---
slug: wayfinder
nivel: 4
nuevo: si
titulo: Wayfinder: un mapa para lo que no entra en una sesión
bajada: Cuando el trabajo es más grande que una conversación, se planea primero con tickets de decisión y se ejecuta después.
---

Hay trabajos que no caben en una sesión. A veces ni siquiera son difíciles; son grandes y están envueltos en niebla: sabés más o menos adónde querés llegar, pero no ves el camino. Si lo encarás igual, la sesión se llena de contexto, llega el tope y lo que quedó decidido a medias se pierde en el traspaso.

*Wayfinder* es otra skill de Matt Pocock (repo `mattpocock/skills`, se instala con `npx skills@latest add mattpocock/skills`). Su propuesta es dibujar el mapa antes de dar el primer paso.

## Las partes del mapa

El mapa es un documento que sirve de índice, no de depósito. Tiene cuatro secciones:

- **Destino.** Qué aspecto tiene llegar: una especificación, una decisión cerrada o un cambio hecho. Se fija primero, porque define el alcance de todo lo demás.
- **Decisiones tomadas.** Una línea por cada ticket resuelto, con un link al detalle. La decisión vive en un solo lugar (su ticket) y el mapa solo la resume.
- **Todavía sin especificar.** La niebla: cosas que sabés que van a aparecer pero que no podés formular con precisión. No se corta en tickets antes de tiempo. Cuando una decisión la aclara, recién ahí se vuelve ticket.
- **Fuera de alcance.** Lo que descartaste a propósito. No vuelve, salvo que cambie el destino.

Cada ticket es una pregunta que se resuelve con una decisión, del tamaño de una sesión. Puede ser investigación, un prototipo, una conversación (acá entra el [grill me](grill-me.html)) o una tarea manual que destraba una decisión. Y una regla simple: una sesión, un ticket.

## Planear sin ejecutar

Esto fue lo que más me costó. La skill pide planear y soltar. Cada ticket produce una decisión, no un entregable, y el mapa termina cuando no queda nada por decidir. Las ganas de “ya que estoy, lo hago” suelen indicar que llegaste al borde del mapa y toca pasar a otra etapa.

## El ejemplo: un reinicio

Lo estoy usando para pensar un reinicio de todos mis proyectos: qué queda, qué se archiva y con qué reglas sigo. Es el caso típico de lo que no entra en una conversación, porque toca todas las carpetas y cada decisión cambia las que vienen después.

El destino quedó escrito en una línea: una especificación de una página. Planificar, no ejecutar. De la primera sesión salieron unas pocas decisiones, siete tickets abiertos y una sorpresa: uno de esos tickets bloquea a todos los demás, y no era el que yo creía. Todavía no terminé. El mapa está a medias, y la gracia es justamente esa: puedo cerrar la sesión hoy y abrir otra la semana que viene sin perder nada, porque lo decidido está escrito y no en el contexto de una conversación.

## Cuándo no usarlo

Si el camino ya está claro y entra en una sesión, no hace falta mapa: la propia skill dice que en ese caso conviene frenar y preguntar cómo seguir. Un mapa también tiene costo, y para un cambio de dos archivos sería un modo elegante de procrastinar.

Es, además, la mejor forma que encontré de respetar el tope de sesión que cuento en [Hábitos](habitos.html).

```text
Quiero planear [describí el trabajo grande y el resultado que imaginás]. Usá la skill wayfinder: primero ayudame a fijar el destino con una entrevista (grilling), después armá el mapa con destino, decisiones tomadas, lo todavía sin especificar y lo fuera de alcance, y creá solo los tickets de decisión que se puedan formular ya. Resolvé un ticket por sesión. Planeá sin ejecutar nada y no guardes ni cambies ningún archivo sin que yo lo apruebe.
```
