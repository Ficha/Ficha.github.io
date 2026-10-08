"""Vistas previas para compartir (Open Graph): portadas, imágenes de ensayos y etiquetas de cada página.

    python .github/scripts/build_og.py            # todo
    python .github/scripts/build_og.py metas      # solo las etiquetas (lo llaman build_diario y build_guia_claude)
    python .github/scripts/build_og.py portadas   # solo regenera las portadas (Chrome o Edge sin ventana)

Las portadas miden 1200×630 y tienen lo importante en el cuadrado del centro: WhatsApp, Telegram y
LinkedIn, cuando muestran la tarjeta chica (imagen al costado), recortan ese cuadrado.
"""
import base64
import html
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SITIO = "https://ficha.github.io"
OG = RAIZ / "assets" / "img" / "og"
ANCHO, ALTO = 1200, 630

# nombre: (etiqueta, título, bajada, criatura de assets/press/criaturas/)
PORTADAS = {
    "inicio": ("Copywriter & UX writer científico", "Fidel Chaves", "Convierto ideas complejas en mensajes claros.", "ficha-robot"),
    "blog": ("Blog", "Ficción y ensayos", "Relatos, divulgación y ciencia.", "melan-tintero"),
    "diario-de-un-robot": ("Newsletter · desde 2020", "Diario de un Robot", "Escritura, ciencia, tiempo y lenguaje.", "tecla-teclado"),
    "faeton": ("Cuento · La chispa", "Faetón", "Para leer acá o bajar en PDF y EPUB.", "hermes-sobre"),
    "la-chispa": ("Libro de cuentos · adelanto", "La chispa", "El prólogo, mientras el libro se edita.", "lux-llama"),
    "guia-claude": ("Guía por tarjetas", "Cómo trabajo con Claude", "Qué gasta, qué ordenar y qué automatizar.", "folio-raton"),
    "cursada": ("Edición · FFyL · UBA", "Cursada", "Notas, fechas, programas y horarios.", "noctua-buho"),
    "arcade": ("Arcade", "La guardería", "Las criaturitas del álbum.", "egg-huevo"),
    "maquina-del-tiempo": ("Máquina del tiempo", "Todas las versiones", "De la primera página a hoy.", "cronos-reloj"),
    "press-kit": ("Press kit", "Fidel Chaves", "Bios, fotos, logos, criaturas y paleta.", "figaro-reportero"),
    "quests": ("Dashboard compartido", "Quests", "Quests, agenda, viajes y recetas.", "rufo-zorzal"),
    "diario": ("App de escritura", "Diario", "Minutos, proyectos, concursos y envíos.", "erlen-matraz"),
}

# página → portada (lo que no está acá usa "inicio"; los ensayos con imagen propia usan su og.jpg)
PAGINAS = {
    "blog.html": "blog", "ensayos/": "diario-de-un-robot", "ficcion/faeton.html": "faeton",
    "ficcion/la-chispa.html": "la-chispa", "guias/claude/": "guia-claude", "cursada/": "cursada",
    "arcade.html": "arcade", "maquina-del-tiempo.html": "maquina-del-tiempo", "press-kit.html": "press-kit",
    "quests/": "quests", "diario/": "diario",
}
# páginas que no tenían título ni descripción para compartir
FALTANTES = {
    "quests/index.html": ("Quests", "Dashboard compartido: quests, agenda cultural, viajes y recetas."),
    "diario/index.html": ("Diario de escritura", "App de escritura de Fidel Chaves: minutos, proyectos, concursos y envíos."),
}


def _portada(nombre):
    p = RAIZ / "assets" / "img" / "og-cover.png" if nombre == "inicio" else OG / f"{nombre}.png"
    return p


def _fuente(familia, archivo, estilo="normal", peso="400"):
    b = base64.b64encode((RAIZ / "assets" / "fonts" / archivo).read_bytes()).decode()
    return f"@font-face{{font-family:'{familia}';src:url(data:font/woff2;base64,{b}) format('woff2');font-style:{estilo};font-weight:{peso}}}"


