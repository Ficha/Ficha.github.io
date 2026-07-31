# Fidel Chaves — hub personal (ficha.github.io)

Sitio estático, sin build, sin frameworks. HTML + CSS + un poco de JS.
Pensado para GitHub Pages.

## Estructura

```
index.html
404.html                  ← página de error personalizada (GitHub Pages la sirve sola)
cv.html                   ← CV completo en HTML, bilingüe, sin descargar nada
ficcion/la-chispa.html    ← adelanto de ficción, linkeado desde #portfolio
assets/css/style.css
assets/js/main.js
assets/img/favicon.svg
assets/img/favicon-32.png
assets/img/favicon-16.png
assets/img/apple-touch-icon.png
assets/img/og-cover.png
assets/cv/                ← los dos PDF de CV
robots.txt
sitemap.xml
llms.txt
```

## Configuración ya hecha

Estos puntos ya están resueltos en el sitio actual — quedan documentados acá
por si en algún momento hay que cambiarlos:

- **CV**: el contenido completo vive en `cv.html` (ES/EN, sin necesidad de
  descargar nada). Los dos PDF originales siguen en `assets/cv/`
  (`Fidel_Chaves_CV_2026_Castellano.pdf` y `Fidel_Chaves_CV_2026_English.pdf`)
  y quedan linkeados como opción secundaria al pie de `cv.html`, por si
  alguien todavía quiere un archivo. Si actualizás tu trayectoria, hay que
  actualizar `cv.html` a mano (no se genera desde el PDF).
- **Formulario de contacto (Formspree)**: `index.html` ya usa un ID real de
  Formspree (`action="https://formspree.io/f/xgogqzvj"`) en `#contactForm`.
  Si cambiás de cuenta, reemplazá ese ID.
- **Agendamiento (Calendly)**: `#calendlyWidget` ya tiene una URL real
  (`data-url="https://calendly.com/fidelchaves96/15-minute-meeting"`).
  `main.js` la detecta automáticamente y carga el widget; si no hubiera URL
  real, se muestra el bloque invitando a escribir por mail.
- **Dominio**: todas las URLs (`index.html`, `404.html`, `robots.txt`,
  `sitemap.xml`, `llms.txt`) ya apuntan a `https://ficha.github.io/`. Si en
  algún momento comprás un dominio propio, reemplazá esas apariciones y
  agregá un archivo `CNAME` (ver sección de deploy abajo).
- **Google Analytics (GA4)**: el tag de `gtag.js` (`G-631LPGC1XE`) ya está en
  el `<head>` de `index.html`, `404.html`, `cv.html` y `ficcion/la-chispa.html`
  — mide visitas y también hits a la 404 (útil para detectar links rotos). Si
  cambiás de propiedad de GA, reemplazá el ID en los cuatro archivos.
- **`og-cover.png`**: regenerada con la paleta actual (negro mate + verde
  bosque + hueso) y el dominio real (`ficha.github.io`). Si cambiás el
  copy/tagline del hero, conviene regenerar esta imagen para que no quede
  desalineada (está armada con un script simple de Pillow, no es un diseño
  a mano).
- **Google Search Console**: propiedad verificada vía meta tag
  (`<meta name="google-site-verification" content="...">` en el `<head>` de
  `index.html`). Solo hace falta en la home — Search Console verifica ahí y
  cubre todo el dominio. Si alguna vez perdés la verificación, repetí el
  proceso en Search Console y actualizá el `content`.
- **Portfolio** (`#portfolio`): sección con 11 casos reales (sitio de Stämm,
  comunicado del HTB, cobertura de BIO 2026, reels de Instagram, ensayos de
  Substack, sitio y guía de Awkbit, y el adelanto de ficción), cada uno
  etiquetado por tipo de servicio y linkeando a la pieza real. El botón
  "Ver Casos y Trabajos" del hero ahora apunta acá en vez de a `#servicios`.

## Deploy en GitHub Pages

1. Creá un repo en GitHub (puede ser público o privado con Pages habilitado
   en plan free si es público).
2. Subí todo el contenido de esta carpeta a la raíz del repo.
3. En el repo: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
4. Esperá 1-2 minutos. El sitio queda en `https://tuusuario.github.io/nombre-repo/`.
5. Si comprás un dominio propio: agregá un archivo `CNAME` en la raíz con el
   dominio adentro (ej. `fidelchaves.com`), y configurá los DNS del dominio
   apuntando a GitHub Pages (A records a las IPs de GitHub o CNAME a
   `tuusuario.github.io`, según el caso). Instrucciones oficiales:
   https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

## Qué se implementó y por qué

- **Sin frameworks ni build step**: HTML/CSS/JS plano. Carga rápida, nada que
  romperse, cero dependencias que mantener.
- **Mobile-first**: el CSS parte del layout angosto y agrega columnas recién
  a partir de 720px.
- **Alto contraste**: paleta Bone White / Matte Black + un solo acento
  (Forest Green) usado solo en fondos de botones/hover, nunca como color de
  texto sobre fondo claro, para no romper contraste WCAG.
- **Tema claro/oscuro**: sigue `prefers-color-scheme` por default, con un
  toggle manual en el nav (`#themeToggle`) que persiste la preferencia en
  `localStorage` y evita flash de color al cargar.
- **Idioma ES/EN**: todo el copy vive en el diccionario `i18n` de `main.js`
  (atributos `data-i18n` / `data-i18n-html` en el HTML). El toggle del nav
  (`#langToggle`) persiste la preferencia en `localStorage`.
- **Accesibilidad**: skip link, landmarks semánticos (`header`/`nav`/`main`/
  `footer`), foco visible (`:focus-visible`), labels asociados a cada campo
  del form, honeypot invisible para spam (no captcha, no fricción para
  personas), `prefers-reduced-motion` respetado, soporta `prefers-color-scheme`.
  El menú mobile además cierra con `Escape` (devolviendo el foco al botón que
  lo abrió) y manda el foco al primer link al abrirse.
