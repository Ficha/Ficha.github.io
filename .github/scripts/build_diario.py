#!/usr/bin/env python3
"""Arma el archivo de *Diario de un Robot* a partir de .github/scripts/diario/*.md:
  - ensayos/<slug>.html   (una página por ensayo; molde = ensayos/_template.html)
  - ensayos/index.html    (archivo con buscador, orden por fecha o extensión y filtros por etiqueta y serie)
  - sitemap.xml           (bloque entre <!-- diario:inicio --> y <!-- diario:fin -->)
  - blog.html             (los 3 últimos ensayos, entre <!-- ultimos:inicio --> y <!-- ultimos:fin -->)

Uso, desde la raíz del repo:  python .github/scripts/build_diario.py
No editar ensayos/*.html a mano: se regeneran. El texto vive en diario/<slug>.md
(lo importa escritura/.../newsletter-diario-de-un-robot/_trabajo/importar_al_sitio.py).
Si existe diario/en/<slug>.html, se usa como versión en inglés.
"""
import datetime as dt
import html
import json
import re
from pathlib import Path

import markdown

RAIZ = Path(__file__).resolve().parents[2]
FUENTES = Path(__file__).with_name("diario")
MOLDE = RAIZ / "ensayos" / "_template.html"
SALIDA = RAIZ / "ensayos"
SITIO = "https://ficha.github.io"
HOY = dt.date.today().isoformat()
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
PALABRAS_POR_MINUTO = 230

# Tecla, la criatura del Diario (misma grilla que en assets/js/sistema.js)
TECLA = ["................", "....########....", "....#oooooo#....", "....#o####o#....", "....#oooooo#....", ".##############.", "#oooooooooooooo#", "#oo##oooooo##oo#", "#oo##oooooo##oo#", "#oooooo##oooooo#", "#aaaaaaaaaaaaaa#", "#aoaoaoaoaoaoao#", "#oaoaoaoaoaoaoa#", "################", ".##..........##.", "###..........###"]


# Mélan, la de la noche (misma grilla que en assets/js/sistema.js)
MELAN = ["...........#aa#.", "...........#aaa#", "..........#aaa#.", ".........#aa##..", "........#aa#....", ".....######.....",
         ".....######.....", ".....#oooo#.....", "....##oooo##....", "...#oooooooo#...", "..#oooooooooo#..", "..#oo##oo##oo#..",
         "..#oooo##oooo#..", "..#o#o#o#o#oo#..", "..############..", "...##########..."]


def _una(grilla, id_, clase, px, sobre_acento):
    rects = "".join(f'<rect class="si" x="{x}" y="{y}" width="1" height="1"/>'
                    for y, fila in enumerate(grilla) for x, c in enumerate(fila) if c == "#")
    cls = "spr spr--on-accent" if sobre_acento else "spr"  # sobre verde, siempre tinta oscura
    return (f'<span class="{cls} {clase}" data-creature="{id_}"><svg width="{16 * px}" height="{16 * px}" viewBox="0 0 16 16" '
            f'shape-rendering="crispEdges" aria-hidden="true">{rects}</svg></span>')


def sprite(px=4, sobre_acento=False):
    """De día Tecla, de noche Mélan (el CSS muestra una u otra según el tema)."""
    return _una(TECLA, "tecla", "spr--dia", px, sobre_acento) + _una(MELAN, "tintero", "spr--noche", px, sobre_acento)


def leer(path):
    head, body = path.read_text(encoding="utf-8").split("---", 2)[1:]
    meta = {}
    for linea in head.strip().splitlines():
        k, _, v = linea.partition(":")
        meta[k.strip()] = v.strip().strip('"')
    meta["etiquetas"] = [t.strip() for t in meta.get("etiquetas", "").split("|") if t.strip()]
    meta["palabras"] = int(meta.get("palabras") or 0)
    meta["minutos"] = max(1, round(meta["palabras"] / PALABRAS_POR_MINUTO))
    meta["body"] = re.sub(r"^\s*# .*\n", "", body.lstrip("\n"), count=1)  # el título va aparte
    # Substack a veces repite el título en negrita como primer párrafo
    meta["body"] = re.sub(r"^\s*\*\*" + re.escape(meta.get("titulo", "")) + r"\*\*\s*\n", "", meta["body"], count=1)
    # Nombres propios y conceptos con mayúscula (Borges, Camus, Sísifo…), para el buscador del archivo
    texto = re.sub(r"\]\([^)]*\)|<[^>]+>|https?://\S+", " ", meta["body"])
    nombres = re.findall(r"(?<=[a-záéíóúñ,;:(“\"] )([A-ZÁÉÍÓÚÑ][a-záéíóúñü]{3,})", texto)  # sin las que abren oración
    meta["nombres"] = " ".join(dict.fromkeys(nombres))
    meta["links"] = set(re.findall(r"\]\(([a-z0-9-]+)\.html\)", body))
    return meta


