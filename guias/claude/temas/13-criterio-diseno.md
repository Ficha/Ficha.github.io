---
slug: criterio-diseno
nivel: 3
nuevo: si
titulo: Pedirle criterio de diseño
bajada: Una skill con las pautas de Apple como vara, y lo que encontró en una app mía mirada en un celular.
---

Claude diseña pantallas que funcionan en mi monitor y se rompen en el celular, y la razón es simple: nadie le dijo contra qué compararlas. Si le pedís “mejorá el diseño”, mejora lo que se le ocurre. Si le das una vara, mide.

## La vara

Instalé una skill ajena, `apple-design`, solo en la carpeta de ese proyecto. Trae 123 páginas de las Human Interface Guidelines de Apple (las pautas con las que Apple diseña sus pantallas) y una regla que me gusta: antes de opinar, lee la pauta, y cada observación cita el archivo y el apartado de donde sale. Sin cita, es opinión, y opinión ya tengo yo (de sobra).

La otra regla es de tamaño: en cada revisión carga entre 8 y 12 de esas páginas, siempre las de accesibilidad, diagramación, tipografía y color, más las de la plataforma. No se lee el manual entero cada vez, que es justo lo que le pido a todo lo demás en [cómo se gasta la cuota](como-se-gasta.html).

## Lo que encontró

La probé con una app para la carrera que armé, abierta a 375 píxeles de ancho, que es un celular chico. Esto salió:

- Nueve pestañas arriba que no entraban y desbordaban hacia los costados.
- Cosas para tocar de 34, 36 y hasta 20 píxeles (los enlaces). La pauta pide 44. Los de 20 no los acertaba ni yo, que los había puesto ahí.
- El cartel de cookies ocupaba un 20 % de la pantalla, siempre, tapando justo lo que había que leer.

Lo arreglamos así: las pestañas pasaron a una barra inferior, que es donde el pulgar llega; todo lo tocable subió a 44 píxeles; el cartel de cookies se achicó; y en pantallas grandes se aprovechó el ancho en lugar de dejar una columna angosta en el medio. Le había pedido algo mucho más vago: “revisá la app, proponé una lista de cambios y mostrame un prototipo”. Lo único que agregué en el medio fue “ojo, que no es solo para celular”, y por eso la versión de escritorio también salió ganando.

## La salvedad

Todo esto lo vimos en un navegador con el ancho achicado. No lo probé en un celular físico, y un celular de verdad tiene un pulgar, una pantalla sucia y un sol que pega de costado. Tomalo como una primera pasada y no como una aprobación. La [accesibilidad](accesibilidad.html) tiene su propia tarjeta porque ahí la vara es otra.

## Cuándo sirve y cuándo no

Sirve cuando ya hay algo hecho y querés una crítica con fuente. No sirve para decidir qué construir; eso va antes, en la [entrevista](entrevista.html). Y no reemplaza a una persona usándolo. Si un amigo tarda diez segundos en encontrar un botón, ese dato vale más que cualquier cita de pauta.

```text
Revisá el diseño de esta app como lo haría la skill apple-design, mirándola a 375 píxeles de ancho. Elegí entre 8 y 12 archivos que definan la interfaz y decime cuáles elegiste. Para cada problema, citá la pauta de la que sale, el archivo y la línea, y qué cambiarías. Ordenalos por cuánto estorban a quien la usa. Aclará qué cosas no pudiste verificar sin un celular real. Proponé los cambios como diff y no guardes nada sin que lo apruebe.
```
