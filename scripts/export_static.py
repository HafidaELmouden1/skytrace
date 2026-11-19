"""Export the running SkyTrace server as a set of static files.

A static host cannot run astropy, so the export precomputes what the interface
asks for and rewrites the API calls in the browser: same pages, same images,
same numbers, no server. Comparisons are limited to the pairs listed in the
manifest (consecutive passes, plus the first and last of each field), because
each one costs a second of CPU here.

    uv run --python 3.13 --with astropy --with numpy --with pillow \\
        python scripts/export_static.py --out site
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from app import main as api  # noqa: E402


def dump(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")


def copy_asset(src: Path, dest: Path) -> bool:
    if not src.exists():
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dest)
    return True


SHIM = """
<script>
/* Static export: every /api call the interface makes is answered from a file
   written by scripts/export_static.py. Pairs that were not precomputed return
   an explicit error instead of a wrong picture. */
(() => {
  const real = window.fetch.bind(window);
  const json = (url, init) => real(url, init);

  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    const method = (init && init.method) || 'GET';
    const u = new URL(url, location.origin);
    if (!u.pathname.startsWith('/api/')) return real(input, init);
    if (method !== 'GET') {
      return Promise.resolve(new Response(
        JSON.stringify({ detail: 'static export: read-only' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }));
    }

    const target = u.searchParams.get('target') || (u.pathname === '/api/stats' ? 'all' : 'wise0855');
    let file = null;
    if (u.pathname === '/api/targets') file = 'targets.json';
    else if (u.pathname === '/api/stats') file = target === 'all' ? 'stats.json' : `stats-${target}.json`;
    else if (u.pathname === '/api/gallery') file = 'gallery.json';
    else if (u.pathname === '/api/spectrum') file = 'spectrum.json';
    else if (u.pathname === '/api/epochs') file = `epochs-${target}.json`;
    else if (u.pathname === '/api/track') file = `track-${target}.json`;
    else if (u.pathname.startsWith('/api/diff')) {
      file = `diff/${u.searchParams.get('a')}--${u.searchParams.get('b')}.json`;
    } else if (u.pathname.startsWith('/api/metadata/')) {
      file = `metadata/${u.pathname.split('/').pop()}.json`;
    } else if (u.pathname.startsWith('/api/describe/')) {
      file = `describe/${u.pathname.split('/').pop()}-${u.searchParams.get('lang') || 'fr'}.json`;
    } else if (u.pathname.startsWith('/api/frames/') || u.pathname.startsWith('/api/cache/')) {
      return real(input, init);
    }
    if (!file) return Promise.resolve(new Response('{}', { status: 404,
      headers: { 'Content-Type': 'application/json' } }));

    return real(`/api-static/${file}`, init).then((r) => {
      if (r.ok) return r;
      if (file.startsWith('diff/')) {
        return new Response(JSON.stringify({
          detail: 'Cette comparaison n\\'est pas précalculée dans la version statique.',
        }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      return r;
    });
  };
})();
</script>
"""

NOTE = """
<div style="position:fixed;left:50%;bottom:14px;transform:translateX(-50%);
  z-index:9999;background:var(--card,#111);border:1px solid var(--border,#333);
  border-radius:999px;padding:8px 16px;font:12px/1.4 system-ui,sans-serif;
  color:var(--muted-foreground,#aaa);max-width:92vw;text-align:center">
  Version statique · comparaisons précalculées (passes consécutives, première et
  dernière) · l'application complète calcule chaque paire à la demande.
</div>
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=str(ROOT / "site"))
    args = parser.parse_args()
    out = Path(args.out)

    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    api.FILES = api.discover_frames()
    api.build_frames()
    print(f"{len(api._frames)} poses indexees")

    static_src = ROOT / "backend" / "app" / "static"
    shutil.copytree(static_src, out / "static")

    source = (static_src / "index.html").read_text(encoding="utf-8")
    source = source.replace("</head>", SHIM + "</head>", 1)
    source = source.replace("</body>", NOTE + "</body>", 1)
    (out / "index.html").write_text(source, encoding="utf-8")
    # GitHub Pages serves unknown paths through 404.html; the interface routes
    # on location.pathname, so the same shell answers /explore, /about and so on.
    (out / "404.html").write_text(source, encoding="utf-8")
    (out / ".nojekyll").write_text("", encoding="utf-8")

    # One directory per route: a static host answers /explore with 404 unless a
    # real file sits there, and the interface routes on location.pathname.
    for route in ("explore", "gallery", "about", "learn", "archive", "targets"):
        (out / route).mkdir(exist_ok=True)
        (out / route / "index.html").write_text(source, encoding="utf-8")

    api_dir = out / "api-static"
    dump(api_dir / "targets.json", api.targets())
    dump(api_dir / "stats.json", api.stats(target="all"))
    dump(api_dir / "gallery.json", api.gallery(target=None))
    try:
        dump(api_dir / "spectrum.json", api.spectrum(ra=133.7951, dec=-7.2451))
    except Exception as exc:
        # The spectrum needs the reference FITS at the data root, which the
        # hosted build may not carry; the page then shows its empty state.
        print(f"  spectrum: {exc}")
        dump(api_dir / "spectrum.json", {"detail": str(exc)})

    frames = list(api._frames.values())
    for index, record in enumerate(frames, 1):
        copy_asset(record.path, out / "api" / "frames" / f"{record.obs_id}.webp")
        try:
            dump(api_dir / "metadata" / f"{record.obs_id}.json", api.metadata(record.obs_id))
        except Exception as exc:
            print(f"  metadata {record.obs_id}: {exc}")
        for lang in ("fr", "en"):
            try:
                dump(api_dir / "describe" / f"{record.obs_id}-{lang}.json",
                     api.describe(record.obs_id, lang=lang))
            except Exception:
                pass
        if index % 25 == 0:
            print(f"  {index}/{len(frames)} poses exportees")

    comparisons = 0
    for target in api.TARGETS:
        slug = target["slug"]
        try:
            data = api.epochs(target=slug)
        except Exception:
            # A field with no observation yet still needs a payload, or the
            # interface shows a network error instead of its empty state.
            dump(api_dir / f"epochs-{slug}.json",
                 {"field": {"name": slug}, "count": 0, "epochs": [], "groups": []})
            dump(api_dir / f"stats-{slug}.json", {"frames": 0})
            continue
        dump(api_dir / f"epochs-{slug}.json", data)
        try:
            dump(api_dir / f"stats-{slug}.json", api.stats(target=slug))
        except Exception as exc:
            print(f"  stats {slug}: {exc}")
        try:
            dump(api_dir / f"track-{slug}.json", api.track(target=slug, threshold=5.0))
        except Exception as exc:
            print(f"  track {slug}: {exc}")

        ids = [epoch["obs_id"] for epoch in data["epochs"]]
        pairs = {(ids[i], ids[i + 1]) for i in range(len(ids) - 1)}
        if len(ids) > 2:
            pairs.add((ids[0], ids[-1]))
        for a, b in sorted(pairs):
            try:
                result = api.diff(a, b, threshold=5.0)
            except Exception as exc:
                print(f"  diff {a}/{b}: {exc}")
                continue
            dump(api_dir / "diff" / f"{a}--{b}.json", result)
            copy_asset(ROOT / "cache" / Path(result["image"]).name,
                       out / "api" / "cache" / Path(result["image"]).name)
            comparisons += 1
        print(f"{slug}: {len(ids)} poses, {len(pairs)} comparaisons")

    total = sum(1 for _ in out.rglob("*") if _.is_file())
    size = sum(f.stat().st_size for f in out.rglob("*") if f.is_file())
    print(f"{total} fichiers, {size / 1e6:.1f} Mo, {comparisons} comparaisons")


if __name__ == "__main__":
    main()
