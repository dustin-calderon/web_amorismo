/**
 * gallery.js – Interactive gallery for production photos
 *
 * Shows the large viewer only after a thumbnail click and keeps
 * click-to-switch state in sync with aria-pressed.
 *
 * Syntax: ES5 strict — matches nav.js and forms.js for browser parity.
 */
(function () {
  'use strict';

  var mainGallery = document.querySelector('.am-gallery__main');
  var mainImage   = document.querySelector('#gallery-main-image');
  var thumbnails  = document.querySelectorAll('.am-gallery__thumb');
  var switchTimer = null;
  var pendingImage = null;
  var pendingSrc = null;

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

    function clearPendingSwitch() {
      if (switchTimer) window.clearTimeout(switchTimer);
      switchTimer = null;
      if (pendingImage) {
        pendingImage.onload = null;
        pendingImage.onerror = null;
        pendingImage = null;
      }
      pendingSrc = null;
    }

    function applyImage() {
      if (pendingSrc !== newSrc) return;
      mainImage.src = newSrc;
      if (newAlt) mainImage.alt = newAlt;
      mainImage.classList.remove('am-gallery__image--switching');
      clearPendingSwitch();
    }

    if (mainImage.getAttribute('src') !== newSrc) {
      clearPendingSwitch();
      pendingSrc = newSrc;
      pendingImage = new Image();
      pendingImage.onload = pendingImage.onerror = function () {
        if (pendingSrc !== newSrc) return;
        mainImage.classList.add('am-gallery__image--switching');
        switchTimer = window.setTimeout(applyImage, 120);
      };
      pendingImage.src = newSrc;
    } else {
      clearPendingSwitch();
      mainImage.src = newSrc;
      if (newAlt) mainImage.alt = newAlt;
      mainImage.classList.remove('am-gallery__image--switching');
    }

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

})();
