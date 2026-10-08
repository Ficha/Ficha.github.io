---
slug: modelos
nivel: 1
titulo: Qué modelo y cuánto esfuerzo
bajada: Opus piensa, Sonnet hace y los lotes van con el esfuerzo al mínimo.
---

Durante un tiempo usé siempre el modelo más grande, por las dudas. Es como ir al supermercado en camión. Llegás, sí, pero el combustible se termina el martes.

## Sonnet por defecto

Uso Sonnet para casi todo: corregir, programar, ordenar archivos, estudiar. A Opus lo llamo cuando hay que pensar en serio, sea una estrategia, una edición fina, la arquitectura de algo nuevo o un problema que Sonnet no logra resolver. Opus planifica; Sonnet ejecuta. Muchas veces abro la sesión con Opus para armar el plan y la sigo con Sonnet para hacerlo.

Lo dejé escrito en mi [archivo general](contexto-general.html) para que Claude me avise cuando una tarea pide Opus, en vez de cambiarlo por su cuenta. El cambio lo hago yo.

## El esfuerzo también se elige

Además del modelo, se puede elegir cuánto razona antes de contestar. ¿Hace falta que piense un buen rato para decirme si una coma va o no va? Para una pregunta simple, el razonamiento largo es gasto puro; para una decisión con muchas variables, vale cada token.

Donde más se nota es en los subagentes: los ayudantes que Claude lanza para tareas masivas, como resumir treinta PDF, clasificar o desgrabar. Son trabajos mecánicos y van con un brief cerrado, así que los corro con esfuerzo bajo. Mi skill para [preparar parciales](skills.html) lanza los apuntes por eje en esfuerzo bajo y deja el esfuerzo medio solo para el simulacro.

Ojo, que los subagentes gastan más en total que hacer todo en la misma conversación. Los uso cuando quiero que la conversación principal quede limpia. No para ahorrar.

## Haiku para lo chico

Para tareas cortas y repetidas (clasificar, extraer un dato, revisar un formato), Haiku alcanza y sobra. El día antes del reinicio, a veces, pruebo una tarea con un modelo más chico que el habitual, para ver si la resuelve igual; si la resuelve, queda así.

```text
Revisá cómo estamos usando los modelos en este proyecto. Para cada tipo de tarea que hacemos seguido, decime qué modelo y qué esfuerzo usarías, y por qué. Si hay subagentes, indicá cuáles pueden correr con esfuerzo bajo. Proponé los cambios como diff en el archivo del proyecto o en la skill que corresponda, y no guardes nada sin que lo apruebe.
```
