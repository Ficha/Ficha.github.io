---
slug: corregir
nivel: 3
nuevo: si
titulo: Corregir con una hoja de estilo
bajada: Errores, sugerencias y dudas, cada uno con su regla, y una lista de lo que me sigue pasando.
---

Estudio Edición, y la materia de Corrección de Estilo me dejó algo más útil que una nota: una hoja de estilo. Tiene dos capas. La norma (lo que dicen la *Ortografía* y el *Diccionario panhispánico de dudas*) y las decisiones de la casa, que son elecciones entre opciones válidas: voseo, comillas inglesas en la web, números en cifras desde el 10. Apartarse de la norma es un error; apartarse de la casa, una inconsistencia.

Esa hoja es la fuente de una [skill](skills.html), `corregir-texto`. Claude no corrige según su gusto, corrige según la hoja. Y si no puede citar la regla, no es un error.

## Tres categorías, nunca mezcladas

- **Error**: se aparta de la norma. Se corrige y se cita la regla.
- **Sugerencia**: una mejora opcional. Pocas, solo las que suman.
- **Duda**: algo que Claude no puede resolver sin mí, como un dato, una intención o dos opciones válidas usadas a la vez.

La diferencia importa. Una corrección que mezcla las tres te obliga a discutir cada cambio, y a la quinta discusión aceptás todo para terminar.

## Pasadas separadas

Ortografía y puntuación primero. Después gramática y léxico. Al final, lo textual: coherencia, registro, párrafos. Si se hacen juntas, se escapan errores, igual que cuando corregís mirando el sentido y no ves la tilde.

## Un revisor para decidir

Antes recibía una tabla larga que nunca terminaba de leer. Ahora la skill arma una página local con el texto y cada cambio marcado: lo acepto o lo rechazo con el teclado y bajo el texto final. Los errores ya vienen aplicados en una copia; las sugerencias y las dudas esperan mi decisión.

## Lo que se acumula

Cada corrección suma sus patrones a `errores-frecuentes.md`, con la cantidad de veces. Es lo primero que la skill busca en el texto siguiente. Lo que más me pasa: cursiva faltante (224 veces) y tildes diacríticas (178). No hay vergüenza en la lista. Hay estadística.

Dos reglas que aprendí: si el texto lo escribió Claude, sus errores no van a mi lista, que es de los míos. Y la skill tiene casos de prueba, para comprobar que no empeora cada vez que la toco.

```text
Armá una skill para corregir mis textos usando como fuente la hoja de estilo que te adjunto. Que separe cada cambio en error (con la regla citada), sugerencia o duda, sin mezclarlas, y que haga pasadas separadas: ortotipografía, gramática y léxico, y nivel textual. Que guarde un archivo errores-frecuentes.md con los patrones de cada corrección y cuántas veces aparecieron, y que lo lea antes de empezar la siguiente. Probala con un texto mío corto y mostrame el resultado antes de instalarla.
```
