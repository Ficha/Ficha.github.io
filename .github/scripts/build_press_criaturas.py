"""Pone en el press kit todas las criaturitas del álbum (CREATURES, en assets/js/sistema.js).

Correr después de sumar o cambiar una criatura:
    python .github/scripts/build_press_criaturas.py

- Crea el SVG de cada criatura que falte en assets/press/criaturas/ (los que ya existen no se tocan).
- Rehace la grilla de criaturas de press-kit.html, el conteo («Catorce criaturas…») y LEEME.txt.
- Rearma el ZIP del kit y actualiza su peso en la lista de descargas.
"""
import json
import os
import re
import zipfile

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PRESS = os.path.join(RAIZ, 'assets', 'press')
CRIAS = os.path.join(PRESS, 'criaturas')
ZIP = os.path.join(PRESS, 'fidel-chaves-press-kit.zip')
KIT = os.path.join(RAIZ, 'press-kit.html')

# Nombre de archivo de cada criatura (las primeras ya estaban publicadas con este nombre).
ARCHIVO = {
    'robot': 'ficha-robot', 'flask': 'erlen-matraz', 'owl': 'noctua-buho', 'pad': 'agnes-fantasma',
    'sprout': 'ceibo-brote', 'fuego': 'lux-llama', 'rollo': 'curry-rollo', 'tintero': 'melan-tintero',
    'huevo': 'egg-huevo', 'sobre': 'hermes-sobre', 'figaro': 'figaro-reportero', 'tecla': 'tecla-teclado', 'rufo': 'rufo-zorzal',
    'cronos': 'cronos-reloj', 'tomatina': 'tomatina-tomate',
}
COLOR = {'#': '#0b0b0c', 'o': '#f5f5f3', 'a': '#c6ff00'}
CLASE = {'#': 'si', 'o': 'sp', 'a': 'sa'}
NUM = {
    'es': ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce',
           'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'],
    'en': ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
           'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
}


def leer_criaturas():
    js = open(os.path.join(RAIZ, 'assets', 'js', 'sistema.js'), encoding='utf8').read()
    m = re.search(r'var CREATURES = (\[.*?\]);\n', js)
    return json.loads(m.group(1))


def rects(rows, attr):
    out = []
    for y, fila in enumerate(rows):
        for x, c in enumerate(fila):
            if c in attr:
                out.append(f'<rect x="{x}" y="{y}" width="1" height="1" {attr[c]}/>')
    return ''.join(out)


def svg_archivo(rows):
    w, h = len(rows[0]), len(rows)
    fills = {k: 'fill="%s"' % v for k, v in COLOR.items()}
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w * 16}" height="{h * 16}" '
            f'shape-rendering="crispEdges">{rects(rows, fills)}</svg>\n')


def svg_inline(rows, px=4):
    w, h = len(rows[0]), len(rows)
    cuerpo = ''.join(f'<rect class="{CLASE[c]}" x="{x}" y="{y}" width="1" height="1"/>'
                     for y, fila in enumerate(rows) for x, c in enumerate(fila) if c in CLASE)
    return f'<svg width="{w * px}" height="{h * px}" viewBox="0 0 {w} {h}" shape-rendering="crispEdges">{cuerpo}</svg>'


def main():
    crias = leer_criaturas()
    n = len(crias)
    os.makedirs(CRIAS, exist_ok=True)
    for c in crias:
        nombre = ARCHIVO.get(c['id'], c['id'])
        ruta = os.path.join(CRIAS, nombre + '.svg')
        if not os.path.exists(ruta):
            open(ruta, 'w', encoding='utf8').write(svg_archivo(c['rows']))
            print('nuevo SVG:', nombre)

    s = open(KIT, encoding='utf8').read()
    grilla = ''.join(
        f'<a class="pk-crea" href="assets/press/criaturas/{ARCHIVO.get(c["id"], c["id"])}.svg" download>'
        f'<span class="pk-crea__art"><span class="spr" aria-hidden="true">{svg_inline(c["rows"])}</span></span>'
        f'<span class="pk-crea__n">{c["name"]}</span></a>' for c in crias)
    s, k = re.subn(r'(<div class="pk-creas">).*?(</div>)', lambda m: m.group(1) + grilla + m.group(2), s, count=1, flags=re.S)
    assert k == 1, 'no encontré la grilla de criaturas'
    es, en = NUM['es'][n].capitalize(), NUM['en'][n].capitalize()
    s = re.sub(r'<span data-lang-content="es">\w+ criaturas de píxel', f'<span data-lang-content="es">{es} criaturas de píxel', s)
    s = re.sub(r'<span data-lang-content="en">\w+ pixel creatures', f'<span data-lang-content="en">{en} pixel creatures', s)

    leeme = os.path.join(PRESS, 'LEEME.txt')
    t = open(leeme, encoding='utf8').read()
    t = re.sub(r'las \d+ criaturas de píxel', f'las {n} criaturas de píxel', t)
    open(leeme, 'w', encoding='utf8').write(t)

    if os.path.exists(ZIP):
        os.remove(ZIP)
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for base, _, archivos in os.walk(PRESS):
            for a in sorted(archivos):
                ruta = os.path.join(base, a)
                if ruta != ZIP:
                    z.write(ruta, os.path.relpath(ruta, PRESS).replace(os.sep, '/'))
    kb = round(os.path.getsize(ZIP) / 1024)
    s = re.sub(r'ZIP · \d+ KB', f'ZIP · {kb} KB', s)
    open(KIT, 'w', encoding='utf8').write(s)
    print(f'{n} criaturas en el press kit; ZIP de {kb} KB')


if __name__ == '__main__':
    main()
