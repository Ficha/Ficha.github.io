---
slug: imagenes
nivel: 6
nuevo: si
titulo: Imágenes de Commons con tratamiento propio
bajada: Millones de imágenes libres, qué dice cada licencia y un filtro hecho con un script para que parezcan de la casa.
---

Un sitio sin imágenes se comparte mal: en las redes, cada link es un rectángulo gris con un título. Pero no todos tenemos ilustrador, y las imágenes generadas con IA tienen sus propios [signos](signos-ia.html), además de sus propias discusiones.

[Wikimedia Commons](https://commons.wikimedia.org/wiki/Special:MediaSearch) tiene millones de imágenes libres. Para ciencia es una mina: micrografías, ilustraciones botánicas antiguas, grabados, diagramas, fotos de archivo.

## Las licencias, lo que importa

- **Dominio público y CC0**: libres, sin condiciones. Preferilas.
- **CC BY**: se usa y se modifica, con atribución (autor, licencia, link).
- **CC BY-SA**: lo mismo, pero la imagen modificada tiene que salir con la misma licencia. Se puede, pero hay que decirlo.
- **NC** (no comercial): evitalas si el sitio vende algo o tiene auspiciantes.

Commons tiene una página que explica [cómo atribuir](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia). Con una línea al pie de la imagen y una página de créditos alcanza.

## El tratamiento

Una foto de Commons pegada tal cual parece sacada de Wikipedia, porque lo es. Para que todas parezcan de la misma casa, conviene pasarlas por el mismo filtro, y que el filtro sea un script: así la imagen número 40 sale igual que la primera.

En mi sitio uso tramas de imprenta en blanco y negro, que van con el resto del diseño. Para otro sitio pensaría algo propio: un duotono con los dos colores de su paleta, un grano suave, un recorte fijo. El filtro es parte de la identidad, así que no copies el mío.

## Lo que hace el script

- Aplica el tratamiento y recorta a las medidas que usa el sitio, incluida la de 1200 × 630 para compartir.
- Exporta en formatos livianos (AVIF y WebP) y en tres anchos, para que el celular no baje la versión de escritorio.
- Anota título, autor, licencia y link en un archivo de datos, del que salen el pie y la página de créditos.

El texto alternativo no lo escribe el script: lo escribe una persona, y describe lo que se ve y por qué está ahí.

```text
Armá un script en Python (con Pillow) que tome una imagen de Wikimedia Commons y devuelva: una versión con un tratamiento propio para mi sitio (proponeme tres, a partir de mi paleta, y yo elijo), recortada a 16:9 y a 1200×630; las salidas en AVIF y WebP en tres anchos, más un JPG para compartir; y una línea de créditos (título, autor, licencia, link) en un archivo de datos. Antes de procesar, que revise la licencia y frene si es NC. Probalo con una imagen de dominio público y mostrame el resultado.
```
