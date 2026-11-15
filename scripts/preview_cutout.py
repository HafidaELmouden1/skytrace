"""Render a level-2 cutout to WebP and report its spectral geometry.

A single cutout covers roughly half a spectral channel, so this tool
produces a white-light image (all channels stacked) rather than a set of
wavelength slices. Use spectrum_from_slews.py for the spectral axis.
"""

from __future__ import annotations

import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.science.render import load_cutout, save_webp, stack_white_light, stretch_asinh  # noqa: E402
from app.science.wcs_wave import band_centres  # noqa: E402


def main(path: str, outdir: str = "out") -> None:
    os.makedirs(outdir, exist_ok=True)
    cut = load_cutout(path)

    stack = stack_white_light(cut)
    img8, limits = stretch_asinh(stack)
    stem = cut.meta["obs_id"] or "frame"
    out = os.path.join(outdir, f"{stem}_white.webp")
    save_webp(img8, out)

    span = float(np.nanmax(cut.wavelength) - np.nanmin(cut.wavelength))
    print(f"obs_id        {cut.meta['obs_id']}")
    print(f"date          {cut.meta['date']}  (MJD {cut.meta['mjd']:.4f})")
    print(f"detector      {cut.meta['detector']}   unit {cut.meta['unit']}")
    print(f"shape         {cut.image.shape}   valid pixels {cut.valid_fraction * 100:.1f} %")
    print(f"cutout lambda {np.nanmin(cut.wavelength):.4f} - {np.nanmax(cut.wavelength):.4f} um"
          f"  (span {span:.4f} um)")
    print(f"detector band {cut.grid.lo:.3f} - {cut.grid.hi:.3f} um "
          f"({band_centres(cut.grid, 17).size} nominal channels)")
    print(f"stretch       {limits[0]:.4f} .. {limits[1]:.4f} MJy/sr")
    print(f"wrote         {out}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "out")
