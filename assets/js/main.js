// Fidel Chaves — hub personal
// JS mínimo: menú mobile, año dinámico, preselección de "tipo de proyecto"
// desde los botones de servicios, y envío del formulario por fetch (progressive
// enhancement: si falla o no hay JS, el form igual funciona por action/method).

(function () {
  "use strict";

  // Menú mobile
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

  // Envío del formulario vía fetch para no salir de la página
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
      status.textContent = "Enviando...";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            status.textContent = "Gracias, te respondo pronto.";
            form.reset();
          } else {
            status.textContent =
              "Hubo un problema. Escribime directo a fidelchaves96@gmail.com.";
          }
        })
        .catch(function () {
          status.textContent =
            "Hubo un problema. Escribime directo a fidelchaves96@gmail.com.";
        });
    });
  }
})();
