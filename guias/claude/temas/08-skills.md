---
slug: skills
nivel: 2
titulo: De proceso repetido a skill
bajada: Instrucciones que Claude carga solo cuando las necesita.
---

Una skill es una carpeta con instrucciones (y, si hace falta, scripts) para una tarea concreta. La diferencia con el [archivo general](contexto-general.html) es que no se carga siempre: Claude la lee solo cuando el pedido la necesita. Si esas instrucciones vivieran en el archivo general, las pagaría en cada mensaje.

Mi regla: lo que hice dos veces se vuelve skill.

## Las que uso

- **Corregir texto.** Corrección ortotipográfica y de estilo de mis textos, con mi hoja de estilo y el [manual de voz](briefs.html). Devuelve los cambios como “original → corregido” y nunca reescribe en una voz que no es la mía.
- **Preparar un parcial.** A partir de la carpeta con la bibliografía de una materia, ordena y renombra los archivos, hace el OCR en mi compu (sin gastar cuota), arma apuntes por eje con [subagentes en esfuerzo bajo](modelos.html), un plan de estudio, un simulacro y un cuadernillo para imprimir. La armé con la primera materia y ya la usé en tres.
- **Las de mi app de escritura**: fichar textos nuevos, seguir concursos y armar presentaciones. Viven dentro del proyecto de la app, porque solo sirven ahí.
- **Las de las [tareas programadas](tareas.html)**: cada tarea es, en el fondo, una skill que corre a una hora fija.

## Cómo armo una

1. Escribo qué hace, cuándo se usa y qué criterios sigue. La descripción importa: es lo que Claude lee para decidir si la carga.
2. El paso a paso, con todo lo pesado en scripts que corren en mi compu: convertir, renombrar, contar, validar. Lo que hace un script no gasta tokens.
3. La pruebo con un caso real y la comparo con lo que hicimos a mano.
4. Después de cada uso, si algo se trabó, la ajusto en el momento.

Las skills personales van en `~/.claude/skills/` y sirven en todos los proyectos; las de un proyecto, en `.claude/skills/` dentro de su carpeta.

```text
Esto ya lo hicimos dos veces: [proceso]. Convertilo en una skill. Primero escribí qué hace, cuándo se usa y qué criterios sigue; después el paso a paso, con los scripts que hagan falta para que lo pesado corra en mi compu y no en la conversación. Si lanza subagentes para lotes, que vayan con esfuerzo bajo. Probala con un caso real y comparala con lo que hicimos a mano.
```
