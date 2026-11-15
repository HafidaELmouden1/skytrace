"""Test: does the same sky position sample a different wavelength across slews?

If the LVF dispersion spans the whole 2040-pixel detector, a 0.1 degree
cutout covers only ~0.02 um, so a spectrum cannot come from slicing one
image: it has to come from the repointing sequence.
"""

from __future__ import annotations

import os
import sys

import numpy as np
from astropy.io import fits
from astropy.wcs import WCS
from astropy.coordinates import SkyCoord
import astropy.units as u

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.science.wcs_wave import load_wave_grid, wavelength_map  # noqa: E402

RA, DEC = 133.7951, -7.2451

rows = []
for path in sys.argv[1:]:
    with fits.open(path, memmap=False) as hdul:
        hdr = hdul[1].header
        img = hdul[1].data
        grid = load_wave_grid(hdul)
        lam, bw = wavelength_map(grid, hdr, img.shape)
        wcs = WCS(hdr)
        x, y = wcs.world_to_pixel(SkyCoord(ra=RA, dec=DEC, unit=(u.deg, u.deg), frame="icrs"))
        xi, yi = int(round(float(x))), int(round(float(y)))
        xi, yi = np.clip(xi, 0, img.shape[1] - 1), np.clip(yi, 0, img.shape[0] - 1)
        rows.append(
            {
                "slew": hdr.get("OBSID"),
                "crpix2": float(hdr.get("CRPIX2")),
                "mjd": float(hdr.get("MJD-OBS")),
                "px": (xi, yi),
                "lam_centre": float(lam[yi, xi]),
                "lam_min": float(np.nanmin(lam)),
                "lam_max": float(np.nanmax(lam)),
            }
        )

print(f"{'slew':<24}{'CRPIX2':>9}{'pix':>10}{'lambda':>9}{'span':>8}")
for r in rows:
    print(f"{r['slew']:<24}{r['crpix2']:>9.1f}"
          f"{str(r['px']):>10}{r['lam_centre']:>9.4f}{r['lam_max'] - r['lam_min']:>8.4f}")

if len(rows) >= 2:
    d = abs(rows[0]["lam_centre"] - rows[1]["lam_centre"])
    print(f"\ndelta lambda between slews: {d:.4f} um")
    print(f"per-pixel dispersion      : {(rows[0]['lam_max'] - rows[0]['lam_min']) / 2040:.6f} um/px")
    print(f"cutout span               : {rows[0]['lam_max'] - rows[0]['lam_min']:.4f} um")
    print(f"channel width (17/det)    : ~0.034 um -> cutout spans "
          f"{(rows[0]['lam_max'] - rows[0]['lam_min']) / 0.034 * 100:.1f} % of a channel")
