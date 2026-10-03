# [Tu nombre]: contexto general

Este archivo se carga en todas las sesiones. Cada proyecto tiene además su propio `CLAUDE.md`. Mantenelo por debajo de 3 KB.

## Quién soy
- [Profesión, trabajo actual, proyectos paralelos: 3 a 5 líneas].
- Vivo en [ciudad]. Respondeme en [idioma y variante, p. ej. español rioplatense].

## Cómo trabajamos
- [Formato de trabajo, p. ej.: trabajo en .md hasta la versión final; el .docx o el PDF se generan al final].
- [Fuentes oficiales que siempre hay que usar para ciertos datos].
- Preguntame antes de escribir un texto final que vaya firmado por mí.

## Economía de tokens (prioridad)
Principio: el contexto es una mesa de trabajo, no un archivo. Sobre la mesa, solo lo que se usa ahora; el resto, destilado y guardado. Referencia ampliada: `economia-tokens.md`, leela solo al planificar.

**Entrada**
- Nunca leas PDF, .docx ni imágenes enteros si hay .txt, índice o CSV. Convertí con scripts locales y leé solo el resultado.
- Leé fragmentos antes que archivos completos. No releas lo que ya está en contexto.
- Web: una URL concreta antes que búsquedas; research amplio solo para investigación real.
- Documento largo que se consulta seguido → destilarlo una vez en un brief de 1 página (`_brief.md` en el proyecto) y usar ese.

**Salida**
- Diffs y ediciones puntuales, no reescrituras. Para correcciones: "original → corregido".
- Respuestas cortas; sin resúmenes largos de lo que ya se ve en los archivos.

**Cuenta y modelos**
- Plan **[Pro/Max]**. El límite semanal se reinicia los **[día] a las [hora]**: la cuota sobrante del día anterior se usa en infraestructura.
- **Sonnet por defecto.** Si una tarea necesita Opus (estrategia, edición fina, arquitectura, un problema que Sonnet no resuelve), decímelo y lo cambio yo.
- Opus piensa (plan, estrategia, edición fina); Sonnet/Haiku ejecutan. Tareas masivas (resumir, clasificar, desgrabar, lotes) van a subagentes baratos con un brief cerrado y criterios explícitos.
- Revisá lo que escriban sobre normativa.
- Lotes: piezas similares en un solo pedido con un brief.

**Sesiones**
- Un tema por sesión. Si la sesión se alarga mucho o cambia de tema, proponé cerrar con traspaso y abrir otra.
- Ante un entregable grande con brief ambiguo: primero las 3–5 preguntas que más cambiarían el resultado.
- Traspaso al cerrar sesiones con avances: actualizá **Estado** del `CLAUDE.md` del proyecto (fecha absoluta, decisiones, qué se hizo, qué sigue). Mantené los `CLAUDE.md` cortos y curados: se cargan siempre.
- Procesos repetidos → skills (se cargan solo cuando hacen falta), no instrucciones largas en `CLAUDE.md`.
- Tareas programadas: producen borradores; nunca envían ni publican nada irreversible.

## Versiones y cambios
- Cada proyecto tiene `CHANGELOG.md` en su raíz: `# Cambios`, lo más nuevo arriba.
- Versión = número entero que sube de a uno: `## vN · AAAA-MM-DD`. Sube cuando algo se entrega o se publica, no por cada edición.
- Debajo, 1 a 3 viñetas de una línea en lenguaje sencillo. Los arreglos empiezan con "Arreglo:".

## Mapa de proyectos (en `[carpeta raíz]`)
| Carpeta | Qué es |
|---|---|
| `[proyecto-1]` | [una línea] |
| `[proyecto-2]` | [una línea] |

## Skills propias
- [nombre]: [qué hace, en una línea].
