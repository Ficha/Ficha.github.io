# Cómo organizar tus proyectos con Claude Code

Una guía práctica, sin datos de nadie en particular, para usar Claude Code con muchos proyectos sin quedarte sin cuota ni perder el hilo. Al final hay plantillas para copiar y una entrevista para que Claude adapte todo a vos.

---

## 0. Cómo usar este documento

1. **Guardalo en tu carpeta de proyectos**, la carpeta madre donde están todos tus proyectos, con este nombre: `_guia-claude.md`. El guion bajo indica que es un archivo interno, de consulta.
2. **No lo conviertas en tu `CLAUDE.md` ni le pidas a Claude que lo lea en cada sesión.** Es largo a propósito: se lee una vez, se usa para configurar todo y después queda guardado. (Por qué importa: sección 2.)
3. **Abrí una sesión nueva de Claude Code en esa carpeta madre**, elegí el modelo Opus para esta única vez (diseñar el sistema es trabajo de pensar) y pegá el prompt de la **sección 9**. Claude te va a entrevistar, va a mirar lo que ya tenés y te va a proponer los cambios de a uno. Nada se guarda sin que digas que sí.
4. Cuando termine la entrevista, volvé a **Sonnet** para el día a día.

Si algo de lo que sigue no se aplica a tu forma de trabajar, ignoralo: la entrevista sirve justamente para quedarte con lo que te sirve.

---

## 1. Glosario

Términos que aparecen en la guía. No hace falta saber programar: Claude escribe y corre los comandos, y vos aprobás.

| Término | Qué es |
|---|---|
| **Claude Code** | La versión de Claude que trabaja directamente sobre las carpetas de tu compu: lee, crea y edita archivos y corre programas. En la app de escritorio es la pestaña **Code**. |
| **claude.ai** | El chat de Claude en la web o la app, que sirve para conversar. Comparte la cuota con Claude Code. |
| **Sesión** | Una conversación con Claude. Cada sesión arranca sin recordar las anteriores, salvo lo que esté escrito en archivos. |
| **Contexto** | Todo lo que Claude tiene “sobre la mesa” en una sesión: tus mensajes, sus respuestas, los archivos que abrió y las instrucciones que se cargan solas. |
| **Token** | La unidad en la que se mide lo que Claude lee y escribe (más o menos ¾ de una palabra). La cuota se gasta en tokens. |
| **Cuota o límite** | Cuánto podés usar Claude. Hay una ventana de 5 horas y un límite semanal. Los ves en *Settings > Usage*. |
| **Modelo** | La “versión” de Claude que contesta. De más chico y barato a más grande y caro: **Haiku**, **Sonnet**, **Opus** (y Fable, el más grande). Se elige en el selector de la app. |
| **Esfuerzo** | Cuánto razona Claude antes de contestar. Más esfuerzo = mejores decisiones complejas, pero más gasto. |
| **Markdown (`.md`)** | Texto plano con marcas simples: `#` para títulos, `**negrita**`, `-` para listas. Lo lee cualquier programa y Claude lo maneja mejor y más barato que un `.docx`. |
| **`CLAUDE.md`** | Un archivo de instrucciones que Claude Code lee solo, al empezar cada sesión. Hay uno **general** (para todo) y uno **por proyecto**. |
| **Carpeta madre o raíz** | La carpeta que contiene todas tus carpetas de proyectos. |
| **Ruta** | La dirección de un archivo. **Absoluta**: completa, desde el disco (`C:\Users\vos\Proyectos\101-tesis\CLAUDE.md`). **Relativa**: desde donde estás parado (`101-tesis\CLAUDE.md`). |
| **`~`** | Abreviatura de tu carpeta de usuario (en Windows, `C:\Users\tu-usuario`). `~/.claude/` es la carpeta de configuración de Claude Code. |
| **Terminal o shell** | La ventana donde se escriben comandos de texto. Claude la usa por vos; no la tenés que aprender. |
| **Script** | Un programa corto que hace una tarea mecánica: convertir, renombrar, contar. Lo que hace un script corre en tu compu y **no gasta cuota**. |
| **Python** | Un lenguaje de programación muy usado para scripts. Si no lo tenés instalado, Claude te puede guiar. |
| **OCR** | Reconocimiento de texto en imágenes o PDF escaneados. Tesseract es un programa gratuito que lo hace en tu compu. |
| **Conector (MCP)** | Una conexión de Claude con otro servicio (Drive, Gmail, Calendar, Notion…). Cada conector prendido carga sus instrucciones en cada sesión, aunque no lo uses. |
| **Skill** | Una carpeta con instrucciones (y a veces scripts) para una tarea que repetís. Claude la carga **solo cuando hace falta**. |
| **Subagente** | Un ayudante que Claude lanza para una tarea aparte (resumir 30 archivos, por ejemplo). Trabaja en su propio contexto y le devuelve el resultado. |
| **Tarea programada** | Un pedido que Claude ejecuta solo, a una hora fija. |
| **Permisos y `settings.json`** | Qué puede hacer Claude sin preguntarte (leer, editar, correr ciertos comandos). Se guardan en `~/.claude/settings.json`. |
| **Diff** | La lista de cambios entre dos versiones de un archivo: qué se sacó y qué se agregó. Revisar un diff es más rápido que releer todo. |
| **Git, repositorio, GitHub** | Git guarda el historial de cambios de una carpeta (un *repositorio*). Cada guardado es un *commit*. GitHub es un sitio donde se suben repositorios. Solo hace falta si programás o publicás algo. |
| **`CHANGELOG.md`** | Un registro corto de versiones: qué cambió en cada entrega. |
| **KB** | Kilobyte. Sirve de medida para los archivos de instrucciones: 3 KB son unas 450 palabras. |
| **Memoria** | Notas que Claude Code guarda solo, atadas a la ruta de la carpeta donde trabajás. Si renombrás la carpeta, la memoria “se pierde” (hay que mudarla). |

---

## 2. Cómo se gasta la cuota

Tres ideas que lo explican casi todo:

1. **Claude no tiene memoria entre mensajes.** Cada vez que le escribís, relee la conversación entera. El mensaje 10 sale más caro que el 1, y el 50, mucho más. Además, en las sesiones muy largas empieza a mezclar lo viejo con lo nuevo (en inglés le dicen *context rot*).
2. **Escribir le cuesta mucho más que leer.** Si le pedís un texto entero corregido, pagás cada palabra que ya estaba bien. Si le pedís solo los cambios, pagás los cambios.
3. **Todo suma:** tus mensajes, sus respuestas, los archivos que abre, las búsquedas web, lo que razona y los conectores prendidos.

