"""Alignment and difference imaging between two SPHEREx cutouts.

Two exposures of the same sky position rarely share a pixel grid: the
telescope is repointed, and the detector under the target changes between
epochs. Before any subtraction the second image is resampled onto the
first one's grid through its own World Coordinate System.

Only numpy and astropy are used, so the whole path stays dependency-free.
"""

from __future__ import annotations

import numpy as np
from astropy.wcs import WCS

from .render import Cutout, background_stats, valid_mask


def _wcs(header) -> WCS:
    """Linear WCS of a cutout, without its SIP distortion.

    Cutout headers keep the SIP coefficients of the full 2040x2040 detector
    while their reference pixel has been moved, so inverting the polynomial
    diverges. Across a 59 pixel cutout the correction is well under a pixel,
    so the linear part alone is accurate and always invertible.
    """
    wcs = WCS(header)
    if wcs.sip is not None:
        wcs = wcs.deepcopy()
        wcs.sip = None
    return wcs


def _world_grid(header, shape: tuple[int, int]) -> tuple[np.ndarray, np.ndarray]:
    ny, nx = shape
    yy, xx = np.mgrid[0:ny, 0:nx]
    ra, dec = _wcs(header).all_pix2world(xx.ravel(), yy.ravel(), 0)
    return np.asarray(ra), np.asarray(dec)


def resample(src: np.ndarray, src_header, shape: tuple[int, int],
             dst_ra: np.ndarray, dst_dec: np.ndarray) -> np.ndarray:
    """Sample ``src`` at the sky positions of the destination grid."""
    wcs = _wcs(src_header)
    x, y = wcs.all_world2pix(dst_ra, dst_dec, 0)
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)

    ny, nx = src.shape
    inside = (x >= 0) & (x <= nx - 1) & (y >= 0) & (y <= ny - 1)

    x0 = np.clip(np.floor(x).astype(int), 0, nx - 2)
    y0 = np.clip(np.floor(y).astype(int), 0, ny - 2)
    fx = np.clip(x - x0, 0.0, 1.0)
    fy = np.clip(y - y0, 0.0, 1.0)

    data = np.asarray(src, dtype=float)
    top = data[y0, x0] * (1 - fx) + data[y0, x0 + 1] * fx
    bottom = data[y0 + 1, x0] * (1 - fx) + data[y0 + 1, x0 + 1] * fx
    out = top * (1 - fy) + bottom * fy
    out[~inside] = np.nan
    return out.reshape(shape)


def _bilinear(img: np.ndarray, x: np.ndarray, y: np.ndarray) -> np.ndarray:
    ny, nx = img.shape
    inside = (x >= 0) & (x <= nx - 1) & (y >= 0) & (y <= ny - 1)
    x0 = np.clip(np.floor(x).astype(int), 0, nx - 2)
    y0 = np.clip(np.floor(y).astype(int), 0, ny - 2)
    fx = np.clip(x - x0, 0.0, 1.0)
    fy = np.clip(y - y0, 0.0, 1.0)
    top = img[y0, x0] * (1 - fx) + img[y0, x0 + 1] * fx
    bottom = img[y0 + 1, x0] * (1 - fx) + img[y0 + 1, x0 + 1] * fx
    out = top * (1 - fy) + bottom * fy
    return np.where(inside, out, np.nan)


