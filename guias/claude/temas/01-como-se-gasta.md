---
slug: como-se-gasta
nivel: 1
titulo: Cómo se gasta la cuota
bajada: Por qué el mensaje cincuenta sale más caro que el primero, y qué consume más.
---

Lo primero que me costó entender es que Claude no tiene memoria entre mensaje y mensaje. Cada vez que le escribo, relee la conversación entera desde el principio, así que el décimo mensaje sale más caro que el primero y el quincuagésimo, bastante más. Pasadas unas horas de charla, además, empieza a mezclar lo que le pedí al principio con lo que le pido ahora. En inglés le dicen *context rot*, contexto podrido, buen nombre.

Lo segundo es que escribir le cuesta mucho más que leer: cuando le pido que me devuelva un texto entero corregido, pago cada palabra que ya estaba bien. Si le pido solo los cambios, pago los cambios. Nada más.

Y lo tercero es que todo suma: mis mensajes, sus respuestas, los archivos que abre, las búsquedas en la web, lo que razona antes de contestar y hasta los conectores que tengo prendidos (Drive, Gmail, lo que sea), que cargan sus instrucciones aunque no los use.

## Un solo pozo

La app, la web, Claude Code y las tareas programadas descuentan del mismo límite. Hay una ventana de cinco horas, que empieza con el primer mensaje, y un límite semanal, que se reinicia siempre el mismo día a la misma hora. ¿Cuál hay que administrar? El semanal; el tuyo está en *Settings > Usage*.

Los conectores, además, pueden tener su propio cupo. El de Figma, en el plan gratuito, da 20 llamadas por mes. Lo agoté en un día (pasando un sistema de diseño, no mirando dibujitos), así que ahora tengo una tarea que me avisa cuando se renueva.

## Qué consume más

De más a menos, diría: las sesiones largas, los modelos grandes (Opus gasta bastante más que Sonnet, y Sonnet más que Haiku), el research y las búsquedas web, los PDF pesados o escaneados, los agentes y el razonamiento extendido usado para cosas simples.

Si querés datos tuyos en vez de mi lista, al final de una sesión larga pedile que te explique tu uso: Claude Code tiene una skill (`explain-usage`) que arma un gráfico con lo que se llevó cada parte. Sirve para calibrar los [hábitos](habitos.html) con números propios.

## El día del reinicio

La cuota que sobra no se acumula. Se pierde. Por eso el día anterior al reinicio lo uso para mejorar la infraestructura (skills, briefs, auditorías), y lo que pesa lo dejo para la noche, en [tareas programadas](tareas.html). Y un truco que todavía me parece medio trampa: si una tarea liviana corre a las seis de la mañana, la ventana de cinco horas se reinicia a las once, y el día rinde dos ventanas.

```text
Te paso cómo uso Claude en una semana típica: [qué tareas, cuánto duran, con qué modelo]. Mi plan es [plan] y el límite se reinicia los [día] a las [hora]. Decime qué de todo eso es lo que más cuota me consume y proponé tres cambios concretos, ordenados por cuánto ahorran, sin que pierda calidad en lo que importa.
```