def _html(etiqueta, titulo, bajada, criatura):
    svg = (RAIZ / "assets" / "press" / "criaturas" / f"{criatura}.svg").read_text(encoding="utf-8")
    svg = re.sub(r'width="\d+" height="\d+"', 'width="132" height="132"', svg, count=1)
    fuentes = "".join([_fuente("Anton", "anton-normal-latin.woff2"), _fuente("Anton", "anton-normal-latin-ext.woff2"),
                       _fuente("JetBrains Mono", "jetbrains-mono-normal-latin.woff2", peso="100 800"),
                       _fuente("Newsreader", "newsreader-italic-latin.woff2", "italic", "200 800")])
    return f"""<!doctype html><meta charset="utf-8"><style>{fuentes}
*{{margin:0;box-sizing:border-box}}
html,body{{width:{ANCHO}px;height:{ALTO}px;overflow:hidden;background:#0b0b0c}}
body{{position:relative;background:radial-gradient(#2a2a2d 1.6px,transparent 1.8px) 0 0/14px 14px,#0b0b0c}}
.lado{{position:absolute;top:0;bottom:0;width:250px;background:radial-gradient(#a6d600 6px,transparent 6.5px) 0 0/26px 26px,#c6ff00}}
.izq{{left:0;border-right:8px solid #0b0b0c}} .der{{right:0;border-left:8px solid #0b0b0c}}
.centro{{position:absolute;left:285px;width:630px;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:34px 18px;text-align:center}}
.chip{{font:700 21px/1 'JetBrains Mono';letter-spacing:.12em;text-transform:uppercase;color:#0b0b0c;background:#c6ff00;padding:11px 16px;outline:4px solid #f5f5f3;outline-offset:0}}
.bicho{{background:#c6ff00;border:6px solid #f5f5f3;padding:6px;line-height:0}}
h1{{font:400 112px/0.95 Anton;text-transform:uppercase;color:#f5f5f3;width:100%}}
p{{font:italic 400 31px/1.15 Newsreader;color:#f5f5f3;opacity:.92}}
.url{{position:absolute;right:28px;bottom:26px;font:700 20px/1 'JetBrains Mono';background:#f5f5f3;color:#0b0b0c;padding:10px 12px;border:4px solid #0b0b0c}}
</style><div class="lado izq"></div><div class="lado der"></div>
<div class="centro"><span class="chip">{html.escape(etiqueta)}</span><div class="bicho">{svg}</div>
<h1 id="t">{html.escape(titulo)}</h1><p>{html.escape(bajada)}</p></div><span class="url">ficha.github.io</span>
<script>var t=document.getElementById('t'),s=112;while((t.scrollWidth>t.clientWidth||t.offsetHeight>200)&&s>40){{s-=4;t.style.fontSize=s+'px'}}</script>"""


