# Economía de tokens: referencia

Consultar al planificar tareas pesadas, programadas o de fin de semana. Las reglas diarias están en el `CLAUDE.md` general. Los límites cambian: verificar en *Settings > Usage*.

## Mecánica
- Cada turno relee todo el contexto: el costo por turno crece con el largo de la sesión. Contexto largo = más caro y peor.
- Generar texto cuesta bastante más que leerlo. Pedir diffs y respuestas cortas es lo que más ahorra.
- Consumen: mensajes, respuestas, archivos leídos, resultados web, razonamiento y las definiciones de los conectores y herramientas activos.

## Límites
- **Mi cuenta: [plan], reinicio semanal [día] a las [hora].**
- Ventana de 5 h desde el primer mensaje. Límite semanal con reinicio fijo por cuenta: es el que se administra.
- Pozo único: claude.ai, apps, Claude Code y tareas programadas descuentan del mismo límite.

## Ranking de consumo (mayor → menor)
1. Sesiones largas · 2. Modelos grandes (Opus > Sonnet > Haiku) · 3. Research y web · 4. Archivos pesados (PDF con imágenes) · 5. Agentes y subagentes · 6. Razonamiento extendido en tareas simples

## Calendario de uso
- **Noche (tareas programadas):** research recurrente ([tema]), borradores en lote, revisiones pesadas. Solo borradores: nunca envían ni publican.
- **Arranque temprano:** una tarea liviana a las 6 hace que la ventana se reinicie a las 11 → dos ventanas en la jornada.
- **Antes del reinicio semanal (lo sobrante se pierde)**, en este orden:
  1. Infraestructura: skills, hojas de estilo destiladas, plantillas de briefs.
  2. Destilar documentos largos en briefs de 1 página.
  3. Investigaciones postergadas ([temas]).
  4. Auditorías: archivos de contexto, skills, textos propios contra el perfil de voz.
  5. Calibrar modelos: probar Opus donde se usa Sonnet.

## En claude.ai (no aplica a Claude Code)
- Editar el mensaje en vez de corregir con uno nuevo; ramificar editando un mensaje intermedio.
- Projects por cliente o frente con un brief de 1 página; curar el knowledge (ocupa contexto siempre).
- Apagar conectores que no se usan en ese chat. Research solo para investigación real.
- Criterios en vez de adjetivos: "máx. 120 palabras, sin gerundios, cierre con dato".
