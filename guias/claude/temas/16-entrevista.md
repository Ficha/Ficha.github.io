---
slug: entrevista
nivel: 4
nuevo: si
titulo: La entrevista que arma todo
bajada: Un documento largo y un prompt corto para que Claude te entreviste y adapte todo esto a vos.
---

Esta guía tiene un problema: es mía. Las carpetas, los nombres, las reglas del archivo general, todo salió de cómo trabajo yo. Si la copiás tal cual, vas a pasar una tarde borrando mis proyectos de tus plantillas. Para eso armé un documento aparte, pensado para que Claude lo lea y te haga las preguntas que yo ya me contesté solo.

## Qué es el documento

Es un solo archivo, `guia-para-compartir.md`, que se descarga del [kit](kit.html). Junta lo esencial de estas tarjetas sin ningún dato mío: cómo se gasta la cuota, las reglas de economía de tokens, la organización de carpetas, las plantillas del archivo general y del archivo de proyecto, los criterios de calidad y un cuestionario por bloques. Es largo a propósito. Está hecho para leerse una vez, no para cargarse en cada sesión (sería repetir el error que cuento en [Cómo se gasta](como-se-gasta.html)).

La primera versión es del 8 de octubre, justo la semana en que me quedé sin cuota (la casualidad tiene sentido del humor), y la fui actualizando con lo que aprendí. Por eso trae los topes de sesión y la regla de planear en Opus y ejecutar en Sonnet.

## Cómo se usa

1. Guardalo en tu carpeta madre, la que contiene todos tus proyectos, con el nombre `_guia-claude.md`. El guion bajo avisa que es de consulta. Si todavía no tenés una carpeta madre, [Carpetas](carpetas.html) explica por qué conviene.
2. Abrí Claude Code en esa carpeta y elegí Opus. Es la única vez: diseñar el sistema es trabajo de pensar.
3. Pegá el prompt de abajo.
4. Cuando termine, volvé a Sonnet, que es el modelo del día a día.

La entrevista dura un rato, pero está hecha de a tres preguntas por vez, así que se puede dejar y retomar. Si contestás “no sé”, Claude propone la opción que recomienda el documento y sigue. Tampoco hace falta que sepas programar: el prompt le pide que explique cualquier término técnico con palabras simples.

## Qué hace Claude

Primero mira lo que ya tenés, sin tocar nada: las carpetas de primer nivel, tu archivo general si existe, los de cada proyecto, las skills y los permisos. Te cuenta qué encontró. Después te entrevista, saltea lo que se deduce de tus archivos (y te avisa qué salteó) y recién al final propone, de a una cosa por vez, tu archivo general, los archivos de calidad, el de cada proyecto, un plan de migración si querés renombrar carpetas, la primera skill que valdría la pena armar y una lista corta de lo que te toca hacer a mano.

Dos reglas del prompt las puse por experiencia. Nunca borra nada y, si algo de tus archivos contradice el documento, te pregunta cuál queda. Y cada archivo se muestra antes de guardarse. Una entrevista que reescribe tu configuración sin avisar es un buen modo de perder lo que ya funcionaba.

## Si te sirvió

El documento termina con una invitación: si el prompt te sirvió, volvé a esta guía. No es obligatorio, pero me ayuda a saber si alguien lo usa de verdad (confieso que es la parte que más me importa).

```text
Leé una sola vez el archivo _guia-claude.md de esta carpeta: es una guía para organizar proyectos con Claude Code. Quiero adaptarla a mí sin romper lo que ya tengo.

Primero mirá lo que existe, sin cambiar nada: carpetas de primer nivel, mi ~/.claude/CLAUDE.md, los CLAUDE.md de cada proyecto, las skills y los permisos. Contame en pocas líneas qué encontraste.

Después entrevistame con el cuestionario de la guía, de a tres preguntas por vez y por bloques. Salteá lo que ya se deduce de mis archivos y avisame qué salteaste. Si respondo "no sé", proponé la opción recomendada y seguí. Explicame cualquier término técnico con palabras simples.

Al terminar, proponé de a uno, mostrándome cada archivo o diff antes de guardarlo: mi archivo general, los archivos de calidad, el de cada proyecto y la primera skill. Nunca borres ni muevas nada, y no guardes nada sin que yo lo apruebe. Cuando termines, decime que vuelva a Sonnet.
```
