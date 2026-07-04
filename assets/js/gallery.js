/**
 * gallery.js – Interactive gallery for production photos
 *
 * Activates the first thumbnail on load (progressive enhancement)
 * and handles click-to-switch with aria-pressed state management.
 *
 * Syntax: ES5 strict — matches nav.js and forms.js for browser parity.
 */
(function () {
  'use strict';

  var mainGallery = document.querySelector('.am-gallery__main');
  var mainImage   = document.querySelector('#gallery-main-image');
  var thumbnails  = document.querySelectorAll('.am-gallery__thumb');

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

  // Auto-activate first thumbnail on load — ensures main image is visible
  activateThumb(thumbnails[0]);

})();
