"""Record which cutouts the app runs on, and where the archive serves them.

data/frames is far too large for git and a free host has no persistent disk, so
the image rebuilds the series from IRSA at build time. This manifest is what
makes that reproducible: one entry per observation, with the sky position that
produced the cutout, so scripts/fetch_manifest.py can ask for the same pixels
again.

    uv run --python 3.13 --with astropy --with numpy python scripts/build_manifest.py
"""

from __future__ import annotations

import csv
import io
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

SIA = "https://irsa.ipac.caltech.edu/SIA"
ROOT = Path(__file__).resolve().parents[1]
FRAMES = ROOT / "data" / "frames"
MANIFEST = ROOT / "data" / "manifest.json"

SIZE_DEG = 0.1

# DR1 stops at MJD 61174 and QR3 carries the months after it: a series that
# spans both years needs the two collections, in that order.
COLLECTIONS = ("spherex_dr1", "spherex_qr3")

TARGETS = [
    ("barnard", 269.4521, 4.6933),
    ("eps-indi-b", 330.8403, -56.7861),
    ("wise0855", 133.7951, -7.2451),
    ("rw-aur", 76.9560, 30.4014),
    ("r-dra", 248.1680, 66.7547),
]


def get(url: str, timeout: int = 90, attempts: int = 4) -> bytes:
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


def query(ra: float, dec: float, collection: str) -> list[dict]:
    url = (
        f"{SIA}?COLLECTION={collection}"
        f"&POS=circle+{ra}+{dec}+0.001&RESPONSEFORMAT=CSV"
    )
    return list(csv.DictReader(io.StringIO(get(url).decode("utf-8", "replace"))))


def main() -> None:
    local = {path.stem: path for path in sorted(FRAMES.rglob("*.fits"))}
    if not local:
        raise SystemExit("data/frames est vide : rien a decrire")

    entries: list[dict] = []
    seen: set[str] = set()
    unreachable: list[str] = []
    for slug, ra, dec in TARGETS:
        for collection in COLLECTIONS:
            try:
                rows = query(ra, dec, collection)
            except RuntimeError as exc:
                # The archive edge answers 502 for minutes at a time; one
                # unreachable collection must not cost the whole manifest.
                unreachable.append(f"{slug}/{collection}: {exc}")
                continue
            for row in rows:
                obs_id = row["obs_id"]
                if obs_id in seen or obs_id not in local:
                    continue
                seen.add(obs_id)
                entries.append({
                    "obs_id": obs_id,
                    "target": slug,
                    "collection": collection,
                    "ra": ra,
                    "dec": dec,
                    "size_deg": SIZE_DEG,
                    "url": row["access_url"],
                    "bytes": local[obs_id].stat().st_size,
                })

    entries.sort(key=lambda entry: (entry["target"], entry["obs_id"]))

    # A collection that answered 502 for a whole target would silently drop it
    # from the series; refuse to write a manifest that misses a field the app
    # advertises.
    covered = {entry["target"] for entry in entries}
    missing = [slug for slug, _, _ in TARGETS if slug not in covered]
    if missing:
        raise SystemExit(
            "manifeste non ecrit, cibles sans aucune pose: " + ", ".join(missing))

    MANIFEST.write_text(json.dumps({
        "collections": list(COLLECTIONS),
        "size_deg": SIZE_DEG,
        "count": len(entries),
        "frames": entries,
    }, indent=1) + "\n")

    absent = sorted(set(local) - seen)
    print(f"{len(entries)} poses decrites dans {MANIFEST.relative_to(ROOT)}")
    for warning in unreachable:
        print(f"  archive injoignable: {warning}")
    for obs_id in absent[:10]:
        print(f"  hors archive, non decrite: {obs_id}")
    if len(absent) > 10:
        print(f"  ... et {len(absent) - 10} autres")


if __name__ == "__main__":
    main()
