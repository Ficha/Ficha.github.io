---
slug: carpetas
nivel: 2
titulo: Ponerle número a las cosas
bajada: Nombres fijos para que Claude, los scripts y yo hablemos de lo mismo.
---

Mis carpetas tenían nombres como `gestor-facultad`, `fidelhub`, `correccion de estilo` (con espacios) y `escritura`. Funcionaban mientras eran pocas. Con dieciséis proyectos, cada vez que le pedía algo a Claude tenía que aclarar de cuál hablaba, y los nombres con espacios o tildes rompían los scripts cada dos por tres.

## El sistema

Ahora cada proyecto tiene un número fijo de tres cifras. La centena es el área: 1 para la facultad, 2 para la escritura, 3 para el trabajo, 4 para lo personal. Las carpetas se llaman `NNN-area-nombre`, en minúsculas, sin tildes ni espacios: `101-edicion-correccion-estilo`, `202-escritura-diario`, `404-personal-infra`. El número no se reutiliza aunque el proyecto se archive.

Dentro de cada proyecto, otra convención:

- Los archivos fijos, en mayúsculas: `CLAUDE.md`, `CHANGELOG.md`, `PLAN.md`, `HISTORIAL.md`.
- Los internos, con un guion bajo adelante: `_brief.md`, `_txt/`.
- Los fechados, con la fecha primero: `2026-10-08-auditoria.md`, para que se ordenen solos.

El número va también en el título del archivo de cada proyecto (`# 202 · Diario`) y en el mapa del [archivo general](contexto-general.html). Ahora digo “el 404” y Claude sabe de qué hablo.

## Por qué conviene hacerlo al principio

Renombrar después es caro. La migración me llevó una tarde entera: no alcanza con cambiar el nombre de la carpeta, también hay que actualizar las rutas en los archivos de contexto, las skills, las tareas programadas, los entornos de Python y las configuraciones. Y la memoria de Claude Code está atada a la ruta de la carpeta, así que hay que mudarla a mano.

En la migración, además, se me escaparon tres errores: un script por lotes que siguió de largo después de fallar, unas rutas con barras invertidas que el shell convirtió en otra cosa y un generador que corrió de verdad cuando yo solo quería ver cómo se usaba. Los anoté, con su causa y su prevención, en el registro que cuento en [Calidad sin papeleo](calidad.html). La regla que quedó: los lotes que mueven o escriben archivos van de a uno, o con un control de error en cada paso.

```text
Quiero ordenar mis carpetas de proyectos con nombres fijos. Proponé un número de 3 cifras para cada una (la centena es el área: [tus áreas]) y un nombre con el formato NNN-area-nombre, en minúsculas, sin tildes ni espacios. Antes de renombrar nada, listá todo lo que nombra esas rutas (archivos de contexto, skills, tareas programadas, configuraciones, memoria) y armá un plan de migración de a una carpeta por vez, verificando cada paso. No muevas nada sin que lo apruebe.
```