**Lo que mostró una auditoría real de una semana de uso** (medida sobre las sesiones de una persona):
- **Releer el contexto fue el 59 % del gasto**, escribir caché el 26 % y las respuestas solo el 15 %. O sea: lo que más cuesta no es lo que Claude escribe, sino lo que vuelve a leer en cada mensaje.
- **El largo de la sesión manda:** una sesión de 270 mensajes costó más que tres de 90.
- **El modelo grande fue el 78 % del gasto**, casi todo ejecutando tareas mecánicas que un modelo chico hacía igual.
- **Dos días concentraron el 77 %** de la semana: arrancar varios proyectos grandes juntos vacía la cuota en dos días.
- **Un panel de 11 asesores consumió el 16 %** de la semana en una sola sesión. Con 3 o 4 alcanza.

**Un solo pozo.** La app, la web, Claude Code y las tareas programadas descuentan del mismo límite. Hay una ventana de 5 horas, que empieza con tu primer mensaje, y un límite semanal que se reinicia siempre el mismo día a la misma hora. El que hay que administrar es el semanal. Algunos conectores tienen además su propio cupo (por ejemplo, pocas llamadas por mes en planes gratuitos).

**Qué consume más, de mayor a menor:**
1. Sesiones largas.
2. Modelos grandes (Fable/Opus > Sonnet > Haiku).
3. Research y búsquedas web.
4. Archivos pesados (PDF escaneados o con imágenes).
5. Agentes y subagentes.
6. Razonamiento extendido usado en tareas simples.

**La cuota que sobra no se acumula: se pierde** el día del reinicio. Por eso conviene planificar qué hacer con ella (sección 3).

---

## 3. Economía de tokens: las reglas

Principio: **el contexto es una mesa de trabajo, no un archivo.** Sobre la mesa, solo lo que se usa ahora; el resto, destilado y guardado en cajones con etiqueta.

### Código antes que IA
Lo que se repite y tiene reglas claras (capturar, clasificar por patrones, sincronizar, avisar, chequear) va en un **script o una tarea programada**, que corren en tu compu y **no gastan cuota**. La IA queda para lo que pide criterio: redactar, priorizar, editar. Al diseñar algo nuevo, pedile a Claude que **proponga primero la versión con reglas fijas** y que use IA solo donde de verdad haga falta.

### Un dato, un lugar
Cada información vive en **un solo archivo fuente** (tu agenda, tus pendientes, tu lista de proyectos). Todo lo demás (avisos, tableros, resúmenes) lo lee de ahí y no guarda copia propia. Así no hay versiones que se contradicen y Claude no gasta en reconciliarlas.

### Lo que entra
- **Texto antes que PDF.** Nunca le pases un PDF, un `.docx` o una imagen entera si podés darle texto. Pedile a Claude que los convierta en tu compu con un script (y OCR para los escaneados) y que lea solo el resultado. Un PDF escaneado de 40 páginas puede costar más que una semana de conversaciones.
- **Fragmentos antes que archivos completos.** Que busque la parte que necesita en vez de leer todo, y que no relea lo que ya está en la conversación.
- **Archivos grandes (más de unos 20 KB): búsqueda y fragmentos, nunca enteros.** Pedile que busque la parte y lea solo ese tramo. Un archivo de 80 KB leído entero se paga otra vez en cada mensaje de la sesión.
- **Web: una dirección concreta antes que una búsqueda.** El research amplio, solo para investigación de verdad.
- **Destilar lo que consultás seguido.** Un documento largo que usás todo el tiempo (hoja de estilo, bases de un concurso, reglamento) se lee una sola vez y se resume en un `_brief.md` de una página dentro del proyecto. De ahí en más se usa el brief.
- **Apagar los conectores** que no vas a usar en esa sesión.

### Lo que sale
- **Cambios, no reescrituras.** Para correcciones, el formato “original → corregido”.
- **Respuestas cortas**, sin resúmenes de lo que ya se ve en los archivos.
- **Criterios en vez de adjetivos.** “Hacelo más dinámico” no le dice nada; “máximo 120 palabras, sin gerundios, que cierre con un dato” le dice todo y evita vueltas.

### Modelos y esfuerzo
- **Sonnet por defecto.** Sirve para casi todo: escribir, corregir, ordenar archivos, programar.
- **Opus para pensar:** estrategia, edición fina, diseñar algo nuevo, un problema que Sonnet no resuelve. Una buena combinación es planificar con Opus y ejecutar con Sonnet.
- **Haiku para lo chico y repetido:** clasificar, extraer un dato, revisar un formato.
- **Que Claude te avise, que no cambie solo.** Dejá escrito en tu `CLAUDE.md` que te diga cuándo una tarea pide Opus; el cambio lo hacés vos.
- **En Opus, planear y soltar.** Cuando el plan está listo, que Claude te avise en una línea (“Plan listo: pasá a Sonnet para ejecutar”). Si seguís en Opus, la ejecución mecánica (ediciones en lote, commits, scripts, pruebas) va a subagentes Sonnet con instrucciones cerradas. Sesiones enteras en el modelo grande haciendo tareas mecánicas fueron la mayor fuga de la auditoría.
- **Esfuerzo bajo para tareas mecánicas**, sobre todo en los subagentes con instrucciones cerradas.
- **Los subagentes gastan más en total**, no menos. Usalos para mantener limpia la conversación principal (por ejemplo, para una investigación ruidosa), no para ahorrar.

