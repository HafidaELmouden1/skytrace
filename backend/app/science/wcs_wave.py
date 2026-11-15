"""Spectral coordinate handling for SPHEREx level-2 cutouts.

A cutout MEF carries its wavelength calibration in HDU 6 (WCS-WAVE) as a
sparse lookup table: 11x11 nodes spanning the FULL 2040x2040 detector
frame, each holding (central wavelength, bandwidth) in micrometres.
The cutout header keeps CRPIX in full-frame coordinates, so a cutout
pixel is mapped back onto the detector grid before interpolation.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

GRID_NODES = 11
FULL_FRAME = 2040.0


@dataclass(frozen=True)
class WaveGrid:
    """Sparse wavelength calibration sampled on the detector grid."""

    x_nodes: np.ndarray  # 1-based full-frame column of each grid node
    y_nodes: np.ndarray  # 1-based full-frame row of each grid node
    wavelength: np.ndarray  # (ny, nx) micrometres
    bandwidth: np.ndarray  # (ny, nx) micrometres

    @property
    def lo(self) -> float:
        return float(np.nanmin(self.wavelength))

    @property
    def hi(self) -> float:
        return float(np.nanmax(self.wavelength))


def load_wave_grid(hdul) -> WaveGrid:
    """Read the WCS-WAVE extension into a WaveGrid, tolerating both table layouts."""
    index = None
    for i, hdu in enumerate(hdul):
        if hdu.header.get("EXTNAME", "").strip().upper() == "WCS-WAVE":
            index = i
            break
    if index is None:
        raise ValueError(
            "no WCS-WAVE extension found; the file is probably truncated "
            f"({len(hdul)} HDUs present, 7 expected)"
        )

    table = hdul[index].data
    row = table[0]
    x_nodes = np.asarray(row["X"], dtype=float)
    y_nodes = np.asarray(row["Y"], dtype=float)
    flat = np.asarray(row["VALUES"], dtype=float).ravel()

    if flat.size != 2 * x_nodes.size * y_nodes.size:
        raise ValueError(
            f"WCS-WAVE holds {flat.size} values, expected "
            f"{2 * x_nodes.size * y_nodes.size}"
        )

    cube = flat.reshape(y_nodes.size, x_nodes.size, 2)
    wavelength = cube[:, :, 0]
    bandwidth = cube[:, :, 1]

    if not np.all(np.isfinite(wavelength)):
        raise ValueError("WCS-WAVE wavelength grid contains non-finite nodes")

    return WaveGrid(x_nodes, y_nodes, wavelength, bandwidth)


def _interp_axis(nodes: np.ndarray, targets: np.ndarray, values: np.ndarray, axis: int) -> np.ndarray:
    """Linear interpolation along one grid axis, clamped at the edges."""
    moved = np.moveaxis(values, axis, 0)
    out = np.empty((targets.size,) + moved.shape[1:], dtype=float)
    for i in range(moved.shape[1]):
        out[:, i] = np.interp(targets, nodes, moved[:, i])
    return np.moveaxis(out, 0, axis)


def wavelength_map(grid: WaveGrid, header, shape: tuple[int, int]) -> tuple[np.ndarray, np.ndarray]:
    """Build per-pixel wavelength and bandwidth arrays for a cutout.

    ``shape`` is the cutout image shape (ny, nx); ``header`` is that of
    HDU 1 in the same cutout, whose CRPIX sit in full-frame coordinates.
    """
    ny, nx = shape
    crpix1 = float(header.get("CRPIX1", 1.0))
    crpix2 = float(header.get("CRPIX2", 1.0))

    x_full = np.arange(nx, dtype=float) + crpix1
    y_full = np.arange(ny, dtype=float) + crpix2

    on_x = _interp_axis(grid.x_nodes, np.clip(x_full, grid.x_nodes[0], grid.x_nodes[-1]),
                        grid.wavelength, axis=1)
    lam = _interp_axis(grid.y_nodes, np.clip(y_full, grid.y_nodes[0], grid.y_nodes[-1]),
                       on_x, axis=0)

    on_x_bw = _interp_axis(grid.x_nodes, np.clip(x_full, grid.x_nodes[0], grid.x_nodes[-1]),
                           grid.bandwidth, axis=1)
    bw = _interp_axis(grid.y_nodes, np.clip(y_full, grid.y_nodes[0], grid.y_nodes[-1]),
                      on_x_bw, axis=0)

    return lam, bw


def band_centres(grid: WaveGrid, count: int = 32) -> np.ndarray:
    """Nominal channel centres spanning the detector's wavelength range."""
    return np.linspace(grid.hi, grid.lo, count)


def band_mask(wavelength: np.ndarray, bandwidth: np.ndarray, centre: float) -> np.ndarray:
    """Pixels whose channel overlaps ``centre``, weighted by half-bandwidth."""
    half = np.nanmedian(bandwidth) * 0.75
    return np.abs(wavelength - centre) <= half


def extract_spectrum(
    image: np.ndarray,
    wavelength: np.ndarray,
    bandwidth: np.ndarray,
    x: int,
    y: int,
    aperture: int = 3,
) -> tuple[np.ndarray, np.ndarray]:
    """Sum flux in a small aperture per wavelength channel.

    Returns (centre wavelengths, flux) sorted from blue to red, skipping
    channels with no valid pixel in the aperture.
    """
    ny, nx = image.shape
    x0, x1 = max(0, x - aperture), min(nx, x + aperture + 1)
    y0, y1 = max(0, y - aperture), min(ny, y + aperture + 1)

    sub_img = image[y0:y1, x0:x1]
    sub_lam = wavelength[y0:y1, x0:x1]

    centres = np.unique(np.round(sub_lam[np.isfinite(sub_lam)], 2))
    flux = np.full(centres.size, np.nan)
    for i, c in enumerate(centres):
        sel = np.abs(sub_lam - c) <= 0.01
        vals = sub_img[sel]
        vals = vals[np.isfinite(vals)]
        if vals.size:
            flux[i] = float(np.sum(vals))

    ok = np.isfinite(flux)
    return centres[ok], flux[ok]
