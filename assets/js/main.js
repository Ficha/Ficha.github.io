// Fidel Chaves — hub personal
// JS mínimo: menú mobile, año dinámico, preselección de "tipo de proyecto"
// desde los botones de servicios, envío del formulario por fetch (progressive
// enhancement: si falla o no hay JS, el form igual funciona por action/method),
// toggle de tema claro/oscuro y toggle de idioma ES/EN.

(function () {
  "use strict";

  var THEME_KEY = "fc-theme";
  var LANG_KEY = "fc-lang";

  // -----------------------------------------------------------------------
  // Menú mobile
  // -----------------------------------------------------------------------
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    var closeMenu = function (focusToggle) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (focusToggle) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        var firstLink = menu.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeMenu(true);
      }
    });
  }

  // Año en footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Preseleccionar el tipo de proyecto al venir de un "Consultar por esto"
  var tipoSelect = document.getElementById("tipo");
  document.querySelectorAll(".card__link[data-servicio]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (tipoSelect) {
        tipoSelect.value = link.getAttribute("data-servicio");
      }
    });
  });

  // -----------------------------------------------------------------------
  // Toggle de tema (claro/oscuro) — persistido, pisa prefers-color-scheme
  // -----------------------------------------------------------------------
  var themeToggle = document.getElementById("themeToggle");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }

  var ICON_SUN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>';
  var ICON_MOON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M19 13.5A8 8 0 1 1 10.5 5a6.3 6.3 0 0 0 8.5 8.5z"/></svg>';

  function renderThemeToggle() {
    if (!themeToggle) return;
    var theme = currentTheme();
    var lang = getLang();
    themeToggle.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? i18n[lang].theme.toLight : i18n[lang].theme.toDark
    );
  }

  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var themeColorMeta = document.getElementById("themeColorMeta");
    if (themeColorMeta) {
      var effective = theme || (systemPrefersDark() ? "dark" : "light");
      themeColorMeta.setAttribute("content", effective === "dark" ? "#1c1710" : "#eae3cf");
    }
    renderThemeToggle();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      applyTheme(next);
    });
  }

  // -----------------------------------------------------------------------
  // Idioma (ES/EN) — persistido, traduce todo lo marcado con data-i18n
  // -----------------------------------------------------------------------
  var i18n = {
    es: {
      skipLink: "Saltar al contenido",
      nav: {
        openMenu: "Abrir menú",
        about: "Sobre mí",
        services: "Servicios",
        portfolio: "Portfolio",
        online: "Enlaces",
        blog: "Blog",
        faq: "FAQ",
        contact: "Contacto",
      },
      theme: { toDark: "Cambiar a modo oscuro", toLight: "Cambiar a modo claro" },
      lang: { toEn: "Switch to English", toEs: "Cambiar a español" },
      hero: {
        eyebrow: "FIDEL CHAVES | COPYWRITER & UX WRITER CIENTÍFICO",
        title: "Traducí ideas complejas en mensajes claros.",
        pitch: "Ayudo a startups de biotecnología y software a comunicar su valor y lanzar productos sin perder rigor científico.",
        credential: 'Biólogo (UBA) <span class="hedera">❧</span> 2+ años en Stämm Biotech <span class="hedera">❧</span> 100+ piezas publicadas',
        ctaPrimary: "Contame tu proyecto ❧",
        ctaSecondary: "Ver portfolio ❧",
      },
      about: {
        heading: "Sobre mí",
        p1: "Soy licenciado y profesor en Ciencias Biológicas (UBA), y crecí trilingüe: español, francés e inglés. Actualmente estudio Edición, también en la UBA.",
        p2: 'Desde octubre de 2023 soy especialista en comunicación científica en <strong>Stämm</strong>, una startup de biotecnología: escribo whitepapers, artículos técnicos y guiones, y gestiono contenido trilingüe en Instagram, LinkedIn y X hace más de dos años.',
        p3: 'Antes fui copywriter en Awkbit (software factory) y profesor de biología en secundaria. Desde 2021 escribo ficción y no ficción cada semana en <a href="https://diariodeunrobot.substack.com/">Diario de un Robot</a>, mi newsletter en Substack.',
      },
      services: {
        heading: "Servicios",
        lead: "Tres cosas que hago bien y puedo hacer para vos.",
        card1: {
          title: "Redacción Técnica & Whitepapers",
          copy: "Redacto whitepapers, artículos técnicos y guiones explicativos que mantienen el rigor científico y explican tu tecnología a inversores, clientes y stakeholders.",
          cta: "Solicitar redacción técnica ❧",
        },
        card2: {
          title: "UX Writing & Copywriting Web",
          copy: "Rediseño el copy de pantallas, landing pages y flujos de usuario en SaaS y sitios B2B, para reducir fricción y mejorar la conversión.",
          cta: "Auditar el copy de mi web ❧",
        },
        card3: {
          title: "Thought Leadership & Ghostwriting",
          copy: "Gestiono estrategia y redacción de contenido en LinkedIn y Substack para fundadores y empresas, con constancia semanal e impacto real en su industria.",
          cta: "Potenciar mi marca ejecutiva ❧",
        },
      },
      portfolio: {
        heading: "Portfolio",
        lead: "Piezas concretas, no promesas.",
        item1: {
          tag: "UX Writing & Copywriting Web",
          title: "Rediseño del sitio de Stämm",
          copy: "UX writing completo para el lanzamiento del nuevo producto de Stämm, explicando una tecnología compleja sin descuidar contratación ni prensa.",
          link1: "Ver sitio ❧",
        },
        item2: {
          tag: "Redacción Técnica & Whitepapers",
          title: "Lanzamiento del HTB (Stämm)",
          copy: "Redacción del comunicado de prensa del Bubble-Free Bioprocessor y guión del video de lanzamiento: precisión técnica sobre biomanufactura para audiencia especializada.",
          link1: "Ver comunicado ❧",
          link2: "Ver video ❧",
        },
        item4: {
          tag: "Redes sociales",
          title: "Reel explicativo (Instagram)",
          copy: "Guión y exposición a cámara para explicar un tema científico en formato reel.",
          link1: "Ver reel ❧",
        },
        item6: {
          tag: "Divulgación científica",
          title: "La timidez de las copas",
          copy: "Ensayo de divulgación botánica: por qué los árboles evitan tocar sus copas entre sí, con bibliografía científica citada y trabajo de campo propio.",
          link1: "Leer en Substack ❧",
        },
        item8: {
          tag: "Ensayo",
          title: "No tengo ideas propias",
          copy: "Ensayo sobre el origen de las ideas y si existe, en rigor, algo así como una idea completamente nueva.",
          link1: "Leer en Substack ❧",
        },
        item11: {
          tag: "Ficción",
          title: "La chispa (adelanto)",
          copy: "Prólogo de un libro de cuentos actualmente en edición.",
          link1: "Leer el adelanto ❧",
        },
        item12: {
          tag: "Próximo caso",
          title: "Tu proyecto",
          copy: "Esta tarjeta todavía no existe. La próxima pieza que sume a este portfolio puede ser un proyecto tuyo, si me contás de qué se trata.",
          link1: "Contame tu proyecto ❧",
        },
      },
      testimonials: {
        heading: "Lo que dicen de mí",
        t1: {
          quote: "Cada texto tenía intención: sabía exactamente a quién le hablaba, qué quería lograr, y cómo hacerlo sin resignar creatividad.",
          name: "Florencia Tracchia",
          role: "Ex supervisora en Awkbit",
        },
        t2: {
          quote: "Excelente profesional, con un amplio conocimiento del campo científico y una gran capacidad para comunicarlo de manera clara, atractiva y atrapante.",
          name: "Martina Casas",
          role: "Strategic Communications & Project Leadership",
        },
        t3: {
          quote: "Convierte el profundo conocimiento de la biología al lenguaje común: lo difícil de comprender muta en un aprendizaje lúdico e informativo.",
          name: "Joaquín Peña Gazal",
          role: "Visual & Graphic Designer",
        },
        t4: {
          quote: "Tiene un gran manejo de las palabras, producto de su sensibilidad a la hora de observar y de su pasión por la lectura.",
          name: "Mariana Salcedo",
          role: "Bióloga, Comunicación Científica",
        },
      },
      network: {
        heading: "¿Tu proyecto requiere más de lo que ofrezco?",
        lead: "Tengo una red de colaboradores de confianza en:",
        item1: "Diseño gráfico",
        item2: "Filmmaking",
        item3: "Edición de video",
        item4: "Maquetación de libros",
        item5: "Project management",
        item6: "Corrección de estilo y ortotipográfica",
        item7: "Fotografía",
        cta: "Contame qué necesitás ❧",
      },
      online: {
        heading: "Enlaces",
      },
      cv: {
        heading: "Curriculum",
      },
      blog: {
        metaTitle: "Blog | Fidel Chaves",
        metaDescription: "Ficción y ensayos de Fidel Chaves: relatos, divulgación científica y reflexiones sobre ciencia, tecnología y lo que nos hace humanos.",
        heading: "Blog",
        lead: "Ficción y ensayos. Lo que escribo cada semana en Diario de un Robot, migrado acá de a poco.",
        tagFiction: "Ficción",
        tagEssay: "Ensayo",
        backLink: "← Volver al inicio",
        backToBlog: "← Volver al blog",
      },
      blogChispa: {
        eyebrow: "Destacado | libro de cuentos",
        lead: "Dieciséis cuentos encadenados sobre lo que prende, lo que arde y lo que queda. El libro está en edición: por ahora puede leerse el prólogo; el resto va a ir saliendo.",
        readBtn: "Leer el prólogo",
        read: "Leer",
        tocTitle: "Índice",
        waiting: "Pronto",
        waitingFull: "A la espera de publicación",
        tocNote: "Pronto: a la espera de publicación. Regalo: Faetón te llega por mail.",
        ctaText: "Para leer el resto, tocá cualquier cuento del índice o el botón. Si dejás tu mail, te escribo cuando haya novedades y te mando Faetón de regalo, en PDF y EPUB.",
        gift: "Regalo",
        giftFull: "De regalo al dejar tu mail",
        faetonLink: "Leer Faetón, el cuento de regalo ❧",
        bitacora: "Bitácora del proceso",
        ctaBtn: "¿Te interesa leer más? Hacemelo saber",
        more: "Más para leer",
      },
      guiaClaude: {
        title: "Cómo trabajo con Claude gastando menos",
        eyebrow: "Guía",
        lead: "Lo que aprendí para usar Claude todo el día sin quedarme sin cuota el martes, con los prompts y las plantillas para que lo armes vos.",
        backLink: "← Volver al blog",
        footerNote: "¿Te sirvió? Podés",
        footerLink: "invitarme un cafecito",
        metaTitle: "Cómo trabajo con Claude gastando menos | Fidel Chaves",
        metaDescription: "Economía de tokens, un newsletter semanal de mejora continua e infraestructura para Claude: guía, prompts y plantillas .md para descargar.",
      },
      ensayoIdeasPropias: {
        title: "No tengo ideas propias",
        eyebrow: "Ensayo",
        lead: "¿Existen las ideas nuevas, o solo remezclamos lo que ya conocemos? Un recorrido por Platón, Borges, Gorodischer y el camino del héroe.",
        backLink: "← Volver al blog",
        footerNote: "Este ensayo se publicó originalmente en Diario de un Robot. Si te interesa seguir leyendo,",
        footerLink: "suscribite al newsletter",
        metaTitle: "No tengo ideas propias | Fidel Chaves",
        metaDescription: "Ensayo sobre el origen de las ideas y si existe, en rigor, algo así como una idea completamente nueva.",
      },
      cookieConsent: {
        message: "Uso Google Analytics para entender qué contenido funciona. No hay cookies de publicidad ni venta de datos a terceros.",
        accept: "Aceptar",
        reject: "Rechazar",
      },
      faq: {
        heading: "Preguntas frecuentes",
        lead: "Lo que más me preguntan antes de arrancar un proyecto.",
        q1: {
          q: "¿Cómo cotizás un proyecto?",
          a: "Depende del trabajo: los proyectos puntuales (un whitepaper, una landing page) se cotizan por alcance, extensión y plazo. La colaboración continua va por retainer mensual. En la llamada de 15 minutos te paso un número concreto.",
        },
        q2: {
          q: "¿Cuánto tarda un proyecto típico en entregarse?",
          a: "Depende del contenido: un posteo de LinkedIn o un ajuste de UX copy puede estar en pocos días; un whitepaper o artículo técnico extenso suele llevar 2 a 3 semanas.",
        },
        q3: {
          q: "¿Trabajás con clientes fuera de Argentina o en inglés?",
          a: "Sí. Trabajo 100% remoto con clientes de cualquier país, y puedo redactar en español, inglés o francés según lo que necesite tu equipo.",
        },
        q4: {
          q: "¿Cuántas rondas de revisión incluye cada proyecto?",
          a: "1 o 2 rondas de ajustes sobre el primer borrador. Cambios más grandes, como un replanteo completo del enfoque, se cotizan aparte.",
        },
        q5: {
          q: "¿Qué necesitás de mí para arrancar un proyecto?",
          a: "Un brief con objetivo, público y tono, más acceso a las fuentes técnicas: papers, documentación interna o alguien de tu equipo a quien consultarle dudas puntuales.",
        },
        q6: {
          q: "¿Firmás acuerdos de confidencialidad (NDA)?",
          a: "Sí, sin problema. Si tu empresa maneja información sensible (por ejemplo, propiedad intelectual en biotecnología), firmo el NDA que tengas o puedo proponer uno propio.",
        },
        q7: {
          q: "¿Qué medios de pago aceptás y cómo facturás?",
          a: "Transferencia bancaria, PayPal y también criptomonedas.",
        },
        q8: {
          q: "¿Trabajás por proyecto puntual o solo con retainers mensuales?",
          a: "Las dos modalidades: proyectos puntuales (un whitepaper, una landing, una tanda de posts) y colaboración continua mensual (retainer) para necesidades recurrentes de contenido.",
        },
      },
      contact: {
        heading: "¿Simplificamos tu mensaje y escalamos tu comunicación?",
        subtitle: "Contame de qué se trata tu proyecto y te respondo con feedback concreto en menos de 48 horas.",
        ctaPrimary: "Contame tu proyecto ❧",
        ctaSecondary: "Ver el portfolio ❧",
        altText: 'Escribime a <a href="mailto:fidelchaves96@gmail.com">fidelchaves96@gmail.com</a>.',
      },
      form: {
        name: "Nombre",
        email: "Email",
        projectType: "Tipo de proyecto",
        message: "Mensaje",
        other: "Otro",
        honeypot: "No completar este campo",
        submit: "Enviar",
        sending: "Enviando...",
        success: "Gracias, te respondo pronto.",
        error: "Hubo un problema. Escribime directo a fidelchaves96@gmail.com.",
        namePlaceholder: "Ej: Juana Pérez",
        emailPlaceholder: "vos@tuempresa.com",
        messagePlaceholder: "Contame en pocas líneas de qué se trata tu proyecto: objetivo, timeline y presupuesto aproximado.",
      },
      meta: {
        title: "Fidel Chaves | Copywriter y UX Writer científico",
        description: "Fidel Chaves ayuda a startups DeepTech y equipos de producto a comunicar su valor con textos claros: redacción técnica, UX writing y ghostwriting.",
      },
      cvPage: {
        metaTitle: "Curriculum | Fidel Chaves",
        metaDescription: "CV completo de Fidel Chaves: experiencia, educación y habilidades, sin necesidad de descargar nada.",
      },
      laChispa: {
        eyebrow: "Ficción | adelanto",
        lead: "Prólogo de un libro de cuentos actualmente en edición. Esta es una primera versión; el texto final puede variar.",
        note: "Este texto está escrito en español.",
        backLink: "← Volver al blog",
        footerNote: "Este es un adelanto del libro de cuentos que estoy terminando de editar. Si te interesa el resto, o querés hablar de una edición/publicación,",
        footerLink: "escribime",
        ctaBtn: "¿Te interesa leer más? Hacemelo saber",
        blogLink: "Ver más ficción y ensayos en el blog ❧",
        metaTitle: "La chispa (adelanto) | Fidel Chaves",
        metaDescription: "Adelanto de 'La chispa', prólogo de un libro de cuentos de Fidel Chaves actualmente en edición.",
      },
      faeton: {
        eyebrow: "Ficción | cuento de La chispa",
        lead: "Un cuento de La chispa, libro en edición. Es un regalo: leelo acá o bajalo en PDF o EPUB.",
        note: "Este texto está escrito en español. Versión en revisión; el texto final del libro puede variar.",
        pdf: "Bajar PDF",
        epub: "Bajar EPUB",
        metaTitle: "Faetón (cuento) | Fidel Chaves",
        metaDescription: "Faetón, un cuento de La chispa, el libro de Fidel Chaves. Para leer acá o bajar en PDF y EPUB.",
      },
      bitacoraChispa: {
        eyebrow: "Ficción | bitácora",
        title: "Bitácora de La chispa",
        lead: "Cómo se edita un libro de cuentos entre amigos: lo que hicimos, lo que aprendimos y lo que sigue. Se va llenando a medida que avanza.",
        note: "Esta bitácora está escrita en español.",
        back: "Leer el adelanto de La chispa ❧",
        metaTitle: "Bitácora de La chispa | Fidel Chaves",
        metaDescription: "El proceso de edición de La chispa, libro de cuentos de Fidel Chaves, contado paso a paso con quienes participan.",
      },
      notFound: {
        title: "Esta página se extinguió (o nunca evolucionó).",
        lead: "El enlace que buscás no existe, se movió o se escribió mal. Como buen biólogo: no todas las especies sobreviven a una reestructuración de sitio.",
        ctaHome: "Volver al inicio ❧",
        ctaContact: "Avisame que el link está roto ❧",
        metaTitle: "Página no encontrada | Fidel Chaves",
        metaDescription: "La página que buscás no existe o se movió. Volvé al inicio del sitio de Fidel Chaves.",
      },
    },
    en: {
      skipLink: "Skip to content",
      nav: {
        openMenu: "Open menu",
        about: "About",
        services: "Services",
        portfolio: "Portfolio",
        online: "Online",
        blog: "Blog",
        faq: "FAQ",
        contact: "Contact",
      },
      theme: { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
      lang: { toEn: "Switch to English", toEs: "Cambiar a español" },
      hero: {
        eyebrow: "FIDEL CHAVES | SCIENTIFIC COPYWRITER & UX WRITER",
        title: "I translate biotech, software and complex ideas into clear copy.",
        pitch: "I help DeepTech startups, tech companies and product teams communicate their value, launch products and write technical content without losing scientific rigor.",
        credential: 'Biologist (UBA) <span class="hedera">❧</span> 2+ years at Stämm Biotech <span class="hedera">❧</span> 100+ published pieces',
        ctaPrimary: "Tell me about your project ❧",
        ctaSecondary: "See Case Studies & Work ❧",
      },
      about: {
        heading: "About me",
        p1: "I hold a degree and teaching credential in Biological Sciences (UBA), and grew up trilingual: Spanish, French and English. I'm currently studying Editing, also at UBA.",
        p2: 'Since October 2023 I\'ve been the scientific communication specialist at <strong>Stämm</strong>, a biotech startup: I write whitepapers, technical articles and video scripts, and manage trilingual content on Instagram, LinkedIn and X, at least one post per week per channel, kept up for over two years.',
        p3: 'Before that I was a copywriter at Awkbit (a software factory) and a high school biology teacher. Since 2021 I\'ve written fiction and non-fiction every week in <a href="https://diariodeunrobot.substack.com/">Diario de un Robot</a>, my newsletter on Substack.',
      },
      services: {
        heading: "Services",
        lead: "Three things I do well and can do for you.",
        card1: {
          title: "Technical Writing & Whitepapers",
          copy: "Is your technology groundbreaking but nobody outside your lab understands it? I write whitepapers, technical articles and explainer scripts that keep 100% of the scientific rigor while educating investors, customers and stakeholders.",
          cta: "Request a Technical Writing proposal ❧",
        },
        card2: {
          title: "UX Writing & Web Copywriting",
          copy: "Built for SaaS, complex platforms and B2B sites. I redesign the copy on your screens, landing pages and user flows to cut friction, improve onboarding and lift your conversion rate.",
          cta: "Audit my web copy ❧",
        },
        card3: {
          title: "Thought Leadership & Ghostwriting",
          copy: "Build technical authority without spending 10 hours a week on it. I manage content strategy and writing for founders and companies on LinkedIn and Substack, with real weekly consistency and impact in your industry.",
          cta: "Power up my executive brand ❧",
        },
      },
      portfolio: {
        heading: "Portfolio",
        lead: "Concrete work, not promises.",
        item1: {
          tag: "UX Writing & Web Copywriting",
          title: "Stämm website redesign",
          copy: "Full UX writing for the launch of Stämm's new product: explaining a complex technology without losing the hiring and press angles.",
          link1: "See the site ❧",
        },
        item2: {
          tag: "Technical Writing & Whitepapers",
          title: "HTB launch (Stämm)",
          copy: "Wrote the press release for the Bubble-Free Bioprocessor and the launch video script: technical precision on biomanufacturing for a specialized audience.",
          link1: "Read the press release ❧",
          link2: "Watch the video ❧",
        },
        item4: {
          tag: "Social media",
          title: "Explainer reel (Instagram)",
          copy: "Script and on-camera delivery to explain a scientific topic in reel format.",
          link1: "Watch the reel ❧",
        },
        item6: {
          tag: "Science communication",
          title: "The shyness of the treetops",
          copy: "A science essay on why trees avoid touching each other's crowns, citing scientific literature and my own field observations.",
          link1: "Read on Substack ❧",
        },
        item8: {
          tag: "Essay",
          title: "I don't have original ideas",
          copy: "An essay on where ideas come from, and whether anything like a completely original idea actually exists.",
          link1: "Read on Substack ❧",
        },
        item11: {
          tag: "Fiction",
          title: "La chispa (preview, in Spanish)",
          copy: "Prologue of a short story collection currently being edited. Written in Spanish.",
          link1: "Read the preview ❧",
        },
        item12: {
          tag: "Next case study",
          title: "Your project",
          copy: "This card doesn't exist yet. The next piece to join this portfolio could be a project of yours, if you tell me what it's about.",
          link1: "Tell me about your project ❧",
        },
      },
      testimonials: {
        heading: "What people say",
        t1: {
          quote: "Every piece had intention: he knew exactly who he was writing for, what he wanted to achieve, and how to do it without giving up creativity.",
          name: "Florencia Tracchia",
          role: "Former manager at Awkbit",
        },
        t2: {
          quote: "An excellent professional, with deep scientific knowledge and a real talent for communicating it clearly and engagingly.",
          name: "Martina Casas",
          role: "Strategic Communications & Project Leadership",
        },
        t3: {
          quote: "He turns deep biological knowledge into everyday language: what's hard to grasp becomes playful, informative learning.",
          name: "Joaquín Peña Gazal",
          role: "Visual & Graphic Designer",
        },
        t4: {
          quote: "He has a real command of language, shaped by his sensitivity as an observer and his love of reading.",
          name: "Mariana Salcedo",
          role: "Biologist, Science Communication",
        },
      },
      network: {
        heading: "Does your project need more than what I offer?",
        lead: "I can get you help. I have a trusted network of collaborators in:",
        item1: "Graphic design",
        item2: "Filmmaking",
        item3: "Video editing",
        item4: "Book layout & typesetting",
        item5: "Project management",
        item6: "Copyediting & proofreading",
        item7: "Photography",
        cta: "Tell me what you need ❧",
      },
      online: {
        heading: "Links",
      },
      cv: {
        heading: "Resume",
      },
      blog: {
        metaTitle: "Blog | Fidel Chaves",
        metaDescription: "Fiction and essays by Fidel Chaves: short stories, science communication and reflections on science, technology and what makes us human.",
        heading: "Blog",
        lead: "Fiction and essays. What I write every week in Diario de un Robot, migrated over here bit by bit.",
        tagFiction: "Fiction",
        tagEssay: "Essay",
        backLink: "← Back to home",
        backToBlog: "← Back to the blog",
      },
      blogChispa: {
        eyebrow: "Featured | short stories",
        lead: "Sixteen linked stories about what ignites, what burns and what remains. The book is being edited: for now only the prologue can be read; the rest will come out little by little. The stories are in Spanish.",
        readBtn: "Read the prologue",
        read: "Read",
        tocTitle: "Contents",
        waiting: "Soon",
        waitingFull: "Awaiting publication",
        tocNote: "Soon: awaiting publication. Gift: Faetón arrives by email.",
        ctaText: "To read the rest, tap any story in the contents or the button. If you leave your email, I'll write when there's news and send you Faetón as a gift, in PDF and EPUB.",
        gift: "Gift",
        giftFull: "Free when you leave your email",
        faetonLink: "Read Faetón, the gift story ❧",
        bitacora: "Process log",
        ctaBtn: "Want to read more? Let me know",
        more: "More to read",
      },
      guiaClaude: {
        title: "How I work with Claude on fewer tokens",
        eyebrow: "Guide",
        lead: "What I learned about using Claude all day without running out of quota by Tuesday, with prompts and templates to build your own.",
        backLink: "← Back to the blog",
        footerNote: "Found it useful? You can",
        footerLink: "buy me a coffee",
        metaTitle: "How I work with Claude on fewer tokens | Fidel Chaves",
        metaDescription: "Token economy, a weekly self-improvement newsletter and setup for Claude: guide, prompts and downloadable .md templates.",
      },
      ensayoIdeasPropias: {
        title: "I don't have original ideas",
        eyebrow: "Essay",
        lead: "Do new ideas actually exist, or do we just remix what we already know? A tour through Plato, Borges, Gorodischer and the hero's journey.",
        backLink: "← Back to blog",
        footerNote: "This essay was originally published in Diario de un Robot. If you'd like to keep reading,",
        footerLink: "subscribe to the newsletter",
        metaTitle: "I don't have original ideas | Fidel Chaves",
        metaDescription: "Essay on where ideas come from, and whether anything like a completely original idea actually exists.",
      },
      cookieConsent: {
        message: "I use Google Analytics to understand what content works. No advertising cookies, no selling data to third parties.",
        accept: "Accept",
        reject: "Reject",
      },
      faq: {
        heading: "FAQ",
        lead: "What people ask me most before starting a project.",
        q1: {
          q: "How do you price a project?",
          a: "It depends on the type of work: one-off projects (a whitepaper, a landing page) are quoted based on scope, length and timeline. For ongoing collaboration (weekly content, LinkedIn management) we set up a monthly retainer. I'll give you a concrete number on the 15-minute call.",
        },
        q2: {
          q: "How long does a typical project take?",
          a: "It varies a lot by content type: a LinkedIn post or a UX copy tweak can be ready in a few days, while a whitepaper or long technical article usually takes 2 to 3 weeks, depending on how complex the topic is and how available the sources are.",
        },
        q3: {
          q: "Do you work with clients outside Argentina or in English?",
          a: "Yes. I work 100% remote with clients anywhere, and I can write in Spanish, English or French depending on what your team needs.",
        },
        q4: {
          q: "How many revision rounds are included?",
          a: "Each project includes 1 or 2 rounds of edits on the first draft. If you need bigger changes beyond that, say, a full rethink of the approach, we quote that separately.",
        },
        q5: {
          q: "What do you need from me to get started?",
          a: "A brief covering your goal, audience and tone, plus access to the relevant technical sources: papers, internal docs, or someone on your team I can ask specific questions to. The more scientific rigor the piece needs, the more that last part matters.",
        },
        q6: {
          q: "Do you sign NDAs?",
          a: "Yes, no problem. If your company handles sensitive information, say, IP in biotech, I'll sign your NDA or propose one of my own.",
        },
        q7: {
          q: "What payment methods do you accept and how do you invoice?",
          a: "Bank transfer, international platforms like Wise or PayPal, and crypto too.",
        },
        q8: {
          q: "Do you take one-off projects or only monthly retainers?",
          a: "Both: one-off projects (a whitepaper, a landing page, a batch of posts) and ongoing monthly retainers for recurring content needs.",
        },
      },
      contact: {
        heading: "Ready to simplify your message and scale your communication?",
        subtitle: "Tell me about your project and I'll get back to you with actionable feedback within 48 hours.",
        ctaPrimary: "Tell me about your project ❧",
        ctaSecondary: "See my portfolio ❧",
        altText: 'Write to <a href="mailto:fidelchaves96@gmail.com">fidelchaves96@gmail.com</a>.',
      },
      form: {
        name: "Name",
        email: "Email",
        projectType: "Project type",
        message: "Message",
        other: "Other",
        honeypot: "Leave this field empty",
        submit: "Send",
        sending: "Sending...",
        success: "Thanks, I'll get back to you soon.",
        error: "Something went wrong. Write to me directly at fidelchaves96@gmail.com.",
        namePlaceholder: "E.g: Jane Doe",
        emailPlaceholder: "you@yourcompany.com",
        messagePlaceholder: "Tell me in a few lines what your project is about: goal, timeline and rough budget.",
      },
      cvPage: {
        metaTitle: "Resume | Fidel Chaves",
        metaDescription: "Fidel Chaves' full CV: experience, education and skills, no download required.",
      },
      laChispa: {
        eyebrow: "Fiction | preview",
        lead: "Prologue of a short story collection currently being edited. This is an early draft; the final text may change.",
        note: "This piece is written in Spanish.",
        backLink: "← Back to the blog",
        footerNote: "This is a preview of the short story collection I'm finishing editing. If you'd like to read the rest, or want to talk about editing/publishing it,",
        footerLink: "email me",
        ctaBtn: "Want to read more? Let me know",
        blogLink: "See more fiction and essays on the blog ❧",
        metaTitle: "La chispa (preview) | Fidel Chaves",
        metaDescription: "Preview of 'La chispa', prologue of a short story collection by Fidel Chaves currently being edited.",
      },
      faeton: {
        eyebrow: "Fiction | story from La chispa",
        lead: "A story from La chispa, a book being edited. It's a gift: read it here or download it as PDF or EPUB.",
        note: "This piece is written in Spanish. Draft under revision; the final text of the book may change.",
        pdf: "Download PDF",
        epub: "Download EPUB",
        metaTitle: "Faetón (story) | Fidel Chaves",
        metaDescription: "Faetón, a story from La chispa, the book by Fidel Chaves. Read it here or download it as PDF and EPUB.",
      },
      bitacoraChispa: {
        eyebrow: "Fiction | process log",
        title: "La chispa process log",
        lead: "How a short story collection gets edited among friends: what we did, what we learned and what comes next. It fills up as the work moves on.",
        note: "This log is written in Spanish.",
        back: "Read the preview of La chispa ❧",
        metaTitle: "La chispa process log | Fidel Chaves",
        metaDescription: "The editing process of La chispa, a short story collection by Fidel Chaves, told step by step with the people involved.",
      },
      notFound: {
        title: "This page went extinct (or never evolved).",
        lead: "The link you're looking for doesn't exist, moved, or maybe got typed wrong. As a biologist, I can tell you: not every species survives a site restructure.",
        ctaHome: "Back to homepage ❧",
        ctaContact: "Let me know the link is broken ❧",
        metaTitle: "Page not found | Fidel Chaves",
        metaDescription: "The page you're looking for doesn't exist or moved. Head back to Fidel Chaves' homepage.",
      },
      meta: {
        title: "Fidel Chaves | Scientific Copywriter & UX Writer",
        description: "Fidel Chaves helps DeepTech startups and product teams communicate their value with clear, converting copy: technical writing, UX writing and ghostwriting.",
      },
    },
  };

  function getByPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  var langToggle = document.getElementById("langToggle");

  function getLang() {
    var stored;
    try {
      stored = localStorage.getItem(LANG_KEY);
    } catch (e) {}
    return stored === "en" ? "en" : "es";
  }

  function renderLangToggle(lang) {
    if (!langToggle) return;
    langToggle.textContent = lang === "es" ? "EN" : "ES";
    langToggle.setAttribute("aria-label", lang === "es" ? i18n.es.lang.toEn : i18n.en.lang.toEs);
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === "en" ? "en" : "es-AR";
    document.documentElement.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = getByPath(i18n[lang], el.getAttribute("data-i18n"));
      if (typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = getByPath(i18n[lang], el.getAttribute("data-i18n-html"));
      if (typeof val === "string") el.innerHTML = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var val = getByPath(i18n[lang], el.getAttribute("data-i18n-placeholder"));
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });

    // Cada página puede declarar su propia clave de metadatos con
    // data-meta-key en <body> (ej. "notFound"); por defecto usa "meta".
    var metaKey = document.body.getAttribute("data-meta-key") || "meta";
    var pageMeta = getByPath(i18n[lang], metaKey) || i18n[lang].meta;
    var titleEl = document.querySelector("title");
    if (titleEl) titleEl.textContent = pageMeta.metaTitle || pageMeta.title;
    var descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", pageMeta.metaDescription || pageMeta.description);

    renderLangToggle(lang);
    renderThemeToggle();
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = getLang() === "es" ? "en" : "es";
      try {
        localStorage.setItem(LANG_KEY, next);
      } catch (e) {}
      applyLang(next);
    });
  }

  // Estado inicial (tema ya se aplicó en el <head> para evitar flash; acá
  // solo sincronizamos el botón e idioma)
  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {}
  if (storedTheme) applyTheme(storedTheme);
  applyLang(getLang());

  // -----------------------------------------------------------------------
  // Consentimiento de cookies (Google Consent Mode v2) — el <head> de cada
  // página ya seteó el consentimiento por defecto en "denied" antes de que
  // cargue gtag.js. Acá solo mostramos el banner si no hay una decisión
  // guardada, y actualizamos el consentimiento cuando el usuario elige.
  // -----------------------------------------------------------------------
  var CONSENT_KEY = "fc-consent";

  function applyConsent(value) {
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: value === "granted" ? "granted" : "denied",
        ad_storage: "denied",
      });
    }
  }

  function initConsentBanner() {
    var banner = document.getElementById("cookieConsent");
    if (!banner) return;
    var stored = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch (e) {}

    if (stored === "granted" || stored === "denied") {
      applyConsent(stored);
      return;
    }

    banner.classList.add("is-visible");
    var acceptBtn = document.getElementById("cookieAccept");
    var rejectBtn = document.getElementById("cookieReject");
    var decide = function (value) {
      try {
        localStorage.setItem(CONSENT_KEY, value);
      } catch (e) {}
      applyConsent(value);
      banner.classList.remove("is-visible");
    };
    if (acceptBtn) acceptBtn.addEventListener("click", function () { decide("granted"); });
    if (rejectBtn) rejectBtn.addEventListener("click", function () { decide("denied"); });
  }

  initConsentBanner();

  // -----------------------------------------------------------------------
  // Envío del formulario vía fetch para no salir de la página
  // -----------------------------------------------------------------------
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        // Formspree todavía no configurado: dejar que el form haga submit normal
        // (fallará visiblemente, lo cual es preferible a fingir éxito).
        return;
      }
      e.preventDefault();
      var lang = getLang();
      status.textContent = i18n[lang].form.sending;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          status.textContent = res.ok ? i18n[getLang()].form.success : i18n[getLang()].form.error;
          if (res.ok) form.reset();
        })
        .catch(function () {
          status.textContent = i18n[getLang()].form.error;
        });
    });
  }
})();