### Sesiones
- **Un tema por sesión, abierta en la carpeta del proyecto** (no en la carpeta madre), salvo que el tema cruce varios proyectos.
- **Tope de sesión: unos 80 mensajes o unos 150 mil tokens de contexto.** Al llegar, cerrá con un traspaso (sección 4) y abrí otra; no sigas de largo. Cada mensaje relee todo, así que una sesión larga cuesta mucho más que varias cortas y además empieza a mezclar lo viejo con lo nuevo.
- **Un proyecto grande por día.** Si querés arrancar varios a la vez, repartilos en la semana; juntarlos vacía la cuota en dos días.
- **Consultas a varios asesores (paneles): 3 o 4, no 11.** Cada subagente arranca en frío y vuelve a pagar su contexto: conviene para tareas grandes y aisladas, no para pasos chicos.
- **Planes largos, en bloques cortos.** Para un proyecto que avanza de a poco, una `HOJA-DE-RUTA.md` con bloques de unos 30 minutos, **un solo próximo paso** arriba de todo, una barra de avance que solo crece, un “Dónde quedé” al cerrar cada bloque y un “terminado cuando…” por bloque. Sin rachas ni castigos: sirve para sentir que siempre avanzás.
- **Preguntas antes que vueltas.** Ante un encargo grande con instrucciones difusas, pedile primero las 3 a 5 preguntas que más cambiarían el resultado.
- **Lotes en un solo pedido.** Diez piezas parecidas van juntas, con las mismas instrucciones, no en diez sesiones.
- **Los archivos que se cargan siempre, cortos.** Cada línea del `CLAUDE.md` se paga en cada sesión: menos de 3 KB.
- **Los procesos repetidos, a skills** (se cargan solo cuando hacen falta), no a instrucciones largas en el `CLAUDE.md`.

### Calendario de la semana
- **Mirá tu plan y tu día de reinicio** en *Settings > Usage*, y anotalo en tu `CLAUDE.md`. Todo se organiza alrededor de esa fecha.
- **El día antes del reinicio**, usá lo que sobra, en este orden:
  1. Infraestructura: skills, hojas de estilo destiladas, plantillas.
  2. Destilar documentos largos en briefs de una página.
  3. Investigaciones que venías postergando.
  4. Revisiones: archivos de contexto, skills, textos propios.
  5. Calibrar modelos: probar si una tarea sale igual con un modelo más chico.
- **De noche, tareas programadas** para lo pesado que puede esperar (siempre como borradores; ver sección 7).
- **Truco de la ventana:** si una tarea liviana corre a las 6, la ventana de 5 horas se reinicia a las 11, y el día rinde dos ventanas.

### Medir con datos propios
Al final de una sesión larga, pedile que te explique tu uso (“explicame en qué se fue la cuota de esta sesión”). Si tu versión tiene la skill `explain-usage`, arma un gráfico. Sirve para ajustar estos hábitos con números tuyos.

Mejor aún: una vez por semana, un script (o una tarea programada) que sume el gasto de las sesiones y agregue una fila a un `_gasto-tokens.csv`, para comparar con la semana anterior. Columnas útiles: semana, turnos, sesiones, % de modelo grande, contexto promedio, % de releer y % de subagentes. **Metas de partida** (ajustalas a tus números): modelo grande por debajo del 40 % del gasto, contexto promedio por mensaje por debajo de 90 mil tokens y ninguna sesión por encima del 8 % del gasto semanal.

---

## 4. Organización: archivos y carpetas

### El archivo general (`~/.claude/CLAUDE.md`)
Se carga en **todas** las sesiones, en cualquier carpeta. Dice quién sos, cómo querés que te responda, tus reglas de economía de tokens y el mapa de tus proyectos. **Menos de 3 KB.** Plantilla en la sección 8.

### Un archivo por proyecto (`CLAUDE.md` dentro de cada carpeta)
Dice qué es el proyecto, cómo se trabaja ahí, sus reglas propias y una sección **Estado** con fecha:
- **Decidido:** las decisiones vigentes.
- **Hecho:** lo último que se terminó.
- **Sigue:** la próxima acción concreta.
- **Pendiente:** lo que espera una decisión tuya.

### El traspaso: el hábito que más rinde
Al cerrar una sesión en la que avanzaste, pedile a Claude que actualice el Estado. La próxima sesión arranca donde quedó esta y no de cero. Sin Estado, Claude tiene que reconstruir todo leyendo archivo por archivo, y eso se paga.

Dos cuidados:
- **Los Estados envejecen.** Si dice “pendiente” algo que ya hiciste, Claude te va a recomendar hacerlo de nuevo. Mantenelos al día.
- **El Estado dice lo que creés, no lo que es.** Lo que se puede verificar (que un archivo exista, que algo esté sincronizado), se verifica.

### Lo viejo, a otro archivo
Cuando el Estado crece, lo que ya no está vivo pasa a un `HISTORIAL.md` al lado, que no se carga. Así el `CLAUDE.md` del proyecto sigue por debajo de 3 KB.

### Versiones (`CHANGELOG.md`)
Un registro mínimo en cada proyecto: `## v1 · 2026-10-08` y debajo una a tres líneas sobre qué cambió, en lenguaje sencillo. La versión sube cuando algo **se entrega o se publica**, no por cada edición. Sirve para saber qué está listo.

### Nombres fijos para las carpetas
Con pocos proyectos da igual; con muchos, no. Un sistema que funciona:
- **Un número fijo de tres cifras por proyecto**, donde la centena es el área (por ejemplo: 1 estudio, 2 escritura, 3 trabajo, 4 personal). El número no se reutiliza aunque el proyecto se archive.
- **Formato `NNN-area-nombre`**, en minúsculas, sin tildes ni espacios: `101-estudio-tesis`, `201-escritura-cuentos`, `401-personal-viajes`. Los espacios y las tildes rompen scripts.
- **Dentro de cada proyecto:** los archivos fijos en mayúsculas (`CLAUDE.md`, `CHANGELOG.md`, `HISTORIAL.md`, `PLAN.md`); los internos con guion bajo (`_brief.md`, `_txt/`); los fechados con la fecha primero (`2026-10-08-reunion.md`), así se ordenan solos.
- El número va en el título del `CLAUDE.md` de cada proyecto (`# 201 · Cuentos`) y en el mapa del archivo general. Después alcanza con decir “el 201”.

**Hacelo al principio o con un plan.** Renombrar una carpeta obliga a actualizar las rutas en todos lados: archivos de contexto, skills, tareas programadas y configuraciones. Además, la memoria de Claude Code está atada a la ruta y hay que mudarla. Si ya tenés carpetas con otros nombres, la migración se hace **de a una carpeta por vez y verificando cada paso**.

### Briefs
Un buen `_brief.md` tiene lo que vas a consultar seguido (no un resumen del documento), criterios concretos con ejemplos cortos y nada de narrativa. Si reemplazás un brief por otro, actualizá los lugares que lo nombran.

Si escribís con voz propia, el brief más útil es un **manual de voz**: cómo arrancás, cómo cerrás, qué palabras usás y cuáles nunca, cómo armás las listas. Así Claude corrige en tu voz sin releer todos tus textos.

---

## 5. Hábitos de todos los días

