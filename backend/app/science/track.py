"""Track sources that move between consecutive SPHEREx pointings.

Most objects leave the field long before the next monthly epoch, so a
separation of months cannot show motion: an asteroid covers about a degree a
day, and the stored cutout is a tenth of a degree wide. Motion is only
observable inside the exposures taken minutes apart during one pointing, and
between pointings a few hours apart. That is what this module compares.

A moving source appears at a new position and vanishes from the old one, so a
pair of one apparition and one disappearance at a plausible distance is what
the matcher looks for. Fixed stars keep the same pixel; variable stars change
brightness without moving; cosmic rays appear once and never continue.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from astropy.wcs import WCS

from .align import _wcs

from .align import _world_grid, find_sources, phase_shift, resample
from .render import Cutout, valid_mask

PIXEL_ARCSEC = 6.2


@dataclass
class Pose:
    obs_id: str
    mjd: float
    detector: int
    cutout: Cutout


def slew_key(obs_id: str) -> str:
    """``2025W19_1B_0181_3`` -> ``2025W19_1B_0181``: same pointing, other pose."""
    return obs_id.rsplit("_", 1)[0]


def catalogue(poses: list[Pose], threshold: float = 5.0) -> list[dict]:
    """Source catalogue of every pose, on the grid of the first one."""
    reference = poses[0].cutout
    shape = reference.image.shape
    ref_ra, ref_dec = _world_grid(reference.header, shape)

    catalogues = []
    for pose in poses:
        stack = pose.cutout.clean()
        stack = np.nanmean(stack, axis=0) if stack.ndim == 3 else stack
        mask = valid_mask(pose.cutout.flags).astype(float)

        if pose is not poses[0]:
            moved = resample(stack, pose.cutout.header, shape, ref_ra, ref_dec)
            shifted_mask = resample(mask, pose.cutout.header, shape, ref_ra, ref_dec)
            fill = np.where(np.isfinite(moved), moved, np.nanmedian(moved))
            dy, dx = phase_shift(fill, fill)
            yy, xx = np.mgrid[0:shape[0], 0:shape[1]]
            moved = _shift(fill, xx + dx, yy + dy)
            shifted_mask = _shift(np.where(np.isfinite(shifted_mask), shifted_mask, 0.0),
                                  xx + dx, yy + dy)
            stack, mask = moved, shifted_mask

        usable = np.where(mask > 0.5, stack, np.nan)
        catalogues.append(find_sources(usable, threshold))
    return catalogues


def _shift(img: np.ndarray, x: np.ndarray, y: np.ndarray) -> np.ndarray:
    ny, nx = img.shape
    inside = (x >= 0) & (x <= nx - 1) & (y >= 0) & (y <= ny - 1)
    x0 = np.clip(np.floor(x).astype(int), 0, nx - 2)
    y0 = np.clip(np.floor(y).astype(int), 0, ny - 2)
    fx = np.clip(x - x0, 0.0, 1.0)
    fy = np.clip(y - y0, 0.0, 1.0)
    top = img[y0, x0] * (1 - fx) + img[y0, x0 + 1] * fx
    bottom = img[y0 + 1, x0] * (1 - fx) + img[y0 + 1, x0 + 1] * fx
    return np.where(inside, top * (1 - fy) + bottom * fy, np.nan)


def _pair(first: list[dict], second: list[dict], static_px: float = 2.0,
          max_move_px: float = 12.0) -> tuple[set[int], set[int], list[dict]]:
    """Split both catalogues into fixed sources and moving candidates."""
    used_second: set[int] = set()
    fixed_first: set[int] = set()

    for i, src in enumerate(first):
        best, distance = None, None
        for j, other in enumerate(second):
            if j in used_second:
                continue
            d = float(np.hypot(other["x"] - src["x"], other["y"] - src["y"]))
            if distance is None or d < distance:
                best, distance = j, d
        if best is not None and distance is not None and distance <= static_px:
            used_second.add(best)
            fixed_first.add(i)

    gone = [i for i in range(len(first)) if i not in fixed_first]
    appeared = [j for j in range(len(second)) if j not in used_second]

    moves = []
    claimed: set[int] = set()
    for i in gone:
        src = first[i]
        best, distance = None, None
        for j in appeared:
            if j in claimed:
                continue
            d = float(np.hypot(second[j]["x"] - src["x"], second[j]["y"] - src["y"]))
            if d < static_px or d > max_move_px:
                continue
            if distance is None or d < distance:
                best, distance = j, d
        if best is not None and distance is not None:
            claimed.add(best)
            moves.append({"from": src, "to": second[best], "px": round(distance, 2)})

    return fixed_first, used_second, moves


def build_tracks(poses: list[Pose], threshold: float = 5.0) -> dict:
    """Follow candidate movers across a sequence of poses."""
    if len(poses) < 2:
        return {"tracks": [], "poses": len(poses), "note": "two poses are needed"}

    # Two detectors cover different wavelengths, so their brightness cannot be
    # matched. Compare within each detector and merge the results.
    detectors = {pose.detector for pose in poses}
    if len(detectors) > 1:
        combined: list[dict] = []
        counts: list[int] = []
        for detector in sorted(detectors):
            subset = [pose for pose in poses if pose.detector == detector]
            if len(subset) < 2:
                continue
            part = build_tracks(subset, threshold)
            combined.extend(part["tracks"])
            counts.extend(part["catalogues"])
        combined.sort(key=lambda t: (-t["steps"], -t["displacement_px"]))
        return {"tracks": combined, "poses": len(poses), "catalogues": counts,
                "pixel_arcsec": PIXEL_ARCSEC,
                "span_minutes": round((max(p.mjd for p in poses) - min(p.mjd for p in poses)) * 1440, 2)}

    poses = sorted(poses, key=lambda p: p.mjd)
    catalogues = catalogue(poses, threshold)

    pairs = []
    for i in range(len(poses) - 1):
        _, _, moves = _pair(catalogues[i], catalogues[i + 1])
        dt_minutes = (poses[i + 1].mjd - poses[i].mjd) * 24 * 60
        for move in moves:
            move["dt_minutes"] = round(dt_minutes, 2)
            move["step"] = i
        pairs.append(moves)

    # A real track continues: the position reached at step i+1 is the position
    # left at step i+1. Any pair can start a chain, because poses inside one
    # pointing differ in quality and an intermediate pair may show nothing.
    tracks: list[dict] = []
    for start in range(len(pairs)):
        for move in pairs[start]:
            chain = [move]
            last = move["to"]
            for step in range(start + 1, len(pairs)):
                nxt = None
                for candidate in pairs[step]:
                    d = float(np.hypot(candidate["from"]["x"] - last["x"],
                                       candidate["from"]["y"] - last["y"]))
                    if d <= 2.0:
                        nxt = candidate
                        break
                if nxt is None:
                    break
                chain.append(nxt)
                last = nxt["to"]

            total_px = float(np.hypot(chain[-1]["to"]["x"] - chain[0]["from"]["x"],
                                      chain[-1]["to"]["y"] - chain[0]["from"]["y"]))
            total_seconds = sum(step["dt_minutes"] for step in chain) * 60
            speed = total_px * PIXEL_ARCSEC / (total_seconds / 3600) if total_seconds else 0.0

            # A chain that returns to its starting point is noise, not motion.
            steps = [
                (chain[i]["to"]["x"] - chain[i]["from"]["x"],
                 chain[i]["to"]["y"] - chain[i]["from"]["y"])
                for i in range(len(chain))
            ]
            reversed_steps = any(
                a[0] * b[0] + a[1] * b[1] < 0
                for a, b in zip(steps, steps[1:])
            )
            if total_px < 1.5 or reversed_steps:
                continue

            tracks.append({
                "start": chain[0]["from"],
                "end": chain[-1]["to"],
                "steps": len(chain) + 1,
                "displacement_px": round(total_px, 2),
                "displacement_arcsec": round(total_px * PIXEL_ARCSEC, 1),
                "duration_minutes": round(sum(step["dt_minutes"] for step in chain), 2),
                "speed_arcsec_per_hour": round(speed, 1),
                "continues": len(chain) > 1,
            })

    unique: dict[tuple, dict] = {}
    for track in tracks:
        key = (track["start"]["x"], track["start"]["y"], track["end"]["x"], track["end"]["y"])
        if key not in unique or track["steps"] > unique[key]["steps"]:
            unique[key] = track
    tracks = list(unique.values())

    tracks.sort(key=lambda t: (-t["steps"], -t["displacement_px"]))
    return {
        "tracks": tracks,
        "poses": len(poses),
        "catalogues": [len(c) for c in catalogues],
        "pixel_arcsec": PIXEL_ARCSEC,
        "span_minutes": round((poses[-1].mjd - poses[0].mjd) * 24 * 60, 2),
    }


def sky_position(cutout: Cutout, x: int, y: int) -> tuple[float, float]:
    ra, dec = _wcs(cutout.header).all_pix2world(x, y, 0)
    return round(float(ra), 6), round(float(dec), 6)
