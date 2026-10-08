"""Revisa los links internos del sitio: href/src de cada .html y los links que arman los JS (Tomatina, Folio, arcade).
Uso: python .github/scripts/revisar_links.py   (sale con código 1 si hay links rotos)"""
import re, sys, pathlib, html
from urllib.parse import urlsplit, unquote
sys.stdout.reconfigure(encoding="utf-8")
root = pathlib.Path(__file__).resolve().parents[2]
SKIP = ("_anterior", "node_modules", ".git")
ids_cache = {}


def ids(p):
    if p not in ids_cache:
        t = p.read_text(encoding="utf-8", errors="ignore")
        ids_cache[p] = set(re.findall(r'\bid="([^"]+)"', t)) | set(re.findall(r'\bname="([^"]+)"', t))
    return ids_cache[p]


def check(base_file, url, origen):
    u = html.unescape(url.strip())
    if not u or u.startswith(("http:", "https:", "mailto:", "tel:", "javascript:", "data:", "//", "{", "'")) or "${" in u or "' +" in u:
        return None
    s = urlsplit(u)
    path, frag = unquote(s.path), s.fragment
    if path.startswith("/"):
        target = root / path.lstrip("/")
    elif path:
        target = (base_file.parent / path)
    else:
        target = base_file
    target = pathlib.Path(str(target))
    if target.is_dir() or path.endswith("/"):
        target = target / "index.html"
    if not target.exists():
        return f"{origen}: {url} → no existe ({target.relative_to(root) if root in target.parents else target})"
    # los filtros del índice de ensayos se abren con #t-tema (data-f), no con un id
    if frag and target.suffix == ".html" and frag not in ids(target) and f'data-f="{frag}"' not in target.read_text(encoding="utf-8", errors="ignore"):
        return f"{origen}: {url} → falta el ancla #{frag}"
    return None


errores = []
for p in sorted(root.rglob("*.html")):
    if any(x in p.parts for x in SKIP):
        continue
    t = p.read_text(encoding="utf-8", errors="ignore")
    t = re.sub(r"<script\b[^>]*>.*?</script>", "", t, flags=re.S)  # los scripts inline van aparte
    for m in re.finditer(r'\b(?:href|src)="([^"]*)"', t):
        e = check(p, m.group(1), str(p.relative_to(root)))
        if e: errores.append(e)

# Links que arma el JS: con la página desde la que se muestran
js = (root/"assets/js/sistema.js").read_text(encoding="utf-8")
i = js.index("TIPS.tomatina = ["); j = js.index("  ];", i)
for h in re.findall(r"href: '([^']+)'", js[i:j]):
    e = check(root/"index.html", h, "Tomatina (desde index.html)"); errores += [e] if e else []
i = js.index("TIPS.raton = ["); j = js.index("  ];", i)
for h in re.findall(r"href: '([^']+)'", js[i:j]):
    e = check(root/"guias/claude/index.html", h, "Folio (desde guias/claude/)"); errores += [e] if e else []
for s in re.findall(r'\["([a-z-]+)", "', js[js.index("var GUIA_TEMAS"):js.index("/* guia:fin */")]):
    e = check(root/"arcade.html", f"guias/claude/{s}.html", "Folio en el arcade"); errores += [e] if e else []
arc = (root/"assets/js/arcade.js").read_text(encoding="utf-8")
for h in re.findall(r"href: '([^']+)'", arc):
    e = check(root/"arcade.html", h, "arcade.js LINKS"); errores += [e] if e else []
m = re.search(r"var RANDOM = \[(.*?)\];", arc)
for h in re.findall(r"'([^']+)'", m.group(1)):
    e = check(root/"arcade.html", h, "arcade.js RANDOM (Egg)"); errores += [e] if e else []

print(len(errores), "errores")
for e in errores: print("-", e)
sys.exit(1 if errores else 0)