def fecha_es(iso):
    d = dt.date.fromisoformat(iso)
    return f"{d.day} de {MESES[d.month - 1]} de {d.year}"


def fecha_en(iso):
    d = dt.date.fromisoformat(iso)
    return f"{MONTHS[d.month - 1]} {d.day}, {d.year}"


def bi(es, en):
    """Texto en los dos idiomas con el mecanismo data-lang-content del sitio."""
    return f'<span data-lang-content="es">{es}</span><span data-lang-content="en">{en}</span>'


def tag_id(t):
    t = t.lower().translate(str.maketrans("áéíóúñ", "aeioun"))
    return "t-" + re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def md_a_html(texto):
    # Los títulos internos bajan un nivel: el h1 es el del ensayo.
    texto = re.sub(r"^(#{1,5}) ", lambda m: "#" * (len(m.group(1)) + 1) + " ", texto, flags=re.M)
    out = markdown.markdown(texto, extensions=["extra", "sane_lists"], output_format="html")
    # Links externos en pestaña nueva
    out = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener noreferrer"', out)
    # Imagen sola en un párrafo → figure; si el párrafo siguiente es corto, es el epígrafe
    def figura(m):
        img = m.group(1).replace("<img ", '<img loading="lazy" decoding="async" ')
        sig = m.group(2)
        cap = ""
        if sig is not None:
            plano = re.sub(r"<[^>]+>", "", sig)
            if len(plano) <= 180 and not plano.rstrip().endswith(":"):
                cap, sig = f"<figcaption>{sig}</figcaption>", None
                # Sin texto alternativo, el epígrafe lo describe (accesibilidad y buscadores)
                img = img.replace('alt=""', f'alt="{html.escape(html.unescape(plano.strip()), quote=True)}"', 1)
        resto = f"\n<p>{sig}</p>" if sig is not None else ""
        return f'<figure class="diario-fig">{img}{cap}</figure>{resto}'
    out = re.sub(r"<p>(<img [^>]+>)</p>\s*(?:<p>(.*?)</p>)?", figura, out, flags=re.S)
    # Capitular en el primer párrafo de prosa (no en epígrafes, fechas ni títulos repetidos)
    for m in re.finditer(r"<p>(.*?)</p>", out, flags=re.S):
        interior = m.group(1).strip()
        plano = re.sub(r"<[^>]+>", "", interior).strip()
        if len(plano) > 140 and not re.fullmatch(r"<(em|strong)>.*</\1>", interior, flags=re.S):
            out = out[:m.start()] + '<p class="capitular">' + out[m.start() + 3:]
            break
    return out


def relacionados(e, todos):
    def puntaje(o):
        p = 2 * len(set(e["etiquetas"]) & set(o["etiquetas"]))
        p += 3 * ((o["slug"] in e["links"]) + (e["slug"] in o["links"]))
        p += 2 * bool(e.get("serie") and e.get("serie") == o.get("serie"))
        return p
    cand = sorted((o for o in todos if o["slug"] != e["slug"]), key=lambda o: (-puntaje(o), o["fecha"]))
    return cand[:3]


def tarjeta(o, cls="diario-rel"):
    return (f'<li class="{cls}"><a href="{o["slug"]}.html"><span class="diario-rel__t">{html.escape(o["titulo"])}</span>'
            f'<span class="diario-rel__m">{fecha_es(o["fecha"])} · {o["minutos"]} min</span></a></li>')


