# Cómo trabajo con Claude gastando menos

Esto empezó como un mensaje para una amiga que me preguntó cómo hacía para usar Claude todo el día sin quedarme sin cuota el martes. El mensaje se fue alargando (me pasa) y terminó acá.

Uso el plan Pro para casi todo: corregir, estudiar para la facultad, programar este sitio y llevar media docena de proyectos a la vez. En estos meses aprendí tres cosas que me cambiaron la forma de trabajar. La primera es cuidar los tokens, que son la moneda con la que Claude cobra. La segunda es un newsletter que Claude me escribe una vez por semana para decirme qué mejorar. La tercera es la infraestructura, que es un nombre lindo para un grupito de archivos de texto que hacen que cada conversación arranque sabiendo quién soy.

Al final dejé los prompts que usaría si tuviera que armar todo de nuevo y un kit de plantillas `.md` para descargar.

## 1. Economía de tokens

### Cómo se gasta

Lo primero que me costó entender es que Claude no tiene memoria entre mensaje y mensaje. Cada vez que le escribo, relee la conversación entera desde el principio, así que el décimo mensaje sale más caro que el primero y el quincuagésimo, bastante más. Pasadas unas horas de charla, además, empieza a mezclar lo que le pedí al principio con lo que le pido ahora. En inglés le dicen *context rot*, contexto podrido, buen nombre.

Lo segundo es que escribir le cuesta mucho más que leer. Cuando le pido que me devuelva un texto entero corregido, pago cada palabra que ya estaba bien. Si le pido solo los cambios, pago los cambios.

Y lo tercero es que todo suma: mis mensajes, sus respuestas, los archivos que abre, las búsquedas en la web, lo que razona antes de contestar y hasta los conectores que tengo prendidos (Drive, Gmail, lo que sea), que cargan sus instrucciones aunque no los use. Todo sale del mismo pozo: la app, la web, Claude Code y las tareas programadas descuentan del mismo límite. Hay una ventana de cinco horas que empieza con el primer mensaje y un límite semanal que se reinicia siempre el mismo día a la misma hora. El que hay que administrar es el semanal; el tuyo está en *Settings > Usage*.

Si tuviera que ordenar lo que más consume, de más a menos, diría: las sesiones largas, los modelos grandes (Opus gasta bastante más que Sonnet, y Sonnet más que Haiku), el research y las búsquedas web, los PDF pesados o escaneados, los agentes y el razonamiento extendido usado para cosas simples.

### Mis reglas de todos los días

Pienso el contexto como el escritorio de mi casa. Si apilo encima todo lo que alguna vez voy a necesitar, termino trabajando en una esquinita y sin encontrar nada. Arriba dejo lo que estoy usando ahora; lo demás va a cajones etiquetados.

En la práctica, eso se traduce en unas cuantas costumbres:

- Una conversación por tema. Cuando se alarga o se desvía, le pido que deje anotado dónde quedamos (más abajo explico cómo) y abro otra.
- Sonnet para casi todo. A Opus lo llamo cuando hay que pensar en serio: una estrategia, una edición fina, un problema que Sonnet no logra resolver. Opus planifica y Sonnet ejecuta.
- Nunca le paso un PDF entero si puedo darle texto. Los apuntes de la facultad los convierto a texto en mi compu, con un script y OCR, y Claude lee solo el resultado.
- Fragmentos antes que archivos completos, y nada de releer lo que ya está en la conversación.
- Los documentos largos que consulto seguido (mi hoja de estilo, el perfil de voz de mi newsletter, las bases de un concurso) los destilo una sola vez en un brief de una página, un `_brief.md`, y de ahí en más trabajo con ese.
- Criterios en vez de adjetivos. “Hacelo más dinámico” no le dice nada; “máximo 120 palabras, sin gerundios, que cierre con un dato” le dice todo.
- Las correcciones, en formato “original → corregido”.
- En claude.ai, si una respuesta salió mal, edito mi mensaje en vez de mandar otro corrigiendo. El intento fallido desaparece y deja de ocupar lugar.
- Apago los conectores que no voy a usar en esa conversación.
- Las tareas masivas (resumir treinta PDF, clasificar, desgrabar) se las doy a agentes baratos con instrucciones cerradas. Ojo que en total gastan más, así que los uso solo cuando quiero que la conversación principal quede limpia.
- Todo lo que escriben sobre normativa lo reviso. Leyes, reglamentos, bases de convocatorias: ahí se equivocan con una seguridad envidiable.

### El calendario

