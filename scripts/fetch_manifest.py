"""Fetch the cutouts listed in data/manifest.json into data/frames.

The Docker image has no persistent disk and the FITS are not in git, so the
build calls this to obtain the same pixels the app was developed on. Frames are
pulled six at a time: the archive answers each one in a second or two and a
serial loop would spend most of the build waiting. A frame that cannot be
downloaded is reported and skipped — the server already rejects incomplete
files at startup and lists them under /api/health.

    uv run --python 3.13 --with astropy --with numpy python scripts/fetch_manifest.py
"""

from __future__ import annotations

import argparse
import json
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "manifest.json"
FRAMES = ROOT / "data" / "frames"

MIN_BYTES = 1_000_000
WORKERS = 6


def get(url: str, timeout: int = 120, attempts: int = 4) -> bytes:
    last: Exception | None = None
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(url, timeout=timeout) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError, ConnectionError) as exc:
            last = exc
            time.sleep(3 + 4 * attempt)
    raise RuntimeError(f"echec apres {attempts} tentatives: {last}")


def fetch(entry: dict, out: Path, lock: threading.Lock, done: list[int]) -> str | None:
    """Download one cutout; returns an error message, or None when it landed."""
    dest = out / f"{entry['obs_id']}.fits"
    if dest.exists() and dest.stat().st_size >= MIN_BYTES:
        return None

    url = (
        f"{entry['url']}?center={entry['ra']},{entry['dec']}"
        f"&size={entry['size_deg']}"
    )
    try:
        payload = get(url)
    except RuntimeError as exc:
        return f"{entry['obs_id']}: {exc}"
    if len(payload) < MIN_BYTES:
        return f"{entry['obs_id']}: reponse trop courte ({len(payload)} octets)"

    # A temporary name means an interrupted transfer never leaves a truncated
    # file that looks like a valid observation.
    partial = dest.with_suffix(".part")
    partial.write_bytes(payload)
    partial.replace(dest)

    with lock:
        done[0] += 1
        print(f"[{done[0]}] {entry['obs_id']} {len(payload) // 1024} Ko", flush=True)
    return None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", default=str(MANIFEST))
    parser.add_argument("--out", default=str(FRAMES))
    parser.add_argument("--limit", type=int, default=None,
                        help="ne telecharger que les N premieres poses")
    args = parser.parse_args()

    manifest = json.loads(Path(args.manifest).read_text())
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    entries = manifest["frames"]
    if args.limit:
        entries = entries[:args.limit]

    lock = threading.Lock()
    done = [0]
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        errors = [message for message in pool.map(
            lambda entry: fetch(entry, out, lock, done), entries) if message]

    present = sum(
        1 for entry in entries
        if (out / f"{entry['obs_id']}.fits").exists()
        and (out / f"{entry['obs_id']}.fits").stat().st_size >= MIN_BYTES
    )
    print(f"{present} poses disponibles sous {out}")
    for message in errors:
        print(f"  echec: {message}")


if __name__ == "__main__":
    main()
