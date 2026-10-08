/* Arcade: guardería con las criaturitas que ya encontraste (se llena a medida que completás el álbum);
   al tocarlas, hablan. Con el álbum completo se gana el Doblón, que enciende la pantalla de la máquina. */
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
    arch: { es: ['...', '........................................................', '{silencio}'],
            en: ['...', '........................................................', '{silencio}'] },
    sprout: { es: ['Ceibo. Todavía soy brote, pero tengo planes.', 'Regame con paciencia y algún cuento.', 'Algún día voy a dar flores rojas. Avisado quedás.'],
              en: ['Ceibo. Still a sprout, but I have plans.', 'Water me with patience and the odd story.', 'Someday I will bloom red. Consider yourself warned.'] },
    fuego: { es: ['Lux. Soy la chispa de La chispa.', 'Dieciséis cuentos y yo en todos. ¡Combustión!', 'Dejá tu mail en el blog y te mando a Faetón. Es primo mío.'],
             en: ['Lux. I am the spark in La chispa.', 'Sixteen stories and I am in all of them. Combustion!', 'Leave your email on the blog and I will send you Faetón. He is my cousin.'] },
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
    rufo: { es: ['Rufo, zorzal de barrio. Cada día canto mejor.', 'Sentir que es un soplo la vida, que veinte años no es nada. Y en internet, menos.', 'El día que me quieras... te canto un tango entero.'],
            en: ['Rufo, neighborhood thrush. I sing a little better every day.', 'To feel that life is a breath, that twenty years is nothing. On the internet, even less.', 'The day you love me... I will sing you a whole tango.'] },
    tecla: { es: ['Tecla. Escribo el Diario de un Robot desde 2020.', 'Cuarenta ensayos y ninguna tecla rota. Bueno, una.', 'Tac, tac, tac. Perdón, es un tic.'],
             en: ['Tecla. I have been typing Diario de un Robot since 2020.', 'Forty essays and not a single broken key. Well, one.', 'Tap, tap, tap. Sorry, it is a tic.'] },
    cronos: { es: ['Cronos. Yo cuido la máquina del tiempo.', 'Este sitio tuvo otras caras. Las guardo todas.', 'No me des vuelta, que se me mezcla el pasado con el futuro.'],
              en: ['Cronos. I look after the time machine.', 'This site had other faces. I keep them all.', 'Do not flip me over, past and future get mixed up.'] },
    tomatina: { es: ['Holaaa', 'Llegaste al arcade, q lindoooo ❤', 'Ahora tenés que volver mañana igual jaja'],
                en: ['Hiii', 'You made it to the arcade, so cuteee ❤', 'Now you have to come back tomorrow anyway haha'] }
  };
  /* Después de la última línea, algunas te llevan a una parte del sitio. */
  var LINKS = {
    robot: { href: 'diario/', es: 'Te muestro dónde anoto mis minutos de escritura. Es una app. La hizo él.', en: 'Let me show you where I log my writing minutes. It is an app. He made it.' },
    flask: { href: 'guias/claude/', es: 'Experimento recomendado: la guía de Claude. Resultados reproducibles.', en: 'Recommended experiment: the Claude guide. Reproducible results.' },
    owl: { href: 'ensayos/', es: 'Vení, te presto un ensayo. Me lo devolvés subrayado.', en: 'Come, I will lend you an essay. Give it back underlined.' },
    pad: { href: 'blog.html#ficcion', es: 'Buuu... ¿Querés leer algo que da miedito? Por acá.', en: 'Booo... Want to read something a little scary? This way.' },
    arch: { href: 'blog.html#ficcion', es: '...', en: '...' },
    fuego: { href: 'blog.html#chispaTitulo', es: 'Vamos a La chispa. Yo prendo.', en: 'Let us go to La chispa. I will light it.' },
    rollo: { href: 'cv.html', es: '¿Querés ver todo lo que hizo Fidel? Me desenrollo entero.', en: 'Want to see everything Fidel has done? I will unroll all the way.' },
    tintero: { href: 'blog.html', es: 'Todo lo que escribí con Fidel está en el blog. Pasá, que no mancho.', en: 'Everything I wrote with Fidel is on the blog. Come in, I do not stain.' },
    huevo: { random: true, es: 'No sé adónde vas a caer. Yo tampoco sabía. ¡Crac!', en: 'I do not know where you will land. Neither did I. Crack!' },
    sobre: { href: 'index.html#contacto', es: '¿Le escribimos a Fidel? Yo llevo el mensaje.', en: 'Shall we write to Fidel? I will carry the message.' },
    figaro: { href: 'press-kit.html', es: 'Pase por la sala de prensa. Hay fotos, bios y criaturitas para llevar.', en: 'Drop by the press room. Photos, bios and little creatures to go.' },
    rufo: { href: 'blog.html#chispaTitulo', es: 'Te canto el camino a La chispa. Es cortito.', en: 'I will sing you the way to La chispa. It is short.' },
    tecla: { href: 'blog.html', es: 'Tac, tac: el blog. Ahí está todo lo que tecleé.', en: 'Tap, tap: the blog. Everything I typed is there.' },
    cronos: { href: 'maquina-del-tiempo.html', es: 'Subí a la máquina del tiempo. Ajustate el cinturón.', en: 'Get in the time machine. Buckle up.' }
  };
  /* Páginas a las que puede mandarte Egg. */
  var RANDOM = ['index.html', 'blog.html', 'cv.html', 'ensayos/', 'guias/claude/', 'press-kit.html', 'maquina-del-tiempo.html', 'diario/', '404.html'];
  var REST = ['.#...', '..#..', '..##.', '.##..', '##...', '.##..', '..#..', '.##..', '#....'];  /* silencio de negra: las fuentes del sitio no lo tienen */
  var T = {
    es: { yard: 'Guardería de criaturitas', tap: 'Tocá a una criaturita para charlar.', close: 'Cerrar', go: 'Ir', empty: 'Todavía no hay nadie. Las criaturitas se mudan acá cuando las encontrás en el sitio.', find: 'Salir a buscarlas',
          missing: 'Te faltan {n} criaturitas.', missing1: 'Te falta una criaturita.', coin: 'Insert coin', ready: '¡Tenés un Doblón! Metelo en la máquina.', on: '1 CRÉDITO', onMsg: 'Pantalla encendida. Los juegos están en camino.', tip: 'El Doblón quedó en la máquina. Tocalo y lo convertimos en un cafecito.' },
    en: { yard: 'Little creature daycare', tap: 'Tap a little creature to chat.', close: 'Close', go: 'Go', empty: 'Nobody here yet. The little creatures move in when you find them on the site.', find: 'Go find them',
          missing: '{n} little creatures left.', missing1: 'One little creature left.', coin: 'Insert coin', ready: 'You have a Doubloon! Put it in the machine.', on: '1 CREDIT', onMsg: 'Screen on. Games are on their way.', tip: 'The Doubloon stayed in the machine. Tap it and we turn it into a coffee.' }
  };
  var CLS = { '#': 'si', 'o': 'sp', 'a': 'sa' };
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es'; }
  var state = { found: {}, done: false };
  try { var s = JSON.parse(localStorage.getItem('fc-album') || 'null'); if (s && s.found) state = s; } catch (e) {}
  /* Llaves del arcade: una por juego, { idDelJuego: fecha en que se ganó }. Con las 5 se abre lo que está
     detrás de la pantalla. Por ahora no hay juegos: solo la estructura y las siluetas vacías. */
  if (!state.llaves) state.llaves = {};
  function save() { try { localStorage.setItem('fc-album', JSON.stringify(state)); } catch (e) {} }
  function svg(rows, px) {
    var w = rows[0].length, h = rows.length, r = '';
    rows.forEach(function (row, y) { for (var x = 0; x < w; x++) { var c = CLS[row[x]]; if (c) r += '<rect class="' + c + '" x="' + x + '" y="' + y + '" width="1" height="1"/>'; } });
    return '<svg width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  var yard = document.getElementById('arcadeYard'), box = document.getElementById('arcadeBox');
  var who = box.querySelector('.arcade__who'), say = box.querySelector('.arcade__say');
  var hint = document.getElementById('arcadeHint');
  var mons = [], talking = null, typer = null, step = {};
  var found = CREATURES.filter(function (c) { return state.found[c.id]; });
  yard.hidden = false; hint.hidden = !found.length;
  if (!found.length) yard.insertAdjacentHTML('beforeend', '<div class="arcade__empty"><p></p><a class="btn btn--accent" href="index.html"></a></div>');

  found.forEach(function (cr, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'arcade__mon';
    b.innerHTML = '<span class="spr arcade__spr">' + svg(cr.rows, 4) + '</span>';
    var m = { el: b, cr: cr, x: 4 + (i % 5) * 19, y: 6 + Math.floor(i / 5) * 23 };
    yard.appendChild(b);
    for (var k = 0; k < 12; k++) {  /* arranque con un poco de desorden, sin encimarse */
      var cx = m.x + rnd(-4, 4), cy = m.y + rnd(-3, 3);
      if (free(m, cx, cy)) { m.x = cx; m.y = cy; break; }
    }
    place(m); mons.push(m);
    b.addEventListener('click', function () { talk(m); });
    if (!still && cr.id !== 'arch') setTimeout(function () { wander(m); }, rnd(300, 3000));  /* Arch no se mueve */
  });

  /* Lugar libre: no se pisa con ninguna otra criaturita (tamaño real del sprite + un margen). */
  function free(m, x, y) {
    var w = yard.clientWidth, h = yard.clientHeight;
    return mons.every(function (o) {
      return o === m || Math.abs((o.x - x) * w / 100) > o.el.offsetWidth + 10 || Math.abs((o.y - y) * h / 100) > o.el.offsetHeight + 10;
    });
  }
  function place(m) { m.el.style.left = m.x + '%'; m.el.style.top = m.y + '%'; }
  function wander(m) {
    if (talking !== m) {
      var nx = m.x, ny = m.y;
      for (var k = 0; k < 10; k++) {  /* busca un lugar libre: que no se encimen */
        var cx = Math.max(3, Math.min(87, m.x + rnd(-18, 18))), cy = Math.max(4, Math.min(52, m.y + rnd(-12, 12)));
        if (free(m, cx, cy)) { nx = cx; ny = cy; break; }
      }
      if (nx === m.x && ny === m.y) { setTimeout(function () { wander(m); }, rnd(1200, 2600)); return; }
      m.el.classList.toggle('is-left', nx < m.x);
      m.el.classList.add('is-walking');
      m.x = nx; m.y = ny; place(m);
      setTimeout(function () { m.el.classList.remove('is-walking'); }, 1600);
    }
    setTimeout(function () { wander(m); }, rnd(2200, 5200));
  }
  function talk(m) {
    var l = lang(), id = m.cr.id, lines = LINES[id] ? LINES[id][l] : ['…'], link = LINKS[id], n = lines.length + (link ? 1 : 0);
    if (talking && talking !== m) talking.el.classList.remove('is-talking');
    talking = m; m.el.classList.add('is-talking');
    var i = step[id] || 0; step[id] = (i + 1) % n;
    box.hidden = false;
    who.innerHTML = '<span class="spr">' + svg(m.cr.rows, 2) + '</span>' + m.cr.name;
    if (i < lines.length) { type(lines[i]); return; }
    var href = link.random ? RANDOM[Math.floor(Math.random() * RANDOM.length)] : link.href;
    type(link[l], '<a class="arcade__ir" href="' + href + '">' + T[l].go + ' ►</a>');
  }
  function type(txt, after) {
    clearInterval(typer);
    if (txt === '{silencio}') { say.innerHTML = '<span class="arcade__rest">' + svg(REST, 4) + '</span>'; return; }
    function done() { if (after) say.insertAdjacentHTML('beforeend', ' ' + after); }
    if (still) { say.textContent = txt; done(); return; }
    var n = 0; say.textContent = '';
    typer = setInterval(function () { n++; say.textContent = txt.slice(0, n); if (n >= txt.length) { clearInterval(typer); done(); } }, 28);
  }
  function hush() {
    clearInterval(typer); box.hidden = true;
    if (talking) talking.el.classList.remove('is-talking');
    talking = null;
  }
  box.querySelector('.arcade__close').addEventListener('click', hush);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) hush(); });

  /* La máquina: apagada hasta que metés el Doblón (se gana al completar el álbum). */
  var tv = document.getElementById('arcadeTv'), tvMsg = document.getElementById('arcadeTvMsg'), coin = document.getElementById('arcadeCoin');
  function machine() {
    var x = T[lang()], left = CREATURES.length - found.length, on = !!state.coin;
    tv.classList.toggle('is-on', on); tv.classList.toggle('is-ready', !!state.done && !on);
    tv.querySelector('.arcade__blink').textContent = on ? x.on : 'INSERT COIN';
    tvMsg.textContent = on ? x.onMsg : state.done ? x.ready : (left === 1 ? x.missing1 : x.missing.replace('{n}', left));
    coin.hidden = !state.done || on;
    var pz = tv.querySelector('.arcade__paisaje');  /* encendida, la pantalla muestra el paisaje (paisaje.js) */
    if (on && window.paisajeArcade) {
      if (!pz) { tv.querySelector('.arcade__blink').insertAdjacentHTML('afterend', '<div class="arcade__paisaje"></div>'); pz = tv.querySelector('.arcade__paisaje'); }
      window.paisajeArcade(pz, state.llaves, lang());
    }
    var d = tv.querySelector('.arcade__doblon');  /* ya metido, el Doblón te manda a Cafecito */
    if (on && !d) { tv.insertAdjacentHTML('beforeend', '<button type="button" class="arcade__doblon" data-donar>' + svg(DOBLON, 3) + '</button>'); d = tv.querySelector('.arcade__doblon'); }
    if (d) { d.setAttribute('aria-label', x.tip); d.title = x.tip; }
    coin.innerHTML = '<span class="spr">' + svg(DOBLON, 2) + '</span>' + x.coin + ' ►';
  }
  coin.addEventListener('click', function () {
    state.coin = Date.now(); save();
    coin.classList.add('is-in');
    setTimeout(machine, still ? 0 : 600);
  });

  function labels() {
    var x = T[lang()];
    machine();
    yard.setAttribute('aria-label', x.yard); hint.textContent = x.tap;
    var e = yard.querySelector('.arcade__empty'); if (e) { e.querySelector('p').textContent = x.empty; e.querySelector('a').textContent = x.find + ' ►'; }
    box.querySelector('.arcade__close').setAttribute('aria-label', x.close);
    mons.forEach(function (m) { m.el.setAttribute('aria-label', m.cr.name); });
  }
  labels();
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
})();
