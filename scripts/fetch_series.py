"""Download a time series of SPHEREx cutouts for one sky position.

Asks IRSA's SIA2 service which images exist, keeps one exposure per
distinct date across all six detectors, and writes each cutout into
data/frames/. The server discovers those files on startup.

    uv run --python 3.13 --with astropy --with numpy python scripts/fetch_series.py \
        --ra 133.7951 --dec -7.2451 --size 0.1 --max 14
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SIA = "https://irsa.ipac.caltech.edu/SIA"
FRAMES = Path(__file__).resolve().parents[1] / "data" / "frames"


def _get(url: str, timeout: int = 90, attempts: int = 4) -> bytes:
    """GET with backoff: the archive edge answers 502 intermittently."""
    last: Exception | None = None
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(url, timeout=timeout) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError, ConnectionError) as exc:
            last = exc
            time.sleep(2 + 3 * attempt)
    raise RuntimeError(f"echec apres {attempts} tentatives: {last}")


def query(ra: float, dec: float, collection: str = "spherex_dr1") -> list[dict]:
    url = (
        f"{SIA}?COLLECTION={collection}"
        f"&POS=circle+{ra}+{dec}+0.001&RESPONSEFORMAT=CSV"
    )
    body = _get(url).decode("utf-8", "replace")
    return list(csv.DictReader(io.StringIO(body)))


def pick(rows: list[dict], limit: int) -> list[list[dict]]:
    """One date per slot; each slot keeps every detector as a fallback."""
    by_date: dict[str, list[dict]] = {}
    for row in sorted(rows, key=lambda r: float(r["t_min"])):
        by_date.setdefault(row["t_min"][:8], []).append(row)

    ordered = list(by_date.values())
    if len(ordered) > limit:
        step = (len(ordered) - 1) / (limit - 1)
        ordered = [ordered[round(i * step)] for i in range(limit)]
    return ordered


def is_usable(path: Path) -> bool:
    """A cutout is usable only if it is complete and lands on the detector."""
    from astropy.io import fits

    try:
        with fits.open(path, memmap=False) as hdul:
            if len(hdul) < 7:
                return False
            header = hdul[1].header
            cx = float(header.get("CRPIX1", 0))
            cy = float(header.get("CRPIX2", 0))
            if hdul[1].data is None or hdul[1].data.size == 0:
                return False
    except Exception:
        return False
    return 1 <= cx <= 2040 and 1 <= cy <= 2040


def download(row: dict, size: float, ra: float, dec: float) -> tuple[str, int]:
    obs_id = row["obs_id"]
    dest = FRAMES / f"{obs_id}.fits"
    if dest.exists() and dest.stat().st_size > 1_000_000:
        if is_usable(dest):
            return obs_id, dest.stat().st_size
        dest.unlink(missing_ok=True)

    url = f"{row['access_url']}?center={ra},{dec}&size={size}"
    try:
        payload = _get(url, timeout=120)
    except RuntimeError as exc:
        return obs_id, f"erreur: {exc}"

    if len(payload) < 1_000_000:
        return obs_id, "reponse trop courte (ignoree)"

    # Write to a temporary name so an interrupted transfer can never leave a
    # truncated file that looks like a valid observation.
    partial = dest.with_suffix(".part")
    partial.write_bytes(payload)
    if not is_usable(partial):
        partial.unlink(missing_ok=True)
        return obs_id, "hors du detecteur ou incomplet (ignoree)"
    partial.replace(dest)
    return obs_id, len(payload)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ra", type=float, required=True)
    parser.add_argument("--dec", type=float, required=True)
    parser.add_argument("--size", type=float, default=0.1)
    parser.add_argument("--max", type=int, default=14)
    parser.add_argument("--out", default=None, help="dossier de destination")
    args = parser.parse_args()

    global FRAMES
    if args.out:
        FRAMES = Path(args.out).resolve()
    FRAMES.mkdir(parents=True, exist_ok=True)

    # Files kept from earlier runs may predate the on-detector check.
    for stale in sorted(FRAMES.glob("*.fits")):
        if not is_usable(stale):
            stale.unlink(missing_ok=True)
            print(f"  purge {stale.name} (hors du detecteur)")

    rows = query(args.ra, args.dec)
    print(f"{len(rows)} images couvrent cette position")

    selection = pick(rows, args.max)
    print(f"{len(selection)} dates retenues, telechargement...")

    kept = 0
    for group in selection:
        for row in group[:4]:
            started = time.time()
            obs_id, result = download(row, args.size, args.ra, args.dec)
            flag = row["energy_bandpassname"][-2:]
            if isinstance(result, int):
                kept += 1
                print(f"  {obs_id:26} {flag}  {result / 1e6:5.1f} Mo  {time.time() - started:4.1f}s")
                break
            print(f"  {obs_id:26} {flag}  {result}")

    print(f"termine — {kept} dates exploitables sur {len(selection)}")


if __name__ == "__main__":
    sys.exit(main())
