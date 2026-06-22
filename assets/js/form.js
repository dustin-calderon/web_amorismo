/**
 * form.js – Prevents form reload and shows feedback.
 *
 * Without a real backend, this captures the submit event,
 * prevents the default reload, and shows a feedback message.
 * When a backend is ready, replace the TODO with a fetch() call.
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = form.querySelector('[name="email"]');
    var feedback = document.getElementById('contact-feedback');
    if (!email || !feedback) return;

    // TODO: Replace with actual fetch() to backend/Mautic endpoint
    feedback.textContent = '¡Gracias! Te mantendremos al tanto.';
    feedback.className = 'am-contact__feedback am-contact__feedback--visible am-contact__feedback--success';
    email.value = '';
  });
})();
