---
slug: proyectos
nivel: 2
titulo: Un archivo por proyecto
bajada: Estado, traspaso, historial y versiones: para que cada sesión arranque donde terminó la anterior.
---

Además del [archivo general](contexto-general.html), cada proyecto tiene el suyo: un `CLAUDE.md` en su carpeta o, en claude.ai, las instrucciones de un *Project*. Dice qué es el proyecto, cómo se trabaja ahí, sus reglas propias y una sección que se llama **Estado**.

## El Estado y el traspaso

El Estado tiene fecha y tres cosas: qué decidí, qué hice y qué sigue. Al cerrar una sesión en la que avancé, le pido a Claude que lo actualice. Es el traspaso: la próxima conversación arranca donde quedó esta, y no de cero.

Parece poco, pero es lo que más rinde de toda la guía. Un proyecto sin estado anotado sale caro, porque Claude tiene que reconstruir lo que pasó leyendo todo.

Dos cosas que aprendí por las malas. La primera: los estados envejecen rápido. Si un archivo dice “pendiente” y en realidad ya lo terminé, Claude me va a recomendar hacer algo hecho. Por eso conviene que lo cruce con algo más confiable, como el historial de cambios del repositorio. La segunda: el estado dice lo que yo creo, no lo que es. El mío afirmaba que dos computadoras estaban sincronizadas al cien por ciento, y una de las dos no tenía nada. Ahora lo que se puede verificar se verifica (más en [Calidad sin papeleo](calidad.html)).

## Lo viejo, a otro archivo

Si el Estado acumula todo, el archivo crece y se paga en cada sesión del proyecto. El de mi sitio llegó a casi 9 KB con el detalle de cinco versiones que ya nadie necesitaba. Lo arreglé con un `HISTORIAL.md` al lado, que no se carga: en el Estado quedan solo los pendientes vivos y lo demás se muda. Desde entonces, cada archivo de proyecto pesa menos de 3 KB.

## Versiones

Cada proyecto lleva también un `CHANGELOG.md` mínimo: versión 1, 2, 3, con una a tres líneas sobre qué cambió, escritas para quien lo usa y no para quien lo programó. Sube cuando algo se entrega o se publica, no por cada edición. Nos sirve a los dos (a Claude y a mí) para saber qué está listo. En los proyectos con repositorio, además, cada versión lleva su etiqueta.

```text
Cerramos acá. Actualizá la sección Estado del archivo de este proyecto con la fecha de hoy: qué decidimos, qué se hizo y qué sigue, en 5 líneas como máximo. Lo que ya no está vivo pasalo a HISTORIAL.md. Si algo se entregó o se publicó, sumá una versión al CHANGELOG.md. Mostrame el diff antes de guardar.
```