REDES = [("LinkedIn", "https://www.linkedin.com/in/fidel-chaves"), ("Instagram", "https://www.instagram.com/fidelchaves/"),
         ("Substack", "https://diariodeunrobot.substack.com/"), ("Letterboxd", "https://letterboxd.com/ficha/")]


def pie(e, todos, i):
    prev = todos[i - 1] if i > 0 else None
    nxt = todos[i + 1] if i + 1 < len(todos) else None
    nav = ""
    if prev: nav += f'<a class="diario-nav__prev" href="{prev["slug"]}.html"><span data-i18n="diario.prev">← Anterior</span><b>{html.escape(prev["titulo"])}</b></a>'
    if nxt: nav += f'<a class="diario-nav__next" href="{nxt["slug"]}.html"><span data-i18n="diario.next">Siguiente →</span><b>{html.escape(nxt["titulo"])}</b></a>'
    redes = "".join(f'<a class="chip" href="{u}" target="_blank" rel="noopener noreferrer">{n}</a>' for n, u in REDES)
    return f'''
    <aside class="diario-pie" aria-labelledby="pieTitulo">
      <div class="diario-pie__head">{sprite(4, True)}<h2 id="pieTitulo" data-i18n="diario.pieTitle">Sobre esta versión</h2></div>
      <p><span data-i18n="diario.pieNote">Esta es una versión corregida para el sitio. Se publicó por primera vez en Diario de un Robot el</span>
        {bi(fecha_es(e["fecha"]), fecha_en(e["fecha"]))}.
        <a href="{e["url"]}" target="_blank" rel="noopener noreferrer" data-i18n="diario.pieOriginal">Leer el original en Substack</a> ►</p>
      <div class="diario-pie__acciones">
        <a class="btn" href="https://cafecito.app/fidelchaves" target="_blank" rel="noopener noreferrer" data-i18n="diario.coffee">Invitame un cafecito</a>
        <a class="btn btn--ghost" href="../index.html#contacto" data-i18n="diario.contact">¿Un comentario? Escribime</a>
        <a class="btn btn--ghost" href="https://diariodeunrobot.substack.com/" target="_blank" rel="noopener noreferrer" data-i18n="diario.subscribe">Suscribite al newsletter</a>
      </div>
      <p class="diario-pie__redes"><span data-i18n="diario.socials">También estoy en</span> {redes}</p>
    </aside>

    <section class="diario-seguir" aria-labelledby="seguirTitulo">
      <h2 id="seguirTitulo" data-i18n="diario.keepReading">Seguir leyendo</h2>
      <ul class="diario-rels">{"".join(tarjeta(o) for o in relacionados(e, todos))}</ul>
      <nav class="diario-nav" aria-label="Ensayo anterior y siguiente">{nav}</nav>
      <p class="section__lead"><a href="index.html" data-i18n="diario.backToIndex">← Todos los ensayos</a></p>
    </section>'''