- Una sesión por tema, con traspaso al cerrar.
- Texto antes que PDF; fragmentos antes que archivos completos.
- Criterios en vez de adjetivos.
- Correcciones en formato “original → corregido”.
- Lotes en un solo pedido.
- Preguntas antes que vueltas en los encargos grandes.
- Conectores apagados si no se usan.
- **Desconfiar de la normativa y los datos oficiales** (leyes, reglamentos, bases de convocatorias, feriados, fechas): ahí Claude se equivoca con mucha seguridad. Pedile la fuente oficial con link, y verificala vos.
- **Construir menos.** Para cada proyecto nuevo, una pregunta antes de empezar: ¿cuánta plata o cuántas horas me ahorra esta semana? Si la respuesta es “ninguna”, es un hobby: está bien, pero que no gaste la cuota de lo que sí rinde.
- **Mostrame antes de guardar:** para todo lo importante, pedí ver el diff antes de que escriba.

### Prompts para copiar

**Arrancar un encargo grande**
```text
Antes de empezar: este es un pedido grande y el brief no está cerrado. Haceme las tres a cinco preguntas que más cambiarían el resultado, de a una, y recién después proponé un plan corto. Cuando trabajes, leé solo los fragmentos que necesites y devolveme los cambios como “original → corregido”, no el texto entero.
```

**Planear antes de construir (grill me)**
```text
Quiero [idea o decisión]. Antes de proponer nada, entrevistame en rondas numeradas de tres preguntas. En cada pregunta, sumá tu respuesta recomendada y por qué, así puedo contestar “sí” o corregirte. Al terminar, resumí lo decidido en una página y marcá lo que sigue abierto.
```

**Cerrar una sesión (traspaso)**
```text
Cerramos acá. Actualizá la sección Estado del CLAUDE.md de este proyecto con la fecha de hoy: qué decidimos, qué se hizo y qué sigue, en cinco líneas como máximo. Lo que ya no está vivo pasalo a HISTORIAL.md. Si algo se entregó o se publicó, sumá una versión al CHANGELOG.md. Mostrame el diff antes de guardar.
```

**Destilar un documento**
```text
Leé [documento] una sola vez y destilalo en un _brief.md de una página: lo que voy a consultar seguido, con criterios concretos y ejemplos cortos, sin resumen narrativo. Después buscá qué archivos o skills nombran el documento original y proponé cambiar esos punteros al brief. De ahora en más, trabajá con el brief.
```

**Convertir PDF a texto**
```text
En esta carpeta hay PDF y .docx. Convertilos a .txt en una subcarpeta _txt/ con un script que corra en mi compu (con OCR en español para los escaneados). Si me falta instalar algo, explicame qué es y pedime permiso antes. De ahora en más, leé solo los .txt.
```

**Revisar el gasto**
```text
Te paso cómo uso Claude en una semana típica: [qué tareas, cuánto duran, con qué modelo]. Mi plan es [plan] y el límite se reinicia los [día] a las [hora]. Decime qué es lo que más cuota me consume y proponé tres cambios concretos, ordenados por cuánto ahorran, sin perder calidad en lo que importa.
```

---

## 6. Calidad y seguridad

### Qué puede hacer solo y qué no
Decidilo desde el principio y escribilo en el archivo general. Una base razonable:
- **Sin preguntar:** leer, buscar, proponer, escribir borradores dentro de tus carpetas.
- **Siempre preguntando:** publicar, enviar mails o mensajes, borrar, mover o renombrar carpetas, gastar plata, cambiar configuraciones.
- **Textos firmados por vos:** que te pregunte antes de escribir la versión final.

### Tres archivos para no repetir errores
Un sistema mínimo, con una regla: si una pieza no se usa en un mes, se saca.

1. **`CRITERIOS.md`: qué significa “terminado”**, por tipo de entregable. Por ejemplo: un texto firmado está terminado cuando pasó la corrección, está en tu voz y lo aprobaste; un dato normativo, cuando tiene fuente oficial con link y fecha y se verificó contra esa fuente.
2. **`NO-CONFORMIDADES.md`: registro de errores.** Todo error que llega a un archivo o a un entregable se anota en una línea: fecha, proyecto, qué pasó, causa, corrección, **qué cambia para que no se repita** y si está abierto o cerrado. La columna que importa es la de “qué cambia”.
3. **Riesgos (opcional):** una página con lo que puede salir mal y qué hacés si pasa (un borrado, la compu que se rompe, la cuota que se termina antes de una entrega).

Si la regla “todo error se anota en `NO-CONFORMIDADES.md`” está en el archivo general, Claude la sigue solo. Plantillas en la sección 8.

### Lecciones que salieron caras
- Los lotes que mueven o escriben archivos van de a uno, o con un control de error en cada paso: un lote que falla a la mitad puede seguir de largo.
- Antes de correr un script que escribe, leer cómo se usa (algunos ejecutan de verdad cuando solo querías ver la ayuda).
- **Sincronizar no es hacer backup.** Si borrás algo en una compu sincronizada, se borra en la otra. Un backup de verdad sigue la regla 3-2-1: tres copias, en dos soportes distintos, una fuera de casa.

---

## 7. Avanzado (opcional, cuando lo básico ya ande)

### Skills
Una skill es una carpeta con un archivo `SKILL.md` (qué hace, cuándo se usa, el paso a paso) y, si hace falta, scripts. **Regla: lo que hiciste dos veces se vuelve skill.**
- Las personales van en `~/.claude/skills/` y sirven en todos los proyectos; las de un proyecto, en `.claude/skills/` dentro de su carpeta.
- La **descripción** importa: es lo que Claude lee para decidir si la carga.
- Todo lo mecánico (convertir, renombrar, contar, validar) va a scripts, que no gastan cuota.
- Probala con un caso real, comparala con lo que hiciste a mano y ajustala después de cada uso.
- Ejemplos típicos: corregir textos con tu hoja de estilo, preparar material de estudio a partir de una bibliografía, armar un tipo de documento que repetís.

```text
Esto ya lo hicimos dos veces: [proceso]. Convertilo en una skill. Primero escribí qué hace, cuándo se usa y qué criterios sigue; después el paso a paso, con los scripts que hagan falta para que lo pesado corra en mi compu y no en la conversación. Si lanza subagentes para lotes, que vayan con esfuerzo bajo. Probala con un caso real.
```

