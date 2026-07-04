/**
 * forms.js — Amorismo Newsletter
 * Envía email a Mautic Form API (POST /form/submit).
 * Sin auth, sin CORS hack, sin modules.
 *
 * Todas las instancias (#hero-form, #contact-form) comparten el mismo FORM_ID.
 * CSS feedback classes (.am-contact__feedback--success/--error) definidas en contact.css.
 */
(function () {
  'use strict';

  /** @type {string} Subdominio Mautic para Amorismo */
  var MAUTIC_URL = 'https://news.amorismoelmusical.com';

  /** @type {number} ID del formulario "Amorismo — Newsletter" en Mautic */
  var FORM_ID = 18;

  /**
   * Construye FormData con el formato que espera Mautic Form API.
   * @param {string} email - Dirección de correo del suscriptor
   * @returns {FormData}
   */
  function buildPayload(email) {
    var fd = new FormData();
    fd.append('mauticform[formId]', FORM_ID);
    fd.append('mauticform[email]', email);
    fd.append('mauticform[return]', '');
    return fd;
  }

  /**
   * Muestra feedback visual reutilizando clases de contact.css.
   * Busca el <p> dentro de .am-contact; si no existe, lo crea como fallback.
   * @param {HTMLFormElement} form
   * @param {'success'|'error'} type
   * @param {string} msg
   */
  function showFeedback(form, type, msg) {
    var container = form.closest('.am-contact') || form.parentElement;
    var el = container.querySelector('.am-contact__feedback');
    if (!el) {
      el = document.createElement('p');
      el.className = 'am-contact__feedback';
      el.setAttribute('aria-live', 'polite');
      form.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
    el.className = 'am-contact__feedback am-contact__feedback--visible '
                 + 'am-contact__feedback--' + type;
  }

  /**
   * Handler del evento submit.
   * @param {SubmitEvent} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('button[type="submit"]');
    if (!input || !btn) return;

    var email = input.value.trim();
    if (!email) return;

    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando\u2026';

    fetch(MAUTIC_URL + '/form/submit', {
      method: 'POST',
      body: buildPayload(email),
      redirect: 'manual'
      // NO Content-Type — FormData gestiona el boundary automáticamente
    })
    .then(function (res) {
      // Mautic devuelve 302 redirect tras procesar.
      // Con redirect:'manual', response.type === 'opaqueredirect' y status === 0.
      // Esto ES éxito — el contacto ya se creó.
      if (res.type === 'opaqueredirect' || res.ok || res.status === 302) {
        showFeedback(form, 'success', '\u00a1Gracias! Te mantendremos al tanto.');
        input.value = '';
        btn.textContent = '\u2713 Enviado';
      } else {
        throw new Error('Status ' + res.status);
      }
    })
    .catch(function (err) {
      console.error('[AmorismoForm]', err);
      showFeedback(form, 'error', 'Error al enviar. Int\u00e9ntalo de nuevo.');
      btn.disabled = false;
      btn.textContent = originalText;
    });
  }

  // Inicializar: vincular handler a todos los forms de la página
  document.querySelectorAll('#hero-form, #contact-form')
    .forEach(function (f) { f.addEventListener('submit', handleSubmit); });
})();
