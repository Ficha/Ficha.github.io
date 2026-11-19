---
slug: obra-antes
nivel: 4
nuevo: si
titulo: Obra antes que sistema
bajada: Una regla que cuenta archivos y me dice si esta semana me toca construir herramientas o hacer lo que las herramientas tenían que facilitar.
---

[Construir menos](construir-menos.html) terminaba con una pregunta: ¿cuántas horas me ahorra esto esta semana? La pregunta era buena y no alcanzó. Siempre encontraba una respuesta que me dejaba construir.

Lo que hago es de dos tipos. La **obra** es lo que entrego: un texto, una app que alguien usa, un apunte, una versión publicada. El **sistema** es lo que armo para hacer la obra: infraestructura, mods, paneles, limpieza de carpetas, reglas para Claude. El sistema es entretenido, se termina rápido y da la sensación de avanzar. La obra cuesta.

## La regla

Desde el 10 de noviembre, no abro trabajo de sistema en una semana en la que no haya al menos una entrega de obra anotada en un `CHANGELOG.md`. Primero se entrega algo. Después, si sobra, se afila el lápiz.

## El script que la cuenta

Una regla que depende de que me acuerde no funciona conmigo. Prefiero los frenos en la estructura, no en la voluntad. Así que `obra_meta.py` (Python, sin IA, sin red) recorre mis proyectos y cuenta cuántos archivos de obra y cuántos de sistema toqué en los últimos 30 y 90 días, cuándo fue la última versión de cada uno y cuándo actualicé su Estado. Al final dice, en una línea, si esta semana puedo abrir trabajo de sistema.

Los números son incómodos, que es para lo que sirven. En los apuntes de Corrección de Estilo, el 94 % de lo que toqué en un mes fue obra. En mi panel de proyectos, el 18 %.

## Lo que todavía no sabe

No distingue una entrega de obra de un cambio de herramientas anotado en otro proyecto. Si sumo una versión al `CHANGELOG.md` de una app por un arreglo interno, el script lo cuenta como entrega. Lo sé y lo dejo así: una regla imperfecta que se cumple rinde más que una perfecta que se discute.

```text
Ayudame a separar mi trabajo en obra (lo que entrego: textos, apps que alguien usa, versiones publicadas) y sistema (herramientas, automatizaciones, limpieza, configuración). Primero proponé cómo clasificar los archivos de cada proyecto y mostrame ejemplos dudosos para que yo decida. Después escribí un script sin IA que cuente, por proyecto, cuántos archivos de cada tipo toqué en 30 y 90 días y que diga en una línea si esta semana hubo al menos una entrega de obra anotada en un CHANGELOG.md. Usá rutas absolutas y no guardes nada sin que lo apruebe.
```