- **Red de seguridad para `color-mix()`**: cada regla que usa `color-mix()`
  (botones ghost, badge del hero, link cards, inputs, icon buttons) declara
  primero un `background` sólido de respaldo (`var(--bg-alt)`). Si el
  navegador no soporta `color-mix()`, esa línea se ignora y queda el color
  sólido en vez de un fondo transparente/roto.
- **SEO fundamentals**: un solo `<h1>`, meta description de ~145 caracteres
  (para no truncarse en el buscador), canonical, Open Graph + Twitter Card
  con imagen propia (`og-cover.png`, con `og:image:width/height/alt`
  declarados), `robots.txt`, `sitemap.xml`.
- **404 personalizada**: `404.html` reutiliza el mismo header/nav/footer,
  gradiente de fondo, tema claro/oscuro e idioma ES/EN que el resto del
  sitio (agrega su propio `<title>`/meta description vía `data-meta-key` en
  `main.js`, para no heredar los del home). GitHub Pages la sirve
  automáticamente para cualquier ruta inexistente, sin configuración extra.
- **Preguntas frecuentes** (`#faq`): acordeón nativo con `<details>/<summary>`
  (sin JS adicional), 8 preguntas típicas de un cliente freelance
  (cotización, plazos, clientes en el exterior, revisiones incluidas, brief
  necesario, NDA, medios de pago, modalidad de trabajo), traducidas en el
  diccionario `i18n` como el resto del copy.
- **Íconos**: además del `favicon.svg` (actualizado a la paleta Forest
  Green / Matte Black / Bone White), se generaron `favicon-32.png`,
  `favicon-16.png` (respaldo para navegadores sin soporte de SVG favicon) y
  `apple-touch-icon.png` de 180×180 (ícono al agregar el sitio a la pantalla
  de inicio en iOS).
- **`theme-color` dinámico**: un único `<meta name="theme-color"
  id="themeColorMeta">` que el script anti-flash del `<head>` y el toggle de
  tema en `main.js` actualizan según el tema efectivo (guardado o del
  sistema), para que la barra del navegador en mobile matchee el fondo
  claro/oscuro real, no solo la preferencia del SO.
- **Imagen del hero priorizada**: `fetchpriority="high"` en la foto, ya que
  es la imagen más grande arriba del pliegue (candidata a LCP).
- **JSON-LD (schema.org/Person)**: datos estructurados con rol, empleador,
  idiomas y enlaces a redes (`sameAs`), para que buscadores y asistentes
  entiendan quién sos sin tener que inferirlo del texto.
- **llms.txt**: resumen del sitio en markdown plano, siguiendo la convención
  emergente para que los LLMs que lean la web (respuestas de ChatGPT/Perplexity/etc.)
  tengan un resumen limpio en vez de tener que parsear HTML.
- **Funnel de contacto**: cada sección de servicio linkea a un único form de
  contacto con un select de "tipo de proyecto" que se autocompleta al venir
  de un botón "Consultar por esto" — reduce fricción sin fragmentar el form
  en tres.
- **Portfolio con prueba real**: las cards de `#portfolio` usan `.tag` para
  la categoría y `background: var(--bg-alt)` (con su propio fallback de
  `color-mix()`) para contrastar contra la sección, que es `section` plana
  igual que el resto. El caso del HTB tiene dos links (comunicado + video),
  por eso existe `.card__links` como variante de layout en columna.
- **`ficcion/la-chispa.html`**: subpágina con el mismo header/nav/footer,
  tema, idioma y GA que el resto del sitio (vía `data-meta-key="laChispa"`
  en `main.js`, mismo mecanismo que usa `404.html`). El cuento en sí queda
  fijo en español (no tiene sentido traducir prosa literaria automáticamente
  al alternar idioma); solo el chrome de la página y una nota aclaratoria
  cambian con el toggle ES/EN.
- **Red de colaboradores** (`#colaboradores`): sección simple con `.chips`
  (lista de pills) listando las disciplinas donde puedo conseguir ayuda
  (diseño gráfico, filmmaking, edición de video, maquetación de libros,
  project management, corrección de estilo y ortotipográfica, fotografía),
  con CTA a `#contacto`. Sumé `flex-wrap: wrap` al nav de escritorio de paso,
  porque ya son 8 links y en anchos intermedios podían desbordar.
- **`cv.html`**: el CV completo como página del sitio en vez de solo un PDF
  para descargar. A diferencia del resto del copy (que usa el diccionario
  `i18n` de `main.js`), el contenido del CV vive directamente en el HTML en
  dos bloques (`[data-lang-content="es"]` y `[data-lang-content="en"]`) que
  se muestran u ocultan por CSS según el atributo `data-lang` que ya setea
  `main.js` al togglear idioma. Se eligió así en vez de meter todo el texto
  del CV en el diccionario de JS porque es mucho contenido de una sola vez
  (experiencia, educación, cursos) y no gana nada por vivir ahí. Los PDF
  originales quedan como opción secundaria al pie de la página.

## Pendiente / a tu criterio

- **Prueba social**: no hay testimonios de clientes ni de Stämm.
- **Consentimiento de cookies**: Google Analytics ya está instalado pero sin
  banner de consentimiento. Si el público objetivo incluye visitantes de la
  UE/UK (el copy apunta a startups DeepTech, muchas europeas), conviene sumar
  un aviso de cookies antes de que `gtag` corra, para cumplir GDPR/ePrivacy.
- **Bing Webmaster Tools**: todavía no está conectado (Google Search Console
  ya sí).
