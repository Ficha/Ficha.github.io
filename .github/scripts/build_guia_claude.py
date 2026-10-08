"""Arma la guía de Claude en guias/claude/:
- index.html: portada con una tarjeta por tema (temas/_indice.md + front matter de cada tema).
- <slug>.html: un artículo por tema, desde temas/NN-slug.md (ES; el EN remite a la v1).
- v1.html: la primera versión en una sola página, desde guia.md (ES) y guide.md (EN).
Usa la plantilla de ensayos y los "Enlaces" de la portada. Uso: python .github/scripts/build_guia_claude.py"""
import re, markdown, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
guia = root/"guias/claude"
base = "https://ficha.github.io/guias/claude/"
NIVELES = {0: "Para empezar", 1: "Nivel 1 · Entender el gasto", 2: "Nivel 2 · Ordenar", 3: "Nivel 3 · Automatizar"}


def md_html(md, copiar="Copiar", copiado="¡Copiado!"):
    html = markdown.markdown(md, extensions=["fenced_code", "sane_lists"])
    html = re.sub(r'<a href="([^"]+\.md)">', r'<a href="\1" download>', html)
    return html.replace('<pre><code class="language-text">',
        f'<pre class="prompt"><button type="button" class="prompt__copy" data-copiado="{copiado}">{copiar}</button><code>')


def leer(path):
    """Front matter simple (clave: valor) + cuerpo."""
    t = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    _, fm, cuerpo = t.split("---\n", 2)
    meta = dict(l.split(": ", 1) for l in fm.strip().splitlines())
    return meta, cuerpo.strip()


def es_en(es, en, tag="span"):
    return f'<{tag} data-lang-content="es">{es}</{tag}><{tag} data-lang-content="en">{en}</{tag}>'


# "Enlaces" de la portada, con las rutas ajustadas a /guias/claude/
idx = (root/"index.html").read_text(encoding="utf-8")
chips = re.search(r'<section id="en-internet".*?(<div class="chips center">.*?\n      </div>)', idx, flags=re.S).group(1)
chips = chips.replace('href="blog.html"', 'href="../../blog.html"').replace('href="cv.html"', 'href="../../cv.html"')
enlaces = f'<section class="enlaces center">\n      <h2 data-i18n="online.heading">Enlaces</h2>\n      {chips}\n    </section>\n\n    '
cafecito = '<p class="cafecito"><span data-i18n="guiaClaude.footerNote">¿Te sirvió? Podés</span> <a href="https://cafecito.app/fidelchaves" target="_blank" rel="noopener noreferrer" data-i18n="guiaClaude.footerLink">invitarme un cafecito</a> ☕</p>'

plantilla = (root/"ensayos/_template.html").read_text(encoding="utf-8")
plantilla = plantilla.replace('href="../', 'href="../../').replace('src="../', 'src="../../')

