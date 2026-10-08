---
slug: newsletter
nivel: 3
titulo: El newsletter de mejora continua
bajada: Un mail semanal que me dice qué mejorar con la cuota que me sobra.
---

Escribo un newsletter hace cinco años, así que era cuestión de tiempo que me armara uno para mí. Cada semana, una [tarea programada](tareas.html) junta lo que pasó en mis proyectos, lo cruza con las novedades de IA y me manda un mail que se lee en cinco minutos.

## Qué trae

- **Para vos**: una línea por proyecto con su estado y una sola acción concreta para esta semana (una sola, porque si me pone cinco no hago ninguna). La saca de las [secciones Estado](proyectos.html), sin abrir nada pesado.
- **Construyendo infraestructura**, que es la razón de ser del newsletter: qué funcionó en la semana, qué se trabó, qué tuve que explicar dos veces, y hasta tres mejoras ordenadas según cuánto rinden, cada una con el pedido listo para pegar y una etiqueta de peso (liviana, media, pesada) y de modelo.
- **Un plan para la cuota que sobra** antes del reinicio.
- **Noticias de IA** (cinco como máximo, con fuente), tres tips de Claude que no se repitan con las últimas cuatro ediciones y dos de IA en general.

## Cuándo sale

Sale la mañana del día anterior al reinicio. Así, las mejoras que propone las hago con la cuota que de todos modos iba a perder, y cada semana el sistema queda un poco más barato que la anterior.

Las propuestas me las deja escritas y las ejecuto yo, si me convencen. La tarea no toca mis proyectos, no publica nada y el único mail que manda es a mí.

## La memoria del newsletter

Al principio, cada edición arrancaba de cero y me volvía a proponer lo mismo. Ahora la tarea lleva un registro aparte (`_aprendizajes.md`): una entrada por semana con los aprendizajes, las propuestas y el estado de las anteriores (hecha, pendiente, arrastrada). Así ve qué sigue trabado tres semanas seguidas, que suele ser lo que más conviene atacar.

Para que no gaste de más, los datos los junta un script: los Estados de cada proyecto y cuánto pesan, los commits de la semana de cada repositorio y los PR abiertos o mergeados. La tarea recibe eso masticado y escribe.

## Lo que aprendí armándolo

Los estados envejecen y el newsletter me recomendaba cosas ya hechas, así que ahora cruza cada Estado con el historial de los repositorios. Un proyecto sin estado anotado sale caro. La memoria de Claude Code vive en una carpeta por proyecto, y la tarea miraba la de la raíz, que estaba vacía.
```text
Creá una tarea programada que corra [el día anterior a mi reinicio semanal] a las 8 con la plantilla newsletter-semanal.md que te adjunto. Adaptá las rutas y las fuentes a mis proyectos. Que lleve un registro _aprendizajes.md con lo que propone cada semana y el estado de lo anterior. La tarea lee, arma la edición y la guarda (o me la deja como borrador en mi mail); no le escribe a nadie más, no publica y no ejecuta sus propias propuestas. Antes de activarla, corré una edición de prueba y mostrámela.
```