### Skills de otras personas
Hay catálogos con cientos de skills. Instalá pocas y de a una, y leé qué hacen antes de activarlas: cada una suma instrucciones y a veces scripts que corren en tu compu. Instalar treinta de golpe termina en un puñado que se usa de verdad y el resto estorba. Claude no debería correr instaladores de terceros por su cuenta (por ejemplo, un `npx`): que te muestre el comando y qué instala, y lo corrés vos. Una skill que solo usás en un proyecto va en ese proyecto, no en la carpeta general.

### Planear antes de construir
- **Entrevista tipo “grill me”:** Claude te pregunta en rondas numeradas, cada pregunta con su respuesta recomendada, hasta cerrar el plan (prompt en la sección 5). Es más barato que corregir una construcción mal pensada.
- **Wayfinder:** para un trabajo que no entra en una sesión, un mapa de decisiones pendientes (una por ticket) y un solo siguiente paso. Se planea sin ejecutar; cada sesión resuelve un ticket y deja anotado dónde quedó.
- **Asesores ficticios:** personajes con nombre, área y bibliografía (diseño, derecho, biología, lo que necesites) que revisan tu trabajo desde su ángulo. Convocá a 3 o 4, con un orquestador en Sonnet, y verificá sus cifras contra el código o la fuente. Un asesor puede equivocarse con total seguridad.
- **“No confirmado” no autoriza a borrar.** Si un ayudante no pudo verificar que algo existe, eso no es permiso para eliminarlo: se avisa y se decide.

### Sitios y apps: diseño y accesibilidad
- **Revisiones de diseño con fuente.** Pedí que cada observación cite la guía en la que se apoya (las pautas de la plataforma, WCAG) y que revise pocos archivos por vez.
- **Accesible desde el principio**, no al final: zonas táctiles de al menos 44 px, contraste suficiente (4,5:1 en texto común), `prefers-reduced-motion` para las animaciones, el color nunca como única señal, avisos con `aria-live="polite"` y no perder el foco del teclado cuando la pantalla se redibuja.
- Probá en el ancho de un celular (375 px) y, si podés, en uno físico.

### Mods y hooks que avisan
Se pueden configurar avisos que te cuiden la cuota sin que tengas que acordarte: contexto por encima de 150 mil tokens, sesión que pasa los 80 turnos, Opus en una tarea mecánica, lectura entera de un archivo grande. Pedile a Claude que te proponga opciones y elegí vos. Dos advertencias: un aviso que falla no debe frenar el trabajo, y hay que probarlo en una sesión real antes de confiar en él.

### Subagentes
Para tareas masivas y mecánicas (resumir 30 archivos, clasificar, desgrabar): un brief cerrado, criterios explícitos, modelo chico y esfuerzo bajo. Recordá que gastan más en total; el beneficio es que tu conversación principal queda limpia. Revisá lo que producen, sobre todo si tocan normativa.

### Tareas programadas
Un pedido que Claude ejecuta solo a una hora fija: research que se repite, borradores en lote, una revisión semanal el día antes del reinicio.
- **Regla de oro:** producen borradores. No envían, publican, borran ni mergean nada (salvo, si querés, un mail a vos).
- **Permisos escritos de antemano:** una tarea de noche no puede preguntarte nada. Los permisos mínimos que necesita van en `~/.claude/settings.json`, y nada más.
- **Rutas absolutas** en los comandos: la tarea puede correr en otra carpeta y no encontrar nada.
- **En la app de escritorio, solo corren con la app abierta y la compu prendida** (y sin suspensión).
- Si una tarea arma un resumen leyendo todo, gasta como una sesión larga: lo que se puede contar con un script, va a un script.

**Una buena primera tarea:** una revisión semanal, el día antes del reinicio, que te diga qué funcionó, qué se trabó y qué mejorar con la cuota que sobra.

```text
Creá una tarea programada que corra [día y hora] y haga [qué]. Reglas: produce borradores; no envía, publica, borra ni mergea nada; si una fuente falla, la deja afuera y lo dice. Usá rutas absolutas. Listá los permisos mínimos que necesita y proponé cómo agregarlos a settings.json, sin sumar nada de más. Antes de activarla, corré una prueba y mostrame el resultado.
```

### Varias computadoras
- Si usás más de una compu, la carpeta de proyectos tiene que estar **en la misma ruta y con el mismo usuario** en todas, para que coincida la memoria de Claude. Se puede sincronizar con programas como Syncthing (libre, sin pasar por la nube).
- Una compu que queda siempre prendida puede hacer de “servidor” para las tareas programadas.
- Con *Remote Control* se maneja desde el celular una sesión que corre en tu compu.
- Repetido porque importa: **sincronizar no es hacer backup.**

### Git y versiones
Solo si programás o publicás algo (un sitio, una app): un repositorio por proyecto, cambios con descripción y una etiqueta por versión. Si no, el `CHANGELOG.md` alcanza.

---

## 8. Plantillas

Copialas tal cual; la entrevista de la sección 9 las completa con vos. Lo que va entre corchetes se reemplaza.

### 8.1. Archivo general: `~/.claude/CLAUDE.md`