def pagina(molde, e, todos, i):
    url = f"{SITIO}/ensayos/{e['slug']}.html"
    titulo = f"{e['titulo']} | Diario de un Robot"
    es_html = md_a_html(e["body"])
    # Descripción: el subtítulo o, si no hay, el comienzo del primer párrafo de prosa
    primero = re.search(r'<p class="capitular">(.*?)</p>', es_html, flags=re.S)
    desc = e.get("subtitulo") or (html.unescape(re.sub(r"<[^>]+>", "", primero.group(1))) if primero else e["titulo"])
    desc = desc if len(desc) <= 158 else desc[:155].rsplit(" ", 1)[0] + "…"
    # Imagen para compartir: la primera del ensayo, si hay
    img = re.search(r'<img [^>]*src="\.\./([^"]+)"', es_html)
    imagen = f"{SITIO}/assets/img/og-cover.png"
    if img:
        # LinkedIn y otras redes no leen bien WebP en la vista previa: se arma un og.jpg al lado
        origen = RAIZ / img.group(1)
        og = origen.with_name("og.jpg")
        if not og.exists():
            from PIL import Image
            with Image.open(origen) as im:
                im = im.convert("RGB")
                if im.width > 1200: im = im.resize((1200, round(im.height * 1200 / im.width)))
                im.save(og, "JPEG", quality=82, optimize=True)
        imagen = f"{SITIO}/{og.relative_to(RAIZ).as_posix()}"
    ld = [{"@context": "https://schema.org", "@type": "BlogPosting", "headline": e["titulo"], "description": desc, "url": url,
           "author": {"@type": "Person", "name": "Fidel Chaves", "url": f"{SITIO}/"}, "datePublished": e["fecha"], "dateModified": HOY,
           "image": imagen, "mainEntityOfPage": url, "inLanguage": "es-AR", "wordCount": e["palabras"],
           "keywords": ", ".join(e["etiquetas"]), "articleSection": e["etiquetas"][0] if e["etiquetas"] else "Ensayo",
           "isPartOf": {"@type": "Blog", "name": "Diario de un Robot", "url": f"{SITIO}/ensayos/"}, "sameAs": e["url"]},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Blog", "item": f"{SITIO}/blog.html"},
              {"@type": "ListItem", "position": 2, "name": "Diario de un Robot", "item": f"{SITIO}/ensayos/"},
              {"@type": "ListItem", "position": 3, "name": e["titulo"], "item": url}]}]
    extra = (f'<meta property="og:image" content="{imagen}">\n'
             f'<meta property="article:published_time" content="{e["fecha"]}">\n<meta property="article:modified_time" content="{HOY}">\n'
             f'<meta property="article:author" content="Fidel Chaves">\n'
             + "".join(f'<meta property="article:tag" content="{html.escape(t)}">\n' for t in e["etiquetas"])
             + f'<meta name="twitter:card" content="summary_large_image">\n<meta name="author" content="Fidel Chaves">')
    h = molde
    rep = [
        (r"<!-- TODO: título del ensayo -->\n", ""), (r"<!-- TODO: meta description \(~145 caracteres\) -->\n", ""),
        (r"<!-- TODO: actualizar la URL canónica con el slug real -->\n", ""), (r"<!-- TODO: og:title / og:description / og:url -->\n", ""),
        (r"<title>.*?</title>", f"<title>{html.escape(titulo)}</title>"),
        (r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(desc)}">'),
        (r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="index, follow">'),
        (r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">'),
        (r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(titulo)}">'),
        (r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{html.escape(desc)}">'),
        (r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">'),
        (r'<meta property="og:image" content="[^"]*">', extra),
        (r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=2) + "\n</script>"),
        (r"<!-- TODO: data-meta-key único.*?-->\n", ""),
        (r'<body data-meta-key="[^"]*">', '<body data-meta-key="diario" data-keep-meta>'),
    ]
    for a, b in rep:
        h, n = re.subn(a, lambda m, b=b: b, h, count=1, flags=re.S)
        assert n == 1 or a.startswith("<!--"), a
    en_path = FUENTES / "en" / f"{e['slug']}.html"
    if en_path.exists():
        cuerpo = (f'<div data-lang-content="es"><div class="prose prose--diario">{es_html}</div></div>\n'
                  f'    <div data-lang-content="en"><div class="prose prose--diario">{en_path.read_text(encoding="utf-8")}</div></div>')
    else:
        cuerpo = ('<p class="diario-aviso" data-lang-content="en">This essay is only available in Spanish for now.</p>\n'
                  f'    <div class="prose prose--diario" lang="es">{es_html}</div>')
    serie = f' · <span data-i18n="diario.series">Serie:</span> {html.escape(e["serie"])}' if e.get("serie") else ""
    etiquetas = " ".join(f'<a class="tag" href="index.html#{tag_id(t)}">{html.escape(t)}</a>' for t in e["etiquetas"])
    articulo = f'''<article class="section wrap--narrow wrap diario">
    <p class="hero__eyebrow"><a href="index.html">Diario de un Robot</a> · {bi(fecha_es(e["fecha"]), fecha_en(e["fecha"]))}{serie}</p>
    <h1 class="diario__titulo">{html.escape(e["titulo"])}</h1>
    {f'<p class="section__lead">{html.escape(e["subtitulo"])}</p>' if e.get("subtitulo") else ""}
    <p class="diario__meta">{e["minutos"]} <span data-i18n="diario.minutes">min de lectura</span> · {etiquetas}</p>

    {cuerpo}
    {pie(e, todos, i)}
  </article>'''
    h = re.sub(r'<article class="section wrap--narrow wrap">.*?</article>', lambda m: articulo, h, count=1, flags=re.S)
    h = h.replace('<script src="../assets/js/main.js" defer></script>',
                  '<script src="../assets/js/main.js" defer></script>\n<script src="../assets/js/sistema.js" defer></script>')
    return h


def indice(molde, todos):
    url = f"{SITIO}/ensayos/"
    etiquetas = sorted({t for e in todos for t in e["etiquetas"]}, key=lambda t: -sum(t in e["etiquetas"] for e in todos))
    series = sorted({e["serie"] for e in todos if e.get("serie")})
    chips = "".join(f'<button type="button" class="chip diario-filtro" data-f="{tag_id(t)}" aria-pressed="false">{html.escape(t)} <b>{sum(t in e["etiquetas"] for e in todos)}</b></button>' for t in etiquetas)
    chips += "".join(f'<button type="button" class="chip diario-filtro diario-filtro--serie" data-f="{tag_id("s " + s)}" aria-pressed="false"><span data-i18n="diario.series">Serie:</span> {html.escape(s)} <b>{sum(e.get("serie") == s for e in todos)}</b></button>' for s in series)
    items = "".join(item(e) for e in sorted(todos, key=lambda e: e["fecha"], reverse=True))
    return _indice(molde, todos, url, chips, items)


def item(e, base=""):
    return (f'<li class="diario-item" data-fecha="{e["fecha"]}" data-palabras="{e["palabras"]}" '
        f'data-f="{" ".join([tag_id(t) for t in e["etiquetas"]] + ([tag_id("s " + e["serie"])] if e.get("serie") else []))}" '
        f'data-q="{html.escape((e["titulo"] + " " + e.get("subtitulo", "") + " " + " ".join(e["etiquetas"]) + " " + e["nombres"]).lower())}">'
        f'<a href="{base}{e["slug"]}.html"><span class="diario-item__t">{html.escape(e["titulo"])}</span>'
        f'<span class="diario-item__s">{html.escape(e.get("subtitulo", ""))}</span>'
        f'<span class="diario-item__m">{bi(fecha_es(e["fecha"]), fecha_en(e["fecha"]))} · {e["minutos"]} min · {html.escape(" · ".join(e["etiquetas"]))}</span></a></li>')


def _indice(molde, todos, url, chips, items):
    ld = {"@context": "https://schema.org", "@type": "Blog", "name": "Diario de un Robot", "url": url, "inLanguage": "es-AR",
          "author": {"@type": "Person", "name": "Fidel Chaves", "url": f"{SITIO}/"},
          "blogPost": [{"@type": "BlogPosting", "headline": e["titulo"], "url": f"{url}{e['slug']}.html", "datePublished": e["fecha"]} for e in todos]}
    h = molde
    titulo = "Diario de un Robot | Fidel Chaves"
    desc = "Archivo de ensayos de Diario de un Robot, el newsletter de Fidel Chaves: escritura, ciencia, tiempo, lenguaje y lo que nos hace humanos."
    for a, b in [(r"<!-- TODO: título del ensayo -->\n", ""), (r"<!-- TODO: meta description \(~145 caracteres\) -->\n", ""),
                 (r"<!-- TODO: actualizar la URL canónica con el slug real -->\n", ""), (r"<!-- TODO: og:title / og:description / og:url -->\n", ""),
                 (r"<title>.*?</title>", f"<title>{titulo}</title>"),
                 (r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">'),
                 (r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="index, follow">'),
                 (r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">'),
                 (r'<meta property="og:type" content="[^"]*">', '<meta property="og:type" content="website">'),
                 (r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{titulo}">'),
                 (r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{desc}">'),
                 (r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">'),
                 (r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False) + "\n</script>"),
                 (r"<!-- TODO: data-meta-key único.*?-->\n", ""),
                 (r'<body data-meta-key="[^"]*">', '<body data-meta-key="diario">')]:
        h = re.sub(a, lambda m, b=b: b, h, count=1, flags=re.S)
    cuerpo = f'''<section class="section wrap diario-indice">
    <div class="diario-indice__head">{sprite(6, True)}
      <div><p class="hero__eyebrow"><a href="../blog.html" data-i18n="blog.backToBlog">← Volver al blog</a></p>
      <h1 data-i18n="diario.indexTitle">Diario de un Robot</h1>
      <p class="section__lead" data-i18n="diario.indexLead">Seis años de ensayos semanales: escribir, ciencia, tiempo, lenguaje. Versiones corregidas y enlazadas entre sí.</p></div>
    </div>
    <div class="diario-herr">
      <input type="search" id="diarioBuscar" class="diario-buscar" placeholder="Buscar por título o tema…" data-i18n-placeholder="diario.search" aria-label="Buscar">
      <div class="diario-orden" role="group" aria-label="Ordenar">
        <button type="button" class="chip" data-o="new" aria-pressed="true" data-i18n="diario.sortNew">Más nuevos</button>
        <button type="button" class="chip" data-o="old" aria-pressed="false" data-i18n="diario.sortOld">Más viejos</button>
        <button type="button" class="chip" data-o="long" aria-pressed="false" data-i18n="diario.sortLong">Más largos</button>
        <button type="button" class="chip" data-o="short" aria-pressed="false" data-i18n="diario.sortShort">Más cortos</button>
      </div>
      <div class="diario-filtros">{chips}</div>
      <p class="diario-cuenta" aria-live="polite"><span id="diarioN">{len(todos)}</span> <span data-i18n="diario.of">de</span> {len(todos)} <span data-i18n="diario.essays">ensayos</span></p>
    </div>
    <ol class="diario-lista" id="diarioLista">{items}</ol>
    <p class="diario-vacio" id="diarioVacio" hidden data-i18n="diario.empty">No hay ensayos con ese filtro.</p>
  </section>
  <script>
  (function () {{
    var lista = document.getElementById("diarioLista"), q = document.getElementById("diarioBuscar");
    var items = Array.prototype.slice.call(lista.children), orden = "new", filtro = null;
    function norm(s) {{ return s.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase(); }}
    items.forEach(function (li) {{ li._q = norm(li.getAttribute("data-q")); li._w = li._q.split(/[^a-z0-9ñ]+/).filter(Boolean); }});
    // Tolerancia a errores: cada palabra buscada vale si aparece tal cual o si difiere en 1 letra (2 en palabras largas)
    function dist(a, b, max) {{
      if (Math.abs(a.length - b.length) > max) return max + 1;
      var prev = [], cur, i, j;
      for (j = 0; j <= b.length; j++) prev[j] = j;
      for (i = 1; i <= a.length; i++) {{
        cur = [i]; var min = i;
        for (j = 1; j <= b.length; j++) {{
          cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
          if (cur[j] < min) min = cur[j];
        }}
        if (min > max) return max + 1;
        prev = cur;
      }}
      return prev[b.length];
    }}
    function coincide(li, palabras) {{
      return palabras.every(function (w) {{
        if (li._q.indexOf(w) !== -1) return true;
        var max = w.length >= 7 ? 2 : w.length >= 4 ? 1 : 0;
        return max > 0 && li._w.some(function (x) {{ return dist(w, x.slice(0, w.length + max), max) <= max; }});
      }});
    }}
    function pintar() {{
      var t = norm(q.value.trim()), palabras = t.split(/\\s+/).filter(Boolean), n = 0;
      var cmp = {{ new: function (a, b) {{ return b.dataset.fecha.localeCompare(a.dataset.fecha); }},
                  old: function (a, b) {{ return a.dataset.fecha.localeCompare(b.dataset.fecha); }},
                  long: function (a, b) {{ return b.dataset.palabras - a.dataset.palabras; }},
                  short: function (a, b) {{ return a.dataset.palabras - b.dataset.palabras; }} }}[orden];
      items.sort(cmp).forEach(function (li) {{
        var ok = (!t || coincide(li, palabras)) &&(!filtro || (" " + li.dataset.f + " ").indexOf(" " + filtro + " ") !== -1);
        li.hidden = !ok; if (ok) n++; lista.appendChild(li);
      }});
      document.getElementById("diarioN").textContent = n;
      document.getElementById("diarioVacio").hidden = n > 0;
    }}
    q.addEventListener("input", pintar);
    document.querySelectorAll("[data-o]").forEach(function (b) {{
      b.addEventListener("click", function () {{
        orden = b.dataset.o;
        document.querySelectorAll("[data-o]").forEach(function (x) {{ x.setAttribute("aria-pressed", x === b); }});
        pintar();
      }});
    }});
    function elegir(f) {{
      filtro = f;
      document.querySelectorAll(".diario-filtro").forEach(function (x) {{ x.setAttribute("aria-pressed", x.dataset.f === f); }});
      try {{ history.replaceState(null, "", f ? "#" + f : location.pathname); }} catch (e) {{}}
      pintar();
    }}
    document.querySelectorAll(".diario-filtro").forEach(function (b) {{
      b.addEventListener("click", function () {{ elegir(filtro === b.dataset.f ? null : b.dataset.f); }});
    }});
    var h = location.hash.slice(1);
    if (h && document.querySelector('.diario-filtro[data-f="' + h + '"]')) elegir(h); else pintar();
  }})();
  </script>'''
    h = re.sub(r'<main id="contenido">.*?</main>', lambda m: f'<main id="contenido">\n  {cuerpo}\n</main>', h, count=1, flags=re.S)
    h = h.replace('<script src="../assets/js/main.js" defer></script>',
                  '<script src="../assets/js/main.js" defer></script>\n<script src="../assets/js/sistema.js" defer></script>')
    return h


def blog_ultimos(todos, n=3):
    """Actualiza en blog.html la lista de los últimos ensayos y el conteo del botón."""
    p = RAIZ / "blog.html"
    s = p.read_text(encoding="utf-8")
    if "<!-- ultimos:inicio -->" not in s:
        return
    ult = sorted(todos, key=lambda e: e["fecha"], reverse=True)[:n]
    bloque = ("<!-- ultimos:inicio -->\n"
              f'      <ol class="diario-lista">{"".join(item(e, "ensayos/") for e in ult)}</ol>\n'
              f'      <p class="blog__todos"><a class="btn btn--ghost" href="ensayos/">{bi(f"Ver los {len(todos)} ensayos", f"See all {len(todos)} essays")} ►</a></p>\n'
              "      <!-- ultimos:fin -->")
    s = re.sub(r"<!-- ultimos:inicio -->.*?<!-- ultimos:fin -->", lambda m: bloque, s, flags=re.S)
    p.write_text(s, encoding="utf-8", newline="\n")


def sitemap(todos):
    p = RAIZ / "sitemap.xml"
    s = p.read_text(encoding="utf-8")
    ent = [f"  <url>\n    <loc>{SITIO}/ensayos/</loc>\n    <lastmod>{HOY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>"]
    ent += [f"  <url>\n    <loc>{SITIO}/ensayos/{e['slug']}.html</loc>\n    <lastmod>{HOY}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.5</priority>\n  </url>" for e in todos]
    bloque = "  <!-- diario:inicio -->\n" + "\n".join(ent) + "\n  <!-- diario:fin -->"
    if "<!-- diario:inicio -->" in s:
        s = re.sub(r"  <!-- diario:inicio -->.*?<!-- diario:fin -->", lambda m: bloque, s, flags=re.S)
    else:
        # saca la entrada suelta de no-tengo-ideas-propias (ahora va en el bloque)
        s = re.sub(r"  <url>\s*<loc>[^<]*/ensayos/no-tengo-ideas-propias\.html</loc>.*?</url>\n", "", s, flags=re.S)
        s = s.replace("</urlset>", bloque + "\n</urlset>")
    p.write_text(s, encoding="utf-8")


def main():
    molde = MOLDE.read_text(encoding="utf-8")
    todos = sorted((leer(f) for f in FUENTES.glob("*.md")), key=lambda e: e["fecha"])
    for i, e in enumerate(todos):
        (SALIDA / f"{e['slug']}.html").write_text(pagina(molde, e, todos, i), encoding="utf-8", newline="\n")
    (SALIDA / "index.html").write_text(indice(molde, todos), encoding="utf-8", newline="\n")
    sitemap(todos)
    blog_ultimos(todos)
    print(f"{len(todos)} ensayos + índice en {SALIDA.relative_to(RAIZ)}/")


if __name__ == "__main__":
    main()
