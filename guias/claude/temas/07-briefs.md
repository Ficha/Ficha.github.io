---
slug: briefs
nivel: 2
titulo: Destilar lo que consultás seguido
bajada: Leer un documento largo una sola vez y quedarse con la página que importa.
---

Hay documentos que consulto todo el tiempo: mi hoja de estilo, las bases de un concurso, el reglamento de una materia. Si cada vez le pido a Claude que los lea enteros, pago el documento completo en cada conversación. Y otra vez. Y otra.

La solución es destilarlos una vez en un brief de una página, un `_brief.md` dentro del proyecto, y de ahí en más trabajar con ese. El original queda guardado por si hace falta, pero no se abre.

## Qué tiene un buen brief

- Lo que voy a consultar seguido, no un resumen del documento.
- Criterios concretos y ejemplos cortos: “las fechas, en número; los siglos, en romanos” sirve más que “seguir la norma”.
- Nada de narrativa. Si una sección no se va a consultar, no va.

## El manual de voz

El brief que más uso es el de mi newsletter. Primero era un perfil de voz armado con algunas entregas; después lo convertí en un manual, con cómo arranco, cómo cierro, qué palabras uso y cuáles nunca, cómo armo las listas y dónde pongo los paréntesis (en todos lados). Ahora, cuando corrijo un texto en mi voz, Claude lee el manual en vez de releer cinco años de entregas. Lo usa mi skill de [corrección](skills.html), junto con la hoja de estilo que armé en la facultad.

Un cuidado: si reemplazás un brief por otro, actualizá los punteros. Durante unos días mi [archivo general](contexto-general.html) seguía mandando al brief viejo.

## Texto, no PDF

Lo mismo vale para la materia prima. Los PDF escaneados de la facultad los paso a texto en mi compu, con un script de OCR, y Claude lee solo el `.txt`. Un PDF escaneado de cuarenta páginas puede costar más que una semana de conversaciones. No exagero (bueno, un poco). Ese paso hoy es parte de una [skill](skills.html).

```text
Leé [documento] una sola vez y destilalo en un _brief.md de una página: lo que voy a consultar seguido, con criterios concretos y ejemplos cortos, sin resumen narrativo. Después buscá qué archivos o skills nombran el documento original y proponé cambiar esos punteros al brief. De ahora en más, trabajá con el brief y dejá el original.
```