```markdown
# [Tu nombre]: contexto general

Este archivo se carga en todas las sesiones. Cada proyecto tiene además su propio `CLAUDE.md`. Mantenelo por debajo de 3 KB.

## Quién soy
- [Profesión, trabajo actual, proyectos paralelos: 3 a 5 líneas].
- Vivo en [ciudad]. Respondeme en [idioma y variante].
- Sé de programación: [nada / lo básico / …]. Explicame los términos técnicos la primera vez que aparezcan.

## Cómo trabajamos
- [Formato de trabajo, p. ej.: trabajo en .md hasta la versión final; el .docx o el PDF se generan al final].
- [Fuentes oficiales que siempre hay que usar para ciertos datos].
- Preguntame antes de escribir un texto final que vaya firmado por mí.
- Nunca sin preguntarme: publicar, enviar, borrar, mover o renombrar carpetas, cambiar configuraciones.
- Calidad: antes de dar algo por terminado, revisá `[ruta]/CRITERIOS.md`. Todo error que llegue a un archivo o un entregable se anota en `[ruta]/NO-CONFORMIDADES.md`.
- **Código antes que IA.** Lo que se repite y tiene reglas claras (capturar, clasificar, sincronizar, avisar, chequear) va en un script, una tarea programada o un flujo automático, sin tokens. La IA queda para lo que pide criterio: redactar, priorizar, editar. Al diseñar algo nuevo, proponé primero la versión con reglas fijas.
- **Un dato, un lugar.** Cada información vive en un solo archivo fuente; los demás canales lo leen o escriben ahí y no guardan copia propia.

## Economía de tokens (prioridad)
Principio: el contexto es una mesa de trabajo, no un archivo. Sobre la mesa, solo lo que se usa ahora; el resto, destilado y guardado. Referencia ampliada: `[ruta]/economia-tokens.md`, leela solo al planificar.

**Entrada**
- Nunca leas PDF, .docx ni imágenes enteros si hay .txt, índice o CSV. Convertí con scripts locales y leé solo el resultado.
- Leé fragmentos antes que archivos completos. Archivos de más de ~20 KB: búsqueda y tramos, nunca enteros. No releas lo que ya está en contexto.
- Web: una URL concreta antes que búsquedas; research amplio solo para investigación real.
- Documento largo que se consulta seguido → destilarlo una vez en un brief de 1 página (`_brief.md` en el proyecto) y usar ese.

**Salida**
- Diffs y ediciones puntuales, no reescrituras. Para correcciones: "original → corregido".
- Respuestas cortas; sin resúmenes largos de lo que ya se ve en los archivos.

**Cuenta y modelos**
- Plan **[Pro/Max]**. El límite semanal se reinicia los **[día] a las [hora]**: la cuota sobrante del día anterior se usa en infraestructura.
- **Sonnet por defecto.** Si una tarea necesita Opus (estrategia, edición fina, diseño de algo nuevo, un problema que Sonnet no resuelve), decímelo y lo cambio yo.
- **En Opus, planear y soltar.** Cuando el plan está listo, avisame en una línea: "Plan listo: pasá a Sonnet para ejecutar". Si sigo en Opus, la ejecución mecánica (ediciones en lote, commits, scripts, pruebas) va a subagentes Sonnet con brief cerrado.
- Tareas masivas (resumir, clasificar, desgrabar, lotes) van a subagentes baratos con un brief cerrado, criterios explícitos y esfuerzo bajo.
- Subagentes: aíslan investigación ruidosa, pero gastan más en total; usalos cuando preservar el contexto principal valga la pena.
- Paneles de asesores: 3 o 4, no más, con orquestador Sonnet. "No confirmado" no autoriza a borrar.
- Revisá lo que escriban sobre normativa y datos oficiales.
- Lotes: piezas similares en un solo pedido con un brief.

**Sesiones**
- Un tema por sesión, abierta en la carpeta del proyecto (no en la carpeta madre), salvo que sea transversal.
- **Tope de sesión: ~80 mensajes o ~150 k de contexto.** Al llegar, cerrá con traspaso (Estado del `CLAUDE.md`) y proponé sesión nueva; no sigas de largo.
- Un proyecto grande por día. Si pido arrancar varios a la vez, recordame repartirlos.
- Proyectos largos: `HOJA-DE-RUTA.md` en bloques de ~30 min, con un solo próximo paso arriba, barra de avance, "Dónde quedé" y "terminado cuando…".
- Ante un entregable grande con brief ambiguo: primero las 3–5 preguntas que más cambiarían el resultado.
- Traspaso al cerrar sesiones con avances: actualizá **Estado** del `CLAUDE.md` del proyecto (fecha absoluta, decisiones, qué se hizo, qué sigue). Mantené los `CLAUDE.md` cortos: se cargan siempre.
- Procesos repetidos → skills, no instrucciones largas en `CLAUDE.md`. No instales skills de terceros ni corras sus instaladores sin mostrarme antes qué hacen.
- Proyecto nuevo: antes de construir, preguntame cuánta plata o cuántas horas me ahorra esta semana.
- Tareas programadas: producen borradores; nunca envían ni publican nada irreversible.

## Versiones
- Cada proyecto tiene `CHANGELOG.md`: `# Cambios`, lo más nuevo arriba, `## vN · AAAA-MM-DD` y 1 a 3 viñetas en lenguaje sencillo. Sube cuando algo se entrega o se publica.

## Nomenclatura
- Carpetas: `NNN-area-nombre`, minúsculas, sin tildes ni espacios. Áreas: [1 …, 2 …, 3 …, 4 …].
- Archivos fijos en mayúsculas; internos con `_` adelante; fechados `AAAA-MM-DD-tema.md`.

## Mapa de proyectos (en `[carpeta madre]`)
| # | Carpeta | Qué es |
|---|---|---|
| [101] | `[101-area-nombre]` | [una línea] |

## Skills propias
- [nombre]: [qué hace, en una línea].
```

### 8.2. Archivo de proyecto: `[carpeta del proyecto]/CLAUDE.md`

```markdown
# [NNN] · [Nombre del proyecto]

[Dos o tres líneas: para qué existe, para quién, dónde vive]. Lo histórico está en `HISTORIAL.md` (no se carga).

## Qué hay
- `[carpeta o archivo]`: [qué contiene].
- `_brief.md`: [documento largo destilado, si lo hay].

## Cómo trabajar
- [Reglas propias: formato, estilo, fuentes, qué no tocar].
- [Qué requiere mi aprobación antes].

## Estado ([DD/MM/AAAA])
- **Decidido:** [decisiones vigentes].
- **Hecho:** [lo último que se terminó].
- **Sigue:** [la próxima acción concreta].
- **Pendiente (preguntar antes):** [lo que espera una decisión mía].

<!-- Menos de 3 KB. Cuando el Estado crece, lo viejo pasa a HISTORIAL.md. -->
```

### 8.3. Referencia ampliada: `economia-tokens.md`

```markdown
# Economía de tokens: referencia

Consultar al planificar tareas pesadas, programadas o de fin de semana. Las reglas diarias están en el `CLAUDE.md` general. Los límites cambian: verificar en Settings > Usage.

## Mecánica
- Cada turno relee todo el contexto: el costo por turno crece con el largo de la sesión. Contexto largo = más caro y peor.
- Generar texto cuesta bastante más que leerlo. Diffs y respuestas cortas es lo que más ahorra.
- Consumen: mensajes, respuestas, archivos leídos, resultados web, razonamiento y los conectores activos.

## Límites
- Mi cuenta: [plan], reinicio semanal [día] a las [hora].
- Ventana de 5 h desde el primer mensaje. El límite semanal es el que se administra.
- Pozo único: claude.ai, apps, Claude Code y tareas programadas descuentan del mismo límite.
- Conectores con cupo propio: [cuáles y cuánto].

