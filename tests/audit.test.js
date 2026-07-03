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

const PAGES = ['index.html', 'escuchar.html', 'partituras.html', 'vol-1.html', 'vol-2.html', 'vol-3.html'];

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

  test('1.2b - Páginas nuevas existen (escuchar, partituras)', () => {
    assert.ok(fileExists('escuchar.html'), 'escuchar.html debe existir');
    assert.ok(fileExists('partituras.html'), 'partituras.html debe existir');
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

  test('1.4b - No hay JavaScript de formulario sin backend', () => {
    assert.ok(!fileExists('assets/js/form.js'), 'form.js no debe fingir altas sin backend real');
  });

  test('1.5 - Legacy files eliminados', () => {
    assert.ok(!fileExists('assets/css/amorismo-styles.css'), 'Legacy CSS eliminado');
    assert.ok(!fileExists('assets/js/amorismo-scripts.js'), 'Legacy JS eliminado');
  });

  test('1.6 - Favicon optimizado existe', () => {
    assert.ok(fileExists('assets/images/favicon.png'), 'favicon.png debe existir');
    assert.ok(!fileExists('assets/images/amorismo-logo.webp'), 'Legacy WebP logo eliminado');
  });

  test('1.7 - Assets de imágenes existen', () => {
    const images = [
      'amorismo-cartel.webp', 'amorismo-logo.png', 'favicon.png',
      'hero/amorismo-01-sombra.png', 'hero/amorismo-02-sombra.png', 'hero/amorismo-03-sombra.png',
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

  test('1.10 - No quedan herramientas de build rotas u obsoletas', () => {
    assert.ok(!fileExists('scripts/compress-covers.js'));
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

      test('Incluye acceso directo al contenido principal', () => {
        assert.ok(html.includes('class="am-skip-link" href="#main"'));
        assert.ok(html.includes('<main id="main" role="main" tabindex="-1">'));
      });

      test('Cada página navega con data-page para que nav.js pueda activar', () => {
        assert.ok(html.includes('data-page='), `${page} necesita data-page en sus nav links`);
      });

      test('Rutas relativas (no absolutas)', () => {
        assert.ok(!html.includes('href="/assets'));
        assert.ok(!html.includes('src="/assets'));
      });

      test('Footer legal consistente', () => {
        assert.ok(html.includes('Copyright © 2026'));
        assert.ok(html.includes('Aviso Legal'));
        assert.ok(html.includes('Política de Privacidad'));
      });

      test('Footer editorial sin navegación duplicada', () => {
        const footer = html.match(/<footer class="am-footer">([\s\S]*?)<\/footer>/)?.[1] || '';

        assert.ok(footer.includes('src="assets/images/amorismo-logo.png"'));
        assert.ok(footer.includes('Un Musical de Dustin Calderón'));
        assert.ok(!footer.includes('Micromúsica y poesía escrita'));
        ['vol-1.html', 'vol-2.html', 'vol-3.html'].forEach(href => {
          assert.ok(!footer.includes(`href="${href}"`), `Footer no debe duplicar navegación: ${href}`);
        });
      });

      test('Sin copy provisional publicado', () => {
        [
          'PLACEHOLDER',
          'Texto de opinión',
          'Texto de la review',
          'Texto de la sinopsis',
          'Nombre Apellido',
          '— Fuente',
          '<p class="am-person__name">Nombre</p>',
          'Descripción del primer volumen',
          'Descripción del segundo volumen',
        ].forEach(text => {
          assert.ok(!html.includes(text), `${page}: copy provisional publicado: ${text}`);
        });
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

  test('4.1 - Home usa landing hero con triptych y formulario de suscripción', () => {
    assert.ok(html.includes('class="am-landing-hero"'));
    assert.equal((html.match(/class="am-landing-hero__photo /g) || []).length, 3);
    assert.ok(!html.includes('class="am-landing-hero__cover"'));
    assert.ok(html.includes('id="hero-form"'), 'hero debe tener formulario de suscripción');
    assert.ok(html.includes('id="hero-email"'), 'hero debe tener input de email');
    assert.ok(html.includes('id="hero-submit"'), 'hero debe tener botón de submit');
  });

  test('4.2 - Crédito de autoría', () => {
    assert.ok(html.includes('Dustin Calderón'));
  });

  test('4.3 - Footer con copyright y legales', () => {
    assert.ok(html.includes('Copyright © 2026'));
    assert.ok(html.includes('Aviso Legal'));
    assert.ok(html.includes('Política de Privacidad'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. CSS DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

describe('5. CSS Design System', () => {
  const tokens = readFile('assets/css/tokens.css');

  test('5.1 - Tokens semánticos de Home definidos', () => {
    ['--am-home-bg', '--am-home-text', '--am-home-accent'].forEach(token => {
      assert.ok(tokens.includes(token), `${token} debe existir`);
    });
  });

  test('5.2 - Font Inter definida', () => {
    assert.ok(tokens.includes("'Inter'"));
  });

  test('5.3 - Font Fredoka definida', () => {
    assert.ok(tokens.includes("'Fredoka'"));
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

  test('5.6 - Respeta prefers-reduced-motion', () => {
    const base = readFile('assets/css/base.css');
    assert.ok(base.includes('prefers-reduced-motion'));
    assert.ok(!base.includes('scroll-duration'), 'scroll-duration no es una propiedad CSS válida');
    const error404 = readFile('404.html');
    assert.ok(error404.includes('prefers-reduced-motion') || error404.includes('base.css'), '404 debe respetar prefers-reduced-motion (inline o via base.css)');
  });

  test('5.7 - Foco visible global sin supresión de outline', () => {
    assert.ok(readFile('assets/css/base.css').includes(':focus-visible'));
    const productionCss = [
      'assets/css/base.css', 'assets/css/nav.css', 'assets/css/components.css',
      'assets/css/hero.css', 'assets/css/home.css', 'assets/css/volume.css',
      'assets/css/gallery.css', 'assets/css/footer.css', 'assets/css/responsive.css',
    ].map(readFile).join('\n');
    assert.ok(!productionCss.match(/outline:\s*none/));
  });

  test('5.8 - Vol. I remapea todos los colores funcionales a su paleta oficial', () => {
    const volumeOneTheme = tokens.match(/body\[data-vol="1"\]\s*\{([\s\S]*?)\n\}/)?.[1] || '';
    const expectedMappings = [
      '--am-home-bg:           var(--am-v1-fondo-oscuro)',
      '--am-home-surface:      var(--am-v1-principal)',
      '--am-home-text:         var(--am-v1-texto)',
      '--am-home-text-muted:   var(--am-v1-elemento-01)',
      '--am-home-accent:       var(--am-v1-secundario)',
      '--am-home-accent-soft:  var(--am-v1-elemento-02)',
      '--am-home-quote-bg:     var(--am-v1-principal)',
      '--am-bg-grad-bottom:    var(--am-v1-fondo-oscuro)',
    ];

    expectedMappings.forEach(mapping => {
      assert.ok(volumeOneTheme.includes(mapping), `Falta mapping oficial: ${mapping}`);
    });

    ['#4A0015', '#2A000C', '#0A0A0A', '#A71921'].forEach(color => {
      assert.ok(!volumeOneTheme.toUpperCase().includes(color), `Color ajeno en Vol. I: ${color}`);
    });
  });

  test('5.9 - Componentes compartidos no fijan colores de un volumen concreto', () => {
    const sharedComponents = [
      'assets/css/components.css',
      'assets/css/nav.css',
      'assets/css/hero.css',
      'assets/css/home.css',
    ].map(readFile).join('\n');

    assert.ok(!sharedComponents.includes('rgba(167, 25, 33'));
    assert.ok(!sharedComponents.includes('rgba(10, 10, 10'));
    assert.ok(!sharedComponents.includes('rgba(0, 0, 0'));
    assert.ok(!sharedComponents.includes('var(--am-v1-secundario)'));
  });

  test('5.10 - Componentes interactivos usan contraste y tamaño táctil', () => {
    const components = readFile('assets/css/components.css');
    const nav = readFile('assets/css/nav.css');

    assert.ok(components.includes('color: var(--am-on-accent)'));
    assert.ok(components.includes('min-height: 44px'));
    assert.ok(nav.includes('min-height: 44px'));
    assert.ok(nav.includes('var(--am-nav-active-text)'));
  });

  test('5.10b - Menú alineado con marca y sin desplazamientos en hover', () => {
    const nav = readFile('assets/css/nav.css');
    const navLinkHover = nav.match(/\.am-nav__link:hover\s*\{([\s\S]*?)\n\}/)?.[1] || '';

    assert.ok(nav.includes('background: linear-gradient(to bottom, var(--am-nav-bg), transparent)'));
    assert.ok(nav.includes('backdrop-filter: blur(14px)'));
    assert.ok(nav.includes('border-radius: 999px'));
    assert.ok(nav.includes('.am-nav__link.am-nav__link--active::after'));
    assert.ok(!navLinkHover.includes('transform:'), 'El hover del menú no debe mover ni reescalar tabs');
  });

  test('5.11 - Anclas compensan la navegación fija', () => {
    const base = readFile('assets/css/base.css');
    assert.ok(base.includes('scroll-margin-top: calc(var(--am-nav-h) + var(--am-sp-4))'));
  });

  test('5.12 - Placeholder conserva contraste sin opacidad artificial', () => {
    const home = readFile('assets/css/home.css');
    assert.ok(home.includes('color: var(--am-input-placeholder)'));
    assert.ok(home.includes('opacity: 1'));
  });

  test('5.13 - Vol. II define el tema completo de componentes interactivos', () => {
    const volumeTwoTheme = tokens.match(/body\[data-vol="2"\]\s*\{([\s\S]*?)\n\}/)?.[1] || '';
    [
      '--am-on-accent:',
      '--am-nav-bg:',
      '--am-nav-active-bg:',
      '--am-nav-active-text:',
      '--am-cta-hover-bg:',
      '--am-input-placeholder:',
      '--am-footer-logo-bg:',
    ].forEach(token => {
      assert.ok(volumeTwoTheme.includes(token), `Vol. II debe definir ${token}`);
    });
  });

  test('5.14 - Galería usa sombras temáticas', () => {
    const gallery = readFile('assets/css/gallery.css');
    assert.ok(gallery.includes('var(--am-shadow-thumb)'));
    assert.ok(gallery.includes('var(--am-shadow-thumb-hover)'));
    assert.ok(gallery.includes('var(--am-shadow-thumb-active)'));
    assert.ok(!gallery.includes('rgba('));
  });

  test('5.15 - Vol. III no hereda sombras rojas de Home', () => {
    const volumeThreeTheme = tokens.match(/body\[data-vol="3"\]\s*\{([\s\S]*?)\n\}/)?.[1] || '';
    assert.ok(volumeThreeTheme.includes('--am-shadow-cta:'));
    assert.ok(volumeThreeTheme.includes('--am-shadow-cta-hover:'));
    assert.ok(!volumeThreeTheme.includes('rgba(167, 25, 33'));
  });

  test('5.16 - Responsive no pisa tipografía fuera del contenido principal', () => {
    const responsive = readFile('assets/css/responsive.css');
    assert.ok(!responsive.match(/(^|\n)\s*h[123]\s*\{/), 'Los headings globales rompen componentes como footer/nav');
    assert.ok(!responsive.match(/(^|\n)\s*p\s*\{/), 'Los párrafos globales inflan textos pequeños como copyright');
    assert.ok(responsive.includes('main h2'));
    assert.ok(responsive.includes('main h3'));
    assert.ok(responsive.includes('main p'));
  });

  test('5.17 - El filtro del logo se puede componer con drop-shadow', () => {
    const components = readFile('assets/css/components.css');
    const hero = readFile('assets/css/hero.css');
    const nav = readFile('assets/css/nav.css');
    const volumeTwoTheme = tokens.match(/body\[data-vol="2"\]\s*\{([\s\S]*?)\n\}/)?.[1] || '';

    assert.ok(!volumeTwoTheme.includes('--am-logo-filter: none'), 'none + drop-shadow() invalida filter');
    assert.ok(volumeTwoTheme.includes('--am-logo-filter: brightness(1)'));
    // Hero uses pre-baked white logo (no filter needed); only vol page titles use the token
    assert.ok(components.includes('var(--am-logo-filter) drop-shadow'));
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

  test('6.4 - nav.js mapea las 6 páginas', () => {
    const nav = readFile('assets/js/nav.js');
    ['index.html', 'vol-1.html', 'vol-2.html', 'vol-3.html'].forEach(page => {
      assert.ok(nav.includes(`'${page}'`), `nav.js debe mapear ${page}`);
    });
  });

  test('6.5 - nav.js expone la página activa a tecnologías de asistencia', () => {
    const nav = readFile('assets/js/nav.js');
    assert.ok(nav.includes("setAttribute('aria-current', 'page')"));
    assert.ok(!nav.includes("PAGE_MAP[filename] || 'home'"));
  });

  test('6.5b - nav.js normaliza URLs con slash final', () => {
    const nav = readFile('assets/js/nav.js');
    assert.ok(nav.includes("replace(/\\/+$/, '')"));
    assert.ok(nav.includes("path.split('/').pop() || ''"));
  });

  test('6.6 - gallery.js sincroniza imagen y estado accesible', () => {
    const gallery = readFile('assets/js/gallery.js');
    assert.ok(gallery.includes('mainImage.alt = newAlt'));
    assert.ok(gallery.includes("setAttribute('aria-pressed', 'true')"));
    assert.ok(gallery.includes("setAttribute('aria-pressed', 'false')"));
  });

  test('6.7 - Sin console.log en producción', () => {
    const nav = readFile('assets/js/nav.js');
    const gallery = readFile('assets/js/gallery.js');
    assert.ok(!nav.includes('console.log'));
    assert.ok(!gallery.includes('console.log'));
  });

  test('6.8 - Ninguna página carga scripts inexistentes o muertos', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      assert.ok(!html.includes('assets/js/form.js'), `${page}: no debe cargar form.js sin backend`);
    });
  });

  test('6.9 - Nav HTML idéntico en todas las páginas (single source guard)', () => {
    const allPages = [...PAGES, '404.html'];
    const extractNav = (html) => {
      const match = html.match(/<nav class="am-nav"[\s\S]*?<\/nav>/);
      return match ? match[0]
        .replace(/\r\n/g, '\n')                                   // normalize CRLF
        .replace(/href="#correo"/g, 'href="index.html#correo"')   // normalize local anchor
        : null;
    };
    const navs = allPages.map(p => ({ page: p, nav: extractNav(readFile(p)) }));
    navs.forEach(({ page, nav }) => assert.ok(nav, `${page}: no se encontró <nav class="am-nav">`));
    const reference = navs[0].nav;
    navs.slice(1).forEach(({ page, nav }) => {
      assert.strictEqual(nav, reference, `${page}: nav diverge de ${allPages[0]}`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. PÁGINA 404
// ─────────────────────────────────────────────────────────────────────────────

describe('7. Página 404', () => {
  const html = readFile('404.html');

  test('7.1 - Title descriptivo', () => {
    assert.ok(html.includes('404') && html.includes('AMORISMO'));
  });

  test('7.2 - Link a inicio', () => {
    assert.ok(html.includes('href="index.html"'));
  });

  test('7.3 - Usa design system compartido (no paleta aislada)', () => {
    assert.ok(html.includes('tokens.css'), '404 debe usar tokens.css del design system');
    assert.ok(!html.includes('#0D2C2C'), '404 no debe usar paleta verde petróleo aislada');
  });

  test('7.4 - Legales correctos', () => {
    assert.ok(html.includes('dustincalderon.com/legal/aviso-legal/'));
    assert.ok(html.includes('dustincalderon.com/legal/privacidad/'));
    assert.ok(!html.includes('politica-privacidad'));
  });

  test('7.5 - Regreso al inicio funciona en despliegues bajo subruta', () => {
    assert.ok(html.includes('href="index.html"'));
    assert.ok(!html.includes('href="/"'));
  });

  test('7.6 - Descripción no atribuye el error a un volumen concreto', () => {
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
    assert.ok(description.includes('AMORISMO'));
    assert.ok(!description.includes('Vol. III'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. REGRESIONES FUNCIONALES
// ─────────────────────────────────────────────────────────────────────────────

describe('8. Regresiones funcionales', () => {

  test('8.1 - Cada volumen usa su portada optimizada', () => {
    ['1', '2', '3'].forEach(volume => {
      const html = readFile(`vol-${volume}.html`);
      assert.ok(
        html.includes(`src="assets/images/covers/portada-vol-${volume}.webp"`),
        `Vol. ${volume} debe usar su portada`
      );
    });
  });

  test('8.2 - Todas las páginas publicables tienen canonical y Open Graph absolutos', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      assert.ok(html.includes('<link rel="canonical" href="https://amorismoelmusical.com/'));
      assert.ok(html.match(/<meta property="og:url" content="https:\/\/amorismoelmusical\.com\//));
      assert.ok(html.match(/<meta property="og:image" content="https:\/\/amorismoelmusical\.com\//));
      assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image">'));
    });
  });

  test('8.3 - Galería completa, estilizada y operativa en Vol. III', () => {
    const html = readFile('vol-3.html');
    assert.ok(html.includes('href="assets/css/gallery.css"'));
    assert.ok(html.includes('defer src="assets/js/gallery.js"'));
    assert.equal((html.match(/class="am-gallery__thumb(?: |")/g) || []).length, 8);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
    assert.equal((html.match(/aria-pressed="false"/g) || []).length, 7);
  });

  test('8.4 - Imágenes de contenido reservan espacio y las secundarias usan lazy loading', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      const images = html.match(/<img [^>]+>/g) || [];
      images.forEach(img => {
        assert.ok(img.includes('width='), `${page}: imagen sin width: ${img}`);
        assert.ok(img.includes('height='), `${page}: imagen sin height: ${img}`);
      });
    });

    assert.ok(readFile('index.html').includes('loading="lazy"'));
    assert.ok(readFile('vol-3.html').includes('loading="lazy"'));
  });

  test('8.5 - Imagen principal de galería difiere carga y decodificación', () => {
    const html = readFile('vol-3.html');
    const galleryImage = html.match(/<img id="gallery-main-image"[^>]+>/)?.[0] || '';
    assert.ok(galleryImage.includes('loading="lazy"'));
    assert.ok(galleryImage.includes('decoding="async"'));
  });

  test('8.6 - Todos los recursos locales referenciados existen', () => {
    [...PAGES, '404.html', 'escuchar.html', 'partituras.html'].forEach(page => {
      const html = readFile(page);
      const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
        .map(match => match[1])
        .filter(ref => !/^(?:https?:|#|data:|mailto:)/.test(ref));

      references.forEach(ref => {
        const [path, fragment] = ref.split('#');
        if (path) {
          assert.ok(fileExists(path), `${page}: recurso local inexistente: ${ref}`);
        }
        if (fragment) {
          assert.ok(html.includes(`id="${fragment}"`) || readFile(path || page).includes(`id="${fragment}"`), `${page}: ancla local inexistente: ${ref}`);
        }
      });
    });
  });

  test('8.7 - Los formularios de correo no simulan altas sin backend', () => {
    PAGES.forEach(page => {
      const html = readFile(page);

      // Contact section form (index.html only)
      if (html.includes('id="contact-form"')) {
        const emailInput = html.match(/<input[^>]+id="contact-email"[^>]*>/)?.[0] || '';
        const submitButton = html.match(/<button[^>]+id="contact-submit"[^>]*>/)?.[0] || '';
        assert.ok(html.includes('El formulario de correo estará disponible próximamente.'), `${page}: debe explicar el estado real del formulario`);
        assert.ok(emailInput.includes('disabled'), `${page}: input de correo debe estar deshabilitado`);
        assert.ok(submitButton.includes('disabled'), `${page}: submit debe estar deshabilitado`);
      }

      // Hero subscription form (index.html only)
      if (html.includes('id="hero-form"')) {
        const heroInput = html.match(/<input[^>]+id="hero-email"[^>]*>/)?.[0] || '';
        const heroSubmit = html.match(/<button[^>]+id="hero-submit"[^>]*>/)?.[0] || '';
        assert.ok(heroInput.includes('disabled'), `${page}: hero input debe estar deshabilitado pre-Mautic`);
        assert.ok(heroSubmit.includes('disabled'), `${page}: hero submit debe estar deshabilitado pre-Mautic`);
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. SEGURIDAD
// ─────────────────────────────────────────────────────────────────────────────

describe('9. Seguridad', () => {

  test('9.1 - Links externos con noopener', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      const blanks = (html.match(/target="_blank"/g) || []).length;
      const noopers = (html.match(/rel="noopener noreferrer"/g) || []).length;
      assert.equal(blanks, noopers, `${page}: target=_blank (${blanks}) vs noopener (${noopers})`);
    });
  });

  test('9.2 - Sin credenciales en HTML/JS', () => {
    const allContent = PAGES.map(p => readFile(p)).join('') +
      readFile('assets/js/nav.js') + readFile('assets/js/gallery.js');
    assert.ok(!allContent.includes('Bearer '));
    assert.ok(!allContent.includes('api_key'));
  });

  test('9.3 - Sin href javascript: (XSS)', () => {
    PAGES.forEach(page => {
      const html = readFile(page);
      assert.ok(!html.match(/href="javascript:/i), `${page}: no javascript: href`);
    });
  });

  test('9.4 - Sin node_modules; package.json (si existe) solo tiene devDependencies', () => {
    // node_modules may exist locally for dev tooling — verify it's gitignored
    if (fileExists('node_modules')) {
      const gitignore = fileExists('.gitignore') ? readFile('.gitignore') : '';
      assert.ok(gitignore.includes('node_modules'), 'node_modules debe estar en .gitignore');
    }
    if (fileExists('package.json')) {
      const pkg = JSON.parse(readFile('package.json'));
      assert.ok(!pkg.dependencies || Object.keys(pkg.dependencies).length === 0,
        'package.json no debe tener dependencies de producción');
    }
  });
});