def phase_shift(a: np.ndarray, b: np.ndarray) -> tuple[float, float]:
    """Integer offset with sub-pixel refinement, from the image cross-spectrum."""
    win = np.outer(np.hanning(a.shape[0]), np.hanning(a.shape[1]))
    fa = np.fft.rfft2(np.where(np.isfinite(a), a, 0.0) * win)
    fb = np.fft.rfft2(np.where(np.isfinite(b), b, 0.0) * win)
    cross = fa * np.conj(fb)
    cross /= np.abs(cross) + 1e-12
    correlation = np.fft.irfft2(cross, s=a.shape)

    peak = np.unravel_index(np.argmax(correlation), correlation.shape)
    dy, dx = int(peak[0]), int(peak[1])
    if dy > a.shape[0] // 2:
        dy -= a.shape[0]
    if dx > a.shape[1] // 2:
        dx -= a.shape[1]

    def parabola(cy: int, cx: int, along_y: bool) -> float:
        """Sub-pixel offset around the peak, from its two neighbours."""
        limit = correlation.shape[0] if along_y else correlation.shape[1]
        centre = cy if along_y else cx
        if centre <= 0 or centre >= limit - 1:
            return float(centre)
        if along_y:
            left, mid, right = correlation[cy - 1, cx], correlation[cy, cx], correlation[cy + 1, cx]
        else:
            left, mid, right = correlation[cy, cx - 1], correlation[cy, cx], correlation[cy, cx + 1]
        denom = float(left - 2 * mid + right)
        if denom == 0:
            return float(centre)
        return centre + 0.5 * float(left - right) / denom

    return parabola(dy, dx, True), parabola(dy, dx, False)


def stack_cutout(cut: Cutout) -> np.ndarray:
    data = cut.clean()
    return np.nanmean(data, axis=0) if data.ndim == 3 else data


def find_sources(stack: np.ndarray, threshold: float = 5.0) -> list[dict]:
    """Local maxima above threshold, brightest first."""
    median, noise = background_stats(stack)
    significance = np.nan_to_num((stack - median) / noise, nan=0.0, posinf=0.0, neginf=0.0)

    padded = np.pad(significance, 1, mode="constant", constant_values=-np.inf)
    neighbours = np.maximum.reduce([
        padded[0:-2, 0:-2], padded[0:-2, 1:-1], padded[0:-2, 2:],
        padded[1:-1, 0:-2], padded[1:-1, 2:],
        padded[2:, 0:-2], padded[2:, 1:-1], padded[2:, 2:],
    ])
    peaks = (significance > threshold) & (significance >= neighbours)
    ys, xs = np.nonzero(peaks)
    values = significance[ys, xs]
    order = np.argsort(values)[::-1][:300]

    return [
        {"x": int(xs[i]), "y": int(ys[i]), "sigma": round(float(values[i]), 1)}
        for i in order
    ]


def match_sources(sources_a: list[dict], sources_b: list[dict],
                  tolerance_px: float = 2.0) -> dict:
    """Pair sources between two epochs and keep what has no counterpart."""
    used: set[int] = set()
    unmatched: list[dict] = []

    for src in sources_a:
        best_index, best_distance = None, None
        for index, other in enumerate(sources_b):
            if index in used:
                continue
            distance = float(np.hypot(other["x"] - src["x"], other["y"] - src["y"]))
            if best_distance is None or distance < best_distance:
                best_index, best_distance = index, distance

        if best_index is not None and best_distance is not None and best_distance <= tolerance_px:
            used.add(best_index)
        else:
            unmatched.append({
                "x": src["x"], "y": src["y"], "sigma": src["sigma"],
                "nearest_px": None if best_distance is None else round(best_distance, 1),
            })

    ratio = len(unmatched) / max(1, len(sources_a))
    if not unmatched:
        verdict = "none"
    elif len(unmatched) <= 3 and ratio <= 0.1:
        verdict = "isolated"
    else:
        verdict = "many"

    return {
        "unmatched": unmatched,
        "count_a": len(sources_a),
        "count_b": len(sources_b),
        "matched": len(sources_a) - len(unmatched),
        "ratio": round(ratio, 3),
        "verdict": verdict,
    }