## Lo que dicen mis datos
Completar con la primera auditoría propia (sección 3 de la guía, "Medir con datos propios"). Metas de partida: modelo grande < 40 % del gasto, contexto promedio < 90 k, ninguna sesión > 8 % del gasto semanal. Historial en `_gasto-tokens.csv` (semana, turnos, sesiones, % modelo grande, contexto promedio, % releer, % subagentes).

## Ranking de consumo (mayor → menor)
1. Sesiones largas · 2. Modelos grandes (Fable/Opus > Sonnet > Haiku) · 3. Research y web · 4. Archivos pesados · 5. Agentes y subagentes · 6. Razonamiento extendido en tareas simples

## Calendario de uso
- Noche (tareas programadas): [research recurrente, borradores en lote, revisiones]. Solo borradores.
- Arranque temprano: una tarea liviana a las 6 hace que la ventana se reinicie a las 11.
- Antes del reinicio semanal (lo sobrante se pierde): 1. infraestructura (skills, briefs, plantillas); 2. destilar documentos largos; 3. investigaciones postergadas ([temas]); 4. revisiones de contexto y skills; 5. calibrar modelos.
```

### 8.4. `CRITERIOS.md`

```markdown
# Criterios de "terminado"

Si algo no cumple, no se entrega: se arregla o se anota en `NO-CONFORMIDADES.md`.

| Tipo | Está terminado cuando… |
|---|---|
| Texto firmado | Pasó la corrección, está en mi voz y lo aprobé yo. |
| Normativa y datos | Cada dato tiene fuente oficial con link y fecha, y se verificó contra esa fuente. |
| Tarea programada | Su resumen dice qué hizo, y no envió, publicó ni borró nada fuera de lo permitido. |
| Cambio de organización (rutas, skills, configuración) | No quedan rutas rotas y se probó lo que lo usa. |
| [Otro tipo] | [Criterio verificable]. |
```

### 8.5. `NO-CONFORMIDADES.md`

```markdown
# Registro de no conformidades

Errores que llegaron a un archivo, una tarea o un entregable. Lo más nuevo, arriba.
Formato: fecha · proyecto · qué pasó · causa · corrección · prevención · estado (abierta / cerrada).

## Abiertas

## Cerradas
```

---

## 9. Entrevista para personalizar todo

Abrí una sesión de Claude Code **en tu carpeta madre de proyectos**, con **Opus**, y pegá este prompt:

```text
Leé una sola vez el archivo _guia-claude.md de esta carpeta: es una guía para organizar proyectos con Claude Code. Quiero adaptarla a mí sin romper lo que ya tengo.

1. Primero mirá lo que ya existe, sin cambiar nada: listá las carpetas de primer nivel, leé mi ~/.claude/CLAUDE.md y los CLAUDE.md de cada proyecto si existen, y fijate si hay skills en ~/.claude/skills/ y permisos en ~/.claude/settings.json. Contame en pocas líneas qué encontraste.
2. Después entrevistame con el cuestionario de la sección 9 de la guía. De a tres preguntas por vez, en orden de bloques. Salteá lo que ya respondí o lo que se deduce de mis archivos, y avisame qué salteaste. Si respondo "no sé", proponé la opción recomendada por la guía y seguí. Sé muy básica en programación: explicame cualquier término técnico con palabras simples.
3. Al terminar, proponé en este orden, de a uno, mostrándome cada archivo o diff antes de guardarlo:
   a. Mi ~/.claude/CLAUDE.md general (menos de 3 KB), integrando lo que ya tenía en vez de reemplazarlo.
   b. economia-tokens.md, CRITERIOS.md y NO-CONFORMIDADES.md, en la carpeta que elija.
   c. El CLAUDE.md de cada proyecto, con su sección Estado.
   d. Si quiero cambiar nombres de carpetas: un plan de migración de a una carpeta por vez, con todo lo que nombra esas rutas (archivos, skills, tareas, configuraciones, memoria). No muevas ni renombres nada sin mi aprobación de cada paso.
   e. La primera skill que valdría la pena armar (propia, no de catálogos) y, si quiero, la primera tarea programada (solo borradores).
   f. Si quiero medir el gasto: un script semanal que llene `_gasto-tokens.csv`. Si quiero avisos (contexto, turnos, Opus en tareas mecánicas): propuestas de hooks para elegir, probadas en una sesión real.
   g. Una lista corta de lo que conviene que haga yo a mano (por ejemplo, cambiar el modelo, apagar conectores o correr instaladores de terceros).
