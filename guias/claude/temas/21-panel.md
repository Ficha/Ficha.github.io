---
slug: panel
nivel: 5
nuevo: si
titulo: El panel que salió caro
bajada: Consulté a once especialistas ficticios sobre una app. Costó el 16 % de la semana y sirvió igual.
---

Armé un equipo de asesores ficticios. Cada uno tiene nombre, personalidad y su bibliografía: una de biología, otra de diseño, un abogado del diablo, una especialista en datos. Son subagentes de Claude con un encargo fijo. Cuento cómo funcionan en [asesores](asesores.html). Esta tarjeta es sobre el día que los convoqué a todos juntos.

## El día

El 11 de octubre le pedí a once de ellos que opinaran sobre una app que estaba terminando, para la carrera. Quería una mirada cruzada. Lo que obtuve fue una cuenta: el panel se llevó el 16 % de la cuota de toda la semana, con 272 turnos y un pico de 499 k de contexto en una sola sesión.

Tres cosas salieron mal, en orden de gravedad creciente.

**Ocho de los once no cargaron por nombre.** Solo tres respondieron como ellos mismos. Los otros ocho dieron “Agent type not found” y Claude, muy servicial, los lanzó igual como agentes genéricos, sin su personalidad ni su bibliografía y releyendo todo desde cero. Cada uno gastó unos 75 k, contra unos 29 k de los que cargaron bien. Más del doble, y encima eran otros.

**Un dato mal pasado se convirtió en dos falsas alarmas.** Al prepararles el material se copió mal una cifra, y dos asesores encontraron, con toda seriedad, un error de cálculo que no existía. Hicieron bien su trabajo. El problema estaba en lo que les di.

**Un subagente borró un libro real.** Uno de los agentes tenía que revisar la bibliografía y, con la búsqueda en esfuerzo bajo, no pudo confirmar *Demoliendo papers*. Así que lo sacó. El libro existe. “No pude confirmarlo” y “no existe” son cosas distintas, y mi brief le permitía tratarlas como la misma.

## El lado bueno

Ocho de los once, cada uno desde su ángulo, coincidieron en lo mismo: la primera pantalla no le daba al estudiante nada que hacer. Lo sospechaba, pero una sospecha propia se archiva fácil. Ocho voces, no. Ese mismo día rehice la pantalla: un solo botón para marcar las materias aprobadas y un ejemplo que se puede tocar sin miedo a romper nada.

## Las reglas

- Un panel de tres o cuatro, no de once. La coincidencia se ve igual con menos voces.
- Los asesores corren con Sonnet, no con Opus.
- “No confirmado” no es “borrar”. Un agente que no puede verificar algo lo marca y pregunta.
- Las cifras se controlan contra el código o el dato original, no contra lo que dijo otro asesor.

No fue la única sesión con muchos ayudantes esa semana: el arranque de un gestor de finanzas, con un 73 % de trabajo en subagentes, se llevó otro 9 %. Los subagentes gastan más en total que hacer todo en una conversación, y once a la vez gastan once veces. Esa semana terminó como cuento en [la semana que me quedé sin cuota](sin-cuota.html).

```text
Convocá un panel de entre tres y cuatro asesores de mi equipo para revisar esta app. Elegí los que mejor encajan y explicá por qué. Lanzalos con Sonnet y por su nombre, y verificá que cada uno haya cargado su definición antes de empezar. Pedí a cada uno que cite el archivo y la línea de cada observación. Si un dato no se puede confirmar, que lo marque como no confirmado y no lo borre. Después hacé una síntesis con lo que coincide entre ellos, lo que discrepa y las cifras que hay que contrastar contra el código. No guardes nada sin que lo apruebe.
```