STYLE = """<style>
  .prose h2 { margin: 2.5rem 0 1rem; }
  .prose h3 { margin: 1.75rem 0 .75rem; }
  .prose ul, .prose ol { margin: 0 0 1.25em 1.25em; }
  .prose li { margin-bottom: .5em; }
  .prose code { font-size: .9em; }
  .prompt { position: relative; margin: 0 0 1.5em; padding: 1rem; border: 1px solid var(--border); white-space: pre-wrap; word-break: break-word; font-size: .9rem; line-height: 1.5; }
  .prompt code { font-size: inherit; }
  .prompt__copy { float: right; margin: -.25rem -.25rem .5rem .75rem; padding: .25em .7em; font: inherit; font-size: .8rem; background: transparent; color: var(--fg); border: 1px solid var(--border); cursor: pointer; }
  .prompt__copy:hover { background: var(--fg); color: var(--bg); }
  .prompt-titulo { margin: 2.5rem 0 .75rem; font: 700 .75rem/1.3 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; }
  .guia-nivel { margin: 2.75rem 0 0; }
  .guia-cards { margin-top: 14px; }
  @media (min-width: 720px) { .guia-cards { grid-template-columns: repeat(2, 1fr); } }
  .guia-cards .card > h3 { font-size: 1.25rem; }
  .prose .guia-cards .card > * { margin-left: 18px; margin-right: 18px; }
  .prose .guia-cards .card > p:not(.tag) { margin-bottom: 14px; }
  .prose .guia-cards .card > :last-child { margin-bottom: 18px; }
  .guia-pasos { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 24px; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
  .guia-pasos a { max-width: 48%; }
  .guia-pasos .sig { margin-left: auto; text-align: right; }
  .guia-folio { margin-top: 2rem; }
  .guia-folio .tomatina { margin-top: 0; }
  .guia-nivel-folio { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; margin: 10px 0 0; padding: 14px 18px; border: var(--border-w, 3px) solid var(--ink); box-shadow: var(--shadow-hard); }
  .prose .guia-nivel__txt { margin: 0; font: 700 .85rem/1.5 var(--font-mono); }
  .guia-nivel__txt b { display: block; font-size: 1rem; }
  .guia-nivel__bar { display: flex; gap: 3px; margin: 6px 0; }
  .guia-nivel__bar i { width: 12px; height: 12px; border: 2px solid var(--ink); }
  .guia-nivel__bar i.on { background: var(--accent); }
  .guia-cards .card.is-leida .tag::after { content: " ✓"; }
  .enlaces { margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
  .cafecito { margin-top: 2rem; font-size: .9rem; opacity: .75; }
</style>
</head>"""

SCRIPT = """<script>
document.querySelectorAll(".prompt__copy").forEach(function (b) {
  b.addEventListener("click", function () {
    var txt = b.parentNode.querySelector("code").innerText;
    navigator.clipboard.writeText(txt).then(function () {
      var orig = b.textContent;
      b.textContent = b.dataset.copiado; setTimeout(function () { b.textContent = orig; }, 1500);
    });
  });
});
</script>
</body>"""


def pagina(archivo, titulo, desc, cabecera, body, body_en, pie, fecha="2026-10-08"):
    """cabecera: HTML de eyebrow + h1 + bajada; pie: lo que va en lugar de la nota del newsletter."""
    url = base + ("" if archivo == "index.html" else archivo)
    full = f"{titulo} | Fidel Chaves"
    t = plantilla
    rep = {
     "<title>TÍTULO | Fidel Chaves</title>": f"<title>{full}</title>",
     'content="TODO: descripción breve del ensayo."': f'content="{desc}"',
     '<meta name="robots" content="noindex, nofollow">': '<meta name="robots" content="index, follow">',
     "https://ficha.github.io/ensayos/TODO-SLUG.html": url,
     'content="TÍTULO | Fidel Chaves"': f'content="{full}"',
     '"@type": "BlogPosting"': '"@type": "TechArticle"',
     '"headline": "TODO: título"': f'"headline": "{titulo}"',
     '"datePublished": "TODO: YYYY-MM-DD"': '"datePublished": "2026-10-01"',
     '"dateModified": "TODO: YYYY-MM-DD"': f'"dateModified": "{fecha}"',
     "TODO_metaKey": "guiaClaude",
    }
    for a, b in rep.items():
        assert a in t, a
        t = t.replace(a, b)
    t = re.sub(r"\s*<!-- TODO.*?-->", "", t)
    t = re.sub(r"\s*<!-- Chrome \(eyebrow.*?-->", "", t, flags=re.S)
    t = re.sub(r'<p class="hero__eyebrow".*?<p class="section__lead" data-i18n="guiaClaude.lead">.*?</p>', cabecera, t, flags=re.S)
    t = t.replace("<p>TODO: contenido del ensayo en español.</p>", body)
    t = t.replace("<p>TODO: English translation not yet available.</p>", body_en)
    t = re.sub(r'<p class="section__lead" style="margin-top:2rem;">.*?</p>\s*<p class="section__lead">.*?</p>', pie, t, flags=re.S)
    t = t.replace('<script src="../../assets/js/main.js" defer></script>', '<script src="../../assets/js/main.js" defer></script>\n<script src="../../assets/js/sistema.js" defer></script>')
    t = t.replace("</head>", STYLE, 1).replace("</body>", SCRIPT)
    assert "TODO" not in t, [l for l in t.splitlines() if "TODO" in l]
    (guia/archivo).write_text(t, encoding="utf-8")
    return len(t)