def compare_sources(a: Cutout, b: Cutout, threshold: float = 5.0,
                    tolerance_px: float = 2.0) -> dict:
    """Match sources between two epochs on a common grid.

    At 6.2 arcsec per pixel a single star straddles one pixel, so subtracting
    images marks every source. Comparing catalogues instead keeps what really
    has no counterpart at the other epoch.
    """
    ref_shape = b.image.shape
    ref_ra, ref_dec = _world_grid(b.header, ref_shape)

    a_stack = resample(stack_cutout(a), a.header, ref_shape, ref_ra, ref_dec)
    b_stack = stack_cutout(b).astype(float)

    a_mask = resample(valid_mask(a.flags).astype(float), a.header, ref_shape,
                      ref_ra, ref_dec)
    b_mask = valid_mask(b.flags).astype(float)

    fill_a = np.where(np.isfinite(a_stack), a_stack, np.nanmedian(a_stack))
    fill_b = np.where(np.isfinite(b_stack), b_stack, np.nanmedian(b_stack))
    dy, dx = phase_shift(fill_a, fill_b)
    yy, xx = np.mgrid[0:ref_shape[0], 0:ref_shape[1]]
    a_stack = _bilinear(fill_a, xx + dx, yy + dy)
    a_mask = _bilinear(np.where(np.isfinite(a_mask), a_mask, 0.0), xx + dx, yy + dy)

    usable_a = np.where(a_mask > 0.5, a_stack, np.nan)
    usable_b = np.where(b_mask > 0.5, b_stack, np.nan)

    sources_a = find_sources(usable_a, threshold)
    sources_b = find_sources(usable_b, threshold)
    result = match_sources(sources_a, sources_b, tolerance_px)

    wcs = WCS(b.header)
    for item in result["unmatched"]:
        ra, dec = wcs.all_pix2world(item["x"], item["y"], 0)
        item["ra"] = round(float(ra), 5)
        item["dec"] = round(float(dec), 5)

    result["shift_px"] = [round(float(dx), 2), round(float(dy), 2)]
    result["tolerance_px"] = tolerance_px
    return result


