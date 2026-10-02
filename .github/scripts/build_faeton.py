#!/usr/bin/env python3
"""Arma el cuento "Faetón" (de La chispa) a partir de faeton.md:
  - ficcion/faeton.html   (página para leer; molde = ficcion/la-chispa.html)
  - assets/faeton/Faeton.epub
  - assets/faeton/Faeton.pdf  (con Chrome o Edge en modo headless)

Uso, desde la raíz del repo:  python .github/scripts/build_faeton.py
No editar ficcion/faeton.html a mano: se regenera. El texto vive en faeton.md.
"""
import html
import re
import shutil
import subprocess
import sys
import tempfile
import uuid
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FUENTE = Path(__file__).with_name("faeton.md")
MOLDE = RAIZ / "ficcion" / "la-chispa.html"
SALIDA_HTML = RAIZ / "ficcion" / "faeton.html"
CARPETA = RAIZ / "assets" / "faeton"
URL = "https://ficha.github.io/ficcion/faeton.html"
TITULO = "Faetón"
AUTOR = "Fidel Chaves"
NOTA = "Versión en revisión; el texto final del libro puede variar."


def leer():
    marco, cuento, destino = [], [], None
    for bloque in re.split(r"\n\s*\n", FUENTE.read_text(encoding="utf-8").strip()):
        bloque = bloque.strip()
        if bloque == "## MARCO":
            destino = marco
        elif bloque == "## CUENTO":
            destino = cuento
        elif destino is not None:
            destino.append(bloque)
    return marco, cuento


def parrafos(lista):
    return "\n\n".join("      <p>%s</p>" % html.escape(p, quote=False) for p in lista)


def pagina(marco, cuento):
    s = MOLDE.read_text(encoding="utf-8")
    desc = "Faetón, un cuento de La chispa, el libro de Fidel Chaves. Para leer acá o bajar en PDF y EPUB."
    s = re.sub(r"<title>.*?</title>", "<title>Faetón (cuento) | Fidel Chaves</title>", s, 1, re.S)
    s = s.replace("La chispa (adelanto) | Fidel Chaves", "Faetón (cuento) | Fidel Chaves")
    s = re.sub(r"(<meta name=\"description\" content=\")[^\"]*", r"\g<1>" + desc, s, 1)
    s = re.sub(r"(<meta property=\"og:description\" content=\")[^\"]*", r"\g<1>" + desc, s, 1)
    s = s.replace("https://ficha.github.io/ficcion/la-chispa.html", URL)
    s = s.replace('"name": "La chispa (adelanto)"', '"name": "Faetón"')
    s = re.sub(r'("description": ")[^"]*', r"\g<1>" + desc, s, 1)
    s = s.replace('data-meta-key="laChispa"', 'data-meta-key="faeton"')
    s = s.replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, nofollow">')
    s = s.replace('data-i18n="laChispa.backLink">← Volver al blog', 'data-i18n="blog.backToBlog">← Volver al blog')
    s = s.replace('href="../blog.html" data-i18n="laChispa.blogLink"', 'href="../blog.html" data-i18n="laChispa.blogLink"')
    cuerpo = """  <article class="section wrap--narrow wrap">
    <p class="hero__eyebrow" data-i18n="faeton.eyebrow">Ficción | cuento de La chispa</p>
    <h1 style="font-size:clamp(1.8rem,6vw,2.6rem);">Faetón</h1>
    <p class="section__lead" data-i18n="faeton.lead">Un cuento de <em>La chispa</em>, libro en edición. Es un regalo: leelo acá o bajalo en PDF o EPUB.</p>
    <p class="contact__alt" data-i18n="faeton.note">Este texto está escrito en español. Versión en revisión; el texto final del libro puede variar.</p>

    <div class="feature__actions">
      <a class="btn btn--accent" href="../assets/faeton/Faeton.pdf" download data-i18n="faeton.pdf">Bajar PDF</a>
      <a class="btn btn--ghost" href="../assets/faeton/Faeton.epub" download data-i18n="faeton.epub">Bajar EPUB</a>
    </div>

    <div class="prose" style="margin-top:2rem;">
      <blockquote class="prose__marco">
%s
      </blockquote>

      <h2 class="prose__titulo">Faetón</h2>

%s
    </div>

    <p class="section__lead" style="margin-top:2rem;">
      <button type="button" class="btn btn--accent" data-chispa-open data-i18n="laChispa.ctaBtn">¿Te interesa leer más? Hacemelo saber</button>
    </p>
    <p class="section__lead">
      <a href="../blog.html" data-i18n="laChispa.blogLink">Ver más ficción y ensayos en el blog ❧</a>
    </p>
  </article>""" % (parrafos(marco).replace("      <p>", "        <p>"), parrafos(cuento))
    s = re.sub(r"  <article class=\"section wrap--narrow wrap\">.*?</article>", lambda m: cuerpo, s, 1, re.S)
    SALIDA_HTML.write_text(s, encoding="utf-8")


EPUB_CSS = """body{font-family:serif;line-height:1.55;margin:5%}
h1{text-align:center;margin:2em 0 .2em}p.autor{text-align:center;font-style:italic;margin:0 0 2em}
blockquote{margin:1.5em 1em;font-style:italic}h2{text-align:center;margin:2em 0 1em}
p{margin:0 0 .9em;text-indent:0;text-align:left}p.nota{font-size:.85em;text-align:center;margin-top:3em}"""


