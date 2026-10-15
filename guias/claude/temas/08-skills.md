---
slug: skills
nivel: 2
titulo: De proceso repetido a skill
bajada: Instrucciones que Claude carga solo cuando las necesita.
---

Una skill es una carpeta con instrucciones (y, si hace falta, scripts) para una tarea concreta. La diferencia con el [archivo general](contexto-general.html) es que no se carga siempre: Claude la lee solo cuando el pedido la necesita. Si esas instrucciones vivieran en el archivo general, las pagaría en cada mensaje.

Mi regla es simple: lo que hice dos veces se vuelve skill.

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

## Las de otras personas

También se instalan skills ajenas, y algunas son muy buenas: [grill me](grill-me.html) y [wayfinder](wayfinder.html) son de Matt Pocock, y la de [criterio de diseño](criterio-diseno.html) es de otro autor. Pero la primera vez el instalador me ofreció 38 de un repositorio, le di a todas y quedé con 45 skills. Uso unas cinco. Cada skill instalada suma su descripción a lo que Claude lee para decidir cuál cargar, así que las que sobran no son gratis.

Lo que hago ahora: instalo de a una, leo su `SKILL.md` antes y, si sirve solo para un proyecto, la instalo en ese proyecto y no en todos. Y el instalador lo corro yo: Claude, con buen criterio, no ejecuta solo código de terceros que baja de internet.

```text
Esto ya lo hicimos dos veces: [proceso]. Convertilo en una skill. Primero escribí qué hace, cuándo se usa y qué criterios sigue; después el paso a paso, con los scripts que hagan falta para que lo pesado corra en mi compu y no en la conversación. Si lanza subagentes para lotes, que vayan con esfuerzo bajo. Probala con un caso real y comparala con lo que hicimos a mano.
```
