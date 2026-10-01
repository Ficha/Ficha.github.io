---
name: newsletter-semanal
description: Arma mi newsletter semanal: estado de mis proyectos, propuestas para mejorar la infraestructura, noticias de IA y tips de Claude.
---

Armá mi newsletter semanal personal. Escribí en [idioma], con tono cercano y concreto. Ahorrá tokens: leé índices y secciones "Estado", no archivos pesados (PDF, .docx). Se lee en 5 minutos: nada de relleno.

## 0. Contexto
- Leé mi `CLAUDE.md` general (quién soy y el mapa de proyectos).
- Leé las últimas 4 ediciones de `[carpeta]/ediciones/` (si existen) para no repetir tips ni noticias.
- Hoy es la fecha del sistema. La edición cubre los últimos 7 días.

## 1. Noticias y tips (web)
- **Noticias** (máximo 5): novedades de Anthropic y Claude, y lo más importante de la IA en general. Priorizá fuentes primarias (anthropic.com/news, la documentación oficial, changelogs, blogs oficiales) y medios serios. Cada noticia: título, 2 líneas de por qué me importa y el link. Si no podés verificar algo, no lo pongas.
- **3 tips de Claude** aplicables ya (skills, tareas programadas, conectores, prompts, ahorro de tokens), conectados con mis proyectos cuando se pueda.
- **2 tips de IA en general** útiles para [mi trabajo].

## 2. Para vos
Para cada proyecto del mapa, leé SOLO la sección "Estado" de su `CLAUDE.md` y crucela con algo real (historial de cambios, fechas de archivos, calendario, [otras fuentes]). Si el Estado dice "pendiente" pero ya está hecho, decilo.
- Por proyecto: una línea de estado y **una** acción concreta para esta semana.
- Fechas de los próximos 14 días: [entregas, vencimientos, convocatorias].
- Cerrá con "Lo más importante de la semana" (1 o 2 cosas).

## 3. Construyendo infraestructura
Objetivo: que cada semana cueste menos tokens y salga mejor que la anterior. Leé `economia-tokens.md`, la sección "Economía de tokens" del `CLAUDE.md` general y las skills existentes (solo su encabezado).
- **Aprendizajes de la semana** (máx. 3): qué funcionó, qué se trabó o se repitió, qué error de los agentes apareció.
- **Propuestas** (máx. 3, ordenadas por retorno): skills nuevas o mejoras a las existentes; briefs `_brief.md` para documentos largos que se consultan seguido; recortes a archivos de contexto que crecieron (más de ~3 KB o secciones Estado viejas); tareas programadas o cambios de modelo. Cada propuesta: qué, por qué ahorra o mejora, un peso estimado (liviana, media o pesada), el modelo sugerido y **el pedido listo para pegar**.
- **Plan de cuota**: el límite se reinicia el [día] a las [hora]. Ordená las propuestas para que entren en la cuota que sobra antes del reinicio.
No implementes nada: solo proponé.

## 4. Armado y entrega
- Guardá la edición en `[carpeta]/ediciones/AAAA-MM-DD.md`. Asunto: "Tu semana con IA · <fecha> · <el titular más importante>".
- Secciones: 1) Para vos, 2) Construyendo infraestructura, 3) Noticias, 4) Tips de Claude, 5) IA en general, 6) Para probar esta semana.
- [Opcional: dejala como borrador en mi mail con el conector de Gmail, dirigido solo a mí].

## Límites
Solo leer, armar y guardar (o dejar el borrador). No modifiques archivos de los proyectos, no envíes nada a nadie más, no publiques ni implementes las propuestas.
