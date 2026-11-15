"""Cutout loading and display rendering.

The level-2 cutout is a MEF whose IMAGE extension is calibrated surface
brightness in MJy/sr, with negative values coming from noise. Rendering
therefore uses a signed asinh stretch; a log stretch would clip the noise
floor to black and manufacture empty regions.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
from astropy.io import fits

from .wcs_wave import WaveGrid, load_wave_grid, wavelength_map

FLAG_OK = 0

# Bit 21 marks pixels containing a catalogued source. It is a benign bit
# (IRSA: "flag values of 0 or 2097152 include only pixels in a nominal
# state"), so masking every non-zero flag would delete the target itself.
FLAG_SOURCE = 1 << 21
BENIGN_FLAGS = FLAG_SOURCE


def valid_mask(flags: np.ndarray, benign: int = BENIGN_FLAGS) -> np.ndarray:
    """Pixels free of every flag except the benign source bit."""
    return (flags & ~benign) == 0


@dataclass
class Cutout:
    image: np.ndarray
    flags: np.ndarray
    variance: np.ndarray
    zodi: np.ndarray
    wavelength: np.ndarray
    bandwidth: np.ndarray
    grid: WaveGrid
    header: object = None
    meta: dict = field(default_factory=dict)

    @property
    def valid_fraction(self) -> float:
        return float(np.mean(valid_mask(self.flags)))

    def clean(self, mask_flags: bool = True) -> np.ndarray:
        data = self.image.astype("float32").copy()
        if mask_flags:
            data[~valid_mask(self.flags)] = np.nan
        data[~np.isfinite(data)] = np.nan
        return data


def load_cutout(path: str) -> Cutout:
    with fits.open(path, memmap=False) as hdul:
        header = hdul[1].header
        image = np.asarray(hdul[1].data, dtype="float32")
        flags = np.asarray(hdul[2].data)
        variance = np.asarray(hdul[3].data, dtype="float32")
        zodi = np.asarray(hdul[4].data, dtype="float32")
        grid = load_wave_grid(hdul)
        wavelength, bandwidth = wavelength_map(grid, header, image.shape)

        meta = {
            "obs_id": header.get("OBSID"),
            "mjd": float(header.get("MJD-OBS", float("nan"))),
            "date": header.get("DATE-OBS"),
            "detector": header.get("DETECTOR"),
            "unit": header.get("BUNIT", "MJy/sr"),
            "exptime": header.get("EXPTIME"),
            "crpix": (float(header.get("CRPIX1", 0)), float(header.get("CRPIX2", 0))),
            "wave_range": (grid.lo, grid.hi),
        }

    return Cutout(image, flags, variance, zodi, wavelength, bandwidth, grid, header, meta)


def _percentiles(values: np.ndarray, low: float = 0.5, high: float = 99.5) -> tuple[float, float]:
    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return 0.0, 1.0
    lo, hi = np.percentile(finite, [low, high])
    if hi <= lo:
        hi = lo + 1e-6
    return float(lo), float(hi)


def stretch_asinh(data: np.ndarray, gain: float = 8.0,
                  limits: tuple[float, float] | None = None) -> tuple[np.ndarray, tuple[float, float]]:
    """Signed asinh stretch to 8-bit, linear near zero."""
    lo, hi = limits if limits is not None else _percentiles(data)
    norm = np.clip((data - lo) / (hi - lo), 0.0, 1.0)
    norm = np.nan_to_num(norm, nan=0.0)
    out = np.arcsinh(norm * gain) / np.arcsinh(gain)
    return (out * 255).astype("uint8"), (lo, hi)


def stack_white_light(cutout: Cutout, mask_flags: bool = True) -> np.ndarray:
    """Collapse all spectral channels, weighting by valid samples per pixel."""
    data = cutout.clean(mask_flags=mask_flags)
    weights = np.isfinite(data)
    total = np.where(weights, data, 0.0)
    count = np.sum(weights, axis=0) if total.ndim == 3 else weights.sum()
    if total.ndim == 3:
        return total.sum(axis=0) / np.maximum(count, 1)
    return total


def band_image(cutout: Cutout, centre: float, tolerance: float = 0.02) -> np.ndarray:
    """Mean image within a narrow wavelength slice around ``centre``."""
    data = cutout.clean()
    sel = np.abs(cutout.wavelength - centre) <= tolerance
    if not np.any(sel):
        img = np.full(data.shape, np.nan)
        return img
    img = np.where(sel, data, np.nan)
    return np.nanmean(img, axis=0) if img.ndim == 3 else img


def save_webp(array8: np.ndarray, path: str, upscale: int = 512) -> None:
    from PIL import Image

    img = Image.fromarray(array8)
    if upscale:
        img = img.resize((upscale, upscale), Image.NEAREST)
    img.save(path, format="WEBP", quality=88, method=4)


def background_stats(data: np.ndarray) -> tuple[float, float]:
    """Robust sky level and noise (median, MAD) over finite pixels."""
    finite = data[np.isfinite(data)]
    if finite.size == 0:
        return 0.0, 1.0
    median = float(np.median(finite))
    mad = float(np.median(np.abs(finite - median))) * 1.4826
    return median, (mad if mad > 0 else float(np.std(finite)) or 1.0)


def pretty_image(cutout: "Cutout", clip: float = 12.0) -> np.ndarray:
    """Background-subtracted, logarithmically stretched render.

    Raw calibrated values sit on a sky pedestal roughly as bright as the
    faintest sources, so a plain percentile stretch produces grey noise with
    white blocks. Removing the pedestal first, then scaling by the noise,
    makes stars stand out and the field readable.

    A linear or arcsine scale saturates the moment a bright star enters the
    field: the whole frame turns white. A logarithmic ramp keeps the halo of
    that star readable while faint neighbours stay visible.
    """
    data = cutout.clean()
    stack = np.nanmean(data, axis=0) if data.ndim == 3 else data
    median, noise = background_stats(stack)
    if noise <= 0:
        noise = 1.0

    # Flagged pixels are NaN after cleaning. Left as zero they would punch a
    # black square in the middle of the brightest star, so they take the
    # brightest value of the frame: a saturated pixel is at least that bright.
    surplus = stack - median
    finite = np.isfinite(surplus)
    ratio = np.where(finite, surplus / noise, np.nan)

    top = float(np.nanpercentile(ratio, 99.9)) if finite.any() else clip
    top = max(top, clip)
    ratio = np.where(finite, ratio, top)
    ratio = np.clip(ratio, 0.0, None)

    stretched = np.log1p(ratio) / np.log1p(top)
    return np.clip(stretched * 255, 0, 255).astype("uint8")


def save_pretty(array8: np.ndarray, path: str, size: int = 640) -> None:
    from PIL import Image

    img = Image.fromarray(array8)
    if size:
        img = img.resize((size, size), Image.LANCZOS)
    img.save(path, format="WEBP", quality=90, method=5)


def detect_sources(cutout: "Cutout", threshold: float = 5.0) -> dict:
    """Count significant peaks in the stacked image (no external deps)."""
    data = cutout.clean()
    stack = np.nanmean(data, axis=0) if data.ndim == 3 else data
    median, noise = background_stats(stack)
    significance = (stack - median) / noise
    significance = np.nan_to_num(significance, nan=0.0)

    above = significance > threshold
    if not above.any():
        return {"count": 0, "peak_sigma": 0.0, "brightest": None}

    # A peak is a pixel above threshold and brighter than its 8 neighbours.
    padded = np.pad(significance, 1, mode="constant", constant_values=-np.inf)
    neighbours = np.maximum.reduce([
        padded[0:-2, 0:-2], padded[0:-2, 1:-1], padded[0:-2, 2:],
        padded[1:-1, 0:-2], padded[1:-1, 2:],
        padded[2:, 0:-2], padded[2:, 1:-1], padded[2:, 2:],
    ])
    peaks = above & (significance >= neighbours)
    ys, xs = np.nonzero(peaks)
    if ys.size == 0:
        return {"count": 0, "peak_sigma": 0.0, "brightest": None}

    values = significance[ys, xs]
    order = np.argsort(values)[::-1][:400]
    ys, xs, values = ys[order], xs[order], values[order]
    return {
        "count": int(ys.size),
        "peak_sigma": round(float(values[0]), 1),
        "brightest": {"x": int(xs[0]), "y": int(ys[0]), "sigma": round(float(values[0]), 1)},
        "valid_fraction": round(float(np.mean(np.isfinite(stack))), 3),
    }
