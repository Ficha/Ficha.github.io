---
slug: sin-cuota
nivel: 5
nuevo: si
titulo: La semana que me quedé sin cuota
bajada: Del 8 al 12 de octubre gasté el cupo semanal antes de tiempo. Estos son los números y lo que cambié.
---

Mi plan tiene un límite semanal que se reinicia los jueves a las 4 de la mañana. La semana que arrancó el jueves 8 de octubre me quedé sin cuota mucho antes del jueves siguiente. Me molestó quedarme sin cuota, pero más me molestó no saber en qué la había gastado (yo, que anoto hasta los minutos que tardo en escribir el newsletter). Así que hice lo que hago con todo lo que no entiendo: lo medí.

## Los números

Del jueves al lunes fueron 41 sesiones y 2.524 turnos. Opus, el modelo más caro, se llevó el 78 % del peso, y casi siempre para ejecutar cosas que Sonnet hace igual de bien. El contexto promedio por turno fue de 157 k (157.000 tokens), y eso importa por algo que yo sabía en teoría y nunca había visto en números: cada turno vuelve a leer toda la conversación. El 59 % del gasto fue releer; el 26 %, guardar en caché, y el 15 %, las respuestas. Escribir, que era lo que yo creía caro, resultó lo más barato. Los subagentes, por su parte, se comieron un 16 %.

Hay otros tres datos que no se ven en un promedio:

- El jueves y el domingo concentraron el 77 % del gasto. Arranqué varios proyectos grandes a la vez, en vez de repartirlos.
- El 79 % de las sesiones se abrió en la carpeta raíz de todos los proyectos, no en la del proyecto. Claude arrancaba cargando contexto que no hacía falta.
- Tres archivos de 87, 74 y 53 KB se leyeron enteros, varias veces, en vez de buscar dentro de ellos lo que se necesitaba.

Ninguno de los tres es un error grave. Los tres juntos son una factura.

## Lo que cambié

Cinco reglas que ahora viven en mi [archivo general](contexto-general.html):

- Sonnet por defecto. Si algo pide Opus, Claude me avisa y lo cambio yo. Más en [modelos](modelos.html).
- En Opus se planea y se suelta: cuando el plan está listo, la ejecución va a Sonnet.
- Tope de sesión: unos 80 turnos o 150 k de contexto. Al llegar, traspaso y sesión nueva. [Hábitos](habitos.html) lo cuenta con más detalle.
- Un proyecto grande por día.
- En archivos de más de 20 KB, búsqueda y lectura por fragmentos; nunca el archivo entero.

Y las metas, para saber si sirvió: Opus por debajo del 40 %, contexto promedio por debajo de 90 k, ninguna sesión por encima del 8 % del gasto semanal.

## Si funcionó

A medias. La segunda medición, del 8 al 14 de octubre, dio Opus en 68 %. Bajó diez puntos y sigue lejos del 40. Resulta que escribir una regla no alcanza si después abro Opus por costumbre, como quien entra a la cocina sin hambre. Por eso armé [una forma de medir](medir.html) todas las semanas y [avisos que saltan solos](mods.html) cuando me estoy pasando.

Lo más gracioso es que buena parte de esa cuota se fue en construir herramientas para ahorrar cuota. Sobre eso hay [otra tarjeta](construir-menos.html).

```text
Quiero entender en qué se me va la cuota semanal. Buscá en las transcripciones locales de Claude Code de esta semana y calculá: cantidad de sesiones y de turnos, porcentaje de peso por modelo, contexto promedio por turno, cuánto se va en releer, en caché y en respuestas, cuánto en subagentes, en qué días se concentra y cuántas sesiones se abrieron en una carpeta raíz. Listá también los archivos grandes leídos enteros. Con eso, proponé cinco reglas para mi archivo general y tres metas medibles. No modifiques nada sin que lo apruebe.
```
