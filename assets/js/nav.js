/**
 * nav.js – Highlights active navigation tab based on current page URL.
 * Reads the filename from window.location and marks the matching link.
 */
(function () {
  'use strict';

  /** @type {Record<string, string>} Maps filename to nav link data-page value */
  const PAGE_MAP = {
    'index.html': 'home',
    'vol-1.html': 'vol1',
    'vol-2.html': 'vol2',
    'vol-3.html': 'vol3',
    '':           'home',  // root path resolves to home
  };

  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  const activePage = PAGE_MAP[filename] || 'home';

  document.querySelectorAll('.am-nav__link').forEach(link => {
    if (link.getAttribute('data-page') === activePage) {
      link.classList.add('am-nav__link--active');
    }
  });
})();
