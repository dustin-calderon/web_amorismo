/**
 * nav.js – Highlights the active page in the nav bar.
 *
 * Reads the current filename from window.location and adds
 * the appropriate active class + aria-current="page" to the matching link.
 *
 * Layout: [Inicio · Escuchar · Partituras]  ←—— [Vol I | Vol II | Vol III] ——→  [✉]
 *
 * @type {Record<string, string>} PAGE_MAP — filename → data-page value
 */
(function () {
  'use strict';

  /** @type {Record<string, string>} */
  var PAGE_MAP = {
    '':               'home',
    'index.html':     'home',
    'escuchar':       'escuchar',
    'escuchar.html':  'escuchar',
    'partituras':     'partituras',
    'partituras.html':'partituras',
    'vol-1':          'vol1',
    'vol-1.html':     'vol1',
    'vol-2':          'vol2',
    'vol-2.html':     'vol2',
    'vol-3':          'vol3',
    'vol-3.html':     'vol3',
  };

  var path = window.location.pathname.replace(/\/+$/, '');
  var filename = path.split('/').pop() || '';
  var activePage = PAGE_MAP[filename];

  if (!activePage) return;

  document.querySelectorAll('[data-page]').forEach(function (link) {
    var isMenuLink = link.classList.contains('am-nav__menu-link');
    var activeClass = isMenuLink ? 'am-nav__menu-link--active' : 'am-nav__link--active';

    if (link.getAttribute('data-page') === activePage) {
      link.classList.add(activeClass);
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove(activeClass);
      link.removeAttribute('aria-current');
    }
  });
})();

