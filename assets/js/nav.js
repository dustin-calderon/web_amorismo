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
    '':            'home',
    'index.html':  'home',
    'vol-1':      'vol1',
    'vol-1.html': 'vol1',
    'vol-2':      'vol2',
    'vol-2.html': 'vol2',
    'vol-3':      'vol3',
    'vol-3.html': 'vol3',
    'escuchar':      'escuchar',
    'escuchar.html': 'escuchar',
    'partituras':      'partituras',
    'partituras.html': 'partituras',
  };

  const path = window.location.pathname.replace(/\/+$/, '');
  const filename = path.split('/').pop() || '';
  const activePage = PAGE_MAP[filename];

  if (!activePage) return;

  document.querySelectorAll('[data-page]').forEach(function (link) {
    var isMenu = link.classList.contains('am-nav__menu-link');
    var activeClass = isMenu ? 'am-nav__menu-link--active' : 'am-nav__link--active';

    if (link.getAttribute('data-page') === activePage) {
      link.classList.add(activeClass);
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove(activeClass);
      link.removeAttribute('aria-current');
    }
  });
})();
