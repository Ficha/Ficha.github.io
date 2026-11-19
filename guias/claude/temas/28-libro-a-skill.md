---
slug: libro-a-skill
nivel: 3
nuevo: si
titulo: De un libro a una skill
bajada: El método de un autor, convertido en algo que Claude aplica a problemas reales y con lo que revisa lo que hago.
---

Leo un libro bueno, lo subrayo entero y a los tres meses me acuerdo de la tapa. Con los libros de método es peor, porque lo que quería era usarlo, no recordarlo.

Así que armé `libro-a-skill`. Recibe un libro o una bibliografía (EPUB, PDF con texto, PDF escaneado o varias fuentes juntas) y lo convierte en una [skill](skills.html) con dos modos: **aplicar**, que usa el método del autor sobre un problema mío, y **revisar**, que mira un texto, un plan o un diseño con sus criterios.

## Cómo trabaja

1. Extrae el texto y lo parte por capítulos con scripts locales. Esa parte no gasta tokens.
2. Escribe una ficha por capítulo con agentes de Sonnet, un modelo más barato.
3. Destila las fichas en cuatro archivos: glosario, método, criterios y patrones.
4. Instala la skill y la prueba con casos reales y uno de control, que es un caso donde el método no debería decir nada.

El primero fue *Thinking in Systems*, de Donella Meadows (2008). Salió `pensamiento-sistemico`, que busca bucles, demoras y puntos de apalancamiento en un problema. La probé con tres casos míos y uno de control.

## Lo que salió mal

El destilado tenía un tope de tamaño total. Para entrar, sacó 12 términos del glosario y 19 criterios que otros archivos de la misma skill usaban. Es decir, la skill nombraba conceptos que ya no definía. Ahora no hay tope total y está prohibido sacar del glosario un término que otro archivo use.

## Pública

La subí a GitHub, con licencia MIT: [github.com/Ficha/libro-a-skill](https://github.com/Ficha/libro-a-skill). Un aviso: la skill destila un método, no copia el libro. Las fichas y el texto extraído son para uso propio; no los publiques.

```text
Quiero convertir este libro en una skill que aplique el método del autor a mis problemas y revise mis textos o planes con sus criterios. Primero extraé el texto y partilo por capítulos con un script local, sin leer el libro entero en la conversación. Después escribí una ficha por capítulo con un subagente de Sonnet por capítulo, de a uno. Destilá las fichas en glosario, método, criterios y patrones, sin sacar del glosario ningún término que otro archivo use. Antes de instalarla, probala con dos casos míos y uno de control, y mostrame los resultados.
```
