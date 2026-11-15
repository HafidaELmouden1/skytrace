"""Build a SPHEREx spectrum from a sequence of repointings.

Each small slew shifts the sky by exactly one spectral channel, so the
spectrum of a fixed position is assembled by reading the flux and the
central wavelength of that position in every exposure of the sequence.
Cutouts are requested centred on the same coordinates, which keeps the
target on the centre pixel while the detector underneath moves.
"""

from __future__ import annotations

import json
import os
import sys

import numpy as np
from astropy.coordinates import SkyCoord
from astropy.io import fits
from astropy.wcs import WCS
import astropy.units as u

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.science.wcs_wave import load_wave_grid, wavelength_map  # noqa: E402

FLAG_SOURCE = 1 << 21
BENIGN_FLAGS = FLAG_SOURCE


def sample(path: str, ra: float, dec: float, aperture: int = 2) -> dict:
    with fits.open(path, memmap=False) as hdul:
        header = hdul[1].header
        image = np.asarray(hdul[1].data, dtype="float32")
        flags = np.asarray(hdul[2].data)
        grid = load_wave_grid(hdul)
        lam, _bw = wavelength_map(grid, header, image.shape)

        wcs = WCS(header)
        x, y = wcs.world_to_pixel(SkyCoord(ra=ra, dec=dec, unit=(u.deg, u.deg), frame="icrs"))
        xi, yi = int(round(float(x))), int(round(float(y)))
        xi = int(np.clip(xi, aperture, image.shape[1] - aperture - 1))
        yi = int(np.clip(yi, aperture, image.shape[0] - aperture - 1))

        cut_img = image[yi - aperture:yi + aperture + 1, xi - aperture:xi + aperture + 1]
        cut_flg = flags[yi - aperture:yi + aperture + 1, xi - aperture:xi + aperture + 1]
        cut_var = np.asarray(hdul[3].data, dtype="float32")[
            yi - aperture:yi + aperture + 1, xi - aperture:xi + aperture + 1
        ]

        good = (cut_flg & ~BENIGN_FLAGS) == 0
        flux = float(np.sum(cut_img[good])) if good.any() else float("nan")
        error = float(np.sqrt(np.sum(cut_var[good]))) if good.any() else float("nan")

        return {
            "obs_id": header.get("OBSID"),
            "mjd": float(header.get("MJD-OBS")),
            "detector": header.get("DETECTOR"),
            "wavelength_um": float(lam[yi, xi]),
            "flux": flux,
            "error": error,
            "valid_pixels": int(good.sum()),
            "valid_fraction": float(((flags & ~BENIGN_FLAGS) == 0).mean()),
        }


def main(paths: list[str], ra: float, dec: float, outdir: str = "out") -> None:
    os.makedirs(outdir, exist_ok=True)
    samples = [sample(p, ra, dec) for p in paths]
    samples = [s for s in samples if np.isfinite(s["wavelength_um"])]
    samples.sort(key=lambda s: s["wavelength_um"])

    print(f"{'obs_id':<24}{'MJD':>12}{'det':>5}{'lambda':>9}{'flux':>11}{'ok px':>7}")
    for s in samples:
        print(f"{s['obs_id']:<24}{s['mjd']:>12.4f}{s['detector']:>5}"
              f"{s['wavelength_um']:>9.4f}{s['flux']:>11.3f}{s['valid_pixels']:>7}")

    if len(samples) >= 2:
        steps = np.diff([s["wavelength_um"] for s in samples])
        print(f"\n{len(samples)} channels, "
              f"{samples[0]['wavelength_um']:.3f} - {samples[-1]['wavelength_um']:.3f} um, "
              f"median step {np.median(np.abs(steps)):.4f} um")

    payload = {
        "target": {"ra": ra, "dec": dec},
        "channels": [
            {
                "wavelength_um": round(s["wavelength_um"], 4),
                "flux_mjy_sr": round(s["flux"], 4) if np.isfinite(s["flux"]) else None,
                "error_mjy_sr": round(s["error"], 4) if np.isfinite(s["error"]) else None,
                "obs_id": s["obs_id"],
                "mjd": round(s["mjd"], 5),
                "detector": s["detector"],
            }
            for s in samples
        ],
        "provenance": {"collection": "spherex_dr1", "calib": "l2b-v27-2026-197"},
    }
    dest = os.path.join(outdir, "spectrum_dither.json")
    with open(dest, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)
    print(f"wrote {dest}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit("usage: spectrum_from_slews.py <fits> [fits...] --ra RA --dec DEC")
    args = sys.argv[1:]
    ra = dec = None
    files = []
    i = 0
    while i < len(args):
        if args[i] == "--ra":
            ra = float(args[i + 1]); i += 2
        elif args[i] == "--dec":
            dec = float(args[i + 1]); i += 2
        else:
            files.append(args[i]); i += 1
    main(files, ra, dec)
