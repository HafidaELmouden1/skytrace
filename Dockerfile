FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    MPLBACKEND=Agg

WORKDIR /app

COPY requirements.txt .
RUN pip install --quiet -r requirements.txt

COPY backend ./backend
COPY scripts ./scripts

# Frames and rendered WebP are data, not code: they live in the repository's
# data release rather than in git. A free instance has no persistent disk, so
# they are baked into the image. Pass --build-arg DATA_URL= to skip the
# download and mount ./data instead.
ARG DATA_URL=https://github.com/HafidaELmouden1/skytrace/releases/download/data-v1/skytrace-data.tar.gz

RUN python -c "\
import os, tarfile, tempfile, urllib.request;\
url = os.environ.get('DATA_URL', '').strip();\
print('data:', url or 'none');\
url and (lambda p: (urllib.request.urlretrieve(url, p), tarfile.open(p).extractall('/app', filter='data')))(tempfile.mktemp(suffix='.tar.gz'))"

EXPOSE 8000

# One worker: rendering a cutout costs a second of CPU, and the module keeps a
# warm index of every frame in memory.
CMD uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}
