"""Live queries against the IRSA SIA2 service.

The archive holds more than a million SPHEREx images. Downloading them all is
neither possible nor useful, so the application asks IRSA what exists for a
position and a date window, and downloads only what someone wants to look at.
"""

from __future__ import annotations

import csv
import io
from datetime import datetime, timedelta
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

SIA = "https://irsa.ipac.caltech.edu/SIA"
MJD_EPOCH = datetime(1858, 11, 17)
COLLECTIONS = ("spherex_dr1", "spherex_dr1_deep", "spherex_qr3", "spherex_qr3_deep")


def _fetch(url: str, timeout: int = 90) -> str:
    with urllib.request.urlopen(url, timeout=timeout) as response:
        return response.read().decode("utf-8", "replace")


def calendar_day(value: str | None) -> str:
    """The archive gives observation times as modified Julian dates."""
    try:
        mjd = float(value or 0)
    except ValueError:
        return ""
    if not mjd:
        return ""
    return (MJD_EPOCH + timedelta(days=mjd)).strftime("%Y-%m-%d")


def search(ra: float, dec: float, radius: float = 0.05,
           date_from: str | None = None, date_to: str | None = None,
           limit: int = 400) -> dict:
    """Return the observations covering a position, newest first.

    The four collections are queried in parallel: IRSA answers one query in
    about twenty seconds, so doing them in sequence would make the page feel
    broken.
    """
    rows: list[dict] = []
    errors: list[str] = []

    def one(collection: str) -> list[dict] | None:
        url = (f"{SIA}?COLLECTION={collection}"
               f"&POS=circle+{ra}+{dec}+{radius}&RESPONSEFORMAT=CSV")
        try:
            body = _fetch(url)
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            errors.append(f"{collection}: {exc}")
            return None
        parsed = list(csv.DictReader(io.StringIO(body)))
        for row in parsed:
            row["collection"] = collection
        return parsed

    with ThreadPoolExecutor(max_workers=len(COLLECTIONS)) as pool:
        for result in pool.map(one, COLLECTIONS):
            if result:
                rows.extend(result)

    seen: set[str] = set()
    unique = []
    for row in rows:
        obs = row.get("obs_id")
        if obs and obs not in seen:
            seen.add(obs)
            unique.append(row)

    filtered = []
    for row in unique:
        day = calendar_day(row.get("t_min"))
        if date_from and day and day < date_from:
            continue
        if date_to and day and day > date_to:
            continue
        filtered.append(row)

    filtered.sort(key=lambda r: float(r.get("t_min") or 0), reverse=True)

    items = []
    for row in filtered[:limit]:
        band = row.get("energy_bandpassname") or ""
        detector = band[-2:].lstrip("D") if band else ""
        items.append({
            "obs_id": row["obs_id"],
            "date": calendar_day(row.get("t_min")) + "T00:00",
            "mjd": float(row.get("t_min") or 0),
            "detector": int(detector) if detector.isdigit() else None,
            "band": band,
            "ra": round(float(row["s_ra"]), 5) if row.get("s_ra") else None,
            "dec": round(float(row["s_dec"]), 5) if row.get("s_dec") else None,
            "collection": row["collection"],
            "access_url": row.get("access_url") or "",
            "downloaded": False,
        })

    return {
        "ra": ra,
        "dec": dec,
        "radius": radius,
        "total": len(filtered),
        "returned": len(items),
        "items": items,
        "collections": list(COLLECTIONS),
        "errors": errors,
    }
