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
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
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
        online: "En internet",
        cv: "CV",
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
        description: "Fidel Chaves ayuda a startups DeepTech, empresas de tecnología y equipos de producto a comunicar su valor con textos claros que convierten. Redacción técnica, UX writing y ghostwriting en LinkedIn.",
      },
    },
    en: {
      skipLink: "Skip to content",
      nav: {
        openMenu: "Open menu",
        about: "About",
        services: "Services",
        online: "Online",
        cv: "CV",
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
      meta: {
        title: "Fidel Chaves — Scientific Copywriter & UX Writer",
        description: "Fidel Chaves helps DeepTech startups, tech companies and product teams communicate their value with clear copy that converts. Technical writing, UX writing and LinkedIn ghostwriting.",
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

    var titleEl = document.querySelector("title");
    if (titleEl) titleEl.textContent = i18n[lang].meta.title;
    var descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", i18n[lang].meta.description);

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
  // Parallax sutil: despega los títulos del fondo al hacer scroll.
  // Respeta prefers-reduced-motion (no corre nada si el usuario lo pidió).
  // -----------------------------------------------------------------------
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (parallaxEls.length && !reduceMotion) {
    // Offset relativo al scroll acumulado desde la carga (no a la posición
    // en el viewport): así el offset arranca siempre en 0, sin saltos que
    // superpongan el texto con el contenido de abajo al cargar la página.
    var parallaxBaseline = window.scrollY || window.pageYOffset || 0;
    var parallaxTicking = false;
    var updateParallax = function () {
      var delta = (window.scrollY || window.pageYOffset || 0) - parallaxBaseline;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.05;
        el.style.transform = "translateY(" + (delta * speed).toFixed(1) + "px)";
      });
      parallaxTicking = false;
    };
    var onParallaxScroll = function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    };
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    window.addEventListener("resize", onParallaxScroll);
    updateParallax();
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
