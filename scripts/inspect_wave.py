import sys
import numpy as np
from astropy.io import fits

path = sys.argv[1]
with fits.open(path) as hdul:
    h = hdul[6]
    print("EXTNAME", h.header.get("EXTNAME"))
    print("cols", [c.name for c in h.columns])
    for c in h.columns:
        print(" ", c.name, c.format, c.dim, c.unit)
    d = h.data
    X = np.array(d["X"][0])
    Y = np.array(d["Y"][0])
    V = np.array(d["VALUES"][0])
    print("\nX:", X)
    print("Y:", Y)
    print("VALUES flat size:", V.size, "dtype", V.dtype)
    print("V raw min/max:", np.nanmin(V), np.nanmax(V))
    for shape in [(11, 11, 2), (2, 11, 11)]:
        try:
            r = V.reshape(shape)
            print(f"\nreshaped {shape}: min {np.nanmin(r):.4f} max {np.nanmax(r):.4f}")
            if shape == (11, 11, 2):
                lam = r[:, :, 0]
                print("  lambda[0,:]:", np.round(lam[0, :], 4))
                print("  lambda[:,0]:", np.round(lam[:, 0], 4))
                print("  grad along axis0 mean:", np.nanmean(np.diff(lam, axis=0)))
                print("  grad along axis1 mean:", np.nanmean(np.diff(lam, axis=1)))
        except Exception as e:
            print(shape, "fail", e)
    print("\nIMAGE shape", hdul[1].data.shape)
    hdr = hdul[1].header
    for k in ("NAXIS1", "NAXIS2", "CRPIX1", "CRPIX2", "CTYPE1", "DETECTOR", "MJD-OBS"):
        if k in hdr:
            print(f"  {k} = {hdr[k]}")
