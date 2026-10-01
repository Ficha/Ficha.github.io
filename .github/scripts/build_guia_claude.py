"""Arma guias/claude/index.html desde guia.md (ES), guide.md (EN), la plantilla de ensayos y los "Enlaces" de la portada. Uso: python .github/scripts/build_guia_claude.py"""
import re, markdown, pathlib
root = pathlib.Path(__file__).resolve().parents[2]


def render(nombre, copiar, copiado):
    md = (root/"guias/claude"/nombre).read_text(encoding="utf-8")
    md = md.split("\n", 1)[1]  # el H1 va en la cabecera de la página
    html = markdown.markdown(md, extensions=["fenced_code", "sane_lists"])
    html = re.sub(r'<a href="([^"]+\.md)">', r'<a href="\1" download>', html)
    return html.replace('<pre><code class="language-text">',
        f'<pre class="prompt"><button type="button" class="prompt__copy" data-copiado="{copiado}">{copiar}</button><code>')


body = render("guia.md", "Copiar", "¡Copiado!")
body_en = render("guide.md", "Copy", "Copied!")

# "Enlaces" de la portada, con las rutas ajustadas a /guias/claude/
idx = (root/"index.html").read_text(encoding="utf-8")
chips = re.search(r'<section id="en-internet".*?(<div class="chips center">.*?\n      </div>)', idx, flags=re.S).group(1)
chips = chips.replace('href="blog.html"', 'href="../../blog.html"').replace('href="cv.html"', 'href="../../cv.html"')
enlaces = f'<section class="enlaces center">\n      <h2 data-i18n="online.heading">Enlaces</h2>\n      {chips}\n    </section>\n\n    '

t = (root/"ensayos/_template.html").read_text(encoding="utf-8")
t = t.replace('href="../', 'href="../../').replace('src="../', 'src="../../')
url = "https://ficha.github.io/guias/claude/"
title = "Cómo trabajo con Claude gastando menos | Fidel Chaves"
desc = "Economía de tokens, un newsletter semanal de mejora continua e infraestructura para Claude: guía, prompts y plantillas .md para descargar."
rep = {
 "<title>TÍTULO | Fidel Chaves</title>": f"<title>{title}</title>",
 'content="TODO: descripción breve del ensayo."': f'content="{desc}"',
 '<meta name="robots" content="noindex, nofollow">': '<meta name="robots" content="index, follow">',
 "https://ficha.github.io/ensayos/TODO-SLUG.html": url,
 'content="TÍTULO | Fidel Chaves"': f'content="{title}"',
 '"@type": "BlogPosting"': '"@type": "TechArticle"',
 '"headline": "TODO: título"': '"headline": "Cómo trabajo con Claude gastando menos"',
 '"TODO: YYYY-MM-DD"': '"2026-10-01"',
 "TODO_metaKey": "guiaClaude",
 '>Ensayo</p>': '>Guía</p>',
 '>TODO: título</h1>': '>Cómo trabajo con Claude gastando menos</h1>',
 '>TODO: bajada breve.</p>': '>Lo que aprendí para usar Claude todo el día sin quedarme sin cuota el martes, con los prompts y las plantillas para que lo armes vos.</p>',
}
for a, b in rep.items():
    assert a in t, a
    t = t.replace(a, b)
t = t.replace("blog.backLink", "guiaClaude.backLink")
t = re.sub(r"\s*<!-- TODO.*?-->", "", t)
t = re.sub(r"\s*<!-- Chrome \(eyebrow.*?-->", "", t, flags=re.S)
t = t.replace("<p>TODO: contenido del ensayo en español.</p>", body)
t = t.replace("<p>TODO: English translation not yet available.</p>", body_en)
# pie: Enlaces + cafecito en lugar de la nota del newsletter
t = re.sub(r'<p class="section__lead" style="margin-top:2rem;">.*?</p>',
  enlaces + '<p class="cafecito"><span data-i18n="guiaClaude.footerNote">¿Te sirvió? Podés</span> <a href="https://cafecito.app/fidelchaves" target="_blank" rel="noopener noreferrer" data-i18n="guiaClaude.footerLink">invitarme un cafecito</a> ☕</p>',
  t, flags=re.S)
style = """<style>
  .prose h2 { margin: 2.5rem 0 1rem; }
  .prose h3 { margin: 1.75rem 0 .75rem; }
  .prose ul, .prose ol { margin: 0 0 1.25em 1.25em; }
  .prose li { margin-bottom: .5em; }
  .prose code { font-size: .9em; }
  .prompt { position: relative; margin: 0 0 1.5em; padding: 1rem; border: 1px solid var(--border); white-space: pre-wrap; word-break: break-word; font-size: .9rem; line-height: 1.5; }
  .prompt code { font-size: inherit; }
  .prompt__copy { float: right; margin: -.25rem -.25rem .5rem .75rem; padding: .25em .7em; font: inherit; font-size: .8rem; background: transparent; color: var(--fg); border: 1px solid var(--border); cursor: pointer; }
  .prompt__copy:hover { background: var(--fg); color: var(--bg); }
  .enlaces { margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
  .cafecito { margin-top: 2rem; font-size: .9rem; opacity: .75; }
</style>
</head>"""
t = t.replace("</head>", style, 1)
script = """<script>
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
t = t.replace("</body>", script)
assert "TODO" not in t, [l for l in t.splitlines() if "TODO" in l]
(root/"guias/claude/index.html").write_text(t, encoding="utf-8")
print("ok", len(t))
