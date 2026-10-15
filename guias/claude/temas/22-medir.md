---
slug: medir
nivel: 5
nuevo: si
titulo: Medir el gasto
bajada: Un script que lee mis transcripciones, escribe una fila por semana y me deja comparar sin acordarme de nada.
---

Después de [quedarme sin cuota](sin-cuota.html) entendí algo incómodo: el gasto se puede medir, y yo no lo estaba midiendo. Tenía una sensación (“esta semana gasté mucho”) y ninguna regla para decidir si esa sensación era cierta. Una sensación no se compara con la de la semana pasada, y un número sí.

## De dónde salen los datos

Claude Code guarda en mi computadora una transcripción de cada sesión. Es un archivo de texto con cada turno, el modelo que se usó, cuánto leyó y cuánto escribió. No hace falta ninguna herramienta externa ni pedirle nada a Claude: los datos ya están ahí, esperando que alguien los sume.

El script se llama `gasto_tokens.py`. Es Python simple, sin IA, sin tokens. Recorre las transcripciones de una semana, suma y escribe una fila.

## Las columnas

Una fila por semana, en un archivo CSV, con estas nueve columnas:

- `desde` y `hasta`: el rango de fechas de la semana.
- `peso`: el gasto total, estimado con la proporción de precios de cada modelo. Sirve para comparar semanas, no es el porcentaje real del límite.
- `turnos` y `sesiones`: cuánto se trabajó.
- `pct_opus`: qué porcentaje del peso fue Opus.
- `ctx_promedio`: el contexto promedio por turno.
- `pct_releer`: cuánto del gasto fue releer la conversación.
- `pct_subagentes`: cuánto se llevaron los subagentes.

Son pocas a propósito. Con más columnas el archivo se vuelve un tablero, y los tableros se miran una vez y se abandonan. Con nueve alcanza para ver una semana de un vistazo.

## La comparación

Mi [newsletter](newsletter.html) de los miércoles corre el script, agrega la fila nueva al CSV y compara con la semana anterior. No necesito acordarme ni abrir nada: aparece en la misma edición que ya leo, como una [tarea programada](tareas.html) más. Si algo se va de la meta, aparece ahí, sin que yo lo busque.

Las metas son tres, escritas antes de mirar los datos para no acomodarlas después:

- Opus por debajo del 40 %.
- Contexto promedio por debajo de 90 k.
- Ninguna sesión por encima del 8 % del gasto semanal.

## Lo que mide y lo que no

Mide cuánto gasté, no si lo gasté bien. Una semana cara puede ser una semana en la que terminé algo importante. Los números no entienden de eso, y por eso mi conclusión semanal la escribo yo y no el script.

Tampoco es una cuenta exacta del plan: solo ve lo que corre en Claude Code en mi computadora, no la web ni el celular. Es una aproximación que alcanza para ver tendencias, que es lo que necesitaba.

En el [kit](kit.html) dejé una plantilla del CSV con las nueve columnas, vacía, para que empieces desde cero.

```text
Escribí un script de Python, sin usar IA, que lea las transcripciones locales de Claude Code de la última semana y agregue una fila a un archivo CSV con estas columnas: desde, hasta, peso, turnos, sesiones, pct_opus, ctx_promedio, pct_releer, pct_subagentes. Antes de escribirlo, mostrame dónde están las transcripciones en mi computadora y cómo está armado un turno. Que el script imprima la comparación con la fila anterior y marque en qué columnas me paso de estas metas: Opus menos del 40 %, contexto menos de 90 k, ninguna sesión sobre el 8 % del total. Usá rutas absolutas. No guardes nada sin que lo apruebe.
```
