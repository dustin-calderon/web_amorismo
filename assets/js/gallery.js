/**
 * gallery.js – Interactive gallery for production photos
 *
 * Activates the first thumbnail on load (progressive enhancement)
 * and handles click-to-switch with aria-pressed state management.
 */
(function () {
  'use strict';

  const qs  = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const mainGallery = qs('.am-gallery__main');
  const mainImage   = qs('#gallery-main-image');
  const thumbnails  = qsa('.am-gallery__thumb');

  if (!mainImage || thumbnails.length === 0) return;

  /**
   * Activates a specific thumbnail: sets main image src/alt,
   * toggles active class and aria-pressed across all thumbs.
   * @param {HTMLElement} thumb - The thumbnail button to activate
   */
  function activateThumb(thumb) {
    var newSrc = thumb.getAttribute('data-src');
    var newAlt = thumb.getAttribute('data-alt');
    if (!newSrc) return;

    mainImage.src = newSrc;
    if (newAlt) mainImage.alt = newAlt;

    // Ensure the gallery container becomes visible
    if (mainGallery && !mainGallery.classList.contains('am-gallery__main--active')) {
      mainGallery.classList.add('am-gallery__main--active');
    }

    thumbnails.forEach(function (t) {
      t.classList.remove('am-gallery__thumb--active');
      t.setAttribute('aria-pressed', 'false');
    });
    thumb.classList.add('am-gallery__thumb--active');
    thumb.setAttribute('aria-pressed', 'true');
  }

  // Bind click handlers
  thumbnails.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      activateThumb(thumb);
    });
  });

  // Auto-activate first thumbnail on load (progressive enhancement)
  activateThumb(thumbnails[0]);
})();
