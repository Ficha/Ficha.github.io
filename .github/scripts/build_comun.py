#!/usr/bin/env python3
"""Reescribe los bloques compartidos del sitio (head de seguridad, header, cookies, footer).

Cada bloque vive en .github/scripts/comun/<nombre>.html y se copia entre las marcas
`<!-- comun:<nombre> -->` … `<!-- /comun:<nombre> -->` de cada página. Las rutas del
parcial usan {R}: prefijo relativo según la profundidad de la página (en 404.html, "/").

Es idempotente. Una página sin marcas se migra sola (busca el bloque viejo) y una
con marcas solo se actualiza. Además agrega lang="en" a cada [data-lang-content="en"].

Uso:
  python build_comun.py           # reescribe
  python build_comun.py --check   # no escribe; sale con 1 si algo está desactualizado

No toca diario/, quests/, cursada/ ni _anterior/ (apps y respaldo con su propio proyecto).
Los generadores (build_diario, build_guia_claude, build_faeton) lo llaman al terminar.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
COMUN = Path(__file__).resolve().parent / "comun"
REDIRECCIONES = {"guias/claude/v1.html"}  # páginas de solo redirección: sin header ni footer
EXCLUIDAS = {"diario", "quests", "cursada", "_anterior", ".github", ".scratch", ".git", "node_modules"}
ABSOLUTAS = {"404.html"}  # GitHub Pages la sirve desde cualquier ruta

# nombre -> (patrón del bloque viejo, sin marcas)
VIEJOS = {
    "head-seguridad": r'<meta http-equiv="Content-Security-Policy".*?gtag\(\'config\'[^\n]*\n</script>',
    "cookies": r'<div class="cookie-consent".*?</div>\s*</div>',
    "header": r'<header class="site-header">.*?</header>',
    "footer": r'<footer class="site-footer">.*?</footer>',
}
ORDEN = ["head-seguridad", "cookies", "header", "footer"]


def paginas():
    for p in sorted(RAIZ.rglob("*.html")):
        rel = p.relative_to(RAIZ)
        if rel.parts[0] in EXCLUIDAS or rel.as_posix() in REDIRECCIONES:
            continue
        yield p, rel


def prefijo(rel):
    if rel.as_posix() in ABSOLUTAS:
        return "/"
    return "../" * (len(rel.parts) - 1)


def bloque(nombre, R):
    cuerpo = (COMUN / f"{nombre}.html").read_text(encoding="utf-8").rstrip("\n").replace("{R}", R)
    return f"<!-- comun:{nombre} -->\n{cuerpo}\n<!-- /comun:{nombre} -->"


def aplicar(s, nombre, R, rel):
    nuevo = bloque(nombre, R)
    marcas = re.compile(rf"<!-- comun:{nombre} -->.*?<!-- /comun:{nombre} -->", re.S)
    if marcas.search(s):
        return marcas.sub(lambda m: nuevo, s, count=1)
    if nombre == "cookies" and not re.search(VIEJOS["cookies"], s, re.S):
        # páginas sin banner: va justo antes del header
        corte = re.search(r"<!-- comun:header -->|<header class=\"site-header\">", s)
        if not corte:
            raise SystemExit(f"{rel}: no encuentro dónde poner cookies")
        return s[:corte.start()] + nuevo + "\n\n" + s[corte.start():]
    viejo = re.compile(VIEJOS[nombre], re.S)
    if not viejo.search(s):
        raise SystemExit(f"{rel}: falta el bloque {nombre} (ni marcas ni versión vieja)")
    return viejo.sub(lambda m: nuevo, s, count=1)


def lang_en(s):
    """lang="en" en cada elemento data-lang-content="en" que no lo tenga."""
    def f(m):
        tag = m.group(0)
        return tag if re.search(r"\slang=", tag) else tag.replace(' data-lang-content="en"', ' data-lang-content="en" lang="en"', 1)
    return re.sub(r'<[a-zA-Z][^<>]*\sdata-lang-content="en"[^<>]*>', f, s)


def procesar(s, rel):
    R = prefijo(rel)
    for nombre in ORDEN:
        s = aplicar(s, nombre, R, rel)
    return lang_en(s)


def main():
    solo_check = "--check" in sys.argv
    viejos = []
    for p, rel in paginas():
        s = p.read_text(encoding="utf-8")
        n = procesar(s, rel)
        if n != s:
            viejos.append(rel.as_posix())
            if not solo_check:
                p.write_text(n, encoding="utf-8", newline="\n")
    if solo_check:
        if viejos:
            print(f"{len(viejos)} páginas desactualizadas (corré build_comun.py):")
            print("\n".join("  " + v for v in viejos[:20]))
            sys.exit(1)
        print("build_comun: todo al día")
    else:
        print(f"build_comun: {len(viejos)} páginas actualizadas")


if __name__ == "__main__":
    main()