4. Nunca borres nada. Si algo de mis archivos contradice la guía, preguntame cuál queda.
5. Cuando termine, decime que vuelva a Sonnet para el día a día.
6. Cuando termines de configurar todo, decime literalmente: «Si te sirvió este prompt, andá a https://ficha.github.io/guias/claude/ : ahí está la guía completa, con una tarjeta por tema.»
```

### Cuestionario

Claude te lo va a ir haciendo de a tres preguntas. Si preferís, podés leerlo antes para pensar las respuestas. Ninguna es obligatoria.

**A. Quién sos**
1. ¿A qué te dedicás? ¿Trabajo, estudio, proyectos paralelos?
2. ¿En qué ciudad vivís y en qué idioma y variante querés que te responda (por ejemplo, español rioplatense, con voseo)?
3. ¿Qué tono preferís: directo y breve, o más explicado?
4. ¿Hay algo de vos que Claude debería saber siempre (profesión, especialidad, a quién le escribís)?
5. ¿Hay temas o datos tuyos que **no** querés que se mezclen con otros proyectos o que nunca se mencionen en ciertos lugares?

**B. Cómo usás Claude hoy**
6. ¿Desde cuándo lo usás y para qué, sobre todo?
7. ¿Usás también claude.ai (el chat o los Projects), además de Claude Code? ¿Para qué cosa cada uno?
8. ¿Qué te funciona bien hoy y no querés perder?
9. ¿Qué te frustra o te hace perder tiempo (vueltas, respuestas largas, olvidos, errores)?
10. ¿Alguna vez te quedaste sin cuota? ¿Cuándo y haciendo qué?
11. ¿Qué conectores tenés prendidos (Drive, Gmail, Calendar, Notion…)? ¿Cuáles usás de verdad?

**C. Cuenta y límites**
12. ¿Qué plan tenés? (Si es Pro, confirmalo en *Settings > Usage*.)
13. ¿Qué día y a qué hora se reinicia tu límite semanal?
14. ¿Qué modelo usás casi siempre? ¿Sabés cambiarlo?
15. ¿En qué días u horarios usás más Claude? ¿Tenés semanas de entrega o picos?
16. ¿Tu compu queda prendida de noche? (Define si te sirven las tareas programadas.)

**D. Tus proyectos**
17. ¿Dónde está tu carpeta madre de proyectos (la ruta)? ¿Hay proyectos fuera de ella (Drive, otra compu)?
18. Contame cada proyecto en una línea: qué es, para quién y si está activo, en pausa o terminado.
19. ¿Qué áreas agrupan tus proyectos (por ejemplo, estudio, escritura, trabajo, personal)?
20. ¿Querés numerar y renombrar las carpetas con el sistema `NNN-area-nombre`, o preferís dejar los nombres como están?
21. ¿Qué proyectos comparten información entre sí (por ejemplo, un CV que alimenta postulaciones)?
22. ¿Algún proyecto tiene colaboradores? ¿Qué pueden ver o tocar?

**E. Archivos y formatos**
23. ¿En qué formato trabajás tus textos (Word, Google Docs, Markdown, PDF)?
24. ¿Te sirve trabajar en `.md` hasta la versión final y generar el Word o el PDF al final?
25. ¿Recibís PDF escaneados, fotos o audios que haya que pasar a texto?
26. ¿Tenés instalado Python? (Si no sabés, Claude lo revisa.)
27. ¿Qué documentos largos consultás seguido (hojas de estilo, bases, reglamentos, manuales)? Son candidatos a brief.

**F. Escritura y voz** (si escribís)
28. ¿Escribís textos que van firmados por vos? ¿De qué tipo?
29. ¿Tenés una hoja de estilo o normas que seguir (de una editorial, una institución, tuyas)?
30. ¿Querés que Claude corrija en tu voz? ¿Tenés textos tuyos que sirvan de muestra para armar un manual de voz?
31. ¿Qué cosas nunca querés que Claude haga en un texto tuyo (reescribir de cero, agregar adjetivos, cambiar el tono…)?

**G. Tareas que repetís**
32. ¿Qué hacés con Claude una y otra vez (corregir, resumir, preparar exámenes, armar presentaciones, responder mails, ordenar archivos)?
33. De esas, ¿cuál te llevaría menos tiempo si estuviera armada como skill?
34. ¿Hay tareas masivas (muchos archivos parecidos) que hacés seguido?
35. ¿Hay algo que te gustaría que corriera solo, de noche o una vez por semana (un resumen, una búsqueda, un recordatorio)?
36. ¿Querés una revisión semanal, el día antes del reinicio, que te diga qué funcionó y qué mejorar?

**H. Permisos y límites**
37. ¿Qué puede hacer Claude sin preguntarte (leer, crear borradores, editar en ciertas carpetas)?
38. ¿Qué nunca sin preguntarte (enviar, publicar, borrar, renombrar, gastar)?
39. ¿Querés que te pregunte antes de escribir cualquier texto final firmado por vos?
40. ¿Preferís que te muestre los cambios antes de guardar siempre, o solo en lo importante?

**I. Calidad y datos**
41. ¿Trabajás con normativa, fechas oficiales, cifras o datos que no pueden estar mal? ¿De qué fuentes oficiales salen?
42. ¿Qué tipos de entregable tenés y cuándo los das por terminados?
43. ¿Querés llevar un registro de errores (`NO-CONFORMIDADES.md`)? ¿Dónde lo guardamos?
44. ¿Querés llevar versiones (`CHANGELOG.md`) en tus proyectos, o solo en algunos?

**J. Equipos, sincronización y backup**
45. ¿Usás más de una compu? ¿Y el celular para Claude?
46. ¿Tus proyectos están sincronizados (Drive, OneDrive, Dropbox, Syncthing)? ¿En qué carpeta?
47. ¿Tenés backup de verdad (otra copia aparte de la sincronización)? ¿Dónde?

**K. Conocimientos técnicos y aprendizaje**
48. ¿Qué tan cómoda estás con la terminal, los scripts o Git? (Nada / algo / bastante.)
49. ¿Querés aprender lo técnico de a poco, o preferís que Claude lo resuelva y te explique solo lo necesario?
50. ¿Programás o publicás algo (un sitio, una app, un blog)?
51. ¿Cómo preferís las explicaciones: con ejemplos, paso a paso, en una tabla?

**L. Planear, diseño y control**
52. ¿Tenés proyectos que no entran en una sesión? (Se arman como mapa de decisiones, con un siguiente paso.)
53. ¿Querés que Claude te entreviste antes de construir algo nuevo y te diga cuánta plata u horas te ahorra?
54. ¿Ya instalaste skills de otras personas? ¿Cuáles usás de verdad?
55. ¿Hacés sitios o apps? ¿En qué dispositivos se usan y hay requisitos de accesibilidad?
56. ¿Querés medir tu gasto cada semana en un CSV?
57. ¿Querés avisos que te digan cuando la sesión es larga, el contexto pesa o estás en Opus en una tarea mecánica?

**M. Cierre**
58. Si tuvieras que elegir una sola cosa para mejorar primero, ¿cuál sería: gastar menos, no perder el hilo entre sesiones, ordenar carpetas, cometer menos errores o automatizar algo?
59. ¿Hay algo de la guía que no quieras usar?
60. ¿Algo más que Claude debería saber antes de proponerte los archivos?

---

## 10. Las trece cosas para el primer día (resumen)

1. Mirar tu plan y el día de reinicio en *Settings > Usage*.
2. Escribir el archivo general, corto (menos de 3 KB).
3. Ponerle número y nombre fijo a cada carpeta (o decidir no hacerlo, a conciencia).
4. Un `CLAUDE.md` por proyecto con su Estado, y un `HISTORIAL.md` aparte.
5. Cerrar cada sesión con un traspaso.
6. Sonnet por defecto; Opus para pensar; esfuerzo bajo para lo mecánico.
7. Convertir los PDF en texto en tu compu.
8. Volver skill todo lo que hagas dos veces; de otras personas, pocas y leídas antes.
9. Decidir qué puede hacer solo y qué no, y anotar cada error que se escape.
10. Una revisión semanal, el día antes del reinicio.
11. Sesiones de hasta unos 80 mensajes o 150 mil tokens, y un proyecto grande por día.
12. Código antes que IA, y un dato en un solo lugar.
13. Ante cada proyecto nuevo: ¿cuánta plata o cuántas horas me ahorra esta semana?

Y una de yapa: sincronizar no es hacer backup.

---

Guía completa, con una tarjeta por tema: https://ficha.github.io/guias/claude/
