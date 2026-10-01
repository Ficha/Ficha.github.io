# Cómo trabajo con Claude gastando menos (y mejorando cada semana)

Lo armé para pasárselo a una amiga y de paso lo dejo acá. Es lo que aprendí en unos meses de usar Claude todos los días con un plan Pro: escribir, corregir, estudiar, programar mi sitio y llevar varios proyectos a la vez sin quedarme sin cuota el martes.

Tiene tres partes: **economía de tokens** (gastar menos), **un newsletter semanal que me escribe Claude** (mejorar de a poco) e **infraestructura** (que cada semana arranque con más armado que la anterior). Al final están los prompts para llegar a algo parecido y un kit de archivos `.md` para descargar y subirle a tu Claude.

## 1. Economía de tokens

### Lo que hay que entender primero

- **Cada mensaje relee toda la conversación.** El costo de un turno crece con el largo de la sesión. Una conversación larga no solo es más cara: también sale peor, porque el modelo se pierde entre tanto contexto.
- **Escribir cuesta más que leer.** Una respuesta larga sale bastante más cara que leer un texto del mismo tamaño. Pedir "solo los cambios" ahorra mucho.
- **Todo suma:** tus mensajes, las respuestas, los archivos que lee, las búsquedas web, el razonamiento y hasta los conectores activos (cada uno carga sus definiciones aunque no lo uses).
- **Es un solo pozo.** La app, la web, Claude Code y las tareas programadas descuentan del mismo límite. Hay una ventana de 5 horas desde el primer mensaje y un límite semanal que se reinicia siempre el mismo día y hora. Fijate el tuyo en *Settings > Usage*: ese es el que se administra.

### Qué consume más (de más a menos)

1. Sesiones largas.
2. Modelos grandes (Opus gasta bastante más que Sonnet, y Sonnet más que Haiku).
3. Research y búsquedas web.
4. Archivos pesados (PDF con imágenes, escaneos).
5. Agentes y subagentes.
6. Razonamiento extendido para tareas simples.

### Las reglas que uso todos los días

**Una mesa de trabajo, no un archivo.** Sobre la mesa, solo lo que se usa ahora; el resto, destilado y guardado.

- **Un tema por sesión.** Cuando la conversación se alarga o cambia de tema, cierro con un traspaso (ver más abajo) y abro otra.
- **Sonnet por defecto.** Opus solo para pensar: estrategia, edición fina, arquitectura o un problema que Sonnet no resuelve. El que piensa planifica; el barato ejecuta.
- **Nada de PDF enteros.** Si hay un .txt, un índice o una tabla, que lea eso. Los PDF y las imágenes los convierto a texto en mi compu (con un script y OCR local) y Claude lee solo el resultado.
- **Fragmentos antes que archivos completos**, y nunca releer lo que ya está en la conversación.
- **Brief de una página.** Un documento largo que consulto seguido (una hoja de estilo, un perfil de voz, las bases de un concurso) lo destilo una vez en un `_brief.md` de una página, y de ahí en más uso ese.
- **Criterios en vez de adjetivos.** No "hacelo más dinámico", sino "máximo 120 palabras, sin gerundios, cierre con un dato".
- **Correcciones como diff:** "original → corregido", no el texto entero reescrito.
- **Editar el mensaje en vez de corregir con uno nuevo.** En claude.ai, si la respuesta salió mal, editá tu mensaje: el intento fallido deja de ocupar contexto.
- **Apagar los conectores que no se usan** en ese chat (Drive, Notion, lo que sea).
- **Tareas masivas a agentes baratos** (resumir 30 PDF, clasificar, desgrabar), con un brief cerrado y criterios explícitos. Gastan más en total, así que solo valen la pena cuando preservar la conversación principal importa.
- **Revisá lo que escriben sobre normativa.** Leyes, reglamentos, bases: ahí los modelos se equivocan con seguridad.

### El calendario

