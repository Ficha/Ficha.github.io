---
slug: contexto-general
nivel: 2
titulo: El archivo que dice quién sos
bajada: Un solo archivo corto para dejar de presentarte en cada conversación.
---

Lo que más me ahorró fue dejar de explicarle a Claude quién soy en cada conversación. ¿Cómo? Con un archivo de texto.

En Claude Code es un `CLAUDE.md` en la carpeta de usuario (`~/.claude/CLAUDE.md`); en claude.ai, las instrucciones personales de *Settings*. Se carga solo, al principio de todas las conversaciones.

## Qué tiene el mío

- **Quién soy**, en cinco líneas, y en qué idioma quiero que me responda.
- **Cómo trabajamos**: que trabajo en `.md` hasta la versión final, de dónde salen ciertos datos (los feriados, solo de la página oficial) y que me pregunte antes de escribir cualquier texto que vaya firmado por mí.
- **Las reglas de ahorro**, en diez líneas. La guía completa vive en otro archivo que se lee solo al planificar.
- **Mi plan y el día del reinicio**, para que sepa cuándo conviene gastar y cuándo no.
- **Cómo nombro las cosas y cómo versiono**: la [nomenclatura de carpetas](carpetas.html) y el formato del `CHANGELOG.md`.
- **Un mapa de proyectos**: una tabla con el número, la carpeta y una línea de qué es cada uno.

## Por qué tiene que ser corto

Como se carga en todas las conversaciones, cada línea se paga siempre, aunque esa conversación no la use, aunque sea un saludo, aunque le pregunte la hora. Lo mantengo por debajo de los 3 KB, más o menos una página. Si algo no se usa en casi todas las sesiones, no va: va al [archivo del proyecto](proyectos.html), a una [skill](skills.html) o a un [brief](briefs.html).

Con el tiempo, los archivos generales engordan solos: cada vez que algo sale mal, la tentación es agregar una regla, y las reglas no se van nunca. Por eso, cada tanto, lo audito (el prompt está en [Calidad sin burocracia](calidad.html)) y lo podo.

Un detalle que aprendí tarde: los punteros envejecen. El mío mandaba a leer un brief de voz que yo había reemplazado por un manual nuevo, y durante días cualquier corrección en mi voz leyó el documento equivocado. Nadie se dio cuenta. Si cambiás de lugar un archivo, buscá quién lo nombra.

## Proyectos sensibles

Si tenés un proyecto que no querés que se cruce con nada (salud, finanzas, lo que sea), decilo en el mapa: que no se cite, no se mezcle con otros proyectos y no se use salvo que lo pidas.

```text
Quiero armar mi archivo de contexto general para que cada conversación arranque sabiendo quién soy. Antes de escribir nada, haceme una entrevista corta (de a 3 preguntas por vez, máximo 12 en total): a qué me dedico, en qué proyectos estoy, cómo quiero que me respondas, qué plan de Claude tengo y qué día se me reinicia el límite semanal. Después escribí el archivo usando la plantilla CLAUDE-general.md que te adjunto. Tiene que pesar menos de 3 KB: si algo no se usa en casi todas las sesiones, no va.
```