def _navegador():
    for exe in [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", "google-chrome", "chromium"]:
        if Path(exe).exists() or "\\" not in exe:
            return exe


def portadas(solo=None):
    from PIL import Image
    OG.mkdir(parents=True, exist_ok=True)
    exe = _navegador()
    with tempfile.TemporaryDirectory() as tmp:
        for nombre, datos in PORTADAS.items():
            if solo and nombre not in solo:
                continue
            fuente, png = Path(tmp) / f"{nombre}.html", Path(tmp) / f"{nombre}.png"
            fuente.write_text(_html(*datos), encoding="utf-8")
            subprocess.run([exe, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                            f"--window-size={ANCHO},{ALTO}", "--virtual-time-budget=3000", f"--screenshot={png}", fuente.as_uri()],
                           check=True, capture_output=True, timeout=120)
            with Image.open(png) as im:
                im.convert("RGB").crop((0, 0, ANCHO, ALTO)).save(_portada(nombre), optimize=True)
            print("portada", _portada(nombre).relative_to(RAIZ))


def encuadrar(origen, destino):
    """Deja una imagen de ensayo en 1200×630. Las apaisadas se recortan al centro; las cuadradas o verticales
    van enteras sobre el fondo de trama, centradas, para que también se vean bien en la tarjeta chica."""
    from PIL import Image, ImageDraw
    with Image.open(origen) as im:
        im = im.convert("RGB")
        if im.width / im.height >= 1.5:
            esc = max(ANCHO / im.width, ALTO / im.height)
            im = im.resize((round(im.width * esc), round(im.height * esc)), Image.LANCZOS)
            x, y = (im.width - ANCHO) // 2, (im.height - ALTO) // 2
            lienzo = im.crop((x, y, x + ANCHO, y + ALTO))
        else:
            lienzo = Image.new("RGB", (ANCHO, ALTO), "#0b0b0c")
            d = ImageDraw.Draw(lienzo)
            for yy in range(7, ALTO, 14):
                for xx in range(7, ANCHO, 14):
                    d.ellipse((xx - 1.6, yy - 1.6, xx + 1.6, yy + 1.6), fill="#2a2a2d")
            esc = min((ALTO - 60) / im.height, 900 / im.width)
            im = im.resize((round(im.width * esc), round(im.height * esc)), Image.LANCZOS)
            x, y = (ANCHO - im.width) // 2, (ALTO - im.height) // 2
            d.rectangle((x - 8, y - 8, x + im.width + 7, y + im.height + 7), fill="#f5f5f3")
            lienzo.paste(im, (x, y))
        lienzo.save(destino, "JPEG", quality=84, optimize=True)


def ensayos():
    from PIL import Image
    for og in sorted((RAIZ / "assets" / "img" / "diario").glob("*/og.jpg")):
        with Image.open(og) as im:
            listo = im.size == (ANCHO, ALTO)
        if not listo:
            encuadrar(og, og)
            print("encuadrada", og.relative_to(RAIZ))


def _meta(m, clave):
    r = re.search(rf'<meta (?:property|name)="{re.escape(clave)}" content="([^"]*)"', m)
    return html.unescape(r.group(1)) if r else None


def metas():
    from PIL import Image
    cambiadas = 0
    for f in sorted(RAIZ.rglob("*.html")):
        rel = f.relative_to(RAIZ).as_posix()
        if rel.startswith((".github/", "_", "node_modules/")) or "/_" in rel or "/kit/" in rel:
            continue
        s = f.read_text(encoding="utf-8")
        if "<head" not in s:
            continue
        orig = s
        url_pag = f"{SITIO}/" + (rel[:-10] if rel.endswith("index.html") else rel)
        titulo = _meta(s, "og:title") or (FALTANTES.get(rel) or [None])[0] or html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip())
        desc = _meta(s, "og:description") or (FALTANTES.get(rel) or [None, None])[1] or _meta(s, "description") or ""
        # imagen: la propia del ensayo si tiene; si no, la portada de su sección
        actual = _meta(s, "og:image") or ""
        if "/assets/img/diario/" in actual:
            img = RAIZ / actual.replace(SITIO + "/", "")
        else:
            nombre = next((v for k, v in PAGINAS.items() if rel == k or (k.endswith("/") and rel.startswith(k))), "inicio")
            img = _portada(nombre)
        with Image.open(img) as im:
            w, h = im.size
        img_url = f"{SITIO}/{img.relative_to(RAIZ).as_posix()}"
        # se sacan las etiquetas viejas de imagen y tarjeta y se vuelven a poner juntas, en orden
        s = re.sub(r'[ \t]*<meta (?:property|name)="(?:og:image(?::\w+)?|twitter:card|twitter:image(?::alt)?)" content="[^"]*">\n', "", s)
        bloque = [f'<meta property="og:image" content="{img_url}">', f'<meta property="og:image:width" content="{w}">',
                  f'<meta property="og:image:height" content="{h}">',
                  f'<meta property="og:image:alt" content="{html.escape(titulo)}">',
                  '<meta name="twitter:card" content="summary_large_image">', f'<meta name="twitter:image" content="{img_url}">']
        faltan = []
        if not _meta(s, "og:type"):
            faltan.append('<meta property="og:type" content="website">')
        if not _meta(s, "og:title"):
            faltan.append(f'<meta property="og:title" content="{html.escape(titulo)}">')
        if not _meta(s, "og:description") and desc:
            faltan.append(f'<meta property="og:description" content="{html.escape(desc)}">')
        if not _meta(s, "og:url") and not rel == "404.html":
            faltan.append(f'<meta property="og:url" content="{url_pag}">')
        if not _meta(s, "og:site_name"):
            faltan.append('<meta property="og:site_name" content="Fidel Chaves">')
        bloque = "\n".join(faltan + bloque) + "\n"
        ancla = re.search(r'<meta property="og:url" content="[^"]*">\n', s) or re.search(r'<meta property="og:description" content="[^"]*">\n', s)
        if ancla:
            s = s[:ancla.end()] + bloque + s[ancla.end():]
        else:
            s = re.sub(r"(\s*)</head>", lambda m: "\n" + bloque + "</head>", s, count=1)
        if s != orig:
            f.write_text(s, encoding="utf-8", newline="\n")
            cambiadas += 1
    print(f"etiquetas: {cambiadas} páginas actualizadas")


if __name__ == "__main__":
    que = sys.argv[1:] or ["portadas", "ensayos", "metas"]
    if "portadas" in que:
        portadas()
    if "ensayos" in que:
        ensayos()
    if "metas" in que:
        metas()
