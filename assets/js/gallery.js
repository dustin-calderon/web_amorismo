/**
 * gallery.js – Interactive gallery for production photos
 * Migrated from amorismo-scripts.js, unchanged logic.
 */
(function () {
  'use strict';

  const qs  = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const mainImage  = qs('#gallery-main-image');
  const thumbnails = qsa('.am-gallery__thumb');

  if (!mainImage || thumbnails.length === 0) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.getAttribute('data-src');
      if (!newSrc) return;

      mainImage.src = newSrc;

      thumbnails.forEach(t => t.classList.remove('am-gallery__thumb--active'));
      thumb.classList.add('am-gallery__thumb--active');
    });
  });
})();
