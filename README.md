<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Fidel Chaves — Scientific Communication, Writing & UX. Buenos Aires.">
  <title>Fidel Chaves</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
  <style>
    /* ─── RESET ──────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ─── VARIABLES ──────────────────────────────── */
    :root {
      --bg:          #0c0c0a;
      --surface:     #131311;
      --border:      #232220;
      --text:        #e2ddd3;
      --muted:       #66625c;
      --accent:      #b89060;
      --accent-soft: rgba(184,144,96,.12);
      --f-serif:     'Playfair Display', Georgia, serif;
      --f-body:      'Crimson Pro', Georgia, serif;
      --f-mono:      'DM Mono', 'Courier New', monospace;
      --max:         1080px;
      --pad:         clamp(1.5rem, 6vw, 5rem);
    }

    /* ─── BASE ───────────────────────────────────── */
    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--f-body);
      font-size: clamp(16px, 1.1vw, 18px);
      line-height: 1.75;
      overflow-x: hidden;
    }

    a { color: inherit; text-decoration: none; }

    ::selection { background: var(--accent); color: var(--bg); }

    /* ─── GRAIN OVERLAY ──────────────────────────── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .025;
      pointer-events: none;
      z-index: 9999;
    }

    /* ─── NAV ────────────────────────────────────── */
    #nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem var(--pad);
      background: var(--bg);
      border-bottom: 1px solid var(--border);
    }

    .nav-brand {
      font-family: var(--f-serif);
      font-size: .95rem;
      letter-spacing: .02em;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      font-family: var(--f-mono);
      font-size: .65rem;
      font-weight: 300;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--muted);
      transition: color .2s;
    }

    .nav-links a:hover { color: var(--text); }

    #langBtn {
      font-family: var(--f-mono);
      font-size: .65rem;
      font-weight: 400;
      letter-spacing: .1em;
      text-transform: uppercase;
      background: none;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: .3rem .65rem;
      cursor: pointer;
      transition: border-color .2s, color .2s;
    }

    #langBtn:hover { border-color: var(--accent); color: var(--accent); }

    @media (max-width: 600px) { .nav-links { display: none; } }

    /* ─── HERO ───────────────────────────────────── */
    #hero {
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 7rem var(--pad) 5rem;
      border-bottom: 1px solid var(--border);
      position: relative;
    }

    .hero-location {
      font-family: var(--f-mono);
      font-size: .65rem;
      font-weight: 300;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 2.5rem;
    }

    .hero-name {
      font-family: var(--f-serif);
      font-size: clamp(4.5rem, 13vw, 11rem);
      font-weight: 700;
      line-height: .9;
      letter-spacing: -.025em;
      margin-bottom: 3rem;
    }

    .hero-name .italic {
      font-style: italic;
      font-weight: 400;
      color: var(--accent);
    }

    .hero-divider {
      width: 2.5rem;
      height: 1px;
      background: var(--accent);
      margin-bottom: 1.75rem;
    }

    .hero-sub {
      font-family: var(--f-serif);
      font-style: italic;
      font-size: clamp(1.05rem, 1.8vw, 1.35rem);
      color: var(--muted);
      max-width: 44ch;
      line-height: 1.55;
    }

    .hero-scroll {
      position: absolute;
      bottom: 2.5rem;
      right: var(--pad);
      font-family: var(--f-mono);
      font-size: .6rem;
      font-weight: 300;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
      writing-mode: vertical-rl;
      display: flex;
      align-items: center;
      gap: .6rem;
    }

    .hero-scroll::before {
      content: '';
      display: block;
      width: 1px;
      height: 3.5rem;
      background: var(--border);
      animation: scrollPulse 2.5s ease-in-out infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { opacity: .3; transform: scaleY(1); }
      50%       { opacity: 1;  transform: scaleY(1.2); }
    }

    /* ─── SECTION SHELL ──────────────────────────── */
    .s-wrap { border-bottom: 1px solid var(--border); }

    .s-inner {
      max-width: var(--max);
      margin: 0 auto;
      padding: 5.5rem var(--pad);
    }

    .s-label {
      font-family: var(--f-mono);
      font-size: .62rem;
      font-weight: 300;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 3.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .s-label::after {
      content: '';
      height: 1px;
      width: 6rem;
      background: var(--border);
    }

    /* ─── FADE-UP ANIMATION ──────────────────────── */
    .fu {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity .65s ease, transform .65s ease;
    }
    .fu.in { opacity: 1; transform: none; }
    .fu.d1 { transition-delay: .1s; }
    .fu.d2 { transition-delay: .2s; }
    .fu.d3 { transition-delay: .3s; }
    .fu.d4 { transition-delay: .4s; }
    .fu.d5 { transition-delay: .5s; }

    /* ─── SERVICES ───────────────────────────────── */
    .svc-list { border-top: 1px solid var(--border); }

    .svc-item {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 2.5rem;
      padding: 2rem 0;
      border-bottom: 1px solid var(--border);
      transition: background .2s;
    }

    .svc-item:hover { background: var(--accent-soft); margin: 0 calc(var(--pad) * -1); padding: 2rem var(--pad); }

    .svc-name {
      font-family: var(--f-serif);
      font-size: 1.2rem;
      font-weight: 400;
      padding-top: .15rem;
    }

    .svc-desc {
      color: var(--muted);
      font-size: .95rem;
      line-height: 1.65;
    }

    @media (max-width: 560px) {
      .svc-item { grid-template-columns: 1fr; gap: .5rem; }
      .svc-item:hover { margin: 0; padding: 2rem 0; }
    }

    /* ─── CONTACT ────────────────────────────────── */
    .contact-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
    }

    @media (max-width: 720px) {
      .contact-wrap { grid-template-columns: 1fr; gap: 3.5rem; }
    }

    .contact-intro {
      font-family: var(--f-serif);
      font-style: italic;
      font-size: clamp(1.15rem, 2.2vw, 1.6rem);
      line-height: 1.45;
      margin-bottom: 2.5rem;
      color: var(--text);
    }

    .contact-links { display: flex; flex-direction: column; gap: 1.1rem; }

    .c-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: var(--f-mono);
      font-size: .78rem;
      font-weight: 300;
      color: var(--muted);
      letter-spacing: .02em;
      transition: color .2s;
    }

    .c-link:hover { color: var(--accent); }

    .c-link-bar {
      width: 1.75rem;
      height: 1px;
      background: currentColor;
      flex-shrink: 0;
      transition: width .2s;
    }

    .c-link:hover .c-link-bar { width: 2.5rem; }

    /* Form */
    .c-form { display: flex; flex-direction: column; gap: 1.5rem; }

    .f-field { display: flex; flex-direction: column; gap: .4rem; }

    .f-label {
      font-family: var(--f-mono);
      font-size: .6rem;
      font-weight: 300;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .f-input, .f-textarea {
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: var(--f-body);
      font-size: 1rem;
      padding: .7rem .9rem;
      outline: none;
      width: 100%;
      transition: border-color .2s;
      -webkit-appearance: none;
    }

    .f-input:focus, .f-textarea:focus { border-color: var(--accent); }

    .f-textarea { resize: vertical; min-height: 110px; }

    .f-btn {
      align-self: flex-start;
      background: none;
      border: 1px solid var(--accent);
      color: var(--accent);
      font-family: var(--f-mono);
      font-size: .65rem;
      font-weight: 400;
      letter-spacing: .1em;
      text-transform: uppercase;
      padding: .7rem 1.6rem;
      cursor: pointer;
      transition: background .2s, color .2s;
    }

    .f-btn:hover { background: var(--accent); color: var(--bg); }

    /* ─── PROJECTS ───────────────────────────────── */
    .proj-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 720px) { .proj-grid { grid-template-columns: 1fr; } }

    .proj-card {
      border: 1px solid var(--border);
      padding: 2rem 1.75rem 2rem;
      position: relative;
      overflow: hidden;
      transition: border-color .3s;
    }

    .proj-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform .35s ease;
    }

    .proj-card:hover { border-color: var(--accent); }
    .proj-card:hover::after { transform: scaleX(1); }

    .proj-tag {
      font-family: var(--f-mono);
      font-size: .6rem;
      font-weight: 300;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 1rem;
    }

    .proj-name {
      font-family: var(--f-serif);
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: .9rem;
    }

    .proj-desc {
      color: var(--muted);
      font-size: .93rem;
      line-height: 1.65;
    }

    /* ─── ABOUT ──────────────────────────────────── */
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 5rem;
    }

    @media (max-width: 720px) { .about-grid { grid-template-columns: 1fr; gap: 3rem; } }

    .about-facts { display: flex; flex-direction: column; gap: 2rem; }

    .fact-label {
      font-family: var(--f-mono);
      font-size: .6rem;
      font-weight: 300;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: .3rem;
    }

    .fact-val { font-size: .95rem; }

    .about-body p {
      font-size: clamp(.98rem, 1.2vw, 1.08rem);
      margin-bottom: 1.5rem;
    }

    .about-body p:last-child { margin-bottom: 0; }

    .pullquote {
      font-family: var(--f-serif);
      font-style: italic;
      font-size: clamp(1.2rem, 2.2vw, 1.65rem);
      line-height: 1.4;
      border-left: 2px solid var(--accent);
      padding-left: 1.5rem;
      margin: 2.5rem 0;
      color: var(--text);
    }

    /* ─── CV ─────────────────────────────────────── */
    .cv-block { margin-bottom: 3.5rem; }
    .cv-block:last-child { margin-bottom: 0; }

    .cv-block-title {
      font-family: var(--f-mono);
      font-size: .62rem;
      font-weight: 400;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: var(--accent);
      padding-bottom: .6rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: .5rem;
    }

    .cv-item {
      display: grid;
      grid-template-columns: 9rem 1fr;
      gap: 1.5rem;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--border);
    }

    @media (max-width: 500px) {
      .cv-item { grid-template-columns: 1fr; gap: .3rem; }
    }

    .cv-year {
      font-family: var(--f-mono);
      font-size: .7rem;
      font-weight: 300;
      color: var(--muted);
      padding-top: .2rem;
    }

    .cv-title {
      font-family: var(--f-serif);
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: .15rem;
    }

    .cv-place {
      font-size: .88rem;
      color: var(--muted);
      margin-bottom: .4rem;
    }

    .cv-desc {
      font-size: .86rem;
      color: var(--muted);
      line-height: 1.6;
    }

    /* ─── FOOTER ─────────────────────────────────── */
    #footer {
      max-width: var(--max);
      margin: 0 auto;
      padding: 2.5rem var(--pad);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-brand { font-family: var(--f-serif); font-size: .9rem; }

    .footer-copy {
      font-family: var(--f-mono);
      font-size: .6rem;
      font-weight: 300;
      color: var(--muted);
      letter-spacing: .06em;
    }
  </style>