- **El día antes del reinicio semanal es oro**: lo que sobra se pierde. Ese día lo uso para infraestructura, en este orden: skills y plantillas, destilar documentos largos en briefs, investigaciones postergadas, auditorías y probar modelos más grandes donde uso uno chico.
- **De noche, tareas programadas** que dejan borradores: research recurrente, revisiones largas, lotes. Nunca envían ni publican nada.
- **Arranque temprano:** una tarea liviana a las 6 hace que la ventana de 5 horas se reinicie a las 11, y la jornada rinde dos ventanas.

## 2. El newsletter de mejora continua

Una vez por semana, una tarea programada de Claude me arma un newsletter y me lo manda. Se lee en cinco minutos y tiene:

- **Para vos:** el estado de cada proyecto y **una** acción concreta para esta semana. Lo saca de la sección "Estado" de cada proyecto (ver infraestructura) y del historial de cambios, sin leer archivos pesados.
- **Construyendo infraestructura:** qué aprendió de la semana (qué funcionó, qué se trabó, qué se repitió), hasta tres propuestas de mejora ordenadas por retorno, cada una con el **pedido listo para pegar**, y un plan para usar la cuota que sobra antes del reinicio.
- **Noticias de IA** (máximo cinco, con fuente), **tres tips de Claude** que no se repitan con las últimas cuatro ediciones y **dos tips de IA en general** para mi trabajo.

El truco está en el horario: sale **la mañana del día anterior al reinicio semanal**, así implemento las propuestas con la cuota que, si no, se perdería. Cada semana el sistema queda un poco más barato y un poco mejor.

Lo que aprendí armándolo:

- **Los estados se quedan atrás.** Si un proyecto dice "pendiente" y en realidad ya está hecho, el newsletter te recomienda algo resuelto. Hay que cruzar el "Estado" con algo real (el historial de cambios, el calendario, la carpeta).
- **Un proyecto sin sección "Estado" sale caro:** Claude tiene que reconstruir qué pasó leyendo todo.
- **La tarea solo corre con la app abierta.** Si la compu está apagada, corre cuando la abrís, y puede salir tarde. Dejá la app abierta esa mañana.
- **Tiene que poder escribir pero no actuar.** La tarea arma borradores y me los manda a mí. No publica, no envía nada a nadie más, no implementa: solo propone.

## 3. Infraestructura

Lo que hace que cada sesión arranque sabiendo quién sos y en qué estás, sin explicarlo de nuevo.

- **Un archivo de contexto general** (`CLAUDE.md` en Claude Code; en claude.ai, las instrucciones personales de *Settings*). Corto: quién sos, cómo querés que te responda, las reglas de ahorro y el mapa de proyectos. Se carga en cada conversación, así que cada línea cuesta: tiene que estar curado.
- **Un archivo por proyecto** (`CLAUDE.md` en la carpeta del proyecto, o las instrucciones de un *Project* en claude.ai) con qué es, cómo se trabaja y una sección **Estado** con fecha: qué se decidió, qué se hizo, qué sigue. Menos de 3 KB; lo viejo va a un `HISTORIAL.md` que no se carga.
- **Traspaso al cerrar.** Al terminar una sesión con avances, le pido que actualice el "Estado" del proyecto. La próxima sesión arranca de ahí y no de cero.
- **Skills para lo que se repite.** Un proceso que hice dos veces (corregir con mi hoja de estilo, preparar un parcial a partir de la bibliografía) se vuelve una skill: instrucciones que se cargan solo cuando hacen falta, en vez de engordar el archivo general.
- **Registro de versiones.** Cada proyecto tiene un `CHANGELOG.md` simple: versión 1, 2, 3, con una o tres líneas de qué cambió para quien lo usa. Sube cuando algo se entrega o se publica, no por cada edición. Sirve para que vos y Claude sepan qué está listo.
- **Antes de un entregable grande con un brief ambiguo**, que te haga primero las tres a cinco preguntas que más cambiarían el resultado. Ahorra una vuelta entera.

## 4. Los prompts para llegar a algo parecido

Van en orden. Cada uno en una sesión nueva. Si usás claude.ai en vez de Claude Code, donde dice "archivo" pensá en las instrucciones personales o en las de un *Project*.

**1. Tu archivo de contexto general**