El día anterior al reinicio semanal le saco todo el jugo que le queda, porque la cuota que sobra se pierde. Ese día lo dedico a la infraestructura, más o menos en este orden: skills y plantillas, briefs de documentos largos, investigaciones que vengo postergando, auditorías y alguna prueba con un modelo más grande donde suelo usar uno chico.

De noche corren tareas programadas que me dejan borradores: research que se repite, revisiones largas, trabajo en lote. Ninguna envía ni publica nada; a la mañana leo y decido.

Y un truco que todavía me parece medio trampa: si una tarea liviana corre a las seis de la mañana, la ventana de cinco horas se reinicia a las once, y el día rinde dos ventanas.

## 2. El newsletter de mejora continua

Escribo un newsletter hace cinco años, así que era cuestión de tiempo que me armara uno para mí. Cada semana, una tarea programada de Claude junta lo que pasó en mis proyectos, lo cruza con las novedades de IA y me manda un mail que se lee en cinco minutos.

Arranca con una sección que se llama “Para vos”: una línea por proyecto con su estado y una sola acción concreta para esta semana (una sola, porque si me pone cinco no hago ninguna). La saca de unos archivos de estado que explico en la parte de infraestructura, sin abrir nada pesado.

Después viene “Construyendo infraestructura”, que es la razón de ser del newsletter. Ahí me cuenta qué funcionó en la semana, qué se trabó y qué tuve que explicar dos veces, y me propone hasta tres mejoras ordenadas según cuánto rinden, cada una con el pedido listo para pegar. También me arma un plan para usar la cuota que sobra antes del reinicio. Cierra con noticias de IA (cinco como máximo, con fuente), tres tips de Claude que no se repitan con las últimas cuatro ediciones y dos de IA en general.

El horario lo elegí para que salga la mañana del día anterior al reinicio. Así, las mejoras que propone las hago con la cuota que de todos modos iba a perder y cada semana el sistema queda un poco más barato que la anterior.

Las propuestas me las deja escritas y las ejecuto yo, si me convencen. La tarea no toca mis proyectos, no publica nada y el único mail que manda es a mí.

Armándolo aprendí un par de cosas por las malas. Los estados de los proyectos envejecen rápido: si un archivo dice “pendiente” y en realidad ya lo terminé, el newsletter me recomienda hacer algo hecho, así que conviene que lo cruce con algo más confiable, como el historial de cambios. Un proyecto sin estado anotado sale caro, porque Claude tiene que reconstruir lo que pasó leyendo todo. Y la tarea solo corre con la app abierta: la segunda edición me llegó tarde, el día después del reinicio, y la cuota sobrante se perdió igual.

## 3. Infraestructura

Lo que más me ahorró fue dejar de explicarle a Claude quién soy en cada conversación. Para eso uso unos pocos archivos de texto.

El primero es el contexto general: en Claude Code es un `CLAUDE.md` en la carpeta de usuario; en claude.ai, las instrucciones personales de *Settings*. Dice quién soy, cómo quiero que me responda, las reglas de ahorro y una tabla con mis proyectos. Se carga en todas las conversaciones, así que cada línea se paga siempre; lo tengo podado por debajo de los 3 KB.

Después, cada proyecto tiene su propio archivo (un `CLAUDE.md` en la carpeta, o las instrucciones de un *Project* en claude.ai) con qué es, cómo se trabaja y una sección “Estado” con fecha: qué decidí, qué hice, qué sigue. Cuando crece, lo viejo pasa a un `HISTORIAL.md` que no se carga.

Al cerrar una sesión en la que avancé, le pido que actualice ese estado. Es el traspaso: la próxima conversación arranca donde quedó esta, y no de cero.

Los procesos que repetí dos veces se vuelven skills, que son instrucciones que Claude carga solo cuando las necesita. Tengo una para corregir mis textos con mi hoja de estilo y otra que, a partir de la bibliografía de una materia, me arma los apuntes y el plan de estudio para un parcial. Si esas instrucciones vivieran en el archivo general las pagaría en cada mensaje.

Cada proyecto lleva también un `CHANGELOG.md` mínimo: versión 1, 2, 3, con una a tres líneas sobre qué cambió. Sube cuando algo se entrega o se publica y nos sirve a los dos (a Claude y a mí) para saber qué está listo.

Y una costumbre más: cuando le encargo algo grande con un brief difuso, le pido que antes me haga las tres a cinco preguntas que más cambiarían el resultado. Me ahorra una vuelta entera.

## 4. Los prompts para llegar a algo parecido

