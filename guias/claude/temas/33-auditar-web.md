---
slug: auditar-web
nivel: 6
nuevo: si
titulo: Auditar una web
bajada: Medir antes de tocar, Search Console, el SEO que no se ve y un chequeo que corre antes de publicar.
---

Le ofrecí a un medio amigo revisarle el sitio con lo que vengo aprendiendo. El sitio estaba bien hecho, y aun así encontré una lista. La ordené en bloques, cada uno con sus links y un prompt para que lo corran con su Claude. Esta tarjeta es esa lista, sin el sitio.

## 1. Medir antes de tocar

[PageSpeed Insights](https://pagespeed.web.dev/) mide velocidad, accesibilidad, buenas prácticas y SEO. Correlo en móvil, que es como lee casi todo el mundo y la versión que Google usa para ordenar resultados. Anotá los cuatro puntajes con la fecha. Sin esa foto no vas a saber si los cambios sirvieron.

Una sospecha que casi siempre se confirma: las tipografías. Tres familias de Google Fonts con varios pesos cada una suelen ser lo primero que marca.

## 2. Search Console

[Search Console](https://search.google.com/search-console) te dice qué buscan las personas que llegan a tu sitio, qué páginas indexó Google y cuáles no, y por qué. Es gratis y es lo más útil de esta tarjeta. Bing tiene la suya y la puede importar. Esto lo hacés vos: Claude no tiene que entrar a tus cuentas.

## 3. El SEO que no se ve

- **Título, descripción y dirección canónica** en cada página.
- **Vista previa al compartir** (`og:*`): una imagen de 1200 × 630 con texto alternativo. Si todas las páginas usan la misma, en WhatsApp todas se ven iguales.
- **Datos estructurados** (JSON-LD): le dicen a Google “esto es un artículo, de esta autora, publicado tal día”.
- **Un `sitemap.xml` con fechas**, un feed RSS y un `llms.txt` para los buscadores con IA.

## 4. Que se pueda seguir

Lo que más importaba en el sitio de mi amigo no era técnico: no había forma de seguirlos. Ni newsletter ni RSS ni formulario. Quien leía una nota y le gustaba no tenía cómo volver.

## El chequeo antes de publicar

En mi sitio, nada se mergea sin que pase un script, `verificar_seo.py`, con cero fallas. Revisa lo del punto 3 en las páginas que cambiaron. No usa IA: cada página nueva pasa por los mismos controles, me acuerde o no. Lo de la accesibilidad (botones de 44 px, contraste) está en [Accesible desde el principio](accesibilidad.html).

```text
Auditá el sitio de esta carpeta. Primero te pego el informe de PageSpeed Insights en móvil: ordená los problemas por impacto y decime qué archivo cambia cada uno. Después revisá cada página: título, descripción, canónica, og:* con imagen de 1200×630 y texto alternativo, twitter:card, JSON-LD, presencia en el sitemap con fecha, feed RSS y llms.txt. Revisá también si hay una forma de suscribirse. Armá un script sin IA que falle si a una página le falta algo de esa lista. Mostrame el plan antes de cambiar nada.
```