```text
Quiero armar mi archivo de contexto general para que cada conversación arranque sabiendo quién soy. Antes de escribir nada, haceme una entrevista corta (de a 3 preguntas por vez, máximo 12 en total): a qué me dedico, en qué proyectos estoy, cómo quiero que me respondas, qué plan de Claude tengo y qué día se me reinicia el límite semanal. Después escribí el archivo usando la plantilla CLAUDE-general.md que te adjunto. Tiene que pesar menos de 3 KB: si algo no se usa en casi todas las sesiones, no va.
```

**2. La guía de economía de tokens**

```text
Te adjunto economia-tokens.md. Adaptalo a mi caso: mi plan, el día y la hora del reinicio semanal, las tareas que repito y las que podrían ir de noche como tarea programada. Dejá en mi archivo general solo un resumen de 10 líneas con las reglas diarias y que la guía completa se lea únicamente al planificar.
```

**3. Un archivo por proyecto con su "Estado"**

```text
Para cada uno de mis proyectos [lista], armá un archivo de proyecto con la plantilla CLAUDE-proyecto.md: qué es, cómo se trabaja, reglas propias y una sección Estado con la fecha de hoy (qué se decidió, qué se hizo, qué sigue). Menos de 3 KB cada uno. Preguntame lo que no sepas en vez de inventarlo.
```

**4. El traspaso al cerrar una sesión**

```text
Cerramos la sesión. Actualizá la sección Estado del archivo de este proyecto con la fecha de hoy: qué decidimos, qué se hizo y qué sigue, en 5 líneas como máximo. Si algo se entregó o publicó, sumá una versión al CHANGELOG.md. Mostrame el diff antes de guardar.
```

**5. El newsletter semanal**

```text
Creá una tarea programada que corra [el día anterior a mi reinicio semanal] a las 8 con la plantilla newsletter-semanal.md que te adjunto. Adaptá las rutas y las fuentes a mis proyectos. La tarea solo lee, arma la edición y la guarda (o me la deja como borrador en mi mail): no envía nada a nadie más, no publica y no implementa sus propias propuestas. Antes de activarla, corré una edición de prueba y mostrámela.
```

**6. Convertir un proceso repetido en skill**

```text
Esto ya lo hicimos dos veces: [proceso]. Convertilo en una skill. Escribí primero qué hace, cuándo se usa y qué criterios sigue; después el paso a paso, con los scripts que hagan falta para que lo pesado corra en mi compu y no en el contexto. Probala con un caso real y comparala con lo que hicimos a mano.
```

**7. Destilar un documento largo**

```text
Leé [documento] una sola vez y destilalo en un _brief.md de una página: lo que voy a consultar seguido, con criterios concretos y ejemplos cortos, sin resumen narrativo. De ahí en más, usá el brief y no el original.
```

**8. Auditoría mensual de la infraestructura**

```text
Revisá mis archivos de contexto (general y de proyectos) y mis skills. Decime cuáles pasan los 3 KB, qué secciones Estado tienen más de dos semanas, qué instrucciones se repiten entre archivos y qué proceso repetido todavía no es skill. Proponé los recortes como diff; no guardes nada sin que te lo apruebe.
```

## 5. El kit para descargar

Archivos `.md` para subirle a tu Claude junto con los prompts de arriba. Son plantillas: tienen `[corchetes]` donde va lo tuyo.

- [CLAUDE-general.md](kit/CLAUDE-general.md): tu contexto general, con las reglas de ahorro.
- [economia-tokens.md](kit/economia-tokens.md): la guía completa, para leer solo al planificar.
- [CLAUDE-proyecto.md](kit/CLAUDE-proyecto.md): la plantilla de cada proyecto, con su Estado.
- [newsletter-semanal.md](kit/newsletter-semanal.md): las instrucciones de la tarea programada.
- [CHANGELOG.md](kit/CHANGELOG.md): el registro de versiones.
- [guia.md](guia.md): esta misma página en Markdown.

Si tenés Claude Code, el archivo general va en `~/.claude/CLAUDE.md` (se carga en todas las sesiones) y el de cada proyecto, como `CLAUDE.md` en la carpeta del proyecto. En claude.ai, pegá el general en las instrucciones personales y el de cada proyecto en las instrucciones de su *Project*.