</head>
<body>

  <!-- ── NAV ──────────────────────────────────────── -->
  <nav id="nav">
    <a href="#hero" class="nav-brand">Fidel Chaves</a>
    <div class="nav-right">
      <ul class="nav-links">
        <li><a href="#services" data-en="Services"  data-es="Servicios">Services</a></li>
        <li><a href="#contact"  data-en="Contact"   data-es="Contacto">Contact</a></li>
        <li><a href="#projects" data-en="Projects"  data-es="Proyectos">Projects</a></li>
        <li><a href="#about"    data-en="About"     data-es="Sobre mí">About</a></li>
        <li><a href="#cv">CV</a></li>
      </ul>
      <button id="langBtn">ES</button>
    </div>
  </nav>

  <!-- ── HERO ─────────────────────────────────────── -->
  <section id="hero">
    <p class="hero-location" data-en="Buenos Aires, Argentina — Available worldwide" data-es="Buenos Aires, Argentina — Disponible en todo el mundo">Buenos Aires, Argentina — Available worldwide</p>
    <h1 class="hero-name">Fidel<br><span class="italic">Chaves</span></h1>
    <div class="hero-divider"></div>
    <p class="hero-sub" data-en="Writer. Scientist. Communicator. Bridging complex ideas and the people who need them." data-es="Escritor. Científico. Comunicador. Tendiendo puentes entre las ideas complejas y quienes las necesitan.">Writer. Scientist. Communicator. Bridging complex ideas and the people who need them.</p>
    <span class="hero-scroll" data-en="Scroll" data-es="Scroll">Scroll</span>
  </section>

  <!-- ── SERVICES ──────────────────────────────────── -->
  <div class="s-wrap" id="services">
    <div class="s-inner">
      <p class="s-label fu" data-en="01 — What I Do" data-es="01 — Lo que hago">01 — What I Do</p>
      <div class="svc-list">

        <div class="svc-item fu d1">
          <h3 class="svc-name" data-en="Scientific Communication" data-es="Comunicación Científica">Scientific Communication</h3>
          <p class="svc-desc" data-en="Whitepapers, technical articles, and audiovisual scripts that make science precise and accessible — without sacrificing accuracy." data-es="Whitepapers, artículos técnicos y guiones audiovisuales que hacen la ciencia precisa y accesible, sin sacrificar exactitud.">Whitepapers, technical articles, and audiovisual scripts that make science precise and accessible — without sacrificing accuracy.</p>
        </div>

        <div class="svc-item fu d2">
          <h3 class="svc-name" data-en="Ghostwriting" data-es="Ghostwriting">Ghostwriting</h3>
          <p class="svc-desc" data-en="I write in your voice. Articles, essays, thought leadership pieces — your ideas, shaped into words." data-es="Escribo con tu voz. Artículos, ensayos, piezas de thought leadership — tus ideas, hechas palabras.">I write in your voice. Articles, essays, thought leadership pieces — your ideas, shaped into words.</p>
        </div>

        <div class="svc-item fu d3">
          <h3 class="svc-name" data-en="UX Writing" data-es="UX Writing">UX Writing</h3>
          <p class="svc-desc" data-en="Copy that guides users through products — from onboarding flows to complete website redesigns built from scratch." data-es="Copy que guía a los usuarios — desde onboarding hasta rediseños web completos construidos desde cero.">Copy that guides users through products — from onboarding flows to complete website redesigns built from scratch.</p>
        </div>

        <div class="svc-item fu d1">
          <h3 class="svc-name" data-en="Translations" data-es="Traducciones">Translations</h3>
          <p class="svc-desc" data-en="Spanish, English, and French — nuanced translation that preserves tone and voice, not just meaning." data-es="Español, inglés y francés — traducciones matizadas que preservan el tono y la voz, no solo el significado.">Spanish, English, and French — nuanced translation that preserves tone and voice, not just meaning.</p>
        </div>

        <div class="svc-item fu d2">
          <h3 class="svc-name" data-en="Content Writing" data-es="Redacción de Contenidos">Content Writing</h3>
          <p class="svc-desc" data-en="Social media, newsletters, blogs and long-form content. Consistent voice, consistent output — at least one post per week, every week." data-es="Redes sociales, newsletters, blogs y contenido de largo aliento. Voz consistente, producción constante — al menos un posteo semanal.">Social media, newsletters, blogs and long-form content. Consistent voice, consistent output — at least one post per week, every week.</p>
        </div>

        <div class="svc-item fu d3">
          <h3 class="svc-name" data-en="Creative Writing Workshops" data-es="Talleres de Escritura">Creative Writing Workshops</h3>
          <p class="svc-desc" data-en="Fiction and non-fiction workshops for teenagers and adults. Weekly sessions with curated prompts and material." data-es="Talleres de ficción y no ficción para adolescentes y adultos. Encuentros semanales con consignas y material curados.">Fiction and non-fiction workshops for teenagers and adults. Weekly sessions with curated prompts and material.</p>
        </div>

      </div>
    </div>
  </div>

  <!-- ── CONTACT ────────────────────────────────────── -->
  <div class="s-wrap" id="contact">
    <div class="s-inner">
      <p class="s-label fu" data-en="02 — Get in Touch" data-es="02 — Contacto">02 — Get in Touch</p>
      <div class="contact-wrap">

        <div>
          <p class="contact-intro fu" data-en="Have a project in mind? I'd love to hear about it." data-es="¿Tenés un proyecto en mente? Me encantaría escuchar sobre él.">Have a project in mind? I'd love to hear about it.</p>
          <div class="contact-links fu d2">
            <a href="mailto:fidelchaves96@gmail.com" class="c-link">
              <span class="c-link-bar"></span>fidelchaves96@gmail.com
            </a>
            <!-- TODO: replace with your actual LinkedIn URL -->
            <a href="https://linkedin.com/in/fidel-chaves" target="_blank" rel="noopener" class="c-link">
              <span class="c-link-bar"></span>LinkedIn
            </a>
            <!-- TODO: replace XXXXXXXXXXX with your WhatsApp number (country code + number) -->
            <a href="https://wa.me/XXXXXXXXXXX" target="_blank" rel="noopener" class="c-link">
              <span class="c-link-bar"></span>WhatsApp
            </a>
          </div>
        </div>

        <form class="c-form fu d3" id="cForm" novalidate>
          <div class="f-field">
            <label class="f-label" for="fname" data-en="Name" data-es="Nombre">Name</label>
            <input class="f-input" type="text" id="fname" name="cname" autocomplete="name" required>
          </div>
          <div class="f-field">
            <label class="f-label" for="femail" data-en="Email" data-es="Email">Email</label>
            <input class="f-input" type="email" id="femail" name="cemail" autocomplete="email" required>
          </div>
          <div class="f-field">
            <label class="f-label" for="fmsg" data-en="Message" data-es="Mensaje">Message</label>
            <textarea class="f-textarea" id="fmsg" name="cmsg" required></textarea>
          </div>
          <button type="submit" class="f-btn" data-en="Send Message" data-es="Enviar Mensaje">Send Message</button>
        </form>

      </div>
    </div>
  </div>

  <!-- ── PROJECTS ───────────────────────────────────── -->
  <div class="s-wrap" id="projects">
    <div class="s-inner">
      <p class="s-label fu" data-en="03 — Current Work" data-es="03 — Proyectos Actuales">03 — Current Work</p>
      <div class="proj-grid">

        <div class="proj-card fu d1">
          <p class="proj-tag" data-en="Biotech · Full-time" data-es="Biotecnología · Tiempo completo">Biotech · Full-time</p>
          <h3 class="proj-name">Stämm</h3>
          <p class="proj-desc" data-en="Communication Specialist at a biotech startup building the future of sustainable biomanufacturing. Full content strategy: social media, technical writing, web copy, and video." data-es="Especialista en comunicación en una startup de biotecnología que construye el futuro de la biofabricación sostenible. Estrategia de contenidos completa: redes, escritura técnica, web y video.">Communication Specialist at a biotech startup building the future of sustainable biomanufacturing. Full content strategy: social media, technical writing, web copy, and video.</p>
        </div>

        <div class="proj-card fu d2">
          <p class="proj-tag" data-en="Newsletter · Fiction & Non-Fiction" data-es="Newsletter · Ficción y No Ficción">Newsletter · Fiction &amp; Non-Fiction</p>
          <h3 class="proj-name">Diario de un Robot</h3>
          <p class="proj-desc" data-en="A newsletter of fiction and non-fiction texts in Spanish — exploring the intersection of technology and what it means to be human." data-es="Un newsletter de textos de ficción y no ficción en castellano — sobre el cruce entre tecnología y lo humano.">A newsletter of fiction and non-fiction texts in Spanish — exploring the intersection of technology and what it means to be human.</p>
        </div>

        <div class="proj-card fu d3">
          <p class="proj-tag" data-en="Newsletter · Literature" data-es="Newsletter · Literatura">Newsletter · Literature</p>
          <h3 class="proj-name">A Quien Corresponda</h3>
          <p class="proj-desc" data-en="A newsletter on literature and writing prompts in Spanish. For those who read, and for those who want to write." data-es="Un newsletter sobre literatura y consignas de escritura en castellano. Para quienes leen y para quienes quieren escribir.">A newsletter on literature and writing prompts in Spanish. For those who read, and for those who want to write.</p>
        </div>

      </div>
    </div>
  </div>

  <!-- ── ABOUT ──────────────────────────────────────── -->
  <div class="s-wrap" id="about">
    <div class="s-inner">
      <p class="s-label fu" data-en="04 — About" data-es="04 — Sobre mí">04 — About</p>
      <div class="about-grid">

        <div class="about-facts fu">
          <div>
            <p class="fact-label" data-en="Based in" data-es="Ubicación">Based in</p>
            <p class="fact-val">Buenos Aires, Argentina</p>
          </div>
          <div>
            <p class="fact-label" data-en="Languages" data-es="Idiomas">Languages</p>
            <p class="fact-val" data-en="Spanish · French · English" data-es="Español · Francés · Inglés">Spanish · French · English</p>
          </div>
          <div>
            <p class="fact-label" data-en="Education" data-es="Educación">Education</p>
            <p class="fact-val" data-en="Biological Sciences (UBA) · Editorial Studies (UBA)" data-es="Ciencias Biológicas (UBA) · Edición Editorial (UBA)">Biological Sciences (UBA) · Editorial Studies (UBA)</p>
          </div>
          <div>
            <p class="fact-label" data-en="Published" data-es="Publicado">Published</p>
            <p class="fact-val">Cinco Fragmentaciones del Alma, 2018</p>
          </div>
          <div>
            <p class="fact-label" data-en="Availability" data-es="Disponibilidad">Availability</p>
            <p class="fact-val" data-en="Open to freelance" data-es="Disponible para freelance">Open to freelance</p>
          </div>
        </div>

        <div class="about-body fu d2">
          <p data-en="I am a communication specialist at Stämm, a biotechnology startup. I hold a degree and teaching certification in Biological Sciences from the Universidad de Buenos Aires, and I am currently pursuing a degree in Editorial Studies at the same institution." data-es="Soy especialista en comunicación en Stämm, una startup de biotecnología. Soy licenciado y profesor de Ciencias Biológicas por la Universidad de Buenos Aires, y actualmente estudio Edición Editorial en esa misma institución.">I am a communication specialist at Stämm, a biotechnology startup. I hold a degree and teaching certification in Biological Sciences from the Universidad de Buenos Aires, and I am currently pursuing a degree in Editorial Studies at the same institution.</p>
          <blockquote class="pullquote" data-en="My scientific training gives me a methodical approach to writing. My curiosity lets me write about anything." data-es="Mi formación científica me da un enfoque metódico en la escritura. Mi curiosidad me permite escribir sobre cualquier cosa.">"My scientific training gives me a methodical approach to writing. My curiosity lets me write about anything."</blockquote>
          <p data-en="I grew up trilingual in Spanish, French, and English. I have experience in research, precise editing, and writing across a wide range of formats — from scientific papers to fiction. I have published a short story collection, hosted science podcasts, and I facilitate weekly creative writing workshops for teens and adults." data-es="Crecí trilingüe en español, francés e inglés. Tengo experiencia en investigación, edición precisa y escritura en una gran variedad de formatos — desde trabajos científicos hasta ficción. Publiqué un libro de cuentos, conduje podcasts de ciencia y dicto talleres semanales de escritura creativa para adolescentes y adultos.">I grew up trilingual in Spanish, French, and English. I have experience in research, precise editing, and writing across a wide range of formats — from scientific papers to fiction. I have published a short story collection, hosted science podcasts, and I facilitate weekly creative writing workshops for teens and adults.</p>
        </div>

      </div>
    </div>
  </div>

  <!-- ── CV ─────────────────────────────────────────── -->
  <div class="s-wrap" id="cv">
    <div class="s-inner">
      <p class="s-label fu" data-en="05 — Curriculum Vitae" data-es="05 — Currículum Vitae">05 — Curriculum Vitae</p>

      <!-- Experience -->
      <div class="cv-block fu">
        <h3 class="cv-block-title" data-en="Experience" data-es="Experiencia">Experience</h3>

        <div class="cv-item">
          <span class="cv-year" data-en="2023 — Present" data-es="2023 — Actualidad">2023 — Present</span>
          <div>
            <p class="cv-title" data-en="Scientific Communication Specialist" data-es="Especialista en Comunicación Científica">Scientific Communication Specialist</p>
            <p class="cv-place">Stämm</p>
            <p class="cv-desc" data-en="Full content strategy for a biotech startup. Whitepapers, technical articles, audiovisual scripts, trilingual community management, UX writing, and complete website redesign." data-es="Estrategia de contenidos para una startup de biotecnología. Whitepapers, artículos técnicos, guiones audiovisuales, gestión de comunidades trilingüe, UX writing y rediseño web completo.">Full content strategy for a biotech startup. Whitepapers, technical articles, audiovisual scripts, trilingual community management, UX writing, and complete website redesign.</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2022 — 2023</span>
          <div>
            <p class="cv-title" data-en="Natural Sciences Teacher" data-es="Docente de Ciencias Naturales">Natural Sciences Teacher</p>
            <p class="cv-place" data-en="ORT Technical School & San Agustín School" data-es="Escuela Técnica ORT & Colegio San Agustín">ORT Technical School &amp; San Agustín School</p>
            <p class="cv-desc" data-en="Secondary-level teaching. Lesson planning, course delivery, and Science Olympiad preparation for 1st–3rd year students." data-es="Docencia en nivel medio. Preparación de clases, dictado de cursos y preparación para Olimpiadas científicas, 1er a 3er año.">Secondary-level teaching. Lesson planning, course delivery, and Science Olympiad preparation for 1st–3rd year students.</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2021 — 2022</span>
          <div>
            <p class="cv-title" data-en="UX, Content & Copywriter" data-es="UX, Content y Copywriter">UX, Content &amp; Copywriter</p>
            <p class="cv-place">Awkbit</p>
            <p class="cv-desc" data-en="UX and content for a software factory. 1–3 articles per week via Drupal CMS, plus use cases, portfolios, social media content, and company website rewrite." data-es="UX y contenido para una software factory. 1 a 3 artículos semanales en Drupal, más use cases, portfolios, redes y rediseño del sitio.">UX and content for a software factory. 1–3 articles per week via Drupal CMS, plus use cases, portfolios, social media content, and company website rewrite.</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2015 — 2019</span>
          <div>
            <p class="cv-title" data-en="Science Communication" data-es="Comunicación Científica">Science Communication</p>
            <p class="cv-place" data-en="FCEN-UBA & Academy of Medicine" data-es="FCEN-UBA & Academia de Medicina">FCEN-UBA &amp; Academy of Medicine</p>
            <p class="cv-desc" data-en="Scientific presentations and public science outreach events." data-es="Presentaciones científicas y exposiciones de divulgación científica.">Scientific presentations and public science outreach events.</p>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div class="cv-block fu d1">
        <h3 class="cv-block-title" data-en="Education" data-es="Educación">Education</h3>

        <div class="cv-item">
          <span class="cv-year" data-en="2025 — Present" data-es="2025 — Actualidad">2025 — Present</span>
          <div>
            <p class="cv-title" data-en="Editorial Studies" data-es="Edición Editorial">Editorial Studies</p>
            <p class="cv-place">Universidad de Buenos Aires</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2022 — 2023</span>
          <div>
            <p class="cv-title" data-en="Teaching Certification in Biological Sciences" data-es="Profesorado en Ciencias Biológicas">Teaching Certification in Biological Sciences</p>
            <p class="cv-place">Universidad de Buenos Aires</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2015 — 2021</span>
          <div>
            <p class="cv-title" data-en="Bachelor's Degree in Biological Sciences" data-es="Licenciatura en Ciencias Biológicas">Bachelor's Degree in Biological Sciences</p>
            <p class="cv-place">FCEyN — Universidad de Buenos Aires</p>
            <p class="cv-desc" data-en="Specialization in paleobiology, macroevolution, and philosophy of science." data-es="Orientación en paleobiología, macroevolución y filosofía de la ciencia.">Specialization in paleobiology, macroevolution, and philosophy of science.</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">1999 — 2013</span>
          <div>
            <p class="cv-title" data-en="French Baccalauréat & Argentine Secondary Diploma" data-es="Baccalauréat Français & Bachillerato Argentino">French Baccalauréat &amp; Argentine Secondary Diploma</p>
            <p class="cv-place" data-en="Liceo Franco Argentino Jean Mermoz — Science track, life &amp; earth sciences" data-es="Liceo Franco Argentino Jean Mermoz — Ciencias, especialidad en ciencias de la vida y la tierra">Liceo Franco Argentino Jean Mermoz — Science track, life &amp; earth sciences</p>
          </div>
        </div>
      </div>

      <!-- Additional -->
      <div class="cv-block fu d2">
        <h3 class="cv-block-title" data-en="Additional" data-es="Adicional">Additional</h3>

        <div class="cv-item">
          <span class="cv-year" data-en="2021 — Present" data-es="2021 — Actualidad">2021 — Present</span>
          <div>
            <p class="cv-title" data-en="Creative Writing Workshops" data-es="Talleres de Escritura Creativa">Creative Writing Workshops</p>
            <p class="cv-desc" data-en="Fiction and non-fiction workshops for teens (11–15) and adults. Weekly sessions, material preparation, and writing prompt design." data-es="Talleres de ficción y no ficción para adolescentes (11–15 años) y adultos. Encuentros semanales, preparación de material y diseño de consignas.">Fiction and non-fiction workshops for teens (11–15) and adults. Weekly sessions, material preparation, and writing prompt design.</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2021 — 2023</span>
          <div>
            <p class="cv-title" data-en="Podcasts" data-es="Podcasts">Podcasts</p>
            <p class="cv-desc" data-en="Jammin' with Fidel (science) · Madrugada en La Colmena (leisure)" data-es="Jammin' with Fidel (ciencia) · Madrugada en La Colmena (ocio)">Jammin' with Fidel (science) · Madrugada en La Colmena (leisure)</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year">2018</span>
          <div>
            <p class="cv-title">Cinco Fragmentaciones del Alma</p>
            <p class="cv-place" data-en="Short story collection · Editorial El Buscador" data-es="Libro de cuentos · Editorial El Buscador">Short story collection · Editorial El Buscador</p>
          </div>
        </div>

        <div class="cv-item">
          <span class="cv-year" data-en="Skills" data-es="Habilidades">Skills</span>
          <div>
            <p class="cv-desc">Drupal · WordPress · Figma · Microsoft Office · Google Workspace · SEO · HTML · Notion · Obsidian · Trello · Open Project</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- ── FOOTER ─────────────────────────────────────── -->
  <footer id="footer">
    <span class="footer-brand">Fidel Chaves</span>
    <span class="footer-copy" id="fYear"></span>
  </footer>

  <script>
    /* ── LANGUAGE TOGGLE ──────────────────────────── */
    let currentLang = 'en';
    const langBtn = document.getElementById('langBtn');

    function applyLang(l) {
      currentLang = l;
      document.documentElement.lang = l;
      langBtn.textContent = l === 'en' ? 'ES' : 'EN';
      document.querySelectorAll('[data-' + l + ']').forEach(el => {
        el.textContent = el.getAttribute('data-' + l);
      });
    }

    langBtn.addEventListener('click', () => applyLang(currentLang === 'en' ? 'es' : 'en'));

    /* ── SCROLL FADE-UPS ──────────────────────────── */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fu').forEach(el => io.observe(el));

    /* ── CONTACT FORM ─────────────────────────────── */
    document.getElementById('cForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name    = document.getElementById('fname').value.trim();
      const email   = document.getElementById('femail').value.trim();
      const message = document.getElementById('fmsg').value.trim();
      if (!name || !email || !message) return;
      const sub  = encodeURIComponent((currentLang === 'es' ? 'Mensaje de ' : 'Message from ') + name);
      const body = encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message);
      window.location.href = 'mailto:fidelchaves96@gmail.com?subject=' + sub + '&body=' + body;
    });

    /* ── FOOTER YEAR ──────────────────────────────── */
    document.getElementById('fYear').textContent = '© ' + new Date().getFullYear();
  </script>
</body>
</html>
