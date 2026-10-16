"""Sprites de píxel en un solo archivo cacheable: assets/img/sprites.svg (<symbol> + <use>).

Antes cada criatura iba en línea con una <rect> por píxel (unos 160 KB por página). Ahora el HTML lleva
<svg ...><use href="assets/img/sprites.svg#s-ab12cd34"/></svg> y funciona sin JS.
Los colores salen de las variables CSS del tema (--ink, --paper, --accent), que se heredan dentro de <use>;
los contextos que cambian la tinta (sobre verde, fijo, hover) lo hacen con --s-i / --s-p / --s-a en sistema.css.

Uso:
    python .github/scripts/sprites.py            # migra el HTML estático que todavía tenga <rect> en línea
Desde otros scripts: `import sprites; sprites.svg_uso(grilla, px, R)` y `sprites.guardar()` al final.
sprites.svg solo crece: los símbolos que ya existen no se borran (los usan las páginas ya generadas).
"""
import hashlib
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ARCHIVO = RAIZ / "assets" / "img" / "sprites.svg"
EXCLUIDAS = {"cursada", "diario", "quests", "_anterior", ".git", ".github", ".scratch", "node_modules"}
CLASE = {"#": "si", "o": "sp", "a": "sa"}

ESTILO = ("<style>.si{fill:var(--s-i,var(--ink,#0b0b0c))}.sp{fill:var(--s-p,var(--paper,#f5f5f3))}"
          ".sa{fill:var(--s-a,var(--accent,#c6ff00))}</style>")
_SIMBOLO = re.compile(r'<symbol id="([^"]+)" viewBox="([^"]+)">(.*?)</symbol>', re.S)
_RECT = re.compile(r'<rect class="(s[ipa])" x="(\d+)" y="(\d+)" width="1" height="1"/>')
_SPRITE = re.compile(r'<svg ([^>]*?)>((?:<rect class="s[ipa]" x="\d+" y="\d+" width="1" height="1"/>)+)</svg>')

_simbolos = {}
if ARCHIVO.exists():
    for i, vb, cuerpo in _SIMBOLO.findall(ARCHIVO.read_text(encoding="utf-8")):
        _simbolos[i] = (vb, cuerpo)


def _juntar(rects):
    """Une los píxeles contiguos de una fila y de una misma clase en una sola <rect>."""
    pts = sorted((int(y), int(x), c) for c, x, y in rects)
    out, i = [], 0
    while i < len(pts):
        y, x, c = pts[i]
        n = 1
        while i + n < len(pts) and pts[i + n] == (y, x + n, c):
            n += 1
        out.append(f'<rect class="{c}" x="{x}" y="{y}" width="{n}" height="1"/>')
        i += n
    return "".join(out)


def registrar(viewbox, rects):
    cuerpo = _juntar(rects)
    id_ = "s-" + hashlib.sha1((viewbox + cuerpo).encode()).hexdigest()[:8]
    _simbolos[id_] = (viewbox, cuerpo)
    return id_


def _use(attrs, id_, R):
    return f'<svg {attrs}><use href="{R}assets/img/sprites.svg#{id_}"/></svg>'


def svg_uso(grilla, px, R, extra=""):
    """<svg> con <use> para una grilla de filas ('#', 'o', 'a', '.')."""
    w, h = len(grilla[0]), len(grilla)
    rects = [(CLASE[c], x, y) for y, f in enumerate(grilla) for x, c in enumerate(f) if c in CLASE]
    id_ = registrar(f"0 0 {w} {h}", rects)
    return _use(f'width="{w * px}" height="{h * px}" viewBox="0 0 {w} {h}" shape-rendering="crispEdges"{extra}', id_, R)


def registrar_criaturas():
    """Un símbolo por criatura de CREATURES (assets/js/sistema.js): cr-<id> a color (la silueta de las que faltan en el álbum
    es el mismo símbolo en tinta y con opacidad, en sistema.css; sistema.js los usa con <use> para no dibujar miles de <rect> en cada página)."""
    for k in [k for k in _simbolos if k.endswith("-sil")]:
        del _simbolos[k]  # versiones viejas: la silueta se hace en CSS
    js = (RAIZ / "assets" / "js" / "sistema.js").read_text(encoding="utf-8")
    for c in json.loads(re.search(r"var CREATURES = (\[.*?\]);\n", js).group(1)):
        w, h = len(c["rows"][0]), len(c["rows"])
        pix = [(CLASE[ch], x, y) for y, f in enumerate(c["rows"]) for x, ch in enumerate(f) if ch in CLASE]
        _simbolos["cr-" + c["id"]] = (f"0 0 {w} {h}", _juntar(pix))


def migrar(html, R):
    def f(m):
        attrs = m.group(1)
        vb = re.search(r'viewBox="([^"]+)"', attrs)
        if not vb:
            return m.group(0)
        return _use(attrs, registrar(vb.group(1), _RECT.findall(m.group(2))), R)
    return _SPRITE.sub(f, html)


def guardar():
    registrar_criaturas()
    ARCHIVO.parent.mkdir(parents=True, exist_ok=True)
    cuerpo = "".join(f'<symbol id="{i}" viewBox="{vb}">{c}</symbol>\n' for i, (vb, c) in sorted(_simbolos.items()))
    ARCHIVO.write_text(f'<svg xmlns="http://www.w3.org/2000/svg">\n{ESTILO}\n{cuerpo}</svg>\n', encoding="utf-8")


def main():
    n = 0
    objetivos = [p for p in sorted(RAIZ.rglob("*.html")) if p.relative_to(RAIZ).parts[0] not in EXCLUIDAS]
    objetivos.append(RAIZ / ".github" / "scripts" / "comun" / "header.html")
    for p in objetivos:
        s = p.read_text(encoding="utf-8")
        rel = p.relative_to(RAIZ)
        if "comun" in rel.parts:
            R = "{R}"
        elif rel.as_posix() in ("404.html",):
            R = "/"
        else:
            R = "../" * (len(rel.parts) - 1)
        nuevo = migrar(s, R)
        if nuevo != s:
            p.write_text(nuevo, encoding="utf-8", newline="")
            n += 1
    guardar()
    print(f"{n} archivos migrados, {len(_simbolos)} símbolos en {ARCHIVO.relative_to(RAIZ)}")


if __name__ == "__main__":
    sys.exit(main())