def cabecera_i18n(eyebrow, titulo, lead):
    """La de la portada y la v1: textos del diccionario guiaClaude de main.js."""
    return (f'<p class="hero__eyebrow" data-i18n="guiaClaude.eyebrow">{eyebrow}</p>\n'
            f'    <h1 style="font-size:clamp(1.8rem,6vw,2.6rem);" data-i18n="guiaClaude.title">{titulo}</h1>\n'
            f'    <p class="section__lead" data-i18n="guiaClaude.lead">{lead}</p>')


volver = '<p class="section__lead"><a href="../../blog.html" data-i18n="blog.backToBlog">← Volver al blog</a></p>'
aviso_en = ('<p><em>This guide is being reorganized into topic cards, in Spanish for now. '
            'The full English version is the <a href="v1.html">original single-page guide</a>.</em></p>')

# --- Temas ---
temas = [leer(p) + (p,) for p in sorted((guia/"temas").glob("[0-9][0-9]-*.md"))]
indice_meta, indice_md = leer(guia/"temas/_indice.md")

for i, (m, md, _) in enumerate(temas):
    partes = md.split("```text", 1)  # el prompt, si hay, va con su título
    md = partes[0] + ('\n<p class="prompt-titulo">El prompt</p>\n\n```text' + partes[1] if len(partes) > 1 else "")
    ant = temas[i - 1][0] if i > 0 else None
    sig = temas[i + 1][0] if i + 1 < len(temas) else None
    pasos = f'<nav class="guia-pasos" aria-label="Tarjetas" data-tema-fin="{m["slug"]}">'
    pasos += f'<a href="{ant["slug"]}.html">← {ant["titulo"]}</a>' if ant else '<a href="./">← Todas las tarjetas</a>'
    pasos += f'<a class="sig" href="{sig["slug"]}.html">{sig["titulo"]} →</a>' if sig else '<a class="sig" href="./">Todas las tarjetas →</a>'
    pasos += '</nav>'
    body = md_html(md) + "\n" + pasos
    eyebrow = es_en(f'Guía de Claude · {NIVELES[int(m["nivel"])]}', 'Claude guide')
    cab = (f'<p class="hero__eyebrow"><a href="./">{eyebrow}</a></p>\n'
           f'    <h1 style="font-size:clamp(1.8rem,6vw,2.6rem);">{m["titulo"]}</h1>\n'
           f'    <p class="section__lead">{m["bajada"]}</p>')
    pie = enlaces + cafecito + '\n    <p class="section__lead"><a href="./">' + es_en("← Todas las tarjetas", "← Back to the guide") + '</a></p>'
    print(m["slug"], pagina(f'{m["slug"]}.html', m["titulo"], m["bajada"], cab, body, aviso_en, pie))

# --- Portada con tarjetas ---
cards = ""
for nivel, nombre in NIVELES.items():
    grupo = [m for m, _, _ in temas if int(m["nivel"]) == nivel]
    clase = "cards cards--one guia-cards" if nivel == 0 else "cards guia-cards"
    cards += f'\n<h2 class="guia-nivel">{nombre}</h2>\n<div class="{clase}">\n'
    for m in grupo:
        n = temas.index(next(x for x in temas if x[0] is m))
        cards += (f'  <article class="card" data-tema="{m["slug"]}"><p class="tag">{n:02d}</p><h3>{m["titulo"]}</h3>'
                  f'<p>{m["bajada"]}</p><a class="card__link" href="{m["slug"]}.html">Leer ❧</a></article>\n')
    cards += "</div>\n"
