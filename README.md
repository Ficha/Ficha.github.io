# fidelchaves.com — hub personal

Sitio estático, sin build, sin frameworks. HTML + CSS + un poco de JS.
Pensado para GitHub Pages.

## Estructura

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/favicon.svg
assets/img/og-cover.png
assets/cv/               ← poné acá tus dos PDF de CV
robots.txt
sitemap.xml
llms.txt
```

## Antes de publicar (checklist)

1. **CV**: copiá tus dos PDFs a `assets/cv/` con estos nombres exactos
   (o cambiá los nombres en `index.html`, sección `#cv`):
   - `Fidel_Chaves_CV_2026_Castellano.pdf`
   - `Fidel_Chaves_CV_2026_English.pdf`

2. **Formulario de contacto (Formspree, gratis)**:
   - Creá una cuenta en https://formspree.io (plan free: 50 envíos/mes).
   - Creá un formulario nuevo, copiá el ID que te dan.
   - En `index.html`, buscá `YOUR_FORM_ID` (dentro de `<form id="contactForm" action="...">`)
     y reemplazalo por tu ID real.
   - Sin este paso, el formulario no envía nada — el resto del sitio funciona igual.

3. **Agendamiento con un clic (Calendly, gratis)**:
   - Creá tu cuenta y tu tipo de evento (ej. "15 min") en https://calendly.com.
   - En `index.html`, buscá `YOUR_CALENDLY_URL` (dentro de `<div id="calendlyWidget" data-url="...">`,
     sección `#contacto`) y reemplazalo por tu URL real
     (ej. `https://calendly.com/tu-usuario/15min`).
   - `main.js` detecta automáticamente la URL real y carga el widget de Calendly;
     mientras tanto se muestra un bloque invitando a escribir por mail.

4. **Dominio**: si comprás `fidelchaves.com` (o el que sea), reemplazá todas las
   apariciones de `https://fidelchaves.com/` en `index.html`, `robots.txt`,
   `sitemap.xml` y `llms.txt` por tu dominio real. Si vas a usar el subdominio
   gratuito de GitHub Pages (`tuusuario.github.io`), hacé lo mismo con esa URL.

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
- **SEO fundamentals**: un solo `<h1>`, meta description, canonical, Open
  Graph + Twitter Card con imagen propia (`og-cover.png`), `robots.txt`,
  `sitemap.xml`.
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

## Pendiente / a tu criterio

- No hay foto de perfil (usa solo tipografía). Si querés agregar una,
  guardala en `assets/img/`, agregá un `<img>` en el hero con `width`/`height`
  explícitos (para no generar layout shift) y `alt` descriptivo.
- El dominio en meta tags está seteado a `fidelchaves.com` como placeholder.
  Actualizalo cuando definas el dominio real.
