/* "¿Te interesa leer más? Hacemelo saber": ventana con mail opcional.
   El sitio es estático: el aviso va a un buzón aparte (un Apps Script, ver fidelhub/chispa-lista/Codigo.gs)
   que filtra bots, anota el interés en una planilla y, si hay mail, manda un cuento de regalo.
   Mientras BUZON esté vacío, la ventana ofrece mandar el aviso por mail. */
(function () {
  "use strict";

  var BUZON = "";
  var CONTACTO = "fidelchaves96@gmail.com";

  var T = {
    es: {
      title: "¿Te interesa leer más?",
      intro: "Si te interesa el resto del libro, avisame. Y si querés, dejame tu mail: te escribo cuando haya novedades y te mando Faetón en PDF y EPUB.",
      msgLabel: "Algo que quieras decirme (opcional)",
      mailLabel: "Tu mail (opcional)",
      mailHint: "Lo uso solo para esto: Faetón y avisarte de novedades de La chispa. Si querés que lo borre, escribime y listo.",
      send: "Enviar",
      cancel: "Cerrar",
      sending: "Enviando…",
      okMail: "¡Gracias! En unos minutos te llega Faetón. Si no lo ves, fijate en spam.",
      okNoMail: "¡Gracias por el interés! Si más adelante querés que te avise, volvé y dejá tu mail.",
      badMail: "Ese mail no parece válido. Revisalo o dejalo vacío.",
      fail: "No se pudo enviar. Probá de nuevo o ",
      failLink: "mandame un mail",
      subject: "La chispa: me interesa leer más",
      body: "Hola Fidel, me interesa leer más de La chispa. Mi mail para novedades: "
    },
    en: {
      title: "Want to read more?",
      intro: "Tell me you're interested and, if you like, leave your email: I'll write when there's news and send you Faetón as PDF and EPUB.",
      msgLabel: "Anything you'd like to tell me (optional)",
      mailLabel: "Your email (optional)",
      mailHint: "I only use it for this: Faetón and news about La chispa. If you want me to delete it, just write to me.",
      send: "Send",
      cancel: "Close",
      sending: "Sending…",
      okMail: "Thanks! Faetón will reach you in a few minutes. If you don't see it, check your spam folder.",
      okNoMail: "Thanks for your interest! If you want me to let you know later, come back and leave your email.",
      badMail: "That email doesn't look valid. Check it or leave it empty.",
      fail: "It couldn't be sent. Try again or ",
      failLink: "send me an email",
      subject: "La chispa: I'd like to read more",
      body: "Hi Fidel, I'd like to read more of La chispa. My email for news: "
    }
  };

  var dlg = null;
  var openedAt = 0;

  function lang() { return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "es"; }
  function $(id) { return dlg.querySelector(id); }

  function build() {
    var t = T[lang()];
    if (dlg) dlg.remove();
    dlg = document.createElement("dialog");
    dlg.className = "dlg";
    dlg.setAttribute("aria-labelledby", "chispaDlgTitle");
    dlg.innerHTML =
      '<h2 id="chispaDlgTitle"></h2><p></p>' +
      '<form class="form" novalidate>' +
      '<div class="form__row"><label for="cm"></label><textarea id="cm" maxlength="600" rows="3"></textarea></div>' +
      '<div class="form__row"><label for="ce"></label><input id="ce" type="email" maxlength="120" autocomplete="email" inputmode="email"><p class="dlg__hint"></p></div>' +
      '<div class="form__hp" aria-hidden="true"><label>No completar<input id="cw" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="dlg__actions"><button type="submit" class="btn btn--accent"></button><button type="button" class="btn btn--ghost" data-cerrar></button></div>' +
      '<p class="dlg__status" role="status" aria-live="polite"></p>' +
      '</form>';
    dlg.querySelector("h2").textContent = t.title;
    dlg.querySelector("p").textContent = t.intro;
    dlg.querySelector('label[for="cm"]').textContent = t.msgLabel;
    dlg.querySelector('label[for="ce"]').textContent = t.mailLabel;
    dlg.querySelector(".dlg__hint").textContent = t.mailHint;
    dlg.querySelector('button[type="submit"]').textContent = t.send;
    dlg.querySelector("[data-cerrar]").textContent = t.cancel;
    dlg.querySelector("[data-cerrar]").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.querySelector("form").addEventListener("submit", enviar);
    document.body.appendChild(dlg);
  }

  function estado(msg, ok) {
    var el = $(".dlg__status");
    el.textContent = msg;
    el.setAttribute("data-ok", ok ? "true" : "false");
  }

  function planB(t, mail, texto) {
    var el = $(".dlg__status");
    el.setAttribute("data-ok", "false");
    el.textContent = t.fail;
    var a = document.createElement("a");
    a.href = "mailto:" + CONTACTO + "?subject=" + encodeURIComponent(t.subject) +
      "&body=" + encodeURIComponent(t.body + mail + (texto ? "\n\n" + texto : ""));
    a.textContent = t.failLink;
    el.appendChild(a);
    el.appendChild(document.createTextNode("."));
  }

  function enviar(ev) {
    ev.preventDefault();
    var t = T[lang()];
    var btn = dlg.querySelector('button[type="submit"]');
    var mail = $("#ce").value.trim();
    var texto = $("#cm").value.trim();
    if (mail && !/^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(mail)) return estado(t.badMail, false);
    if (!BUZON) return planB(t, mail, texto);

    btn.disabled = true;
    btn.textContent = t.sending;
    estado("", true);
    // text/plain evita la consulta previa (preflight) del navegador, que Apps Script no responde.
    fetch(BUZON, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ sitio: "chispa", email: mail, texto: texto, web: $("#cw").value, ms: Date.now() - openedAt, lang: lang(), origen: location.pathname })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.ok) throw new Error(j.error || "error");
      estado(mail ? t.okMail : t.okNoMail, true);
      btn.textContent = t.send;
      $("#ce").value = ""; $("#cm").value = "";
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = t.send;
      planB(t, mail, texto);
    });
  }

  function abrir() {
    if (typeof HTMLDialogElement === "undefined") { location.href = "mailto:" + CONTACTO; return; }
    build();
    openedAt = Date.now();
    dlg.showModal();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-chispa-open]");
    if (b) abrir();
  });
})();
