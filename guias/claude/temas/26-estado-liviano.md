---
slug: estado-liviano
nivel: 2
nuevo: si
titulo: El Estado que no engorda
bajada: Un solo Estado por proyecto, de 1,5 KB como máximo, y lo viejo a otro archivo, palabra por palabra.
---

En [Un archivo por proyecto](proyectos.html) conté que lo viejo se muda a un `HISTORIAL.md`. Lo cumplía a medias. En noviembre sumé lo que pesaban todos mis `CLAUDE.md`: 133 KB, unos 35.000 tokens que se cargaban antes de que yo dijera hola. El de Galera, solo, pesaba 51 KB. Cada sesión arrancaba leyendo una novela sobre sí misma.

El problema no era la regla, era cómo la aplicaba. Al cerrar una sesión, Claude sumaba un Estado nuevo arriba del anterior. Nadie borraba el viejo, por las dudas. Y “por las dudas”, multiplicado por veinte sesiones, es un archivo de 51 KB.

## La regla

Un solo Estado por proyecto, con fecha, de 1,5 KB como máximo. Se **reemplaza**, no se agrega. El anterior va a `HISTORIAL.md` tal cual estaba, sin resumir, porque un resumen pierde justo el dato que vas a buscar dentro de dos meses. `HISTORIAL.md` no se carga en cada sesión: se abre cuando hace falta.

## Con prueba de que no se perdió nada

Mudar texto a mano entre archivos es la forma más segura de perder una línea. Así que el traspaso lo hace un script, `peso_claude_md.py`, que no usa IA:

- `medir` dice cuánto pesa cada `CLAUDE.md`.
- `respaldar` guarda una copia antes de tocar nada.
- `verificar` comprueba que cada línea del original esté en el archivo nuevo o en el historial.

Resultado: de 133 a 57 KB entre todos los proyectos, de unos 35.000 a unos 15.000 tokens por sesión. Galera pasó de 51 a 5 KB.

## El gancho que todavía no pegué

Para que no vuelva a engordar escribí dos ganchos: uno que avisa al abrir una sesión si el archivo pasa de 6 KB, y otro que archiva los Estados de más al cerrar. Están listos. Falta pegarlos en mi configuración, y eso lo tengo que hacer yo: Claude no puede editar sus propios permisos sin mí (y está bien que no pueda). Está en mi lista de pendientes desde el 9 de noviembre.

Mientras tanto, la regla vive en mi [archivo general](contexto-general.html) y Claude la cumple al cerrar. El gancho es el cinturón; la regla escrita, los tiradores.

```text
Medí cuánto pesa cada CLAUDE.md de mis proyectos y mostrame una tabla ordenada de mayor a menor. Para cada uno que pase de 3 KB, proponé cómo dejar un solo Estado, con fecha y de 1,5 KB como máximo, y mové los Estados anteriores a un HISTORIAL.md al lado, textuales, sin resumir. Antes de tocar nada, hacé una copia de respaldo. Después de mover, comprobá con un script que ninguna línea del original se haya perdido. Mostrame el diff de cada archivo y no guardes nada sin que lo apruebe.
```
