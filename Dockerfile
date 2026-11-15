FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    MPLBACKEND=Agg

WORKDIR /app

COPY requirements.txt .
RUN pip install --quiet -r requirements.txt

COPY backend ./backend
COPY scripts ./scripts
COPY data/manifest.json ./data/manifest.json

# The FITS are not in git and a free instance has no persistent disk, so the
# build asks IRSA for the cutouts listed in the manifest. DATA_URL can instead
# point at a tarball holding data/ and cache/ (a frozen snapshot); leaving it
# empty rebuilds the series from the archive.
ARG DATA_URL=
RUN if [ -n "$DATA_URL" ]; then \
        python -c "import os, tarfile, tempfile, urllib.request as request; \
p = tempfile.mktemp(suffix='.tar.gz'); \
request.urlretrieve(os.environ['DATA_URL'], p); \
tarfile.open(p).extractall('/app', filter='data')"; \
    else \
        python scripts/fetch_manifest.py; \
    fi

RUN mkdir -p /app/data/frames /app/cache

EXPOSE 8000

# One worker: rendering a cutout costs a second of CPU, and the module keeps a
# warm index of every frame in memory.
CMD uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}
