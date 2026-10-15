---
slug: mods
nivel: 5
nuevo: si
titulo: Mods que avisan
bajada: Cambios en la interfaz de Claude Code que me frenan antes de gastar de más.
---

Escribir en un archivo “el tope es de 150 k” no alcanza. Lo escribí, lo leí y lo pasé de largo varias veces. Lo que funciona es que algo me lo diga en el momento, en la pantalla, cuando la sesión está llegando.

Claude Code permite hacer *mods*: cambios en su propia interfaz y comportamiento, como una banda sobre el cuadro de texto, un aviso, un comando propio o un gancho que se ejecuta antes de una acción. Hay una skill, `plugin-authoring`, que ayuda a armarlos. Yo la usé para convertir mis reglas de economía de tokens en avisos.

## El primero: el aviso a 150 k

Empezó con una sola cosa: un aviso cuando la sesión llega a los 150 k de contexto, que es el tope que me puse. Después le pedí los ocho mods más útiles para mi forma de trabajar. Me propuso una lista, le dije “todo salvo el 8” y quedaron siete.

## Los siete

1. **Medidor de sesión.** Muestra los turnos (x de 80) y el contexto (x de 150 k), y avisa al 80 % y al 100 %.
2. **Aviso de Opus.** Si llevo varias acciones mecánicas seguidas en Opus (editar en lote, correr scripts), me sugiere pasar a Sonnet.
3. **Guardia de lecturas.** Bloquea leer enteros los PDF y los archivos de Office, y los archivos de más de 20 KB. Hay que usar Grep o leer un fragmento.
4. **Semáforo de SEO.** No deja mergear un cambio del sitio si antes no corrió el chequeo de SEO y vista previa.
5. **Banda de proyecto.** Muestra cuál es el proyecto activo, para no estar trabajando en la carpeta equivocada.
6. **`/traspaso`.** Arma el cierre de la sesión: actualiza el estado del proyecto y deja anotado qué sigue.
7. **`/strategos`.** Abre el panel de estado general de mis proyectos.

## Lo que aprendí

- **Proponer y elegir.** Que Claude proponga una lista y yo tache fue más rápido que dictarle los mods uno por uno.
- ***Hot reload*.** Para que carguen hay que aceptar el aviso de recarga en caliente de la sesión (o abrir Claude Code con la carpeta del mod). Si no, uno cree que están andando y no.
- **Las guardias fallan abiertas.** Si el chequeo se rompe, dejan pasar. Está bien que sea así (una guardia que traba todo termina desactivada), pero quiere decir que pueden dejar de cuidarte sin avisar. El semáforo de SEO, por ejemplo, se pone verde si el script encuentra fallas pero termina sin error.
- **Casi sin tests.** De los siete, solo la guardia de lecturas tiene pruebas, y ninguno se probó todavía en una sesión real, que es donde se ve si un aviso ayuda o molesta. Lo anoto como pendiente, no como logro.
- **Pedir aclaración.** En otra sesión escribí “8 top mods” y Claude entendió “los 8 proyectos que sobreviven”. Desde entonces conviene que repita qué entendió antes de armar nada (dramatizo, pero poco).

## Cuándo conviene

Un mod vale la pena cuando la regla ya existe, la violás seguido y no depende de criterio. Eso es lo que digo en todo el resto de la guía: lo que se repite y tiene reglas claras va en código, no en una instrucción que dependa de que te acuerdes. Si la regla pide juicio, un mod no la resuelve.

Los números que alimentan estos avisos salen de [Medir el gasto](medir.html), y el contexto de por qué elegí 80 turnos está en [Hábitos](habitos.html). Si querés empezar, hacé solo el primero.

```text
Quiero un mod para Claude Code que me avise cuando una sesión llega a los 150 k de contexto. Usá la skill plugin-authoring. Antes de escribir nada, repetime qué entendiste. Después proponeme una lista de ocho mods más que apliquen mis reglas de economía de tokens (medidores, avisos, guardias de lectura, comandos de cierre) y dejame elegir cuáles. Las guardias deben fallar abiertas: si se rompen, que dejen pasar y avisen. Mostrame el código antes de instalarlo y no guardes nada sin mi aprobación.
```
