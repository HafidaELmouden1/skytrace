"""SkyTrace — local server for the SPHEREx temporal viewer.

Serves rendered frames, the epoch list and the spectral samples built from
the repointing sequence. Rendering happens once per file and is cached on
disk under the content-addressed key, so repeat requests never touch FITS.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .science.align import _wcs, compare_sources, difference, render_difference
from .science.track import Pose, build_tracks, sky_position, slew_key
from .science.render import (
    detect_sources,
    load_cutout,
    pretty_image,
    save_pretty,
    save_webp,
    stack_white_light,
    stretch_asinh,
)
from .science.wcs_wave import extract_spectrum

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
FRAMES = DATA / "frames"
CACHE = ROOT / "cache"
STATIC = Path(__file__).resolve().parent / "static"

FLAG_SOURCE = 1 << 21
BENIGN_FLAGS = FLAG_SOURCE

TARGETS = [
    {"slug": "barnard", "name": "Barnard's Star", "ra": 269.4521, "dec": 4.6933,
     "type": "naine rouge", "note": "mouvement propre 10,3″/an"},
    {"slug": "eps-indi-b", "name": "Epsilon Indi B", "ra": 330.8403, "dec": -56.7861,
     "type": "naine brune", "note": "couple serré, non séparable à 6,2″"},
    {"slug": "wise0855", "name": "WISE 0855", "ra": 133.7951, "dec": -7.2451,
     "type": "naine brune", "note": "objet le plus rapide connu, ~8″/an"},
    {"slug": "rw-aur", "name": "RW Aurigae", "ra": 76.9560, "dec": 30.4014,
     "type": "variable", "note": "variabilité d'éclat, pas de mouvement"},
    {"slug": "r-dra", "name": "R Draconis", "ra": 248.1680, "dec": 66.7547,
     "type": "variable Mira", "note": "champ profond, 222 jours observés"},
]

FILES: dict[str, tuple[Path, str]] = {}


def discover_frames() -> dict[str, tuple[Path, str]]:
    """Map every FITS under data/frames to its observation and its target."""
    from astropy.io import fits

    candidates = [(path, "wise0855") for path in sorted(FRAMES.glob("*.fits"))]
    candidates += [(path, path.parent.name) for path in sorted(FRAMES.glob("*/*.fits"))]

    found: dict[str, tuple[Path, str]] = {}
    for path, slug in candidates:
        try:
            with fits.open(path, memmap=False) as hdul:
                obs_id = hdul[1].header.get("OBSID")
        except Exception:
            continue
        if obs_id:
            found.setdefault(str(obs_id), (path, slug))
    return found

app = FastAPI(title="SkyTrace", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000", "http://127.0.0.1:8000",
        "http://localhost:8010", "http://127.0.0.1:8010",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


OBS_ID_RE = re.compile(r"^[A-Za-z0-9_]{6,40}$")


@dataclass
class FrameRecord:
    obs_id: str
    mjd: float
    date: str
    detector: int
    wavelength: float
    valid_fraction: float
    key: str
    path: Path
    slug: str = "wise0855"
    sources: int = 0
    brightest: float = 0.0


_frames: dict[str, FrameRecord] = {}
skipped: dict[str, str] = {}
_jobs: dict[str, str] = {}


def _key(*parts: object) -> str:
    raw = "|".join(str(p) for p in parts).encode()
    return hashlib.sha256(raw).hexdigest()[:24]


def _available(slug: str | None = None) -> dict[str, Path]:
    out: dict[str, Path] = {}
    for obs_id, (path, target) in FILES.items():
        if slug and target != slug:
            continue
        if path.exists() and path.stat().st_size > 1_000_000:
            out[obs_id] = path
    return out


def assign_target(cut) -> str | None:
    """Nearest known field to the centre of this cutout.

    Files land in data/frames without a folder per target, so the sky position
    is what decides which of the five challenge objects an image belongs to.
    """
    try:
        frame = _wcs(cut.header)
        ny, nx = cut.image.shape
        ra, dec = frame.all_pix2world(nx / 2.0, ny / 2.0, 0)
    except Exception:
        return None

    best, best_sep = None, 1e9
    for target in TARGETS:
        sep = np.hypot((float(ra) - target["ra"]) * np.cos(np.radians(target["dec"])),
                       float(dec) - target["dec"])
        if sep < best_sep:
            best, best_sep = target["slug"], sep
    return best if best_sep < 0.35 else None


def build_frames() -> None:
    global _frames_ordered
    CACHE.mkdir(exist_ok=True)
    _frames_ordered = []
    _frames.clear()
    skipped.clear()
    for obs_id, path in _available().items():
        cut = load_cutout(str(path))
        # A plane can intersect the requested position while the corresponding
        # image does not reach it: the cutout then sits outside the detector
        # (CRPIX below 1) and every pixel is fill data. Such a frame would be
        # black, so it is rejected here and reported by /api/health.
        crpix_x, crpix_y = cut.meta["crpix"]
        span = float(np.nanmax(cut.wavelength) - np.nanmin(cut.wavelength))
        if not (1 <= crpix_x <= 2040 and 1 <= crpix_y <= 2040):
            skipped[obs_id] = "cutout hors du détecteur (CRPIX < 1)"
            continue
        if span < 1e-3:
            skipped[obs_id] = "dispersion dégénérée (couverture partielle)"
            continue

        stack = stack_white_light(cut)
        img8, _ = stretch_asinh(stack)
        key = _key(obs_id, "white", "asinh", img8.shape)
        out = CACHE / f"{key}.webp"
        if not out.exists():
            save_webp(img8, str(out))

        pretty = pretty_image(cut)
        pretty_key = _key(obs_id, "pretty", "log-noise-v3", pretty.shape)
        pretty_out = CACHE / f"{pretty_key}.webp"
        if not pretty_out.exists():
            save_pretty(pretty, str(pretty_out))

        found = detect_sources(cut)
        ny, nx = cut.image.shape
        _frames[obs_id] = FrameRecord(
            obs_id=obs_id,
            mjd=cut.meta["mjd"],
            date=cut.meta["date"],
            detector=int(cut.meta["detector"]),
            wavelength=float(np.nanmean(cut.wavelength)),
            valid_fraction=cut.valid_fraction,
            key=pretty_key,
            path=pretty_out,
            slug=assign_target(cut) or FILES.get(obs_id, (None, "wise0855"))[1],
            sources=int(found["count"]),
            brightest=float(found["peak_sigma"]),
        )
    _frames_ordered = sorted(_frames.values(), key=lambda f: f.mjd)


@app.on_event("startup")
def _startup() -> None:
    global FILES
    FILES = discover_frames()
    build_frames()


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "frames": len(_frames),
        "skipped": skipped,
        "data_dir": str(DATA),
        "principle": "FITS rendered once, then served as WebP from cache",
    }


@app.get("/api/targets")
def targets() -> dict:
    counts: dict[str, int] = {}
    preview: dict[str, str] = {}
    for frame in sorted(_frames.values(), key=lambda f: f.mjd):
        counts[frame.slug] = counts.get(frame.slug, 0) + 1
        preview.setdefault(frame.slug, frame.obs_id)
    out = []
    for target in TARGETS:
        out.append({
            **target,
            "frames": counts.get(target["slug"], 0),
            "preview": preview.get(target["slug"]),
            "status": _jobs.get(target["slug"], "idle"),
        })
    return {"targets": out}


def _start_collection(slug: str, ra: float, dec: float, limit: int = 12) -> dict:
    if _jobs.get(slug) == "running":
        raise HTTPException(409, "collection already running")

    script = ROOT / "scripts" / "fetch_series.py"
    if not script.exists():
        raise HTTPException(503, "collector script missing")

    out_dir = FRAMES / slug
    command = [
        sys.executable, str(script),
        "--ra", str(ra), "--dec", str(dec),
        "--size", "0.1", "--max", str(limit), "--out", str(out_dir),
    ]
    process = subprocess.Popen(
        command, cwd=str(ROOT),
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    _jobs[slug] = "running"

    def watch() -> None:
        process.wait()
        _jobs[slug] = "done" if process.returncode == 0 else "failed"

    threading.Thread(target=watch, daemon=True).start()
    return {"status": "started", "slug": slug, "out": str(out_dir)}


@app.post("/api/targets/{slug}/fetch")
def fetch_target(slug: str) -> dict:
    """Collect a time series for one of the challenge targets."""
    target = next((t for t in TARGETS if t["slug"] == slug), None)
    if target is None:
        raise HTTPException(404, "unknown target")
    return _start_collection(slug, target["ra"], target["dec"])


@app.post("/api/collect")
def collect(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    slug: str = Query("custom", pattern=r"^[a-z0-9_-]{3,24}$"),
    limit: int = Query(12, ge=2, le=20),
) -> dict:
    """Collect a time series for an arbitrary position."""
    return _start_collection(slug, ra, dec, limit)


@app.get("/api/epochs")
def epochs(target: str = Query("wise0855")) -> dict:
    frames = sorted((f for f in _frames.values() if f.slug == target), key=lambda f: f.mjd)
    if not frames:
        raise HTTPException(404, "no frames for this target")

    groups: list[dict] = []
    for i in range(1, len(frames)):
        dt_days = frames[i].mjd - frames[i - 1].mjd
        axis = "intra_slew" if dt_days < 0.02 else ("night" if dt_days < 1 else "epoch")
        if groups and groups[-1]["axis"] == axis:
            groups[-1]["count"] += 1
        else:
            groups.append({"axis": axis, "count": 2 if not groups else 1})

    return {
        "field": {"name": "WISE 0855", "ra": 133.7951, "dec": -7.2451, "fov_deg": 0.1},
        "count": len(frames),
        "epochs": [
            {
                "obs_id": f.obs_id,
                "mjd": round(f.mjd, 5),
                "date": f.date,
                "detector": f.detector,
                "wavelength_um": round(f.wavelength, 4),
                "valid_fraction": round(f.valid_fraction, 4),
                "frame_key": f.key,
                "days_from_first": round(f.mjd - frames[0].mjd, 3),
            }
            for f in frames
        ],
        "groups": groups,
        "provenance": {
            "collection": "spherex_dr1",
            "calib": "l2b-v27",
            "unit": "MJy/sr",
            "note": "cutouts 0,1° · détecteur D2 · poses consécutives + seconde époque",
        },
    }


@app.get("/api/frames/{obs_id}.webp")
def frame(obs_id: str) -> FileResponse:
    if not OBS_ID_RE.match(obs_id):
        raise HTTPException(400, "invalid observation id")
    rec = _frames.get(obs_id)
    if rec is None:
        raise HTTPException(404, f"unknown observation {obs_id}")
    if not rec.path.exists():
        raise HTTPException(503, "frame not rendered")
    return FileResponse(
        rec.path,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


@app.get("/api/stats")
def stats(target: str = Query("wise0855")) -> dict:
    frames = sorted((f for f in _frames.values() if f.slug == target), key=lambda f: f.mjd)
    if not frames:
        return {"frames": 0, "days": 0, "detectors": 0, "date_from": None, "date_to": None,
                "target": target}
    detectors = sorted({f.detector for f in frames})
    return {
        "frames": len(frames),
        "days": round(frames[-1].mjd - frames[0].mjd, 1),
        "detectors": len(detectors),
        "detector_list": detectors,
        "date_from": frames[0].date,
        "date_to": frames[-1].date,
        "channels": 102,
        "target": {"name": "WISE 0855", "ra": 133.7951, "dec": -7.2451},
    }


@app.post("/api/refresh")
def refresh() -> dict:
    """Pick up frames added to data/frames since the last start."""
    global FILES
    before = len(_frames)
    FILES = discover_frames()
    build_frames()
    return {"frames_before": before, "frames_after": len(_frames),
            "skipped": skipped, "added": len(_frames) - before}


@app.get("/api/spectrum")
def spectrum(ra: float = Query(133.7951), dec: float = Query(-7.2451)) -> JSONResponse:
    files = [p for p in _available().values() if any(tag in p.name for tag in ("slew", "dr1_w0855.fits"))]
    files = [p for p in files if "2026d3" not in p.name]
    if not files:
        raise HTTPException(503, "no data")

    samples = []
    for path in sorted(files):
        cut = load_cutout(str(path))
        ny, nx = cut.image.shape
        x, y = nx // 2, ny // 2
        lam, flux = extract_spectrum(cut.image, cut.wavelength, cut.bandwidth, x, y, aperture=2)
        if lam.size:
            samples.append(
                {
                    "obs_id": cut.meta["obs_id"],
                    "mjd": round(cut.meta["mjd"], 5),
                    "wavelength_um": round(float(lam[0]), 4),
                    "flux": round(float(np.nansum(flux)), 4),
                }
            )

    samples.sort(key=lambda s: s["wavelength_um"])
    steps = np.diff([s["wavelength_um"] for s in samples]) if len(samples) > 1 else []
    return JSONResponse(
        {
            "channels": samples,
            "median_step_um": round(float(np.median(np.abs(steps))), 4) if len(steps) else None,
            "explanation": (
                "Chaque pose place la source sur un canal different du filtre variable. "
                "Le spectre se construit sur la sequence de repointings, pas dans une image."
            ),
            "provenance": {"collection": "spherex_dr1", "calib": "l2b-v27", "unit": "MJy/sr"},
        }
    )


@app.get("/api/metadata/{obs_id}")
def metadata(obs_id: str) -> dict:
    if not OBS_ID_RE.match(obs_id):
        raise HTTPException(400, "invalid observation id")
    rec = _frames.get(obs_id)
    entry = FILES.get(obs_id)
    if rec is None or entry is None or not entry[0].exists():
        raise HTTPException(404, "unknown observation")
    cut = load_cutout(str(entry[0]))
    flags = cut.flags
    unique, counts = np.unique(flags, return_counts=True)
    top = sorted(zip(unique.tolist(), counts.tolist()), key=lambda t: -t[1])[:4]
    return {
        "obs_id": obs_id,
        "mjd": round(cut.meta["mjd"], 6),
        "date": cut.meta["date"],
        "detector": cut.meta["detector"],
        "unit": cut.meta["unit"],
        "wavelength_range_um": [round(cut.grid.lo, 4), round(cut.grid.hi, 4)],
        "cutout_wavelength_um": [
            round(float(np.nanmin(cut.wavelength)), 4),
            round(float(np.nanmax(cut.wavelength)), 4),
        ],
        "valid_fraction": round(cut.valid_fraction, 4),
        "flags_top": [{"value": int(v), "count": int(c)} for v, c in top],
        "benign_bits": [FLAG_SOURCE],
        "provenance": {"collection": "spherex_dr1", "calib": "l2b-v27-2026-197"},
    }


@app.get("/api/diff")
def diff(
    a: str = Query(..., min_length=6, max_length=40),
    b: str = Query(..., min_length=6, max_length=40),
    threshold: float = Query(5.0, ge=3.0, le=20.0),
) -> dict:
    """Mark what changed between two epochs of the same field."""
    for obs in (a, b):
        if not OBS_ID_RE.match(obs):
            raise HTTPException(400, "invalid observation id")
    entry_a, entry_b = FILES.get(a), FILES.get(b)
    if entry_a is None or entry_b is None:
        raise HTTPException(404, "unknown observation")
    if not entry_a[0].exists() or not entry_b[0].exists():
        raise HTTPException(404, "missing file on disk")
    if a == b:
        raise HTTPException(409, "the two epochs must differ")

    cut_a = load_cutout(str(entry_a[0]))
    cut_b = load_cutout(str(entry_b[0]))

    pixel = difference(cut_a, cut_b, threshold)
    rgb = render_difference(pixel.pop("significance"))
    key = _key(a, b, "diff", round(threshold, 2), rgb.shape)
    path = CACHE / f"{key}.webp"
    if not path.exists():
        from PIL import Image
        Image.fromarray(rgb).resize((640, 640), Image.LANCZOS).save(
            path, format="WEBP", quality=90, method=5)

    catalogue = compare_sources(cut_a, cut_b, threshold)

    dt_days = float(cut_b.meta["mjd"] - cut_a.meta["mjd"])
    return {
        "a": a, "b": b,
        "image": f"/api/cache/{key}.webp",
        "candidates": catalogue["unmatched"][:12],
        "verdict": catalogue["verdict"],
        "counts": {
            "epoch_a": catalogue["count_a"],
            "epoch_b": catalogue["count_b"],
            "matched": catalogue["matched"],
            "unmatched": len(catalogue["unmatched"]),
            "ratio": catalogue["ratio"],
        },
        "pixel_peaks": len(pixel["candidates"]),
        "shift_px": catalogue["shift_px"],
        "coverage": pixel["coverage"],
        "shape": pixel["shape"],
        "threshold": threshold,
        "tolerance_arcsec": round(catalogue["tolerance_px"] * 6.2, 1),
        "compat": {
            "detector_a": cut_a.meta["detector"],
            "detector_b": cut_b.meta["detector"],
            "band_a": [round(cut_a.grid.lo, 2), round(cut_a.grid.hi, 2)],
            "band_b": [round(cut_b.grid.lo, 2), round(cut_b.grid.hi, 2)],
            "same_detector": cut_a.meta["detector"] == cut_b.meta["detector"],
            "dt_days": round(dt_days, 2),
        },
        "note": (
            "A source present at one epoch and absent at the other is a "
            "candidate, not a discovery: variable stars, cosmic rays, flag "
            "gaps and the 6.2 arcsec pixel all produce the same signature."
        ),
    }


@app.get("/api/track")
def track(
    target: str = Query("wise0855", max_length=40),
    threshold: float = Query(5.0, ge=3.0, le=15.0),
) -> dict:
    """Follow sources that move between consecutive pointings."""
    available = _available(target)
    if len(available) < 2:
        raise HTTPException(404, "not enough epochs for this field")

    groups: dict[str, list[Path]] = {}
    for obs_id, path in available.items():
        groups.setdefault(slew_key(obs_id), []).append(path)

    results = []
    detail = []
    for key, paths in sorted(groups.items()):
        detail.append({"slew": key, "poses": len(paths)})
        if len(paths) < 2:
            continue
        poses = []
        for path in sorted(paths):
            cut = load_cutout(str(path))
            poses.append(Pose(
                obs_id=path.stem,
                mjd=float(cut.meta["mjd"]),
                detector=int(cut.meta["detector"]),
                cutout=cut,
            ))

        built = build_tracks(poses, threshold)
        for item in built["tracks"]:
            item["slew"] = key
            item["from_position"] = sky_position(poses[0].cutout, item["start"]["x"], item["start"]["y"])
            item["to_position"] = sky_position(poses[0].cutout, item["end"]["x"], item["end"]["y"])
        results.extend(built["tracks"])

    results.sort(key=lambda t: (-t["steps"], -t["displacement_px"]))
    return {
        "target": target,
        "tracks": results[:40],
        "slews": len(groups),
        "detail": detail,
        "tracked": sum(1 for r in results if r["continues"]),
        "pixel_arcsec": 6.2,
        "note": (
            "Motion is only observable within one pointing or between pointings "
            "hours apart. Across months every moving object has left the field."
        ),
    }


@app.get("/api/gallery")
def gallery(target: str | None = Query(None, max_length=40)) -> dict:
    """Every rendered frame with the numbers a plain description needs."""
    items = []
    for frame in _frames_ordered:
        if target and frame.slug != target:
            continue
        items.append({
            "obs_id": frame.obs_id,
            "slug": frame.slug,
            "date": frame.date[:10],
            "mjd": round(frame.mjd, 4),
            "detector": frame.detector,
            "wavelength_um": round(frame.wavelength, 3),
            "valid_fraction": round(frame.valid_fraction, 3),
            "sources": frame.sources,
            "brightest": round(frame.brightest, 1),
            "image": f"/api/frames/{frame.obs_id}.webp",
        })

    fields = {}
    for item in items:
        fields.setdefault(item["slug"], []).append(item["mjd"])
    summary = {
        slug: {
            "frames": len(mjds),
            "days": len({round(m) for m in mjds}),
            "span": round(max(mjds) - min(mjds), 1),
        }
        for slug, mjds in fields.items()
    }

    return {"items": items, "total": len(items), "summary": summary}


@app.get("/api/cadence")
def cadence(target: str = Query("wise0855", max_length=40)) -> dict:
    """Group the epochs of one field into survey passes of about six months."""
    frames = [f for f in _frames_ordered if f.slug == target]
    if not frames:
        raise HTTPException(404, "no frame for this field")

    frames.sort(key=lambda f: f.mjd)

    # A survey pass is a run of observations without a long interruption.
    # Binning by a fixed 182-day window splits real passes in two whenever the
    # first exposure falls mid-campaign, so the gaps decide instead.
    clusters: list[list] = []
    for frame in frames:
        if clusters and (frame.mjd - clusters[-1][-1].mjd) <= 90:
            clusters[-1].append(frame)
        else:
            clusters.append([frame])

    passes = []
    for members in clusters:
        best = max(members, key=lambda f: f.valid_fraction)
        passes.append({
            "index": len(passes) + 1,
            "mjd": round(members[0].mjd, 2),
            "start": members[0].date[:10],
            "end": members[-1].date[:10],
            "frames": len(members),
            "best": {"obs_id": best.obs_id, "date": best.date[:10],
                     "detector": best.detector, "sources": best.sources},
        })

    baselines = [
        {"from": a["index"], "to": b["index"], "days": round(b["mjd"] - a["mjd"], 1)}
        for a, b in zip(passes, passes[1:])
    ]

    return {"target": target, "passes": passes, "baselines": baselines,
            "cadence_days": 182.6, "pixel_arcsec": 6.2}


@app.get("/api/bands")
def bands() -> dict:
    """Wavelength span of each detector, measured on the frames we hold."""
    spans: dict[int, dict] = {}
    for frame in _frames_ordered:
        entry = spans.setdefault(frame.detector,
                                 {"detector": frame.detector, "min_um": 9.9, "max_um": 0.0, "frames": 0})
        entry["min_um"] = min(entry["min_um"], frame.wavelength)
        entry["max_um"] = max(entry["max_um"], frame.wavelength)
        entry["frames"] += 1

    ordered = sorted(spans.values(), key=lambda e: e["min_um"])
    for entry in ordered:
        entry["min_um"] = round(entry["min_um"], 2)
        entry["max_um"] = round(entry["max_um"], 2)
    return {"bands": ordered}


@app.get("/api/cache/{key}.webp")
def cached(key: str) -> FileResponse:
    if not re.fullmatch(r"[0-9a-f]{24}", key):
        raise HTTPException(400, "invalid key")
    path = CACHE / f"{key}.webp"
    if not path.exists():
        raise HTTPException(404, "not rendered")
    return FileResponse(path, media_type="image/webp",
                        headers={"Cache-Control": "public, max-age=31536000, immutable"})


@app.get("/api/describe/{obs_id}")
def describe(obs_id: str, lang: str = Query("en")) -> dict:
    """Plain-language summary of what an observation actually contains."""
    if not OBS_ID_RE.match(obs_id):
        raise HTTPException(400, "invalid observation id")
    entry = FILES.get(obs_id)
    if entry is None or not entry[0].exists():
        raise HTTPException(404, "unknown observation")

    cut = load_cutout(str(entry[0]))
    found = detect_sources(cut)
    lo, hi = round(cut.grid.lo, 2), round(cut.grid.hi, 2)
    det = cut.meta["detector"]
    date = str(cut.meta["date"])[:10]
    count = found["count"]
    peak = found["peak_sigma"]

    if lang == "fr":
        text = (
            f"Champ de 0,1° observé le {date} par le détecteur D{det}, "
            f"dans la bande {lo}–{hi} µm. "
            f"{count} sources détectées au-dessus de 5σ, la plus brillante à {peak}σ. "
            f"{round(cut.valid_fraction * 100)} % des pixels sont exploitables."
        )
        if count == 0:
            text = (
                f"Champ de 0,1° observé le {date} par le détecteur D{det}, "
                f"dans la bande {lo}–{hi} µm. Aucune source au-dessus de 5σ : "
                f"le champ ne contient que du fond de ciel à cette profondeur."
            )
    else:
        text = (
            f"A 0.1° field observed on {date} by detector D{det}, "
            f"in the {lo}–{hi} µm band. "
            f"{count} sources detected above 5σ, the brightest at {peak}σ. "
            f"{round(cut.valid_fraction * 100)} % of pixels are usable."
        )
        if count == 0:
            text = (
                f"A 0.1° field observed on {date} by detector D{det}, "
                f"in the {lo}–{hi} µm band. No source above 5σ: at this depth "
                f"the field holds only sky background."
            )

    return {
        "obs_id": obs_id,
        "text": text,
        "sources": found,
        "band_um": [lo, hi],
        "detector": det,
        "date": date,
        "valid_fraction": round(cut.valid_fraction, 3),
    }


def _page() -> HTMLResponse:
    return HTMLResponse((STATIC / "index.html").read_text(encoding="utf-8"))


@app.get("/", response_class=HTMLResponse)
def index() -> HTMLResponse:
    return _page()


@app.get("/explore", response_class=HTMLResponse)
def explore() -> HTMLResponse:
    return _page()


@app.get("/about", response_class=HTMLResponse)
def about() -> HTMLResponse:
    return _page()


@app.get("/gallery", response_class=HTMLResponse)
def gallery_page() -> HTMLResponse:
    return _page()


@app.get("/learn", response_class=HTMLResponse)
def learn() -> HTMLResponse:
    return _page()


@app.get("/targets", response_class=HTMLResponse)
def targets_page() -> HTMLResponse:
    return _page()
