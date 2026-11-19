"""Make the static export work under a sub-path such as /skytrace/.

GitHub Pages serves a project site from /<repo>/, while the interface was
written for a server at the root: it links /static/styles.css and pushes
routes like /explore into history. This rewrites those few spots in place and
leaves the original files untouched, so the export can be rebuilt and pushed
again without editing the application.

    python scripts/localize_export.py site
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

BOOTSTRAP = """
<script>
/* The site may be served from /skytrace/ instead of /. Everything below reads
   this prefix: links, history entries and the static API files. */
window.SKYTRACE_BASE = (() => {
  const parts = location.pathname.split('/').filter(Boolean);
  return parts.length ? '/' + parts[0] : '';
})();
(() => {
  const strip = (p) => {
    const b = window.SKYTRACE_BASE;
    if (b && p.startsWith(b)) return p.slice(b.length) || '/';
    return p;
  };
  Object.defineProperty(window, 'SKYTRACE_PATH', { get: () => strip(location.pathname) });
  const push = history.pushState.bind(history);
  history.pushState = (state, title, url) => {
    if (typeof url === 'string' && url.startsWith('/') && window.SKYTRACE_BASE
        && !url.startsWith(window.SKYTRACE_BASE)) {
      url = window.SKYTRACE_BASE + url;
    }
    return push(state, title, url);
  };
})();
</script>
"""


def patch_html(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if "SKYTRACE_BASE" not in text:
        text = text.replace("<head>", "<head>" + BOOTSTRAP, 1)
    text = text.replace('href="/static/', 'href="static/')
    text = text.replace('src="/static/', 'src="static/')
    # The shim reads files next to the page, never from the domain root.
    text = text.replace("real(`/api-static/${file}`, init)",
                        "real(`${window.SKYTRACE_BASE}/api-static/${file}`, init)")
    path.write_text(text, encoding="utf-8")


def patch_app_js(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if "window.SKYTRACE_PATH" in text:
        return
    text = text.replace("window.location.pathname", "(window.SKYTRACE_PATH || '/')")
    path.write_text(text, encoding="utf-8")


def main() -> None:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    pages = [root / "index.html", root / "404.html"]
    for page in pages:
        if page.exists():
            patch_html(page)
    patch_app_js(root / "static" / "app.js")

    html = (root / "index.html").read_text(encoding="utf-8")
    print(f"{root}: bootstrap={'SKYTRACE_BASE' in html} "
          f"css={'href=\"static/' in html} "
          f"js={'SKYTRACE_PATH' in (root / 'static' / 'app.js').read_text(encoding='utf-8')}")


if __name__ == "__main__":
    main()
