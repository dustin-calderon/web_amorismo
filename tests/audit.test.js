/**
 * @file audit.test.js
 * @description Test suite for the multi-page Amorismo static site.
 * Covers file integrity, HTML semantics, content, CSS tokens, JS, 404, and security.
 *
 * Run: node --test tests/audit.test.js
 * Requires Node.js >= 18
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/** @param {string} relPath – path relative to project root */
const readFile = (relPath) => readFileSync(join(ROOT, relPath), 'utf8');

/** @param {string} relPath */
const fileExists = (relPath) => existsSync(join(ROOT, relPath));

// ─── Shared page list ────────────────────────────────────────────────────────

const PAGES = ['index.html', 'vol-1.html', 'vol-2.html', 'vol-3.html'];

// ─────────────────────────────────────────────────────────────────────────────
// 1. FILE INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────

describe('1. Integridad de archivos', () => {

  test('1.1 - Las 4 páginas HTML existen', () => {
    PAGES.forEach(page => {
      assert.ok(fileExists(page), `${page} debe existir`);
    });
  });

  test('1.2 - 404.html existe', () => {
    assert.ok(fileExists('404.html'));
  });

  test('1.3 - Módulos CSS existen', () => {
    const cssFiles = [
      'tokens.css', 'base.css', 'nav.css', 'components.css',
      'hero.css', 'gallery.css', 'footer.css', 'responsive.css',
    ];
    cssFiles.forEach(f => {
      assert.ok(fileExists(`assets/css/${f}`), `CSS: ${f} debe existir`);
    });
  });

  test('1.4 - Módulos JS existen', () => {
    assert.ok(fileExists('assets/js/nav.js'), 'nav.js debe existir');
    assert.ok(fileExists('assets/js/gallery.js'), 'gallery.js debe existir');
  });

  test('1.5 - Legacy files eliminados', () => {
    assert.ok(!fileExists('assets/css/amorismo-styles.css'), 'Legacy CSS eliminado');
    assert.ok(!fileExists('assets/js/amorismo-scripts.js'), 'Legacy JS eliminado');
  });

  test('1.6 - Favicon optimizado existe', () => {
    assert.ok(fileExists('assets/images/favicon.png'), 'favicon.png debe existir');
    assert.ok(!fileExists('assets/images/amorismo-logo.png'), 'PNG bloated eliminado');
  });

  test('1.7 - Assets de imágenes existen', () => {
    const images = [
      'amorismo-cartel.webp', 'amorismo-logo.webp', 'favicon.png',
      'LOA_fondo-verde.webp', 'BLANCA_fondo-verde.webp',
      'ANGELA_fondo-verde.webp', 'BRAULIO_fondo-verde.webp',
      'DUSTIN_fondo-verde.webp', 'DAVID_fondo-verde.webp',
      'CARMEN_fondo-verde.webp',
    ];
    images.forEach(img => {
      assert.ok(fileExists(`assets/images/${img}`), `Imagen: ${img}`);
    });
  });

  test('1.8 - Galería completa (8 fotos)', () => {
    const gallery = [
      'IMG_6612.webp', 'IMG_6624.webp', 'IMG_6632.webp', 'IMG_6655.webp',
      'IMG_6660.webp', 'IMG_6666.webp', 'IMG_6670.webp', 'IMG_6685.webp',
    ];
    gallery.forEach(img => {
      assert.ok(fileExists(`assets/images/${img}`), `Galería: ${img}`);
    });
  });

  test('1.9 - Ningún archivo CSS/JS supera 300 líneas', () => {
    const files = [
      'assets/css/tokens.css', 'assets/css/base.css', 'assets/css/nav.css',
      'assets/css/components.css', 'assets/css/hero.css', 'assets/css/gallery.css',
      'assets/css/footer.css', 'assets/css/responsive.css',
      'assets/js/nav.js', 'assets/js/gallery.js',
    ];
    files.forEach(f => {
      const lines = readFile(f).split('\n').length;
      assert.ok(lines <= 300, `${f} tiene ${lines} líneas (máx 300)`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. HTML SEMÁNTICA (todas las páginas)
// ─────────────────────────────────────────────────────────────────────────────

describe('2. Semántica HTML y SEO', () => {

  PAGES.forEach(page => {
    describe(`2.x - ${page}`, () => {
      const html = readFile(page);

      test('DOCTYPE html5', () => {
        assert.ok(html.startsWith('<!DOCTYPE html>'));
      });

      test('lang="es"', () => {
        assert.ok(html.includes('lang="es"'));
      });

      test('charset utf-8', () => {
        assert.ok(html.includes('charset="utf-8"'));
      });

      test('meta viewport', () => {
        assert.ok(html.includes('name="viewport"'));
      });

      test('Único <h1>', () => {
        const h1s = (html.match(/<h1[^>]*>/g) || []).length;
        assert.equal(h1s, 1);
      });

      test('Preconnect fonts', () => {
        assert.ok(html.includes('preconnect" href="https://fonts.googleapis.com"'));
      });

      test('Favicon referencia favicon.png', () => {
        assert.ok(html.includes('href="assets/images/favicon.png"'));
      });

      test('role="main" presente', () => {
        assert.ok(html.includes('role="main"'));
      });

      test('Footer FUERA de main', () => {
        const mainClose = html.indexOf('</main>');
        const footerOpen = html.indexOf('<footer');
        assert.ok(footerOpen > mainClose, 'Footer debe ser sibling de main, no hijo');
      });

      test('Sin inline style=', () => {
        assert.ok(!html.includes('style='), `${page} no debe tener estilos inline`);
      });

      test('Sin referencias legacy (amorismo__)', () => {
        assert.ok(!html.includes('amorismo__'), `${page} no debe usar clases legacy`);
      });

      test('Todas las img tienen alt', () => {
        const imgs = html.match(/<img [^>]+>/g) || [];
        imgs.forEach(img => {
          assert.ok(img.includes('alt='), `Imagen sin alt: ${img.substring(0, 60)}`);
        });
      });

      test('nav.js cargado con defer', () => {
        assert.ok(html.includes('defer src="assets/js/nav.js"'));
      });

      test('Rutas relativas (no absolutas)', () => {
        assert.ok(!html.includes('href="/assets'));
        assert.ok(!html.includes('src="/assets'));
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTENIDO VOL. III (la página con más contenido)
// ─────────────────────────────────────────────────────────────────────────────

describe('3. Contenido de vol-3.html', () => {
  const html = readFile('vol-3.html');

  test('3.1 - CTA disabled presente', () => {
    assert.ok(html.includes('Entradas no disponibles'));
    assert.ok(html.includes('am-cta--disabled'));
  });

  test('3.2 - Sin enlace a taquilla', () => {
    assert.ok(!html.includes('taquilla.microteatro'));
  });

  test('3.3 - Elenco completo (4)', () => {
    ['Loa Miller', 'Blanca Rodríguez', 'Ángela Santos', 'Braulio Chappell'].forEach(name => {
      assert.ok(html.includes(name), `Elenco: ${name}`);
    });
  });

  test('3.4 - Equipo creativo (3)', () => {
    ['Dustin Calderón', 'David Gregory', 'Carmen Rodríguez'].forEach(name => {
      assert.ok(html.includes(name), `Equipo: ${name}`);
    });
  });

  test('3.5 - Galería con 8 thumbnails', () => {
    const thumbs = (html.match(/class="am-gallery__thumb/g) || []).length;
    assert.ok(thumbs >= 8, `Necesita 8+ thumbnails, tiene ${thumbs}`);
  });

  test('3.6 - gallery.js cargado', () => {
    assert.ok(html.includes('defer src="assets/js/gallery.js"'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTENIDO HOME (index.html)
// ─────────────────────────────────────────────────────────────────────────────

describe('4. Contenido de index.html', () => {
  const html = readFile('index.html');

  test('4.1 - Hero centrado usa modifier class', () => {
    assert.ok(html.includes('am-hero__grid--centered'));
  });

  test('4.2 - Crédito de autoría', () => {
    assert.ok(html.includes('Dustin Calderón'));
  });

  test('4.3 - Footer con copyright y legales', () => {
    assert.ok(html.includes('Copyright © 2025'));
    assert.ok(html.includes('Aviso Legal'));
    assert.ok(html.includes('Política de Privacidad'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. CSS DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

describe('5. CSS Design System', () => {
  const tokens = readFile('assets/css/tokens.css');

  test('5.1 - Verde petróleo definido', () => {
    assert.ok(tokens.includes('--am-verde'));
  });

  test('5.2 - Font Inter definida', () => {
    assert.ok(tokens.includes("'Inter'"));
  });

  test('5.3 - Font IBM Plex Mono definida', () => {
    assert.ok(tokens.includes("'IBM Plex Mono'"));
  });

  test('5.4 - Sin tokens huérfanos (dead tokens eliminados)', () => {
    assert.ok(!tokens.includes('--am-negro-escenico'));
    assert.ok(!tokens.includes('--am-radius-lg'));
    assert.ok(!tokens.includes('--am-sp-7'));
  });

  test('5.5 - Responsive tiene media queries', () => {
    const responsive = readFile('assets/css/responsive.css');
    assert.ok(responsive.includes('@media'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. JAVASCRIPT
// ─────────────────────────────────────────────────────────────────────────────

describe('6. JavaScript', () => {

  test('6.1 - nav.js usa IIFE + strict', () => {
    const nav = readFile('assets/js/nav.js');
    assert.ok(nav.includes("'use strict'"));
    assert.ok(nav.includes('(function ()'));
  });

  test('6.2 - gallery.js usa IIFE + strict', () => {
    const gallery = readFile('assets/js/gallery.js');
    assert.ok(gallery.includes("'use strict'"));
    assert.ok(gallery.includes('(function ()'));
  });

  test('6.3 - gallery.js es defensivo', () => {
    const gallery = readFile('assets/js/gallery.js');
    assert.ok(gallery.includes('if (!mainImage'));
  });

  test('6.4 - nav.js mapea las 4 páginas', () => {
    const nav = readFile('assets/js/nav.js');
    ['index.html', 'vol-1.html', 'vol-2.html', 'vol-3.html'].forEach(page => {
      assert.ok(nav.includes(`'${page}'`), `nav.js debe mapear ${page}`);
    });
  });

  test('6.5 - Sin console.log en producción', () => {
    const nav = readFile('assets/js/nav.js');
    const gallery = readFile('assets/js/gallery.js');
    assert.ok(!nav.includes('console.log'));
    assert.ok(!gallery.includes('console.log'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. PÁGINA 404
// ─────────────────────────────────────────────────────────────────────────────

describe('7. Página 404', () => {
  const html = readFile('404.html');

  test('7.1 - Title descriptivo', () => {
    assert.ok(html.includes('<title>404 - Página no encontrada</title>'));
  });

  test('7.2 - Link a inicio', () => {
    assert.ok(html.includes('href="/"'));
  });

  test('7.3 - Usa paleta verde petróleo', () => {
    assert.ok(html.includes('#0D2C2C'));
  });

  test('7.4 - Legales correctos', () => {
    assert.ok(html.includes('dustincalderon.com/legal/aviso-legal/'));
    assert.ok(html.includes('dustincalderon.com/legal/privacidad/'));
    assert.ok(!html.includes('politica-privacidad'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. SEGURIDAD
// ─────────────────────────────────────────────────────────────────────────────

describe('8. Seguridad', () => {

  test('8.1 - Links externos con noopener', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      const blanks = (html.match(/target="_blank"/g) || []).length;
      const noopers = (html.match(/rel="noopener noreferrer"/g) || []).length;
      assert.equal(blanks, noopers, `${page}: target=_blank (${blanks}) vs noopener (${noopers})`);
    });
  });

  test('8.2 - Sin credenciales en HTML/JS', () => {
    const allContent = PAGES.map(p => readFile(p)).join('') +
      readFile('assets/js/nav.js') + readFile('assets/js/gallery.js');
    assert.ok(!allContent.includes('Bearer '));
    assert.ok(!allContent.includes('api_key'));
  });

  test('8.3 - Sin href javascript: (XSS)', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      assert.ok(!html.match(/href="javascript:/i), `${page}: no javascript: href`);
    });
  });

  test('8.4 - Sin package.json ni node_modules', () => {
    assert.ok(!fileExists('package.json'));
    assert.ok(!fileExists('node_modules'));
  });
});
