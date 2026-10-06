/* Arcade: se abre con el álbum completo. Guardería con las criaturitas paseando; al tocarlas, hablan. */
(function () {
  if (typeof CREATURES === 'undefined') return;
  var screen = document.getElementById('arcade');
  if (!screen) return;

  /* Diálogos: una línea por toque, en orden; al terminar vuelven a empezar. */
  var LINES = {
    robot: { es: ['¡Llegaste! Soy Ficha, el que firma todo este sitio.', 'Me armaron con once píxeles de ancho. Los cuento cuando no puedo dormir.', 'Si ves a Fidel, decile que la antena no es decorativa: capta ideas.'],
             en: ['You made it! I am Ficha, the one who signs this whole site.', 'They built me eleven pixels wide. I count them when I cannot sleep.', 'If you see Fidel, pass it on: the antenna is not decorative: it picks up ideas.'] },
    flask: { es: ['Erlen, del laboratorio. No me agites.', 'Lo verde no es veneno: es entusiasmo concentrado.', 'Hipótesis: si me tocaste tres veces, te caigo bien. Falta replicarlo.'],
             en: ['Erlen, from the lab. Do not shake me.', 'The green is not poison: it is concentrated enthusiasm.', 'Hypothesis: if you tapped me three times, you like me. Needs replication.'] },
    owl: { es: ['Uhú. Noctua. Leo de noche y opino de día.', 'Tengo los anteojos de Fidel. Todavía no se dio cuenta.', 'Ensayo recomendado: cualquiera, pero leelo despacio.'],
           en: ['Hoo. Noctua. I read at night and give opinions by day.', 'I have Fidel’s glasses. Nobody has noticed yet.', 'Recommended essay: any of them, but read it slowly.'] },
    pad: { es: ['Buu. Soy Agnes. Asusto poquito, prometido.', 'Vivo en los márgenes de los cuadernos.', 'Si una idea se te escapa, seguro pasó por acá.'],
           en: ['Boo. I am Agnes. I scare just a tiny bit, promise.', 'I live in the margins of notebooks.', 'If an idea slips away from you, it surely came through here.'] },
    sprout: { es: ['Ceibo. Todavía soy brote, pero tengo planes.', 'Regame con paciencia y algún cuento.', 'Algún día voy a dar flores rojas. Avisado quedás.'],
              en: ['Ceibo. Still a sprout, but I have plans.', 'Water me with patience and the odd story.', 'Someday I will bloom red. Consider yourself warned.'] },
    fuego: { es: ['Lux. Soy la chispa de La chispa.', 'Dieciséis cuentos y yo en todos. No es ego: es combustión.', 'Dejá tu mail en el blog y te mando a Faetón. Es primo mío.'],
             en: ['Lux. I am the spark in La chispa.', 'Sixteen stories and I am in all of them. Not ego: combustion.', 'Leave your email on the blog and I will send you Faetón. He is my cousin.'] },
    rollo: { es: ['Curry. Rollo de papel, no de cocina. Bueno, a veces de cocina.', 'Me desenrollo cuando me cuentan algo largo.', 'Todavía quedan metros. Contame.'],
             en: ['Curry. A paper roll, not a kitchen one. Well, sometimes a kitchen one.', 'I unroll when someone tells me something long.', 'There are meters left. Tell me.'] },
    tintero: { es: ['Mélan. Tinta negra, humor también.', 'Todo lo que ves en este sitio pasó primero por mí.', 'No me vuelques. La última vez quedó un monstruo en la alfombra.'],
               en: ['Mélan. Black ink, black humor.', 'Everything you see on this site went through me first.', 'Do not spill me. Last time a monster was left on the rug.'] },
    huevo: { es: ['Soy Egg. Me encontraste en la página que no existe.', 'Todavía no sé qué voy a ser cuando salga.', 'Crac. No, mentira. Todavía no.'],
             en: ['I am Egg. You found me on the page that does not exist.', 'I still do not know what I will be when I hatch.', 'Crack. No, kidding. Not yet.'] },
    sobre: { es: ['Hermes, mensajero. Traigo y llevo.', 'Si escribís a Fidel, viajo yo. Soy rápido, aunque no lo parezca.', 'Sin estampilla no salgo. Es una cuestión de principios.'],
             en: ['Hermes, messenger. I bring and I carry.', 'If you write to Fidel, I make the trip. I am fast, even if it does not look like it.', 'No stamp, no trip. It is a matter of principle.'] },
    figaro: { es: ['Figaro, prensa. ¿Me da una declaración?', 'Tengo todo el press kit en la gorra.', 'Primicia: completaste el álbum. Sale en tapa.'],
              en: ['Figaro, press. Care to make a statement?', 'I keep the whole press kit in my cap.', 'Scoop: you completed the album. Front page.'] },
    tecla: { es: ['Tecla. Escribo el Diario de un Robot desde 2020.', 'Cuarenta ensayos y ninguna tecla rota. Bueno, una.', 'Tac, tac, tac. Perdón, es un tic.'],
             en: ['Tecla. I have been typing Diario de un Robot since 2020.', 'Forty essays and not a single broken key. Well, one.', 'Tap, tap, tap. Sorry, it is a tic.'] },
    cronos: { es: ['Cronos. Yo cuido la máquina del tiempo.', 'Este sitio tuvo otras caras. Las guardo todas.', 'No me des vuelta, que se me mezcla el pasado con el futuro.'],
              en: ['Cronos. I look after the time machine.', 'This site had other faces. I keep them all.', 'Do not flip me over, past and future get mixed up.'] },
    tomatina: { es: ['Holaaa', 'Llegaste al arcade, q lindoooo ❤', 'Ahora tenés que volver mañana igual jaja'],
                en: ['Hiii', 'You made it to the arcade, so cuteee ❤', 'Now you have to come back tomorrow anyway haha'] }
  };
  var T = {
    es: { yard: 'Guardería de criaturitas', tap: 'Tocá a una criaturita para charlar.', close: 'Cerrar' },
    en: { yard: 'Little creature daycare', tap: 'Tap a little creature to chat.', close: 'Close' }
  };
  var CLS = { '#': 'si', 'o': 'sp', 'a': 'sa' };
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es'; }
  function unlocked() {
    try {
      var s = JSON.parse(localStorage.getItem('fc-album') || 'null');
      return !!(s && s.found) && CREATURES.every(function (c) { return s.found[c.id]; });
    } catch (e) { return false; }
  }
  function svg(rows, px) {
    var w = rows[0].length, h = rows.length, r = '';
    rows.forEach(function (row, y) { for (var x = 0; x < w; x++) { var c = CLS[row[x]]; if (c) r += '<rect class="' + c + '" x="' + x + '" y="' + y + '" width="1" height="1"/>'; } });
    return '<svg width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  if (!unlocked()) { document.getElementById('arcadeLocked').hidden = false; return; }

  var yard = document.getElementById('arcadeYard'), box = document.getElementById('arcadeBox');
  var who = box.querySelector('.arcade__who'), say = box.querySelector('.arcade__say');
  var hint = document.getElementById('arcadeHint');
  var mons = [], talking = null, typer = null, step = {};
  yard.hidden = false; hint.hidden = false;

  CREATURES.forEach(function (cr, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'arcade__mon';
    b.innerHTML = '<span class="spr arcade__spr">' + svg(cr.rows, 4) + '</span>';
    var m = { el: b, cr: cr, x: 8 + (i % 5) * 19 + rnd(-4, 4), y: 6 + Math.floor(i / 5) * 23 + rnd(-3, 3) };
    place(m); yard.appendChild(b); mons.push(m);
    b.addEventListener('click', function () { talk(m); });
    if (!still) setTimeout(function () { wander(m); }, rnd(300, 3000));
  });

  function place(m) { m.el.style.left = m.x + '%'; m.el.style.top = m.y + '%'; }
  function wander(m) {
    if (talking !== m) {
      var nx = Math.max(3, Math.min(87, m.x + rnd(-18, 18))), ny = Math.max(4, Math.min(52, m.y + rnd(-12, 12)));
      m.el.classList.toggle('is-left', nx < m.x);
      m.el.classList.add('is-walking');
      m.x = nx; m.y = ny; place(m);
      setTimeout(function () { m.el.classList.remove('is-walking'); }, 1600);
    }
    setTimeout(function () { wander(m); }, rnd(2200, 5200));
  }
  function talk(m) {
    var l = lang(), lines = LINES[m.cr.id] ? LINES[m.cr.id][l] : ['…'];
    if (talking && talking !== m) talking.el.classList.remove('is-talking');
    talking = m; m.el.classList.add('is-talking');
    var i = step[m.cr.id] || 0; step[m.cr.id] = (i + 1) % lines.length;
    box.hidden = false;
    who.innerHTML = '<span class="spr">' + svg(m.cr.rows, 2) + '</span>' + m.cr.name;
    type(lines[i]);
  }
  function type(txt) {
    clearInterval(typer);
    if (still) { say.textContent = txt; return; }
    var n = 0; say.textContent = '';
    typer = setInterval(function () { n++; say.textContent = txt.slice(0, n); if (n >= txt.length) clearInterval(typer); }, 28);
  }
  function hush() {
    clearInterval(typer); box.hidden = true;
    if (talking) talking.el.classList.remove('is-talking');
    talking = null;
  }
  box.querySelector('.arcade__close').addEventListener('click', hush);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) hush(); });

  function labels() {
    var x = T[lang()];
    yard.setAttribute('aria-label', x.yard); hint.textContent = x.tap;
    box.querySelector('.arcade__close').setAttribute('aria-label', x.close);
    mons.forEach(function (m) { m.el.setAttribute('aria-label', m.cr.name); });
  }
  labels();
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
})();
