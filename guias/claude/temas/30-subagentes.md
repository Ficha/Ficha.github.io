---
slug: subagentes
nivel: 5
nuevo: si
titulo: Lo que dice un subagente no es un hecho
bajada: Verificar en la fuente, lanzar de a uno y probar un lote con cinco antes de largar 30.
---

Los subagentes son ayudantes que Claude lanza para hacer una parte del trabajo en paralelo: leer una carpeta, verificar una lista, resumir veinte archivos. Vuelven con un informe y Claude sigue con eso. El problema es ese “sigue con eso”. Un informe de subagente es una lectura de alguien que no vas a ver trabajar, y Claude lo trata como un dato.

## Tres errores de noviembre

- Una consulta me preguntó si apagaba una tarea nocturna que, según el informe, corría todas las noches. Respondí “apagala”. Era una tarea de una sola vez y ya estaba apagada: decidí sobre un dato falso.
- Mi plan maestro dio por no enviados unos pedidos de presupuesto. Los había mandado. El subagente leyó un pendiente abierto y concluyó que no se había hecho nada.
- En [el panel que salió caro](panel.html), un subagente borró de una lista un libro que existe porque “no pudo confirmarlo”.

Ninguno fue grave. Los tres eran del mismo tipo: una afirmación sobre el mundo hecha desde un archivo.

## Verificar en la fuente

Ahora, antes de afirmar que algo no se hizo, que está activo o que no existe, Claude lo comprueba en la fuente: el mail enviado, el repositorio, el estado real de la tarea, no su archivo de configuración. Si no puede, lo dice así: “figura abierto”, “no lo pude confirmar”. Y “no lo pude confirmar” nunca autoriza a borrar.

## De a uno

En la sesión del plan de Galera, Claude lanzó cinco subagentes casi a la vez, con Opus y Sonnet mezclados. El cupo de cinco horas se terminó en minutos. Cuando los subagentes comparten un plan, van de a uno y en orden de valor: primero el que más importa. En paralelo, solo los cortos.

## Probar con cinco

Para armar muestras de voz lancé un lote de 30 llamadas a Claude desde un script, con Sonnet. El cupo semanal se terminó en la 14, y la tarea programada del día siguiente podía fallar por eso. Ahora, antes de un lote, miro cuánto cupo queda y corro cinco. Si cinco salen bien y el gasto cierra, sigo.

```text
Antes de afirmar que algo no se hizo, está activo o no existe, verificalo en la fuente (el mail enviado, el repositorio, el estado real de la tarea) y no en un resumen o en un pendiente. Si no podés verificarlo, decilo con esas palabras y no borres nada por eso. Cuando lances subagentes que comparten un plan, lanzalos de a uno, en orden de valor; en paralelo, solo los cortos. Antes de un lote de más de diez llamadas, decime cuánto cupo estimás que gasta y probá primero con cinco. Agregá estas reglas a mi archivo general y mostrame el diff antes de guardarlo.
```
