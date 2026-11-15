import glob
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.science.render import load_cutout  # noqa: E402

header = "%-30s%11s%9s%9s%20s%7s  %s" % (
    "fichier", "MJD", "CRPIX1", "CRPIX2", "lambda (um)", "valid", "on-array")
print(header)
print("-" * len(header))

for path in sorted(glob.glob("data/cand_*.fits")) + sorted(glob.glob("data/e2_*.fits")) + ["data/dr1_w0855.fits"]:
    if os.path.getsize(path) < 1_000_000:
        continue
    cut = load_cutout(path)
    cx, cy = cut.meta["crpix"]
    on_array = 1 <= cx <= 2040 and 1 <= cy <= 2040
    name = os.path.basename(path)
    print("%-30s%11.2f%9.1f%9.1f%10.4f-%8.4f%7.3f  %s" % (
        name, cut.meta["mjd"], cx, cy,
        np.nanmin(cut.wavelength), np.nanmax(cut.wavelength),
        cut.valid_fraction, "OUI" if on_array else "hors"))
