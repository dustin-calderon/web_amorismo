/**
 * amorismo-scripts.js
 * Galería interactiva de producción — Amorismo Vol. III
 * Scope aislado via IIFE para evitar contaminación del namespace global.
 */
(function () {
  'use strict';

  const qs  = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ===== GALERÍA: Cambiar imagen principal al hacer clic en thumbnail =====
  const mainImage  = qs('#galeria-main-image');
  const thumbnails = qsa('.amorismo__galeria-thumbnail');

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.getAttribute('data-src');
        if (!newSrc) return;

        mainImage.src = newSrc;

        thumbnails.forEach(t => t.classList.remove('amorismo__galeria-thumbnail--active'));
        thumb.classList.add('amorismo__galeria-thumbnail--active');
      });
    });
  }
})();
