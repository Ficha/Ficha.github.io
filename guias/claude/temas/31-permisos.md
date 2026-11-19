---
slug: permisos
nivel: 5
nuevo: si
titulo: Permisos que no abren la puerta
bajada: Qué le dejo hacer a Claude sin preguntar, y por qué un comodín cómodo puede ser un agujero.
---

Claude Code pide permiso antes de correr un comando o abrir una página. A la vigésima vez que te pregunta si puede listar una carpeta, aprendés a aprobar por las dudas, y ahí está el riesgo. La solución es una lista de permisos en la configuración: lo que puede hacer solo, sin preguntar.

Armarla es fácil. Armarla bien me costó un error.

## El comodín

Para no aprobar cada `git log` de cada repositorio, había dejado permitido `git -C * log *`: cualquier carpeta, cualquier opción. Parece inofensivo, porque `git log` solo lee. Pero `git` tiene opciones que ejecutan otros programas o escriben archivos, y el asterisco final las dejaba pasar todas. Un comodín sobre un comando con opciones peligrosas es una puerta con la llave puesta.

La regla nueva: no aprobar por comodín un comando cuyas opciones puedan ejecutar o escribir. Si lo uso seguido, lo escribo como un script fijo, que hace una sola cosa, y apruebo el script.

## Lo demás que ajusté

- **Páginas web**: Claude podía abrir cualquier sitio. Ahora tiene una lista de dominios. Lo que no está en la lista me lo pregunta.
- **[Tareas que corren solas](tareas.html)**: la nocturna ya no tiene permiso para hacer *push*, publicar, mandar mails ni cambiar permisos. Deja borradores y yo decido.
- **Lo que Claude no puede tocar**: su propia configuración. Cuando quiso sumar dos tareas de Windows y unos ganchos, el sistema lo frenó y me dejó los comandos para correrlos yo. Me dio trabajo, y está bien que me lo haya dado.

## Para no aprobar a ciegas

Hay una skill, `fewer-permission-prompts`, que revisa tus transcripciones, encuentra los comandos de solo lectura que aprobás seguido y propone sumarlos a la lista. Sirve, con una condición: leé cada uno antes de aceptar. Ella propone; la llave la das vos.

```text
Revisá mi configuración de permisos de Claude Code y marcá cada regla que use comodines sobre comandos con opciones que puedan ejecutar programas o escribir archivos. Para cada una, explicá en una línea el riesgo y proponé una alternativa: una regla más estrecha o un script fijo que haga una sola cosa. Revisá también si puedo abrir páginas de cualquier dominio y qué permisos tienen mis tareas programadas. No cambies nada: mostrame la lista y la configuración propuesta como diff.
```
