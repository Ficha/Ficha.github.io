---
slug: asesores
nivel: 4
nuevo: si
titulo: Asesores ficticios
bajada: Catorce especialistas con nombre, personalidad y bibliografía, que se llaman como se llama a un colega.
---

Cuando escribo, casi siempre pienso solo. Y pensar solo tiene un defecto conocido: uno termina coincidiendo con uno mismo. Armé un equipo de asesores ficticios para tener a mano a alguien que me lleve la contra con fundamento.

## Qué son

Catorce especialistas inventados, cada uno con nombre, personalidad, enfoque y una bibliografía propia: biología, divulgación, diseño de interfaces, recorrido del usuario, psicología, calidad, edición literaria, abogado del diablo, pedagogía, contenido y marketing, datos, derecho editorial, ciberseguridad y juegos. Ninguno existe. Lo que sí existe es el conjunto de reglas que los hace consistentes: una ficha de personaje, una lista de lecturas que condiciona cómo opinan y una memoria donde guardan lo que aprendieron de mí.

## Cómo se llaman

Cada uno es un subagente de Claude Code, un archivo en `~/.claude/agents/`, y se invoca por nombre: “preguntale a Iris qué opina de esta pantalla”. Es más cómodo de lo que parece, porque la personalidad ya viene cargada y no hay que explicarla de nuevo. Los archivos se generan con un script a partir de una tabla, así que sumar o renombrar a alguien es cambiar una fila.

Hay dos skills encima. Una sirve para consultar a uno solo y guardar su memoria: cuando corrijo o descarto un consejo, queda registrado y la próxima vez lo tiene en cuenta. La otra convoca a varios a la vez y sintetiza lo que dijeron.

Una regla de diseño importa más que el resto: los asesores opinan y no editan. Leen mis archivos, no los tocan.

## Cuándo sirven

- Para ver un trabajo desde un ángulo que no es el mío: un texto, una pantalla, un plan.
- Cuando necesito a alguien que desconfíe de una idea que me gusta demasiado.
- Cuando varios, sin ponerse de acuerdo de antemano, marcan lo mismo. Eso pasó una vez y lo cuento en [El panel que salió caro](panel.html).

## Cuándo no

No sirven para decidir por mí ni para datos que se verifican en un archivo. Son personajes, y un personaje puede equivocarse con total aplomo. Les pedí que citen y que marquen lo que no pudieron confirmar, y aun así reviso todo lo que dicen sobre normativa, porque ya hubo errores.

Y no sirven en un panel grande. La regla que me quedó: tres o cuatro por vez, no once, y con un orquestador en Sonnet que los convoca y sintetiza. Un panel de once cuesta mucho más de lo que aporta: la coincidencia, que es lo valioso, se ve igual con cuatro.

## Antes de armar los tuyos

Podés copiar la idea sin copiar mis personajes. Los míos tienen bibliografía propia que a vos no te sirve; los tuyos deberían reflejar lo que de verdad te falta en cada proyecto. Empezá con dos o tres. Si querés ordenar primero qué necesitás, el [grill me](grill-me.html) ayuda.

```text
Quiero armarme un equipo chico de asesores ficticios para mis proyectos. Entrevistame con la skill grilling sobre en qué áreas me falta una mirada distinta. Después proponé de dos a cuatro especialistas: para cada uno, un nombre, una personalidad corta, su enfoque y cinco lecturas de base que condicionen cómo opina. Mostrame las fichas antes de crear nada. Si las apruebo, generá un subagente por especialista en ~/.claude/agents/ con acceso solo de lectura, de modo que opinen y no editen mis archivos. No guardes ni cambies nada sin mi aprobación.
```
