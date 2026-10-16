"""Cursada: cuántas horas de trabajo lleva el proyecto, contadas desde el historial público del repo.

Método (el mismo que se explica en la pantalla «Cómo se sostiene»):
  1. Toma la fecha y hora de cada commit que toca la carpeta cursada/.
  2. Los junta en sesiones: si entre un commit y el siguiente pasaron menos de 2 horas, son la misma sesión.
  3. Cada sesión dura lo que pasó entre su primer y su último commit, más 30 minutos de arranque
     (leer, probar y empezar a trabajar antes del primer commit).
Es una estimación, no un reloj: se puede verificar con `git log` en el repo público.

Escribe cursada/datos/sostener.json (horas totales, por mes, sesiones, commits, primer commit y fecha de generación).
Si nada cambió salvo la fecha de generación, no lo reescribe (así la Action no commitea de más).
Usa solo la biblioteca estándar. Uso:  python .github/scripts/cursada_sostener.py
"""
import datetime
import json
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SALIDA = RAIZ / "cursada" / "datos" / "sostener.json"
HUECO = 2 * 3600       # menos de 2 h entre commits = misma sesión
ARRANQUE = 30 * 60     # 30 min que se suman a cada sesión
AR = datetime.timezone(datetime.timedelta(hours=-3))  # hora de Buenos Aires


def commits():
    r = subprocess.run(["git", "-C", str(RAIZ), "log", "--format=%ct", "--", "cursada/"], capture_output=True, text=True, check=True)
    return sorted(int(x) for x in r.stdout.split())


def sesiones(ts):
    out = []
    for t in ts:
        if out and t - out[-1][1] < HUECO:
            out[-1][1] = t
            out[-1][2] += 1
        else:
            out.append([t, t, 1])
    return out


def main():
    ts = commits()
    if not ts:
        sys.exit("No hay commits en cursada/: ¿el checkout trae todo el historial (fetch-depth: 0)?")
    ses = sesiones(ts)
    por_mes, total = {}, 0
    for ini, fin, _ in ses:
        seg = fin - ini + ARRANQUE
        total += seg
        mes = datetime.datetime.fromtimestamp(ini, AR).strftime("%Y-%m")
        por_mes[mes] = por_mes.get(mes, 0) + seg
    datos = {
        "horas_totales": round(total / 3600, 1),
        "horas_por_mes": {m: round(s / 3600, 1) for m, s in sorted(por_mes.items())},
        "sesiones": len(ses),
        "commits": len(ts),
        "primer_commit": datetime.datetime.fromtimestamp(ts[0], AR).strftime("%Y-%m-%d"),
        "metodo": {"hueco_horas": HUECO // 3600, "arranque_minutos": ARRANQUE // 60},
    }
    if SALIDA.exists():
        previo = json.loads(SALIDA.read_text(encoding="utf-8"))
        if {k: v for k, v in previo.items() if k != "generado"} == datos:
            print(f"Sin cambios: {datos['horas_totales']} h, {datos['sesiones']} sesiones, {datos['commits']} commits.")
            return
    datos["generado"] = datetime.datetime.now(AR).strftime("%Y-%m-%d")
    SALIDA.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"{datos['horas_totales']} h en {datos['sesiones']} sesiones ({datos['commits']} commits) desde {datos['primer_commit']}.")


if __name__ == "__main__":
    main()
