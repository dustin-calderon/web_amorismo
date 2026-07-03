/**
 * gallery.js – Interactive gallery for production photos
 */
(function () {
  'use strict';

  const qs  = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const mainGallery = qs('.am-gallery__main');
  const mainImage   = qs('#gallery-main-image');
  const thumbnails  = qsa('.am-gallery__thumb');

  if (!mainImage || thumbnails.length === 0) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.getAttribute('data-src');
      const newAlt = thumb.getAttribute('data-alt');
      if (!newSrc) return;

      mainImage.src = newSrc;
      if (newAlt) mainImage.alt = newAlt;

      // Ensure the gallery container becomes visible
      if (mainGallery && !mainGallery.classList.contains('am-gallery__main--active')) {
        mainGallery.classList.add('am-gallery__main--active');
      }

      thumbnails.forEach(t => {
        t.classList.remove('am-gallery__thumb--active');
        t.setAttribute('aria-pressed', 'false');
      });
      thumb.classList.add('am-gallery__thumb--active');
      thumb.setAttribute('aria-pressed', 'true');
    });
  });
})();
