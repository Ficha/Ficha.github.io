---
slug: tareas
nivel: 3
titulo: Tareas que corren solas
bajada: Trabajo de noche, borradores a la mañana y permisos escritos de antemano.
---

Una tarea programada es un pedido que Claude ejecuta solo, a una hora fija, sin que yo esté mirando. Las uso para lo que se repite y para lo pesado que puede esperar a la noche.

## Las que tengo

- **El [newsletter de mejora continua](newsletter.html)**, una vez por semana, el día antes del reinicio.
- **La cartelera de los jueves**: actualiza la agenda cultural de una app que compartimos en casa (cine, estrenos, listas de películas pendientes y el pronóstico) desde las fuentes de siempre.
- **Recordatorios con condición**: una tarea que, el día que se renueva el cupo del conector de Figma, se fija si ya se puede usar y me avisa. No corre nada: solo chequea.
- **Trabajos nocturnos sueltos**: research que se repite, revisiones largas, borradores de guías. A la mañana leo y decido.

## La regla de oro

Ninguna tarea envía, publica, borra ni mergea nada. Producen borradores, y el único mail que pueden mandar es a mí. Eso lo dice cada tarea en sus instrucciones y también mi [archivo general](contexto-general.html). Si una tarea tiene que tocar algo afuera, como subir la cartelera a la app, lo dice explícito y se limita a eso.

## Permisos escritos de antemano

Una tarea que corre de noche no puede preguntarme si la dejo leer un archivo. Si le falta un permiso, se queda trabada hasta que la veo. Por eso los permisos que necesita van escritos en la configuración de Claude Code (`~/.claude/settings.json`): leer mis proyectos, editar solo la carpeta del newsletter, consultar el historial de los repositorios, correr dos o tres scripts concretos. Lo mínimo para que haga su trabajo y nada más.

Dos detalles que aprendí cuando la tarea se trabó: los comandos, con rutas absolutas (la tarea corrió en una carpeta temporal y no encontraba nada), y los permisos, con la misma forma exacta del comando que va a correr.

## Lo que no te dicen

Las tareas programadas en la app de escritorio corren solo con la app abierta y la computadora prendida. La segunda edición de mi newsletter me llegó un día tarde, después del reinicio, y la cuota que quería aprovechar se perdió igual. Por eso ahora la computadora que hace de servidor queda siempre prendida y sin suspensión (más en [Claude en varias computadoras](equipos.html)).

Y otra: si una tarea arma su resumen leyendo todo, gasta como una sesión larga. Lo que se puede contar con un script (commits de la semana, tamaño de los archivos, estados) va a un script que le entrega los datos masticados.

```text
Creá una tarea programada que corra [día y hora] y haga [qué]. Reglas: produce borradores; no envía, publica, borra ni mergea nada; si una fuente falla, la deja afuera y lo dice. Usá rutas absolutas. Listá los permisos mínimos que necesita y proponé cómo agregarlos a settings.json, sin sumar nada de más. Antes de activarla, corré una prueba y mostrame el resultado.
```