Van en orden y cada uno en una conversación nueva. Si usás claude.ai en vez de Claude Code, donde dice “archivo” leé “instrucciones personales” o “instrucciones del *Project*”.

**1. El archivo de contexto general**

```text
Quiero armar mi archivo de contexto general para que cada conversación arranque sabiendo quién soy. Antes de escribir nada, haceme una entrevista corta (de a 3 preguntas por vez, máximo 12 en total): a qué me dedico, en qué proyectos estoy, cómo quiero que me respondas, qué plan de Claude tengo y qué día se me reinicia el límite semanal. Después escribí el archivo usando la plantilla CLAUDE-general.md que te adjunto. Tiene que pesar menos de 3 KB: si algo no se usa en casi todas las sesiones, no va.
```

**2. La guía de economía de tokens**

```text
Te adjunto economia-tokens.md. Adaptalo a mi caso: mi plan, el día y la hora del reinicio semanal, las tareas que repito y las que podrían correr de noche como tarea programada. En mi archivo general dejá solo un resumen de 10 líneas con las reglas diarias, y que la guía completa se lea únicamente al planificar.
```

**3. Un archivo por proyecto, con su estado**

```text
Para cada uno de mis proyectos [lista], armá un archivo de proyecto con la plantilla CLAUDE-proyecto.md: qué es, cómo se trabaja, reglas propias y una sección Estado con la fecha de hoy (qué se decidió, qué se hizo, qué sigue). Menos de 3 KB cada uno. Lo que no sepas, preguntámelo en vez de inventarlo.
```

**4. El traspaso al cerrar una sesión**

```text
Cerramos acá. Actualizá la sección Estado del archivo de este proyecto con la fecha de hoy: qué decidimos, qué se hizo y qué sigue, en 5 líneas como máximo. Si algo se entregó o se publicó, sumá una versión al CHANGELOG.md. Mostrame el diff antes de guardar.
```

**5. El newsletter semanal**

```text
Creá una tarea programada que corra [el día anterior a mi reinicio semanal] a las 8 con la plantilla newsletter-semanal.md que te adjunto. Adaptá las rutas y las fuentes a mis proyectos. La tarea lee, arma la edición y la guarda (o me la deja como borrador en mi mail); no le escribe a nadie más, no publica y no ejecuta sus propias propuestas. Antes de activarla, corré una edición de prueba y mostrámela.
```

**6. Convertir un proceso repetido en skill**

```text
Esto ya lo hicimos dos veces: [proceso]. Convertilo en una skill. Primero escribí qué hace, cuándo se usa y qué criterios sigue; después el paso a paso, con los scripts que hagan falta para que lo pesado corra en mi compu y no en la conversación. Probala con un caso real y comparala con lo que hicimos a mano.
```

**7. Destilar un documento largo**

```text
Leé [documento] una sola vez y destilalo en un _brief.md de una página: lo que voy a consultar seguido, con criterios concretos y ejemplos cortos, sin resumen narrativo. De ahora en más, trabajá con el brief y dejá el original.
```

**8. La auditoría de cada tanto**

```text
Revisá mis archivos de contexto (el general y los de proyectos) y mis skills. Decime cuáles pasan los 3 KB, qué secciones Estado tienen más de dos semanas, qué instrucciones se repiten entre archivos y qué proceso repetido todavía no es skill. Proponé los recortes como diff y no guardes nada sin que te lo apruebe.
```

## 5. El kit para descargar

Son plantillas para subirle a tu Claude junto con los prompts de arriba. Donde hay `[corchetes]` va lo tuyo.

- [CLAUDE-general.md](kit/CLAUDE-general.md), el contexto general con las reglas de ahorro.
- [economia-tokens.md](kit/economia-tokens.md), la guía completa, para leer solo al planificar.
- [CLAUDE-proyecto.md](kit/CLAUDE-proyecto.md), la plantilla de cada proyecto, con su estado.
- [newsletter-semanal.md](kit/newsletter-semanal.md), las instrucciones de la tarea programada.
- [CHANGELOG.md](kit/CHANGELOG.md), el registro de versiones.
- [guia.md](guia.md), esta misma página en Markdown.

Si usás Claude Code, el archivo general va en `~/.claude/CLAUDE.md` y el de cada proyecto, como `CLAUDE.md` dentro de su carpeta. En claude.ai, el general se pega en las instrucciones personales y el de cada proyecto, en las instrucciones de su *Project*.

Nada de esto salió bien de entrada. Lo fui armando de a una semana por vez, que es justamente lo que el newsletter está para recordarme.
