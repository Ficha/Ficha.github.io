#!/usr/bin/env python3
"""Pasa los .webp animados de assets/img/diario/ a video (mp4 H.264 sin audio).

    python .github/scripts/animados_a_video.py

Por cada NN.webp animado: escribe NN.mp4 al lado y deja NN.webp como imagen fija (el primer cuadro), que
build_diario.py usa de poster. Si existe NN.mp4, el build emite <video> en lugar de <img>.
Hace falta ffmpeg en el PATH. Los que ya son fijos no se tocan, así que se puede correr cuantas veces haga falta.
"""
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageSequence

RAIZ = Path(__file__).resolve().parents[2]
DIARIO = RAIZ / "assets" / "img" / "diario"


def convertir(webp):
    im = Image.open(webp)
    if getattr(im, "n_frames", 1) < 2:
        return None
    w, h = im.size
    w2, h2 = w + w % 2, h + h % 2  # H.264 en yuv420p pide medidas pares: se suma un píxel repetido (el poster queda intacto)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        lista, primero = [], None
        for i, fr in enumerate(ImageSequence.Iterator(im)):
            ms = fr.info.get("duration", 0)
            seg = (ms if ms > 10 else 100) / 1000  # los navegadores toman 100 ms si el cuadro dice 0
            rgb = Image.new("RGB", fr.size, (255, 255, 255))
            rgb.paste(fr.convert("RGBA"), mask=fr.convert("RGBA").split()[3])
            if primero is None:
                primero = rgb.copy()
            if (w2, h2) != (w, h):
                grande = Image.new("RGB", (w2, h2))
                grande.paste(rgb, (0, 0))
                if w2 > w:
                    grande.paste(rgb.crop((w - 1, 0, w, h)), (w, 0))
                if h2 > h:
                    grande.paste(grande.crop((0, h - 1, w2, h)), (0, h))
                rgb = grande
            f = tmp / f"{i:03d}.png"
            rgb.save(f)
            lista.append(f"file '{f.as_posix()}'\nduration {seg}")
        lista.append(f"file '{f.as_posix()}'")  # el último cuadro se repite para que cuente su duración
        (tmp / "l.txt").write_text("\n".join(lista), encoding="utf-8")
        mp4 = webp.with_suffix(".mp4")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(tmp / "l.txt"),
                        "-an", "-c:v", "libx264", "-preset", "slower", "-crf", "30", "-pix_fmt", "yuv420p",
                        "-vf", "fps=15", "-movflags", "+faststart", str(mp4)], check=True)
        primero.save(webp, "WEBP", quality=80)
    return mp4


def main():
    for webp in sorted(DIARIO.rglob("*.webp")):
        antes = webp.stat().st_size
        mp4 = convertir(webp)
        if mp4:
            print(f"{webp.relative_to(DIARIO)}: {antes // 1024} KB -> mp4 {mp4.stat().st_size // 1024} KB + poster {webp.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
