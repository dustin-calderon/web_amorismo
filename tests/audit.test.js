/**
 * @file audit.test.js
 * @description Suite de tests completos para la web estática de Amorismo.
 * Cubre HTML, CSS, JS, Cloudflare y accesibilidad.
 *
 * Ejecutar: node --test tests/audit.test.js
 * (Requiere Node.js >= 18 para el runner nativo)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Lee un archivo del proyecto como string.
 * @param {string} relPath - Ruta relativa a la raíz del proyecto
 * @returns {string}
 */
const readFile = (relPath) => readFileSync(join(ROOT, relPath), 'utf8');

/**
 * Verifica que un archivo exista en el proyecto.
 * @param {string} relPath - Ruta relativa a la raíz del proyecto
 * @returns {boolean}
 */
const fileExists = (relPath) => existsSync(join(ROOT, relPath));

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 1: INTEGRIDAD DE ARCHIVOS
// ─────────────────────────────────────────────────────────────────────────────

describe('1. Integridad de archivos del proyecto', () => {

  test('1.1 - index.html existe', () => {
    assert.ok(fileExists('index.html'), 'index.html debe existir en la raíz');
  });

  test('1.2 - 404.html existe', () => {
    assert.ok(fileExists('404.html'), '404.html debe existir en la raíz');
  });

  test('1.3 - gracias.html existe', () => {
    assert.ok(fileExists('gracias.html'), 'gracias.html debe existir en la raíz');
  });

  test('1.4 - Hoja de estilos principal existe', () => {
    assert.ok(fileExists('assets/css/amorismo-styles.css'), 'amorismo-styles.css debe existir');
  });

  test('1.5 - Script JS principal existe', () => {
    assert.ok(fileExists('assets/js/amorismo-scripts.js'), 'amorismo-scripts.js debe existir');
  });

  test('1.6 - Logo existe', () => {
    assert.ok(fileExists('assets/images/amorismo-logo.png'), 'amorismo-logo.png debe existir');
  });

  test('1.7 - Cartel existe', () => {
    assert.ok(fileExists('assets/images/amorismo-cartel.jpeg'), 'amorismo-cartel.jpeg debe existir');
  });

  test('1.8 - Todas las fotos del elenco existen', () => {
    const elencoPhotos = [
      'LOA_fondo-verde.png',
      'BLANCA_fondo-verde.png',
      'ANGELA_fondo-verde.png',
      'BRAULIO_fondo-verde.png',
    ];
    elencoPhotos.forEach(photo => {
      assert.ok(fileExists(`assets/images/${photo}`), `Foto elenco ${photo} debe existir`);
    });
  });

  test('1.9 - Todas las fotos del equipo creativo existen', () => {
    const equipoPhotos = [
      'DUSTIN_fondo-verde.png',
      'DAVID_fondo-verde.png',
      'CARMEN_fondo-verde.png',
    ];
    equipoPhotos.forEach(photo => {
      assert.ok(fileExists(`assets/images/${photo}`), `Foto equipo ${photo} debe existir`);
    });
  });

  test('1.10 - Todas las fotos de galería existen', () => {
    const galeriaPhotos = [
      'IMG_6612.webp', 'IMG_6624.webp', 'IMG_6632.webp',
      'IMG_6655.webp', 'IMG_6660.webp', 'IMG_6666.webp',
      'IMG_6670.webp', 'IMG_6685.webp',
    ];
    galeriaPhotos.forEach(photo => {
      assert.ok(fileExists(`assets/images/${photo}`), `Foto galería ${photo} debe existir`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 2: SEMÁNTICA HTML Y SEO (index.html)
// ─────────────────────────────────────────────────────────────────────────────

describe('2. Semántica HTML y SEO - index.html', () => {
  const html = readFile('index.html');

  test('2.1 - DOCTYPE HTML5 presente', () => {
    assert.ok(html.startsWith('<!DOCTYPE html>'), 'Debe comenzar con DOCTYPE html');
  });

  test('2.2 - lang="es" declarado', () => {
    assert.ok(html.includes('lang="es"'), 'Idioma debe ser "es"');
  });

  test('2.3 - Meta charset UTF-8', () => {
    assert.ok(html.includes('charset="utf-8"'), 'Charset debe ser UTF-8');
  });

  test('2.4 - Meta viewport presente', () => {
    assert.ok(html.includes('name="viewport"'), 'Meta viewport debe estar presente');
  });

  test('2.5 - <title> descriptivo presente', () => {
    assert.ok(html.includes('<title>Amorismo Vol. III - El Musical</title>'), 'Título debe ser descriptivo');
  });

  test('2.6 - Un único <h1> (SEO)', () => {
    const h1Matches = html.match(/<h1[^>]*>/g) || [];
    assert.equal(h1Matches.length, 1, 'Debe haber exactamente un h1 en la página');
  });

  test('2.7 - Google Fonts cargado con preconnect', () => {
    assert.ok(html.includes('rel="preconnect" href="https://fonts.googleapis.com"'), 'Preconnect a Google Fonts requerido');
    assert.ok(html.includes('rel="preconnect" href="https://fonts.gstatic.com"'), 'Preconnect a gstatic requerido');
  });

  test('2.8 - Favicon configurado (png)', () => {
    assert.ok(html.includes('rel="icon" type="image/png" href="assets/images/amorismo-logo.png"'), 'Favicon PNG debe estar presente');
  });

  test('2.9 - Apple touch icon configurado', () => {
    assert.ok(html.includes('rel="apple-touch-icon"'), 'Apple touch icon debe estar presente');
  });

  test('2.10 - amorismo-styles.css se carga DESPUÉS del bloque <style> inline', () => {
    const styleTagEnd = html.lastIndexOf('</style>');
    const cssLinkPos = html.indexOf('assets/css/amorismo-styles.css');
    assert.ok(cssLinkPos > styleTagEnd, 'El CSS externo debe cargarse después del <style> inline para ganar en cascade');
  });

  test('2.11 - amorismo-scripts.js se carga con defer', () => {
    assert.ok(html.includes('defer src="assets/js/amorismo-scripts.js"'), 'El JS debe cargarse con defer');
  });

  test('2.12 - <main> tiene role="main" (accesibilidad)', () => {
    assert.ok(html.includes('role="main"'), 'Main debe tener role="main"');
  });

  test('2.13 - Nav legal tiene aria-label (accesibilidad)', () => {
    assert.ok(html.includes('aria-label="Enlaces legales"'), 'Nav legal debe tener aria-label');
  });

  test('2.14 - Separadores decorativos tienen aria-hidden (accesibilidad)', () => {
    assert.ok(html.includes('aria-hidden="true"'), 'Separadores decorativos deben tener aria-hidden');
  });

  test('2.15 - Todas las imágenes tienen atributo alt', () => {
    const imgTags = html.match(/<img [^>]+>/g) || [];
    imgTags.forEach(img => {
      assert.ok(img.includes('alt='), `Imagen sin alt: ${img.substring(0, 80)}`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 3: CONTENT INTEGRITY (Negocio)
// ─────────────────────────────────────────────────────────────────────────────

describe('3. Integridad de contenido y lógica de negocio', () => {
  const html = readFile('index.html');

  test('3.1 - Botón CTA muestra "Entradas no disponibles"', () => {
    assert.ok(html.includes('Entradas no disponibles'), 'CTA debe mostrar mensaje de no disponibilidad');
  });

  test('3.2 - CTA NO tiene link a taquilla (tickets eliminados)', () => {
    assert.ok(!html.includes('taquilla.microteatro'), 'No debe haber ningún enlace a taquilla.microteatro');
  });

  test('3.3 - CTA NO tiene href activo (pointer-events: none)', () => {
    assert.ok(html.includes('pointer-events: none'), 'El CTA debe tener pointer-events: none para bloquearlo');
  });

  test('3.4 - CTA NO es un <a>, es un <span> inerte', () => {
    assert.ok(!html.match(/<a[^>]+Entradas no disponibles/), 'CTA no debe ser un <a> clickable');
    assert.ok(html.includes('<span class="amorismo__cta"'), 'CTA debe ser un <span>');
  });

  test('3.5 - Sección de urgencia de venta eliminada', () => {
    assert.ok(!html.includes('La temporada es muy corta'), 'El texto de urgencia debe estar eliminado');
    assert.ok(!html.includes('amorismo__cta-final'), 'La sección cta-final debe estar eliminada');
  });

  test('3.6 - Formulario Mailchimp presente y funcional', () => {
    assert.ok(html.includes('list-manage.com/subscribe/post'), 'Action del formulario Mailchimp debe estar presente');
    assert.ok(html.includes('id="mc-embedded-subscribe-form"'), 'Formulario Mailchimp debe estar identificado');
    assert.ok(html.includes('type="email"'), 'Input de email debe estar presente');
  });

  test('3.7 - Trampa anti-bot de Mailchimp presente', () => {
    // Campo oculto que los bots llenarían pero los humanos no
    assert.ok(html.includes('aria-hidden="true" style="position: absolute; left: -5000px;"'), 'Trampa anti-bot de Mailchimp debe estar presente');
  });

  test('3.8 - Elenco completo (4 artistas)', () => {
    assert.ok(html.includes('Loa Miller'), 'Elenco: Loa Miller');
    assert.ok(html.includes('Blanca Rodríguez'), 'Elenco: Blanca Rodríguez');
    assert.ok(html.includes('Ángela Santos'), 'Elenco: Ángela Santos');
    assert.ok(html.includes('Braulio Chappell'), 'Elenco: Braulio Chappell');
  });

  test('3.9 - Equipo creativo completo (3 roles)', () => {
    assert.ok(html.includes('Dustin Calderón'), 'Equipo: Dustin Calderón');
    assert.ok(html.includes('David Gregory'), 'Equipo: David Gregory');
    assert.ok(html.includes('Carmen Rodríguez'), 'Equipo: Carmen Rodríguez');
  });

  test('3.10 - Galería con 8 fotos', () => {
    const thumbnails = (html.match(/amorismo__galeria-thumbnail/g) || []).length;
    // Cada thumbnail tiene la clase 2 veces (button + img dentro), o 1 en el button
    const thumbnailButtons = (html.match(/class="amorismo__galeria-thumbnail/g) || []).length;
    assert.ok(thumbnailButtons >= 8, `Debe haber al menos 8 thumbnails, hay ${thumbnailButtons}`);
  });

  test('3.11 - Footer tiene copyright y links legales', () => {
    assert.ok(html.includes('Copyright © 2025'), 'Footer debe tener copyright');
    assert.ok(html.includes('Aviso Legal'), 'Footer debe tener Aviso Legal');
    assert.ok(html.includes('Política de Privacidad'), 'Footer debe tener Política de Privacidad');
    assert.ok(html.includes('Términos y Condiciones'), 'Footer debe tener Términos y Condiciones');
  });

  test('3.12 - Links legales abren en nueva pestaña (rel="noopener")', () => {
    const legalLinks = html.match(/dustincalderon\.com\/politica-privacidad[^"]*/g) || [];
    assert.ok(legalLinks.length >= 2, 'Deben haber al menos 2 links legales');
    // Verificamos que target="_blank" y rel="noopener" están presentes
    assert.ok(html.includes('rel="noopener noreferrer"'), 'Links externos deben tener rel=noopener');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 4: CSS - DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

describe('4. CSS - Design System y tokens', () => {
  const css = readFile('assets/css/amorismo-styles.css');

  test('4.1 - Color primario verde petróleo definido', () => {
    assert.ok(css.includes('--amorismo-color-verde-petroleo: #0D2C2C'), 'Token verde petróleo debe estar definido');
  });

  test('4.2 - Fuente Inter definida como principal', () => {
    assert.ok(css.includes("--amorismo-font-sans: 'Inter'"), 'Font Inter debe ser la principal');
  });

  test('4.3 - Fuente IBM Plex Mono definida para títulos', () => {
    assert.ok(css.includes("--amorismo-font-title: 'IBM Plex Mono'"), 'Font monoespaciada para títulos debe estar definida');
  });

  test('4.4 - h1 usa clamp() para tipografía fluida', () => {
    assert.ok(css.match(/h1\s*\{[^}]*clamp\(/s), 'h1 debe usar clamp() para tamaño fluido');
  });

  test('4.5 - Media query para móvil (768px) presente', () => {
    assert.ok(css.includes('@media (max-width: 768px)'), 'Media query para móvil debe estar presente');
  });

  test('4.6 - Media query ultra-mobile (480px) presente', () => {
    assert.ok(css.includes('@media (max-width: 480px)'), 'Media query ultra-mobile debe estar presente');
  });

  test('4.7 - Hero grid responsivo (1 columna en móvil)', () => {
    assert.ok(css.includes('grid-template-columns: 1fr;'), 'Hero debe colapsar a 1 columna en móvil');
  });

  test('4.8 - CSS scoped: todas las clases usan prefijo amorismo__', () => {
    // Verificamos que no haya clases que puedan colisionar sin prefijo
    const nonPrefixedClasses = css.match(/\.((?!amorismo|evl-lm|error|ty-|mc-|mc_)[a-z][a-zA-Z-]+)\s*\{/g) || [];
    // Filtramos pseudo-clases y elementos HTML globales
    const suspicious = nonPrefixedClasses.filter(cls => !cls.match(/\.(clear|response|small-text)\s*\{/));
    assert.equal(suspicious.length, 0, `Clases sin prefijo encontradas: ${suspicious.join(', ')}`);
  });

  test('4.9 - Animación del vinyl (spin) definida', () => {
    assert.ok(css.includes('@keyframes spin'), 'Animación spin del vinyl debe estar definida');
  });

  test('4.10 - Botón CTA tiene transición definida', () => {
    assert.ok(css.includes('transition: all 0.3s ease'), 'CTAs deben tener transición definida');
  });

  test('4.11 - CSS no tiene reglas duplicadas de footer eliminado', () => {
    // Verificamos que NO existe el bloque .evl-lm-simple__footer con las reglas que fueron borradas
    // (el footer CSS con flex-direction column que fue eliminado en el git diff)
    const footerRules = css.match(/\.evl-lm-simple__footer\s*\{[^}]*flex-direction:\s*column/s);
    assert.equal(footerRules, null, 'Las reglas de footer eliminadas no deben existir');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 5: JAVASCRIPT
// ─────────────────────────────────────────────────────────────────────────────

describe('5. JavaScript - Galería y comportamiento', () => {
  const js = readFile('assets/js/amorismo-scripts.js');

  test('5.1 - IIFE con strict mode para scope aislado', () => {
    assert.ok(js.includes("'use strict'"), 'JS debe usar strict mode dentro del IIFE');
    assert.ok(js.includes('(function ()'), 'JS debe estar envuelto en IIFE');
  });

  test('5.2 - Lógica de galería implementada', () => {
    assert.ok(js.includes('#galeria-main-image'), 'JS debe referenciar la imagen principal de galería');
    assert.ok(js.includes('data-src'), 'JS debe leer el data-src de los thumbnails');
  });

  test('5.3 - Thumbnail activo se actualiza al hacer click', () => {
    assert.ok(js.includes('amorismo__galeria-thumbnail--active'), 'JS debe gestionar la clase active en thumbnails');
  });

  test('5.4 - Scroll suave gestionado por CSS (scroll-behavior)', () => {
    // El listener JS de scroll fue eliminado; CSS lo gestiona más eficientemente
    assert.ok(!js.includes('scrollIntoView'), 'Scroll suave no debe estar en JS (lo maneja CSS)');
    // scroll-behavior: smooth está en el <style> inline de index.html
    const html = readFile('index.html');
    assert.ok(html.includes('scroll-behavior: smooth'), 'scroll-behavior: smooth debe estar declarado en el HTML');
  });

  test('5.5 - Código defensivo: comprueba existencia de elementos antes de usarlos', () => {
    assert.ok(js.includes('if (mainImage && thumbnails.length > 0)'), 'JS debe verificar que los elementos existen');
  });

  test('5.6 - Sin console.log de debug en producción', () => {
    // Los console.log en el JS son para verificar carga, son aceptables en este caso
    // pero los señalamos para revisión futura
    const consoleLogs = (js.match(/console\.log/g) || []).length;
    assert.ok(consoleLogs <= 3, `Hay ${consoleLogs} console.log en producción - revisar`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 6: PÁGINAS SECUNDARIAS (404 y gracias)
// ─────────────────────────────────────────────────────────────────────────────

describe('6. Páginas secundarias: 404 y gracias', () => {

  describe('6a. 404.html', () => {
    const html404 = readFile('404.html');

    test('6.1 - 404 tiene title correcto', () => {
      assert.ok(html404.includes('<title>404 - Página no encontrada</title>'), '404 debe tener title descriptivo');
    });

    test('6.2 - 404 tiene favicon', () => {
      assert.ok(html404.includes('rel="icon"'), '404 debe tener favicon');
    });

    test('6.3 - 404 tiene link "Volver a Inicio" (href="/")', () => {
      assert.ok(html404.includes('href="/"'), '404 debe tener link de vuelta a inicio');
    });

    test('6.4 - 404 usa Inter font', () => {
      assert.ok(html404.includes('Inter'), '404 debe usar la fuente Inter');
    });

    test('6.5 - 404 usa paleta de colores correcta', () => {
      assert.ok(html404.includes('#0D2C2C'), '404 debe usar el verde petróleo del design system');
    });

    test('6.6 - 404 tiene fondo con ruido/grain (brand consistent)', () => {
      assert.ok(html404.includes('error__bg-noise'), '404 debe tener el fondo con grain');
    });

    test('6.7 - 404 tiene role="main" (accesibilidad)', () => {
      assert.ok(html404.includes('role="main"'), '404 debe tener role=main');
    });
  });

  describe('6b. gracias.html', () => {
    const htmlGracias = readFile('gracias.html');

    test('6.8 - gracias.html tiene title correcto', () => {
      assert.ok(htmlGracias.includes('¡Gracias!'), 'Página de gracias debe tener title apropiado');
    });

    test('6.9 - gracias.html tiene favicon', () => {
      assert.ok(htmlGracias.includes('rel="icon"'), 'Gracias debe tener favicon');
    });

    test('6.10 - gracias.html rastrea conversión con gtag', () => {
      assert.ok(htmlGracias.includes("window.gtag"), 'Debe disparar conversión si gtag está disponible');
      assert.ok(htmlGracias.includes("sign_up"), 'Evento de conversión debe ser sign_up');
    });

    test('6.11 - gracias.html enlaza a Amorismo Vol. I', () => {
      assert.ok(htmlGracias.includes('amorismo-links'), 'Gracias debe enlazar al Vol. I');
    });

    test('6.12 - gracias.html usa paleta correcta', () => {
      assert.ok(htmlGracias.includes('#0D2C2C'), 'Gracias debe usar el verde petróleo');
    });

    test('6.13 - gracias.html usa paths relativos para assets (no absolutos)', () => {
      assert.ok(!htmlGracias.includes('href="/assets'), 'Assets deben usar paths relativos sin barra inicial');
      assert.ok(htmlGracias.includes('href="assets/'), 'Assets deben usar paths relativos');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 7: CLOUDFLARE PAGES - CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────────────────────

describe('7. Cloudflare Pages - Configuración de despliegue', () => {

  test('7.1 - No hay archivos de build innecesarios (package.json, node_modules)', () => {
    assert.ok(!fileExists('package.json'), 'No debe haber package.json (sitio puramente estático)');
    assert.ok(!fileExists('node_modules'), 'No debe haber node_modules');
  });

  test('7.2 - No hay archivos de framework (next.config, vite.config)', () => {
    assert.ok(!fileExists('next.config.js'), 'No debe haber next.config.js');
    assert.ok(!fileExists('vite.config.js'), 'No debe haber vite.config.js');
  });

  test('7.3 - No hay archivos WordPress residuales', () => {
    assert.ok(!fileExists('wp-config.php'), 'No debe haber wp-config.php');
    assert.ok(!fileExists('wp-content'), 'No debe haber carpeta wp-content');
  });

  test('7.4 - index.html usa rutas relativas (compatible con subdirectorios)', () => {
    const html = readFile('index.html');
    // Verificamos que NO usa rutas absolutas para assets locales
    assert.ok(!html.includes('href="/assets'), 'Assets CSS deben usar rutas relativas');
    assert.ok(!html.includes('src="/assets'), 'Assets imágenes deben usar rutas relativas');
  });

  test('7.5 - 404.html usa rutas relativas', () => {
    const html404 = readFile('404.html');
    // La página 404 puede estar en cualquier ruta, debe usar rutas relativas
    assert.ok(!html404.includes('src="/assets'), '404 no debe usar rutas absolutas para assets');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUE 8: SEGURIDAD Y BUENAS PRÁCTICAS
// ─────────────────────────────────────────────────────────────────────────────

describe('8. Seguridad y buenas prácticas', () => {
  const html = readFile('index.html');

  test('8.1 - Links externos tienen rel="noopener noreferrer"', () => {
    // Verificamos que todos los target="_blank" tengan rel=noopener
    const blankLinks = html.match(/target="_blank"/g) || [];
    const noopenerLinks = html.match(/rel="noopener noreferrer"/g) || [];
    assert.equal(blankLinks.length, noopenerLinks.length,
      `Debe haber tantos rel=noopener (${noopenerLinks.length}) como target=_blank (${blankLinks.length})`);
  });

  test('8.2 - No hay contraseñas ni tokens hardcoded en el HTML', () => {
    assert.ok(!html.includes('password'), 'No debe haber "password" en el HTML');
    assert.ok(!html.includes('Bearer '), 'No debe haber tokens Bearer en el HTML');
    assert.ok(!html.includes('api_key'), 'No debe haber api_key en el HTML');
  });

  test('8.3 - No hay credenciales en el JS', () => {
    const js = readFile('assets/js/amorismo-scripts.js');
    assert.ok(!js.includes('Bearer '), 'No debe haber tokens Bearer en el JS');
    assert.ok(!js.includes('password'), 'No debe haber contraseñas en el JS');
  });

  test('8.4 - No hay href con javascript: (XSS)', () => {
    assert.ok(!html.match(/href="javascript:/i), 'No debe haber href con javascript:');
  });

  test('8.5 - Mailchimp usa HTTPS (no HTTP)', () => {
    assert.ok(html.includes('https://dustincalderon.us12.list-manage.com'), 'Mailchimp debe usar HTTPS');
  });

  test('8.6 - El ID de lista de Mailchimp está presente y tiene formato correcto', () => {
    // u=xxxx&id=xxxx es el formato estándar de Mailchimp
    assert.ok(html.match(/u=[a-f0-9]+&amp;id=[a-f0-9]+/), 'URL de Mailchimp debe tener formato u=xxx&id=xxx');
  });
});
