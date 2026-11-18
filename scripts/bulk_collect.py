"""Collect SPHEREx cutouts for the five challenge fields, in parallel.

The archive answers one cutout per request in about twenty-five seconds, so a
sequential loop caps out at two images a minute. Here the requests run in a
thread pool: latency, not bandwidth, is the limit.

Existing usable files are kept and counted, so the script can be re-run until
the wanted total is reached.

    uv run --python 3.13 --with astropy --with numpy python scripts/bulk_collect.py \
        --target 200 --workers 16
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
import threading
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

SIA = "https://irsa.ipac.caltech.edu/SIA"
FRAMES = Path(__file__).resolve().parents[1] / "data" / "frames"

FIELDS = [
    ("barnard", 269.4521, 4.6933),
    ("eps-indi-b", 330.8403, -56.7861),
    ("wise0855", 133.7951, -7.2451),
    ("rw-aur", 76.9560, 30.4014),
    ("r-dra", 248.1680, 66.7547),
    ("south-deep", 59.9, -66.5),
    ("north-deep", 276.0, 65.0),
    ("equator-strip", 170.0, -4.0),
]

COLLECTIONS = ("spherex_dr1", "spherex_dr1_deep", "spherex_qr3", "spherex_qr3_deep")

lock = threading.Lock()
kept = 0


def get(url: str, timeout: int = 120) -> bytes:
    with urllib.request.urlopen(url, timeout=timeout) as response:
        return response.read()


def query(ra: float, dec: float) -> list[dict]:
    rows: list[dict] = []
    for collection in COLLECTIONS:
        url = f"{SIA}?COLLECTION={collection}&POS=circle+{ra}+{dec}+0.001&RESPONSEFORMAT=CSV"
        try:
            body = get(url, timeout=90).decode("utf-8", "replace")
        except Exception:
            continue
        rows.extend(csv.DictReader(io.StringIO(body)))
    seen: set[str] = set()
    unique = []
    for row in rows:
        obs = row.get("obs_id")
        if obs and obs not in seen:
            seen.add(obs)
            unique.append(row)
    return unique


def usable(path: Path) -> bool:
    from astropy.io import fits

    try:
        with fits.open(path, memmap=False) as hdul:
            if len(hdul) < 7 or hdul[1].data is None or hdul[1].data.size == 0:
                return False
            head = hdul[1].header
            cx = float(head.get("CRPIX1", 0))
            cy = float(head.get("CRPIX2", 0))
    except Exception:
        return False
    return 1 <= cx <= 2040 and 1 <= cy <= 2040


def fetch(job: tuple[str, float, float, dict], size: float) -> tuple[str, int]:
    slug, ra, dec, row = job
    obs_id = row["obs_id"]
    dest = FRAMES / f"{obs_id}.fits"
    if dest.exists() and dest.stat().st_size > 1_000_000:
        return obs_id, 0

    url = f"{row['access_url']}?center={ra},{dec}&size={size}"
    try:
        payload = get(url)
    except urllib.error.HTTPError as exc:
        return obs_id, -exc.code
    except Exception:
        return obs_id, -1

    if len(payload) < 1_000_000:
        return obs_id, -2

    partial = dest.with_suffix(".part")
    partial.write_bytes(payload)
    if not usable(partial):
        partial.unlink(missing_ok=True)
        return obs_id, -3
    partial.replace(dest)

    with lock:
        global kept
        kept += 1
        print(f"  [{kept:3d}] {slug:11} {obs_id:26} {len(payload) / 1e6:4.1f} Mo", flush=True)
    return obs_id, len(payload)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", type=int, default=200)
    parser.add_argument("--workers", type=int, default=16)
    parser.add_argument("--size", type=float, default=0.1)
    args = parser.parse_args()

    FRAMES.mkdir(parents=True, exist_ok=True)

    existing = [p for p in FRAMES.glob("*.fits") if p.stat().st_size > 1_000_000]
    print(f"{len(existing)} fichiers deja presents", flush=True)
    if len(existing) >= args.target:
        print("objectif deja atteint")
        return 0

    jobs: list[tuple[str, float, float, dict]] = []
    for slug, ra, dec in FIELDS:
        rows = query(ra, dec)
        print(f"{slug:11} {len(rows):4d} images disponibles", flush=True)
        for row in rows:
            if not (FRAMES / f"{row['obs_id']}.fits").exists():
                jobs.append((slug, ra, dec, row))

    print(f"{len(jobs)} telechargements a tenter, {args.workers} en parallele", flush=True)

    done = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(fetch, job, args.size): job for job in jobs}
        for future in as_completed(futures):
            done += 1
            if done % 25 == 0:
                have = len(list(FRAMES.glob("*.fits")))
                print(f"  --- {done}/{len(jobs)} tentatives, {have} fichiers ---", flush=True)
                if have >= args.target:
                    for pending in futures:
                        pending.cancel()
                    break

    have = len(list(FRAMES.glob("*.fits")))
    print(f"termine — {have} fichiers au total", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