# Folio, el ratón: tira consejos en un globo, como Tomatina (sistema.js, TIPS.raton), y anota tu nivel en la
# libreta de abajo (la completa sistema.js con lo que leíste).
folio = ('\n<div class="guia-folio">\n'
         '<div class="tomatina"><button type="button" class="tomatina__btn" data-creature="raton" data-px="4" aria-describedby="folioDice"></button>'
         '<div class="tomatina__globo" id="folioDice" role="status" aria-live="polite"><span class="tomatina__quien">Folio</span>'
         '<span class="tomatina__dice">'
         + es_en('<span class="tomatina__msg">Hola. Soy Folio</span><span class="tomatina__msg">Anoto lo que leés, en orden. Tocame y te doy un consejo. Uno por vez</span>',
                 '<span class="tomatina__msg">Hello. I am Folio</span><span class="tomatina__msg">I log what you read, in order. Tap me for a tip. One at a time</span>')
         + '</span></div></div>\n'
         '<div class="guia-nivel-folio" id="guiaNivel"><p class="guia-nivel__txt"><b>Nivel 1 · Lector de solapas</b></p></div>\n'
         '</div>\n')
body_hub = md_html(indice_md) + folio + cards
body_hub_en = aviso_en
cab = cabecera_i18n("Guía", indice_meta["titulo"], indice_meta["bajada"])
print("index", pagina("index.html", indice_meta["titulo"], indice_meta["bajada"], cab, body_hub, body_hub_en, enlaces + cafecito + "\n    " + volver))

# --- v1: la guía original en una sola página ---
def v1(nombre, copiar, copiado):
    md = (guia/nombre).read_text(encoding="utf-8").split("\n", 1)[1]  # el H1 va en la cabecera
    return md_html(md, copiar, copiado)
nota = '<p><em>Esta es la primera versión de la guía, del 1/10/2026. La versión actual, <a href="./">por tarjetas</a>, está más completa.</em></p>\n'
cab = (f'<p class="hero__eyebrow">{es_en("Guía · Primera versión", "Guide · First version")}</p>\n'
       f'    <h1 style="font-size:clamp(1.8rem,6vw,2.6rem);">{es_en("Cómo trabajo con Claude gastando menos", "How I work with Claude on fewer tokens")}</h1>\n'
       f'    <p class="section__lead">{es_en("Lo que aprendí para usar Claude todo el día sin quedarme sin cuota el martes, con los prompts y las plantillas para que lo armes vos.", "What I learned about using Claude all day without running out of quota by Tuesday, with prompts and templates to build your own.")}</p>')
print("v1", pagina("v1.html", "Cómo trabajo con Claude gastando menos (v1)", "La primera versión de la guía, en una sola página: economía de tokens, newsletter de mejora continua e infraestructura.",
                   cab, nota + v1("guia.md", "Copiar", "¡Copiado!"), v1("guide.md", "Copy", "Copied!"), enlaces + cafecito + "\n    " + volver, fecha="2026-10-01"))

# --- La lista de tarjetas para el nivel de Folio (assets/js/sistema.js, entre las marcas) ---
import json
sj = root/"assets/js/sistema.js"
s = sj.read_text(encoding="utf-8")
lista = json.dumps([[m["slug"], m["titulo"]] for m, _, _ in temas], ensure_ascii=False)
s2 = re.sub(r"/\* guia:inicio \*/\n.*?\n/\* guia:fin \*/", lambda _: f"/* guia:inicio */\nvar GUIA_TEMAS = {lista};\n/* guia:fin */", s, flags=re.S)
assert s2 != s or lista in s
sj.write_text(s2, encoding="utf-8")
print("sistema.js", len(temas), "tarjetas")
