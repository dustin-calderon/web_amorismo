/**
 * nav.js – Highlights the active volume pill in the nav bar.
 *
 * Reads the current filename from window.location and adds
 * .am-nav__link--active + aria-current="page" to the matching link.
 *
 * @type {Record<string, string>} PAGE_MAP — filename → data-page value
 */
(function () {
  'use strict';

  const PAGE_MAP = {
    'vol-1':      'vol1',
    'vol-1.html': 'vol1',
    'vol-2':      'vol2',
    'vol-2.html': 'vol2',
    'vol-3':      'vol3',
    'vol-3.html': 'vol3',
  };

  const filename = window.location.pathname.split('/').pop();
  const activePage = PAGE_MAP[filename];

  if (!activePage) return; // index.html — no pill to highlight

  document.querySelectorAll('.am-nav__link').forEach(function (link) {
    if (link.getAttribute('data-page') === activePage) {
      link.classList.add('am-nav__link--active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
