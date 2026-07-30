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

  function renderThemeToggle() {
    if (!themeToggle) return;
    var theme = currentTheme();
    var lang = getLang();
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
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
      themeColorMeta.setAttribute("content", effective === "dark" ? "#28282b" : "#f9f6ee");
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
        online: "En internet",
        cv: "CV",
        faq: "FAQ",
        contact: "Contacto",
      },
      theme: { toDark: "Cambiar a modo oscuro", toLight: "Cambiar a modo claro" },
      lang: { toEn: "Switch to English", toEs: "Cambiar a español" },
      hero: {
        eyebrow: "FIDEL CHAVES — COPYWRITER & UX WRITER CIENTÍFICO",
        title: "Traduzco biotecnología, software e ideas complejas en textos claros que convierten.",
        pitch: "Ayudo a startups DeepTech, empresas de tecnología y equipos de producto a comunicar su valor, lanzar productos y redactar contenido técnico sin perder el rigor científico.",
        badge: "🧬 Biólogo (UBA) · 2+ años en Stämm Biotech · +100 ediciones publicadas",
        ctaPrimary: "Agendar llamada de exploración (15 min)",
        ctaSecondary: "Ver Casos y Trabajos →",
        availability: "Tomo pocos proyectos nuevos por mes — si tu idea encaja, respondo en 48hs.",
      },
      about: {
        heading: "Sobre mí",
        p1: "Soy licenciado y profesor en Ciencias Biológicas (UBA). Actualmente estudio Edición, también en la UBA.",
        p2: 'Desde octubre de 2023 soy especialista en comunicación científica en <strong>Stämm</strong>, una startup de biotecnología: escribo whitepapers, artículos técnicos y guiones para video, y gestiono contenido trilingüe en Instagram, LinkedIn y X — mínimo un posteo semanal por red, sostenido hace más de dos años.',
        p3: 'Antes fui copywriter en Awkbit (software factory) y profesor de biología en secundaria. Desde 2021 escribo ficción y no ficción cada semana en <a href="https://diariodeunrobot.substack.com/">Diario de un Robot</a>, mi newsletter en Substack.',
        p4: "Crecí trilingüe: español, francés e inglés.",
      },
      services: {
        heading: "Servicios",
        lead: "Tres cosas que hago bien y puedo hacer para vos.",
        card1: {
          title: "Redacción Técnica & Whitepapers",
          copy: "¿Tu tecnología es revolucionaria pero nadie fuera de tu laboratorio la entiende? Redacto whitepapers, artículos técnicos y guiones explicativos que mantienen el 100% del rigor científico mientras educan a inversores, clientes y partes interesadas.",
          cta: "Solicitar propuesta para Redacción Técnica →",
        },
        card2: {
          title: "UX Writing & Copywriting Web",
          copy: "Diseñado para SaaS, plataformas complejas y sitios B2B. Rediseño el copy de tus pantallas, landing pages y flujos de usuario para reducir la fricción, mejorar la incorporación (onboarding) e incrementar la tasa de conversión.",
          cta: "Auditar el copy de mi sitio web →",
        },
        card3: {
          title: "Thought Leadership & Ghostwriting",
          copy: "Construye autoridad técnica sin dedicar 10 horas a la semana. Gestiono la estrategia y redacción de contenido para fundadores y empresas en LinkedIn y Substack, garantizando constancia semanal e impacto real en tu industria.",
          cta: "Potenciar mi marca ejecutiva →",
        },
      },
      portfolio: {
        heading: "Portfolio",
        lead: "Piezas concretas, no promesas.",
        item1: {
          tag: "UX Writing & Copywriting Web",
          title: "Rediseño del sitio de Stämm",
          copy: "UX writing completo para el lanzamiento del nuevo producto de Stämm: explicar una tecnología compleja sin desatender las verticales de contratación y de prensa.",
          link1: "Ver sitio →",
        },
        item2: {
          tag: "Redacción Técnica & Whitepapers",
          title: "Lanzamiento del HTB (Stämm)",
          copy: "Redacción del comunicado de prensa del Bubble-Free Bioprocessor y guión del video de lanzamiento: precisión técnica sobre biomanufactura para audiencia especializada.",
          link1: "Ver comunicado →",
          link2: "Ver video →",
        },
        item3: {
          tag: "Thought Leadership & Ghostwriting",
          title: "Cobertura de BIO 2026",
          copy: "Posteo de cierre de feria (Booth 5735) para la página de Stämm en LinkedIn: crónica con nombres y contexto real en vez de genérico corporativo, sostenido en más de dos años de posteo semanal.",
          link1: "Ver página de Stämm →",
        },
        item4: {
          tag: "Redes sociales",
          title: "Reel explicativo (Instagram)",
          copy: "Guión y exposición a cámara para explicar un tema científico en formato reel. Más de 4.000 likes y 80 comentarios.",
          link1: "Ver reel →",
        },
        item5: {
          tag: "Redes sociales",
          title: "Reel de entrevista (Instagram)",
          copy: "Conducción y edición de una entrevista en formato reel para Instagram. Más de 100 likes.",
          link1: "Ver reel →",
        },
        item6: {
          tag: "Divulgación científica",
          title: "La timidez de las copas",
          copy: "Ensayo de divulgación botánica: por qué los árboles evitan tocar sus copas entre sí, con bibliografía científica citada y trabajo de campo propio.",
          link1: "Leer en Substack →",
        },
        item7: {
          tag: "Ensayo",
          title: "¿Quién le tiene miedo al Golem?",
          copy: "Ensayo sobre inteligencia artificial, mito y las preguntas que todavía no tenemos respondidas frente a ella.",
          link1: "Leer en Substack →",
        },
        item8: {
          tag: "Ensayo",
          title: "No tengo ideas propias",
          copy: "Ensayo sobre el origen de las ideas y si existe, en rigor, algo así como una idea completamente nueva.",
          link1: "Leer en Substack →",
        },
        item9: {
          tag: "UX Writing & Copywriting Web",
          title: "Sitio de Awkbit",
          copy: "Renové el texto completo del sitio de Awkbit (software factory), con foco en claridad para leads técnicos y no técnicos por igual.",
          link1: "Ver sitio →",
        },
        item10: {
          tag: "Thought Leadership & Ghostwriting",
          title: "Guía de gestión de desarrollo de software",
          copy: "Artículo de thought leadership de formato largo para el blog de Awkbit en Medium: guía integral sobre roles, metodologías (Scrum, XP, DevOps) y armado de equipos de desarrollo.",
          link1: "Leer en Medium →",
        },
        item11: {
          tag: "Ficción",
          title: "La chispa (adelanto)",
          copy: "Prólogo de un libro de cuentos actualmente en edición.",
          link1: "Leer el adelanto →",
        },
      },
      online: {
        heading: "En internet",
        lead: "Todo lo que hago, en un solo lugar.",
        linkedin: "Mi actividad profesional, en tiempo real.",
        instagram: "Detrás de escena, lecturas y lo que no entra en un posteo de LinkedIn.",
        substack: "Newsletter semanal de ensayo y ficción sobre ciencia, tecnología y lo que nos hace humanos. Gratis, sin algoritmo de por medio.",
      },
      cv: {
        heading: "Curriculum",
        lead: "Toda la trayectoria en un PDF.",
      },
      faq: {
        heading: "Preguntas frecuentes",
        lead: "Lo que más me preguntan antes de arrancar un proyecto.",
        q1: {
          q: "¿Cómo cotizás un proyecto?",
          a: "Depende del tipo de trabajo: los proyectos puntuales (un whitepaper, una landing page) se cotizan según alcance, extensión y plazo. Para colaboración continua (contenido semanal, gestión de LinkedIn) armamos un retainer mensual. En la llamada de 15 minutos te paso un número concreto.",
        },
        q2: {
          q: "¿Cuánto tarda un proyecto típico en entregarse?",
          a: "Varía mucho según el tipo de contenido: un posteo de LinkedIn o un ajuste de UX copy puede estar en pocos días, mientras que un whitepaper o artículo técnico extenso suele llevar 2 a 3 semanas, según la complejidad del tema y la disponibilidad de fuentes.",
        },
        q3: {
          q: "¿Trabajás con clientes fuera de Argentina o en inglés?",
          a: "Sí. Trabajo 100% remoto con clientes de cualquier país, y puedo redactar en español, inglés o francés según lo que necesite tu equipo.",
        },
        q4: {
          q: "¿Cuántas rondas de revisión incluye cada proyecto?",
          a: "Cada proyecto incluye 1 o 2 rondas de ajustes sobre el primer borrador. Si necesitás cambios más grandes fuera de ese alcance (por ejemplo, un replanteo completo del enfoque), lo cotizamos aparte.",
        },
        q5: {
          q: "¿Qué necesitás de mí para arrancar un proyecto?",
          a: "Un brief con el objetivo, el público y el tono que buscás, más acceso a las fuentes técnicas relevantes: papers, documentación interna o alguien de tu equipo a quien pueda consultarle dudas puntuales. Cuanto más rigor científico requiera el texto, más importa esto último.",
        },
        q6: {
          q: "¿Firmás acuerdos de confidencialidad (NDA)?",
          a: "Sí, sin problema. Si tu empresa maneja información sensible (por ejemplo, propiedad intelectual en biotecnología), firmo el NDA que tengas o puedo proponer uno propio.",
        },
        q7: {
          q: "¿Qué medios de pago aceptás y cómo facturás?",
          a: "Transferencia bancaria, plataformas internacionales como Wise o PayPal, y también criptomonedas.",
        },
        q8: {
          q: "¿Trabajás por proyecto puntual o solo con retainers mensuales?",
          a: "Las dos modalidades: proyectos puntuales (un whitepaper, una landing, una tanda de posts) y colaboración continua mensual (retainer) para necesidades recurrentes de contenido.",
        },
      },
      contact: {
        heading: "¿Listo para simplificar tu mensaje y escalar tu comunicación?",
        subtitle: "Agenda una breve sesión de 15 minutos para revisar los desafíos de tu proyecto. Sin compromiso y con feedback accionable desde el primer día.",
        ctaPrimary: "Contame tu proyecto →",
        ctaSecondary: "Portfolio en actualización — escribime →",
        calendlyFallback: "Todavía no tengo agenda online activa — escribime y coordinamos el día y horario que mejor te quede.",
        altText: '¿Preferís el correo tradicional? Escribime a <a href="mailto:fidelchaves96@gmail.com">fidelchaves96@gmail.com</a> y te respondo en menos de 24 horas hábiles.',
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
        title: "Fidel Chaves — Copywriter y UX Writer científico",
        description: "Fidel Chaves ayuda a startups DeepTech y equipos de producto a comunicar su valor con textos claros: redacción técnica, UX writing y ghostwriting.",
      },
      laChispa: {
        eyebrow: "Ficción — adelanto",
        lead: "Prólogo de un libro de cuentos actualmente en edición. Esta es una primera versión; el texto final puede variar.",
        note: "Este texto está escrito en español.",
        backLink: "← Volver al portfolio",
        footerNote: "Este es un adelanto del libro de cuentos que estoy terminando de editar. Si te interesa el resto, o querés hablar de una edición/publicación,",
        footerLink: "escribime",
        metaTitle: "La chispa (adelanto) — Fidel Chaves",
        metaDescription: "Adelanto de 'La chispa', prólogo de un libro de cuentos de Fidel Chaves actualmente en edición.",
      },
      notFound: {
        title: "Esta página se extinguió (o nunca evolucionó).",
        lead: "El enlace que buscás no existe, se movió, o quizás se escribió mal. Como buen biólogo: no todas las especies sobreviven a una reestructuración de sitio.",
        ctaHome: "Volver al inicio →",
        ctaContact: "Avisame que el link está roto →",
        metaTitle: "Página no encontrada — Fidel Chaves",
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
        cv: "CV",
        faq: "FAQ",
        contact: "Contact",
      },
      theme: { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
      lang: { toEn: "Switch to English", toEs: "Cambiar a español" },
      hero: {
        eyebrow: "FIDEL CHAVES — SCIENTIFIC COPYWRITER & UX WRITER",
        title: "I translate biotech, software and complex ideas into clear copy that converts.",
        pitch: "I help DeepTech startups, tech companies and product teams communicate their value, launch products and write technical content without losing scientific rigor.",
        badge: "🧬 Biologist (UBA) · 2+ years at Stämm Biotech · 100+ published pieces",
        ctaPrimary: "Book a 15-min discovery call",
        ctaSecondary: "See Case Studies & Work →",
        availability: "I take on a few new projects per month — if your idea fits, I reply within 48h.",
      },
      about: {
        heading: "About me",
        p1: "I hold a degree and teaching credential in Biological Sciences (UBA). I'm currently studying Editing, also at UBA.",
        p2: 'Since October 2023 I\'ve been the scientific communication specialist at <strong>Stämm</strong>, a biotech startup: I write whitepapers, technical articles and video scripts, and manage trilingual content on Instagram, LinkedIn and X — at least one post per week per channel, kept up for over two years.',
        p3: 'Before that I was a copywriter at Awkbit (a software factory) and a high school biology teacher. Since 2021 I\'ve written fiction and non-fiction every week in <a href="https://diariodeunrobot.substack.com/">Diario de un Robot</a>, my newsletter on Substack.',
        p4: "I grew up trilingual: Spanish, French and English.",
      },
      services: {
        heading: "Services",
        lead: "Three things I do well and can do for you.",
        card1: {
          title: "Technical Writing & Whitepapers",
          copy: "Is your technology groundbreaking but nobody outside your lab understands it? I write whitepapers, technical articles and explainer scripts that keep 100% of the scientific rigor while educating investors, customers and stakeholders.",
          cta: "Request a Technical Writing proposal →",
        },
        card2: {
          title: "UX Writing & Web Copywriting",
          copy: "Built for SaaS, complex platforms and B2B sites. I redesign the copy on your screens, landing pages and user flows to cut friction, improve onboarding and lift your conversion rate.",
          cta: "Audit my website copy →",
        },
        card3: {
          title: "Thought Leadership & Ghostwriting",
          copy: "Build technical authority without spending 10 hours a week on it. I manage content strategy and writing for founders and companies on LinkedIn and Substack, with real weekly consistency and impact in your industry.",
          cta: "Power up my executive brand →",
        },
      },
      portfolio: {
        heading: "Portfolio",
        lead: "Concrete work, not promises.",
        item1: {
          tag: "UX Writing & Web Copywriting",
          title: "Stämm website redesign",
          copy: "Full UX writing for the launch of Stämm's new product: explaining a complex technology without losing the hiring and press angles.",
          link1: "See the site →",
        },
        item2: {
          tag: "Technical Writing & Whitepapers",
          title: "HTB launch (Stämm)",
          copy: "Wrote the press release for the Bubble-Free Bioprocessor and the launch video script: technical precision on biomanufacturing for a specialized audience.",
          link1: "Read the press release →",
          link2: "Watch the video →",
        },
        item3: {
          tag: "Thought Leadership & Ghostwriting",
          title: "BIO 2026 coverage",
          copy: "Closing post for the trade show (Booth 5735) on Stämm's LinkedIn page: a real, name-dropping recap instead of generic corporate copy, backed by more than two years of weekly posting.",
          link1: "See Stämm's page →",
        },
        item4: {
          tag: "Social media",
          title: "Explainer reel (Instagram)",
          copy: "Script and on-camera delivery to explain a scientific topic in reel format. 4,000+ likes and 80 comments.",
          link1: "Watch the reel →",
        },
        item5: {
          tag: "Social media",
          title: "Interview reel (Instagram)",
          copy: "Hosted and edited an interview in reel format for Instagram. 100+ likes.",
          link1: "Watch the reel →",
        },
        item6: {
          tag: "Science communication",
          title: "The shyness of the treetops",
          copy: "A science essay on why trees avoid touching each other's crowns, citing scientific literature and my own field observations.",
          link1: "Read on Substack →",
        },
        item7: {
          tag: "Essay",
          title: "Who's afraid of the Golem?",
          copy: "An essay on artificial intelligence, myth, and the questions we still haven't answered about it.",
          link1: "Read on Substack →",
        },
        item8: {
          tag: "Essay",
          title: "I don't have original ideas",
          copy: "An essay on where ideas come from, and whether anything like a completely original idea actually exists.",
          link1: "Read on Substack →",
        },
        item9: {
          tag: "UX Writing & Web Copywriting",
          title: "Awkbit website",
          copy: "Rewrote the entire copy for Awkbit's website (a software factory), focused on clarity for both technical and non-technical leads.",
          link1: "See the site →",
        },
        item10: {
          tag: "Thought Leadership & Ghostwriting",
          title: "Software development management guide",
          copy: "Long-form thought leadership piece for Awkbit's blog on Medium: a full guide to roles, methodologies (Scrum, XP, DevOps) and building development teams.",
          link1: "Read on Medium →",
        },
        item11: {
          tag: "Fiction",
          title: "La chispa (preview, in Spanish)",
          copy: "Prologue of a short story collection currently being edited. Written in Spanish.",
          link1: "Read the preview →",
        },
      },
      online: {
        heading: "Online",
        lead: "Everything I do, in one place.",
        linkedin: "My professional activity, in real time.",
        instagram: "Behind the scenes, reading notes and everything that doesn't fit in a LinkedIn post.",
        substack: "Weekly newsletter of essays and fiction about science, technology and what makes us human. Free, no algorithm involved.",
      },
      cv: {
        heading: "Resume",
        lead: "My full background in one PDF.",
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
          a: "Each project includes 1 or 2 rounds of edits on the first draft. If you need bigger changes beyond that — say, a full rethink of the approach — we quote that separately.",
        },
        q5: {
          q: "What do you need from me to get started?",
          a: "A brief covering your goal, audience and tone, plus access to the relevant technical sources: papers, internal docs, or someone on your team I can ask specific questions to. The more scientific rigor the piece needs, the more that last part matters.",
        },
        q6: {
          q: "Do you sign NDAs?",
          a: "Yes, no problem. If your company handles sensitive information — say, IP in biotech — I'll sign your NDA or propose one of my own.",
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
        subtitle: "Book a quick 15-minute session to walk through your project's challenges. No strings attached, with actionable feedback from day one.",
        ctaPrimary: "Tell me about your project →",
        ctaSecondary: "Portfolio coming soon — email me →",
        calendlyFallback: "I don't have online scheduling active yet — write to me and we'll find a day and time that works for you.",
        altText: 'Prefer plain old email? Write to <a href="mailto:fidelchaves96@gmail.com">fidelchaves96@gmail.com</a> and I\'ll reply within 24 business hours.',
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
      laChispa: {
        eyebrow: "Fiction — preview",
        lead: "Prologue of a short story collection currently being edited. This is an early draft; the final text may change.",
        note: "This piece is written in Spanish.",
        backLink: "← Back to portfolio",
        footerNote: "This is a preview of the short story collection I'm finishing editing. If you'd like to read the rest, or want to talk about editing/publishing it,",
        footerLink: "email me",
        metaTitle: "La chispa (preview) — Fidel Chaves",
        metaDescription: "Preview of 'La chispa', prologue of a short story collection by Fidel Chaves currently being edited.",
      },
      notFound: {
        title: "This page went extinct (or never evolved).",
        lead: "The link you're looking for doesn't exist, moved, or maybe got typed wrong. As a biologist, I can tell you: not every species survives a site restructure.",
        ctaHome: "Back to homepage →",
        ctaContact: "Let me know the link is broken →",
        metaTitle: "Page not found — Fidel Chaves",
        metaDescription: "The page you're looking for doesn't exist or moved. Head back to Fidel Chaves' homepage.",
      },
      meta: {
        title: "Fidel Chaves — Scientific Copywriter & UX Writer",
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
  // Calendly: carga el widget real solo si se configuró una URL propia;
  // si no, se muestra el bloque de contacto por mail (ya visible por CSS).
  // -----------------------------------------------------------------------
  var calendlyWidget = document.getElementById("calendlyWidget");
  var calendlyFallback = document.getElementById("calendlyFallback");
  if (calendlyWidget) {
    var calendlyUrl = calendlyWidget.getAttribute("data-url") || "";
    if (calendlyUrl.indexOf("YOUR_CALENDLY_URL") === -1) {
      calendlyWidget.classList.add("calendly-inline-widget", "is-active");
      if (calendlyFallback) calendlyFallback.classList.add("is-hidden");
      var script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }

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
