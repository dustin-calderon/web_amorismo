# PLAN: Amorismo Multi-Tab Architecture

## Objetivo
Convertir la web single-page (Vol III only) en un sitio con **4 pestañas**:
- **Home** — Landing general del proyecto Amorismo
- **Vol I** — Página dedicada al Vol I
- **Vol II** — Página dedicada al Vol II
- **Vol III** — El contenido actual migrado aquí

## Estado Actual
```
web_amorismo/
├── index.html              (203 líneas – Vol III, single page)
├── 404.html                (409 líneas – self-contained, no tocar)
├── assets/
│   ├── css/
│   │   └── amorismo-styles.css  (740 líneas – VIOLA el límite de 300)
│   ├── js/
│   │   └── amorismo-scripts.js  (30 líneas – galería)
│   └── images/             (18 archivos webp/png)
└── tests/
    └── audit.test.js
```

### Problemas
1. **amorismo-styles.css** = 740 líneas → hay que modularizarlo
2. **index.html** es una single-page sin navegación
3. No existe estructura para múltiples páginas

## Arquitectura Target
```
web_amorismo/
├── index.html              (Home — nueva landing)
├── vol-1.html              (Vol I)
├── vol-2.html              (Vol II)
├── vol-3.html              (Vol III — contenido actual migrado)
├── 404.html                (sin cambios)
├── assets/
│   ├── css/
│   │   ├── tokens.css      (~40 líneas)  — Custom properties, fuentes
│   │   ├── base.css        (~115 líneas) — Reset, body, typography, links
│   │   ├── nav.css         (~50 líneas)  — Navigation bar
│   │   ├── components.css  (~110 líneas) — CTA, cards, grids, page-title
│   │   ├── hero.css        (~75 líneas)  — Hero section styles
│   │   ├── home.css        (~170 líneas) — Home: testimonials, bios, contact
│   │   ├── volume.css      (~100 líneas) — Volume: synopsis, cast, reviews
│   │   ├── gallery.css     (~100 líneas) — Galería + thumbnails (legacy)
│   │   ├── footer.css      (~30 líneas)  — Footer
│   │   └── responsive.css  (~280 líneas) — Media queries centralizadas
│   ├── js/
│   │   ├── nav.js          (~40 líneas)  — Tab navigation logic
│   │   └── gallery.js      (~30 líneas)  — Galería (legacy)
│   └── images/             (sin cambios)
└── tests/
    └── audit.test.js
```

## Reglas
- **Máximo 300 líneas** por archivo
- **0 código duplicado** — tokens y componentes compartidos
- **Navegación** — `<nav>` fija con 4 tabs, highlightea la activa
- **Sin frameworks** — HTML + CSS + Vanilla JS
- **Mobile-first** — responsive en `responsive.css`

## Fases de Ejecución
1. ✅ **Fase 1**: Estructura de archivos, CSS modular, shells HTML — **COMPLETADA**
2. ✅ **Fase 2**: Home landing — **COMPLETADA**
   - `index.html` — Hero (logo+CTA→form), Discografía, Bios expandidas (Dustin/David), Correo, Footer
   - `assets/css/home.css` — testimonials, bio blocks, contact form, dividers
3. ✅ **Fase 3**: Volúmenes — **COMPLETADA**
   - `vol-1.html`, `vol-2.html` — Hero + sinopsis real + concepto trilogía
   - `vol-3.html` — Hero + sinopsis expandida + concepto trilogía + cast + galería
   - `assets/css/volume.css` — synopsis, concept, cast, reviews
4. ✅ **Fase 4**: Copy integrado — **COMPLETADA** (2026-06-28)
   - `docs/CONTENT.md` — fuente de verdad del contenido
   - Sinopsis reales para los 3 volúmenes
   - Bios profesionales completas de Dustin Calderón y David Gregory
   - Meta tags actualizados con sinopsis reales
5. **Fase 5**: Integración formulario Mautic

## Decisión Arquitectónica
**Multi-page (MPA)** con archivos `.html` independientes.
- Razón: Sin framework, SEO nativo, cada volumen es un contexto propio.
- La navegación activa se marca con data-attribute en `<body>`.
