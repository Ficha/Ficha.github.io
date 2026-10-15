---
slug: grill-me
nivel: 4
nuevo: si
titulo: Grill me: que te pregunte antes
bajada: Una entrevista por rondas, con una respuesta recomendada en cada pregunta, antes de tocar un solo archivo.
---

Mi vicio con Claude era pedir directo. “Armame esto”, y Claude armaba, con una seguridad conmovedora, algo que se parecía bastante a lo que yo tenía en la cabeza. Bastante. Lo que faltaba lo descubría después, con la mitad del contexto gastado en rehacer.

*Grill me* invierte el orden: antes de hacer, Claude me interroga. Es una skill de Matt Pocock (repo `mattpocock/skills`) que se instala con `npx skills@latest add mattpocock/skills`. Se invoca como `grill-me`, que por dentro llama a otra, `grilling`.

## Cómo funciona

Claude arma un árbol de decisiones: cada decisión abre otras que dependen de ella. Y trabaja por rondas. En cada una pregunta todo lo que se puede preguntar ya, sin adivinar respuestas que todavía no escuchó, y espera. Con lo que contesto, el árbol se reacomoda y salen las preguntas siguientes.

Cada pregunta viene numerada y con una respuesta recomendada. Está redactada de modo que un “sí” la acepte. Eso cambia el ritmo: la mayoría las contesto con un “sí” o un “dale”, y las que me hacen dudar se llevan el tiempo que merecen.

## Los hechos los busca él

La regla que más me gusta es la de reparto. Los hechos (qué archivos hay, qué dice tal configuración, cuántos son) los busca Claude, con un subagente si hace falta. A mí me pregunta solo decisiones. Si me pregunta algo que podía mirar él mismo, me está cobrando un trabajo que no me toca. La sesión termina cuando no queda ninguna rama sin visitar y nada quedó supuesto en silencio. Recién ahí, y con mi confirmación, se actúa.

## Un caso real

Esta misma actualización de la guía salió de un grilling: 22 preguntas en 4 rondas. Algunas eran de forma (“¿tarjetas nuevas o reescribir las viejas?”), otras de contenido (“¿se nombran los proyectos o van genéricos?”). De ahí salió un documento de especificación que después se ejecutó casi sin dudas. Y aparecieron dos malentendidos a tiempo: Claude creía que el prompt de entrevista había que escribirlo de cero (existía, estaba en mi carpeta de descargas), y lo que yo llamaba “las cosas de UX/UI” resultaron ser tres tarjetas distintas. A mitad de la escritura, cada uno me habría costado una tarde. En la ronda, costó una línea.

## Cuándo sirve

- Antes de un entregable grande con un brief ambiguo. Es la versión sistemática de mi regla de hacer primero las 3 a 5 preguntas que más cambiarían el resultado.
- Antes de diseñar algo con varias piezas que dependen entre sí.
- Cuando tengo una idea y sospecho que no la pensé hasta el final.

No sirve para tareas chicas, donde la ronda de preguntas cuesta más que equivocarse. Y para lo que no entra en una sola sesión conviene el [Wayfinder](wayfinder.html), que usa esta misma entrevista como parte de su método.

Una advertencia: es mejor hacerlo con Opus, porque las preguntas buenas son las que pide el criterio. Después de la entrevista, la ejecución se pasa a Sonnet. Lo explico en [Modelos](modelos.html).

```text
Quiero [describí el plan o la idea en una o dos líneas]. Antes de hacer nada, entrevistame con la skill grilling: armá el árbol de decisiones y preguntame por rondas, con las preguntas numeradas y una respuesta recomendada en cada una, redactadas para que un "sí" la acepte. Los hechos buscalos vos en mis archivos; preguntame solo decisiones. Seguí hasta que no quede ninguna rama sin visitar. No escribas ni cambies nada hasta que yo confirme que llegamos a un entendimiento compartido.
```
