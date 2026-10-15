---
slug: accesibilidad
nivel: 3
nuevo: si
titulo: Accesible desde el principio
bajada: Seis reglas que ahora van en cada app, y un error que se coló igual.
---

Hacer una pantalla accesible después es caro, porque hay que deshacer decisiones. Hacerla accesible antes sale casi gratis: alcanza con que Claude sepa, desde el arranque, qué reglas seguir. Las fui juntando app por app, y confieso que todavía no están en un solo lugar (juntarlas está en la lista de pendientes, debajo de otras cuarenta cosas).

## Las seis reglas

**Tocables de 44 píxeles.** Todo lo que se aprieta mide al menos 44 por 44. Es la pauta de Apple, y sale de [pedirle criterio de diseño](criterio-diseno.html) con una app que tenía botones de 20.

**Contraste medible.** Las pautas de accesibilidad web (WCAG) piden al menos 4,5 a 1 entre el texto y el fondo. El gris tenue de una de mis apps da 5,3, medido. Antes lo elegía a ojo, y a ojo siempre me parece bien.

**Movimiento con permiso.** Si el sistema operativo de quien usa la app pide menos animación, la app respeta esa preferencia (`prefers-reduced-motion`). Las animaciones se apagan y la información sigue ahí.

**El color nunca es la única señal.** Un estado en rojo tiene que decir también “error” con texto o con un ícono. El texto manda; el color y el ícono acompañan. Quien no distingue rojo de verde, o mira la pantalla con el brillo al mínimo, lee igual.

**Avisos que no gritan.** Cuando algo cambia sin que nadie toque nada, como un mensaje de “guardado”, va en una región con `aria-live="polite"`: el lector de pantalla lo anuncia cuando termina de hablar, no encima.

**Sin presión de racha.** Nada de rachas (dan ansiedad) ni de confeti o sonidos por defecto (son ruido). Una app puede ser agradable sin hacerte sentir que le debés algo.

## El error que se coló

Hubo uno, y está en el registro de [calidad](calidad.html), con fecha del 9 de octubre. En la app de mi diario, una recarga automática redibujaba la pantalla y se llevaba el campo donde estaba escribiendo. Con el perfil a medio editar, lo escrito se perdía. Parecía un detalle de programación y era exactamente lo contrario de una app amable.

La regla nueva es corta: si hay un campo con el foco, no se redibuja. Y si hay que redibujar, el foco vuelve adonde estaba.

## Cómo se pide

No hace falta saber de accesibilidad para pedirla. Alcanza con copiar la lista de arriba en tu [archivo general](contexto-general.html) o en el del proyecto, y pedir que la revisión final la repase punto por punto. Lo que Claude no puede hacer es probar con un lector de pantalla real; eso lo tengo pendiente, y lo digo para que no creas que con la lista alcanza.

```text
Revisá esta app contra estas reglas de accesibilidad: tocables de al menos 44 píxeles, contraste del texto tenue cercano a 5,3 a 1, respeto de prefers-reduced-motion, el color nunca como única señal, avisos con aria-live polite, el foco que no se pierde al redibujar, y nada de rachas ni confeti. Para cada regla decime si se cumple, con archivo y línea, y qué falla. Aclará qué no pudiste verificar sin un lector de pantalla. Proponé los arreglos como diff y no guardes nada sin que lo apruebe.
```