def xhtml(titulo, cuerpo):
    return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es-AR">\n'
            '<head><meta charset="utf-8"/><title>%s</title><link rel="stylesheet" href="estilo.css"/></head>\n'
            '<body>\n%s\n</body>\n</html>\n' % (html.escape(titulo), cuerpo))


def epub(marco, cuento):
    CARPETA.mkdir(parents=True, exist_ok=True)
    cuerpo = ('<h1>%s</h1>\n<p class="autor">%s</p>\n<blockquote>\n%s\n</blockquote>\n<h2>%s</h2>\n%s\n<p class="nota">%s<br/>%s</p>'
              % (TITULO, AUTOR,
                 "\n".join("<p>%s</p>" % html.escape(p, quote=False) for p in marco), TITULO,
                 "\n".join("<p>%s</p>" % html.escape(p, quote=False) for p in cuento),
                 "De <i>La chispa</i>, libro de cuentos en edición. " + NOTA, URL))
    ident = "urn:uuid:%s" % uuid.uuid5(uuid.NAMESPACE_URL, URL)
    opf = ('<?xml version="1.0" encoding="utf-8"?>\n'
           '<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id" xml:lang="es-AR">\n'
           '<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
           '<dc:identifier id="id">%s</dc:identifier><dc:title>%s</dc:title><dc:creator>%s</dc:creator>'
           '<dc:language>es-AR</dc:language><dc:rights>© Fidel Chaves. Se puede compartir sin cambios y sin fines comerciales.</dc:rights>'
           '<meta property="dcterms:modified">2026-10-02T00:00:00Z</meta>\n</metadata>\n'
           '<manifest>\n<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n'
           '<item id="cuento" href="cuento.xhtml" media-type="application/xhtml+xml"/>\n'
           '<item id="css" href="estilo.css" media-type="text/css"/>\n</manifest>\n'
           '<spine><itemref idref="cuento"/></spine>\n</package>\n') % (ident, TITULO, AUTOR)
    nav = xhtml(TITULO, '<nav epub:type="toc"><ol><li><a href="cuento.xhtml">%s</a></li></ol></nav>' % TITULO)
    cont = ('<?xml version="1.0"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
            '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
    with zipfile.ZipFile(CARPETA / "Faeton.epub", "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", cont, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/content.opf", opf, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/nav.xhtml", nav, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/cuento.xhtml", xhtml(TITULO, cuerpo), zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/estilo.css", EPUB_CSS, zipfile.ZIP_DEFLATED)


def navegador():
    for ruta in (r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                 r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                 shutil.which("google-chrome") or "", shutil.which("chromium") or ""):
        if ruta and Path(ruta).exists():
            return ruta
    return None


PDF_CSS = """@page{size:A5;margin:20mm 18mm 22mm}
@font-face{font-family:Bodoni;src:url('%s');font-weight:100 900}
body{font-family:Georgia,'Times New Roman',serif;font-size:11pt;line-height:1.5;color:#1c1710}
h1{font-family:Bodoni,Georgia,serif;font-size:30pt;text-align:center;margin:30mm 0 2mm}
.autor{text-align:center;font-style:italic;margin:0 0 14mm}
blockquote{margin:0 6mm 10mm;font-style:italic}
h2{font-family:Bodoni,Georgia,serif;text-align:center;font-size:20pt;margin:10mm 0 6mm;page-break-before:always}
p{margin:0 0 3mm;text-align:justify;hyphens:auto;orphans:3;widows:3}
.nota{font-size:9pt;text-align:center;margin-top:12mm;color:#555}"""


def pdf(marco, cuento):
    exe = navegador()
    if not exe:
        print("AVISO: no encontré Chrome ni Edge; el PDF no se generó.", file=sys.stderr)
        return
    fuente = (RAIZ / "assets" / "fonts" / "bodoni-moda-normal-latin.woff2").as_uri()
    cuerpo = ('<h1>%s</h1><p class="autor">%s</p><blockquote>%s</blockquote><h2>%s</h2>%s<p class="nota">%s</p>'
              % (TITULO, AUTOR, "".join("<p>%s</p>" % html.escape(p, quote=False) for p in marco), TITULO,
                 "".join("<p>%s</p>" % html.escape(p, quote=False) for p in cuento),
                 "De <i>La chispa</i>, libro de cuentos en edición. " + NOTA + " " + URL))
    with tempfile.TemporaryDirectory() as tmp:
        origen = Path(tmp) / "faeton.html"
        origen.write_text('<!doctype html><html lang="es"><meta charset="utf-8"><title>%s</title><style>%s</style><body>%s</body></html>'
                          % (TITULO, PDF_CSS % fuente, cuerpo), encoding="utf-8")
        CARPETA.mkdir(parents=True, exist_ok=True)
        destino = CARPETA / "Faeton.pdf"
        subprocess.run([exe, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                        "--print-to-pdf=%s" % destino, origen.as_uri()], check=True, capture_output=True, timeout=120)


if __name__ == "__main__":
    m, c = leer()
    pagina(m, c)
    epub(m, c)
    pdf(m, c)
    print("Listo: %s, %s" % (SALIDA_HTML.relative_to(RAIZ), CARPETA.relative_to(RAIZ)))
