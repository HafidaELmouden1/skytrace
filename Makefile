PY := uv run --quiet --python 3.13
SCI := $(PY) --with astropy --with numpy
IMG := $(SCI) --with pillow

.PHONY: help probe preview spectrum dither test clean

help:
	@echo "make probe     anatomy of a cutout (HDUs, flags, wavelength grid)"
	@echo "make preview   render a cutout to WebP + report spectral geometry"
	@echo "make spectrum  build a spectrum from a repointing sequence"
	@echo "make dither    verify the one-channel-per-repointing shift"
	@echo "make clean     remove rendered output"

probe:
	$(SCI) python scripts/probe_mef.py data/dr1_w0855.fits

preview:
	$(IMG) python scripts/preview_cutout.py data/dr1_w0855.fits out

spectrum:
	$(SCI) python scripts/spectrum_from_slews.py \
		data/dr1_w0855.fits data/dr1_w0855_slew2.fits \
		data/dr1_w0855_slew3.fits data/dr1_w0855_slew4.fits \
		--ra 133.7951 --dec -7.2451

dither:
	$(SCI) python scripts/check_dither.py data/dr1_w0855.fits data/dr1_w0855_slew2.fits

clean:
	rm -rf out
