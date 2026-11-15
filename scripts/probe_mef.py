"""Probe SPHEREx MEF cutout: HDUs, WCS-WAVE, spectral slicing, render.

Usage: uv run --with astropy --with numpy --with pillow python probe_mef.py <cutout.fits>
"""
import sys
import numpy as np
from astropy.io import fits
from astropy.wcs import WCS
from PIL import Image

path = sys.argv[1]
with fits.open(path) as hdul:
    print("=== HDUs ===")
    for i, h in enumerate(hdul):
        print(i, h.header.get("EXTNAME"), h.data.shape if h.data is not None else None,
              h.header.get("BUNIT", ""), h.header.get("NAXIS"))

    img = hdul[1].data.astype("float32")
    hdr = hdul[1].header

    print("\n=== IMAGE header (selection) ===")
    keys = ["BUNIT", "BZERO", "BSCALE", "PIXSCAL", "EXPTIME", "MJD-OBS", "DATE-OBS",
            "OBSID", "DETECTOR", "BAND", "CTYPE1", "CTYPE2", "CRVAL1", "CRVAL2",
            "CD1_1", "CD1_2", "CD2_1", "CD2_2", "NAXIS1", "NAXIS2"]
    for k in keys:
        if k in hdr:
            print(f"  {k} = {hdr[k]}")

    print("\n=== IMAGE stats ===")
    good = img[np.isfinite(img)]
    print("  shape", img.shape, "nan frac", float(np.mean(~np.isfinite(img))))
    print("  min/median/max", float(np.nanmin(good)), float(np.nanmedian(good)), float(np.nanmax(good)))

    flags = hdul[2].data if hdul[2].data is not None else None
    if flags is not None:
        print("  FLAGS ext:", flags.shape, flags.dtype, "unique", np.unique(flags)[:12])

    print("\n=== WCS-WAVE ===")
    w = hdul[6].header
    for k in list(w.keys())[:25]:
        print(f"  {k} = {w[k]}")

    try:
        swcs = WCS(hdul[6].header, fobj=hdul, key="W")
        swcs.sip = None
        ny, nx = img.shape
        for frac in (0.1, 0.5, 0.9):
            y = int(frac * (ny - 1))
            lam, bw = swcs.pixel_to_world(np.array([nx // 2.0]), np.array([y]))
            print(f"  row {y}: lambda={float(lam[0]):.4f} band={float(bw[0]):.4f} um")
    except Exception as e:
        print("  WCS-WAVE parse failed:", type(e).__name__, e)

    # Render: robust asinh stretch, per-wavelength row band
    def to_png(arr, out):
        a = np.array(arr, dtype="float32")
        a[~np.isfinite(a)] = np.nan
        v = a[np.isfinite(a)]
        if v.size == 0:
            return
        lo, hi = np.percentile(v, [1, 99.5])
        if hi <= lo:
            hi = lo + 1
        n = np.clip((a - lo) / (hi - lo), 0, 1)
        n = np.nan_to_num(n)
        img8 = (np.arcsinh(n * 8) / np.arcsinh(8) * 255).astype("uint8")
        Image.fromarray(img8).resize((512, 512), Image.NEAREST).save(out)
        print("  wrote", out)

    to_png(img, "frame_full.png")