def difference(a: Cutout, b: Cutout, threshold: float = 5.0,
               dipole_radius: float = 4.0) -> dict:
    """Significance of the change between two cutouts of the same field.

    Fixed sources do not cancel perfectly: pointing, pixel phase and the
    wavelength gradient across the array all leave residuals. A source that
    actually moved produces a *dipole* — a positive peak next to a negative
    one — so peaks are classified by whether such a partner exists.
    """
    ref_shape = b.image.shape
    ref_ra, ref_dec = _world_grid(b.header, ref_shape)

    a_stack = resample(stack_cutout(a), a.header, ref_shape, ref_ra, ref_dec)
    b_stack = stack_cutout(b).astype(float)

    a_mask = resample(valid_mask(a.flags).astype(float), a.header, ref_shape,
                      ref_ra, ref_dec)
    b_mask = valid_mask(b.flags).astype(float)

    good = np.isfinite(a_stack) & np.isfinite(b_stack) & (a_mask > 0.5) & (b_mask > 0.5)

    # A residual sub-pixel offset between the two grids produces a dipole on
    # every source. Measure it from the cross-spectrum and remove it before
    # anything is called a moving object.
    fill_a = np.where(np.isfinite(a_stack), a_stack, np.nanmedian(a_stack))
    fill_b = np.where(np.isfinite(b_stack), b_stack, np.nanmedian(b_stack))
    dy, dx = phase_shift(fill_a, fill_b)
    yy, xx = np.mgrid[0:a_stack.shape[0], 0:a_stack.shape[1]]
    a_stack = _bilinear(fill_a, xx + dx, yy + dy)
    a_mask = _bilinear(np.where(np.isfinite(a_mask), a_mask, 0.0), xx + dx, yy + dy)
    good = np.isfinite(a_stack) & np.isfinite(b_stack) & (a_mask > 0.5) & (b_mask > 0.5)

    med_a, noise_a = background_stats(a_stack[good])
    med_b, noise_b = background_stats(b_stack[good])

    # Photometric matching: the two epochs differ in exposure and calibration,
    # so bright sources are used to derive a single scaling factor.
    bright = good & (b_stack - med_b > 8 * noise_b)
    scale = 1.0
    if np.count_nonzero(bright) > 20:
        num = float(np.median(a_stack[bright] - med_a))
        den = float(np.median(b_stack[bright] - med_b))
        if den > 0 and num > 0:
            scale = num / den

    combined = float(np.hypot(noise_a, scale * noise_b)) or 1.0
    diff = (a_stack - med_a) - scale * (b_stack - med_b)
    significance = np.where(good, diff / combined, 0.0)

    padded = np.pad(significance, 1, mode="constant", constant_values=-np.inf)
    neighbours = np.maximum.reduce([
        padded[0:-2, 0:-2], padded[0:-2, 1:-1], padded[0:-2, 2:],
        padded[1:-1, 0:-2], padded[1:-1, 2:],
        padded[2:, 0:-2], padded[2:, 1:-1], padded[2:, 2:],
    ])
    peaks_mask = good & (significance > threshold) & (significance >= neighbours)
    ys, xs = np.nonzero(peaks_mask)

    # Local minima, used to pair each positive peak with a negative one.
    dips_mask = good & (significance < -threshold) & (significance <= -neighbours)
    dy_idx, dx_idx = np.nonzero(dips_mask)

    candidates: list[dict] = []
    vectors: list[tuple[float, float]] = []
    if ys.size and dx_idx.size:
        values = significance[ys, xs]
        for i in np.argsort(values)[::-1][:16]:
            y, x = int(ys[i]), int(xs[i])
            peak = float(values[i])

            best = None
            for j in range(dx_idx.size):
                oy, ox = int(dy_idx[j]), int(dx_idx[j])
                separation = float(np.hypot(ox - x, oy - y))
                if not (1.0 <= separation <= dipole_radius):
                    continue
                depth = float(significance[oy, ox])
                if abs(depth) < 0.4 * peak:
                    continue
                if best is None or separation < best[0]:
                    best = (separation, ox, oy, depth)

            candidate = {
                "x": x, "y": y, "sigma": round(peak, 1),
                "kind": "dipole" if best else "residual",
                "dipole_sigma": round(best[3], 1) if best else None,
                "separation_arcsec": round(best[0] * 6.2, 1) if best else None,
            }
            candidates.append(candidate)
            if best:
                vectors.append((float(best[1] - x), float(best[2] - y)))

        candidates.sort(key=lambda c: (c["kind"] != "dipole", -c["sigma"]))

    verdict = "none"
    scatter = None
    if len(vectors) >= 4:
        arr = np.array(vectors)
        mean = arr.mean(axis=0)
        scatter = float(np.sqrt(((arr - mean) ** 2).sum(axis=1).mean()))
        # Dipoles pointing the same way everywhere mean the grid is slightly
        # offset, not that every source moved.
        verdict = "systematic" if scatter < 1.2 else "mixed"
    elif len(vectors) >= 1:
        verdict = "isolated"

    return {
        "significance": significance,
        "candidates": candidates,
        "coverage": round(float(good.mean()), 3),
        "scale": round(scale, 3),
        "noise_ratio": round(noise_a / noise_b, 2) if noise_b else None,
        "shape": list(ref_shape),
        "dipoles": len(vectors),
        "dipole_scatter": round(scatter, 2) if scatter is not None else None,
        "verdict": verdict,
        "shift_px": [round(float(dx), 2), round(float(dy), 2)],
        "pixel_arcsec": 6.2,
    }


def render_difference(significance: np.ndarray) -> np.ndarray:
    """Two-sided colour map: red for brighter, blue for fainter.

    Everything below two sigma is left black. Without that cut the map is a
    uniform field of colour and no structure is visible.
    """
    visible = np.where(np.abs(significance) >= 2.0, significance, 0.0)
    scaled = np.clip(visible / 5.0, -2.0, 2.0)
    stretched = np.arcsinh(scaled) / np.arcsinh(2.0)
    value = np.clip(stretched, -1.0, 1.0)

    rgb = np.zeros(significance.shape + (3,), dtype=float)
    positive = np.clip(value, 0, 1)
    negative = np.clip(-value, 0, 1)
    rgb[:, :, 0] = 12 + 235 * positive
    rgb[:, :, 2] = 12 + 235 * negative
    rgb[:, :, 1] = 12 + 110 * np.maximum(positive, negative)
    return rgb.astype("uint8")
