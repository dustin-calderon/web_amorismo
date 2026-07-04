# PLAN: Amorismo Web

> Estado actualizado: 2026-07-04
> Dominio de producción: https://amorismoelmusical.com
> Proyecto Cloudflare Pages: `web-amorismo`
> Rama de producción: `deploy`

## Objetivo Actual

Mantener una web estática, rápida y editorial para **AMORISMO - El Micromusical**, con una home de marca y páginas independientes para escuchar, partituras y cada volumen.

La web no usa framework ni proceso de build. El código publicable vive directamente en la raíz del repositorio y se despliega como sitio estático en Cloudflare Pages.

## Estado Actual del Sitio

### Páginas públicas

| Archivo | Rol | Estado |
|---|---|---|
| `index.html` | Home principal de AMORISMO | Publicada |
| `escuchar.html` | Embeds de Spotify de Vol. I y Vol. II, Vol. III próximamente | Publicada |
| `partituras.html` | Página de partituras en preparación | Publicada como coming soon |
| `vol-1.html` | Página editorial de Vol. I | Publicada |
| `vol-2.html` | Página editorial de Vol. II | Publicada |
| `vol-3.html` | Página editorial de Vol. III | Publicada |
| `404.html` | Error page con design system compartido | Publicada |

### Navegación

La navegación se divide en tres zonas:

- Menú principal: `Inicio`, `Escuchar`, `Partituras`.
- Menú de volúmenes: `Vol I`, `Vol II`, `Vol III`.
- Icono de correo: enlaza a `#correo` en páginas con formulario o a `index.html#correo` en páginas auxiliares.

`assets/js/nav.js` determina la página activa a partir del filename de `window.location.pathname` y aplica:

- `.am-nav__menu-link--active` para `Inicio`, `Escuchar`, `Partituras`.
- `.am-nav__link--active` para `Vol I`, `Vol II`, `Vol III`.
- `aria-current="page"` en el enlace activo.

## Arquitectura

```text
web_amorismo/
├── index.html
├── escuchar.html
├── partituras.html
├── vol-1.html
├── vol-2.html
├── vol-3.html
├── 404.html
├── assets/
│   ├── css/
│   │   ├── tokens.css       # Paletas, tokens semánticos, theming por volumen
│   │   ├── base.css         # Reset, body, fondos, tipografía, accesibilidad base
│   │   ├── nav.css          # Navegación fija y estados activos
│   │   ├── components.css   # CTA, person cards, page title, WIP, listen, 404
│   │   ├── hero.css         # Hero genérico de volúmenes y landing hero del home
│   │   ├── home.css         # Statement, citas, bios y divisores del home
│   │   ├── volume.css       # Sinopsis, cast y reviews
│   │   ├── gallery.css      # Thumbnails y viewer de galerías
│   │   ├── contact.css      # Formularios de correo y feedback
│   │   ├── footer.css       # Footer editorial compartido
│   │   └── responsive.css   # Breakpoints compartidos
│   ├── js/
│   │   ├── nav.js           # Estado activo de navegación
│   │   ├── gallery.js       # Galerías interactivas
│   │   ├── forms.js         # Newsletter Mautic compartida
│   │   └── motion.js        # Scroll-triggered animations
│   └── images/
│       ├── covers/          # Portadas optimizadas de Vol. I, II, III
│       ├── hero/            # Fondos y siluetas del landing hero
│       ├── thumbs/          # Miniaturas 360x360 de galería
│       └── *.webp/*.png/*.jpg
├── docs/
│   ├── CONTENT.md
│   ├── PLAN.md
│   ├── MANUAL_WEB_AMORISMO_*.pdf
│   └── manual*_page*.png
└── tests/
    └── audit.test.js
```

## Principios de Implementación

1. **MPA estática**
   Cada página es un HTML independiente. Esto mantiene SEO simple, URLs limpias y despliegue directo.

2. **CSS modular por responsabilidad**
   Los estilos se separan por capa funcional. No existe ya `amorismo-styles.css`.

3. **Tokens como fuente de verdad visual**
   `tokens.css` define paletas raw y tokens semánticos. Las páginas de volumen usan `body[data-vol="1|2|3"]` para remapear colores, sombras, fondo ambiental, nav y CTAs.

4. **JavaScript mínimo y defensivo**
   Solo hay cuatro scripts de producción:
   - `nav.js`, sin dependencias.
   - `gallery.js`, con early return si no hay galería.
   - `forms.js`, IIFE sin dependencias para enviar newsletter a Mautic.
   - `motion.js`, scroll-triggered animations con `IntersectionObserver`.

5. **Newsletter sin falsa confirmación**
   El working tree actual incluye `assets/js/forms.js` y formularios visibles/activos. El script apunta a `FORM_ID = 18` en `https://news.amorismoelmusical.com`. Los tests validan estructura y configuración local, pero no sustituyen una prueba real de alta contra Mautic.

6. **Accesibilidad básica explícita**
   Todas las páginas tienen `lang="es"`, `meta viewport`, skip link, un único `h1`, `main#main`, imágenes con `alt`, foco visible y respeto por `prefers-reduced-motion`.

7. **No overcoding**
   No se añade framework, compilador ni abstracción nueva mientras la web siga siendo estática y pequeña.

8. **SEO + GEO (Generative Engine Optimization)**
   Structured data (JSON-LD) con `WebSite`, `MusicGroup` y `MusicAlbum` schemas para Rich Results y descubribilidad por motores generativos (ChatGPT, Gemini, Perplexity). Incluye `speakable` para asistentes de voz.

## Home Actual

`index.html` contiene:

1. **Landing hero**
   - Fondo triptych con tres imágenes:
     - `assets/images/hero/fondo-vol1.jpeg`
     - `assets/images/hero/fondo-vol2.jpeg`
     - `assets/images/hero/fondo-vol3.jpeg`
   - Logo `assets/images/amorismo-logo-hero.png`.
   - Formulario hero activo con botón `Entrar`.
   - Script asociado: `assets/js/forms.js`.
   - Estado técnico: `FORM_ID = 18`; pendiente conservar evidencia de prueba real de alta si se necesita auditoría operativa.
   - Grano global desactivado en home mediante `--am-noise-opacity: 0`.

2. **Statement**
   - Headline: `Amorismo es una historia de amor sobre las personas con las que no acabas.`
   - Texto conceptual con crédito a Dustin Calderón y David Gregory.
   - Cuatro citas verificadas.

3. **Equipo creativo**
   - Dustin Calderón.
   - David Gregory.

4. **Correo**
   - Formulario activo.
   - Copy: `Newsletter de Amorismo`.
   - Botón: `Entrar`.
   - Feedback accesible: `.am-contact__feedback` con `aria-live="polite"`.

## Páginas de Volumen

Las páginas `vol-1.html`, `vol-2.html` y `vol-3.html` comparten:

- `body data-vol="1|2|3"` para activar tema de volumen.
- Título `AMORISMO · VOL. X`.
- Hero de portada + frase + CTA o estado.
- Sinopsis.
- Elenco.
- Galería con thumbnails optimizadas y viewer interactivo.
- Formulario de correo activo visualmente.
- Script `assets/js/forms.js` cargado.
- Estado técnico: `FORM_ID = 18` compartido para todas las instancias.
- Footer compartido.

### Vol. I

- Portada: `assets/images/covers/portada-vol-1.webp`.
- CTA: Spotify Vol. I.
- Elenco publicado: Fernando Palacio, Marta Tur, Pablo López, Beatriz Villar.
- Elenco Valenciano: sección presente con placeholders visuales sin nombres publicados.
- Galería: 8 fotos `vol1-foto-01..08.jpg` con thumbnails en `assets/images/thumbs/`.

### Vol. II

- Portada: `assets/images/covers/portada-vol-2.webp`.
- CTA: Spotify Vol. II.
- Elenco publicado: Héctor Vázquez, Blanca Rodríguez, Alba Sáiz, Luis Leon.
- Elenco Valenciano: sección presente con placeholders visuales sin nombres publicados.
- Grabación del Disco: Héctor Vázquez, María Jaraiz.
- Galería: 11 fotos `vol2-foto-02..08`, `vol2-foto-11..14` con thumbnails.

### Vol. III

- Portada: `assets/images/covers/portada-vol-3.webp`.
- CTA deshabilitado: `Entradas no disponibles`.
- Elenco publicado: Loa Miller, Blanca Rodríguez, Ángela Santos, Braulio Chappell.
- Equipo creativo adicional: Carmen Rodríguez, audiovisuales.
- Elenco Valenciano: Mary Porcar, Sergio Escribano.
- Galería: 8 fotos `IMG_6612..IMG_6685`.

## Assets y Convenciones

### Fondos del hero del home

| Asset | Uso | Nota |
|---|---|---|
| `assets/images/hero/fondo-vol1.jpeg` | Masa roja del landing hero | Imagen cuadrada 1500x1500; posición desktop actual `left: 23%` |
| `assets/images/hero/fondo-vol2.jpeg` | Capa central clara / brushstroke | `mix-blend-mode: lighten` |
| `assets/images/hero/fondo-vol3.jpeg` | Capa verde derecha | Fondo atmosférico del Vol. III |

### Siluetas hero

`assets/images/hero/amorismo-01-sombra.png`, `amorismo-02-sombra.png` y `amorismo-03-sombra.png` existen como assets de marca, pero el landing hero actual usa los fondos `fondo-vol*.jpeg`, no estas siluetas.

### Fondos ambientales de volumen

La capa `.am-bg-gradient::before` usa `--am-bg-photo`, `--am-bg-photo-size`, `--am-bg-photo-opacity`, `--am-bg-photo-blend`, `--am-bg-photo-blur` y `--am-bg-photo-scale`.

| Tema | Fondo | Size | Blur | Scale |
|---|---|---|---:|---:|
| Vol. I | `fondo-vol1.jpeg` | `cover` | `6px` | `1.03` |
| Vol. II | `fondo-vol2.jpeg` | `100% 100%` | `3px` | `1` |
| Vol. III | `fondo-vol3.jpeg` | `cover` | `3px` | `1.03` |

### Grain

`assets/images/old_film_grain.png` existe y la capa `.am-bg-noise` sigue en el DOM. El token global está en `--am-noise-opacity: 0`, por lo que la home no muestra grano desde el valor base.

La capa de grano se renderiza como una sola textura fija al viewport, con `background-size: 100% 100%` y `background-repeat: no-repeat`, para evitar cortes o repeticiones visibles.

Sobrescrituras actuales por volumen:

| Tema | Valor |
|---|---:|
| Home/base | `0` |
| `body[data-vol="1"]` | `0` |
| `body[data-vol="2"]` | `0.25` |
| `body[data-vol="3"]` | `0` |

Esto es estado actual: solo Vol. II conserva grano visible. Home, Vol. I y Vol. III quedan sin grano.

## Responsive

Breakpoints principales:

- `<=1200px`: ajustes de grid editorial.
- `<=1024px`: statement del home pasa a una columna.
- `<=768px`: navegación pasa a dos filas; páginas de volumen pasan a una columna.
- `<=480px`: hero home se centra, menú móvil se compacta y se ocultan Vol II/III del triptych dejando Vol I como fondo.
- `<=360px`: reducción extra de navegación y logo.
- `landscape + max-height: 500px`: layout horizontal compacto para móvil en apaisado.

## Testing

Comando:

```bash
node --test tests/audit.test.js
```

Cobertura del test actual (209 tests, 17 suites):

- Existencia de páginas y módulos.
- Semántica HTML.
- SEO: canonical, OG, twitter:card/title/description, títulos con keyword branding.
- Recursos locales referenciados.
- Estado de formularios activos con configuración Mautic.
- Accesibilidad básica.
- Design system y tokens.
- JavaScript defensivo.
- Seguridad básica de enlaces externos.
- Deploy hygiene: `_headers`, `robots.txt`, `sitemap.xml` con `lastmod`, cache-control.
- Structured Data (JSON-LD): WebSite + MusicGroup en home, MusicAlbum en volúmenes, og:type music.album, anti-schema-spam en auxiliares.

Estado conocido al 2026-07-04: 209/209 pass, 0 fail.

## Deploy

El proyecto se despliega en Cloudflare Pages.

```bash
npx wrangler pages deploy . --project-name web-amorismo --branch deploy --commit-hash <sha> --commit-message "<mensaje>"
```

Comprobaciones antes de deploy:

```bash
git status --short
git branch --show-current
node --test tests/audit.test.js
```

Comprobaciones después de deploy:

```bash
# URL de deployment emitida por Wrangler
# Dominio principal
curl -I https://amorismoelmusical.com
```

## Backlog Real

1. **Cerrar integración de formulario**
   - El formulario real ya está referenciado como `FORM_ID = 18`.
   - CORS/túnel/DNS están documentados en `docs/FORM_INTEGRATION.md`.
   - Pendiente operativo: conservar evidencia de una alta real, tags y segmento en Mautic si se requiere trazabilidad fuera de los tests locales.

2. **Grano por volumen**
   - Criterio cerrado: sin grano en Home, Vol. I y Vol. III.
   - Vol. II conserva grano visible con `--am-noise-opacity: 0.25`.

3. **Contenido pendiente**
   - Partituras sigue como coming soon.
   - Vol. III Spotify sigue pendiente.
   - Algunos elencos valencianos de Vol. I y Vol. II están representados visualmente sin nombres publicados.

## Decisiones Cerradas

- MPA estática en lugar de SPA.
- Sin framework.
- Cloudflare Pages como hosting.
- CSS modular, sin archivo monolítico legacy.
- Formularios activos con `FORM_ID = 18`; los tests locales no sustituyen una prueba real de alta en Mautic.
- Footer editorial compartido sin duplicar navegación.
- Galerías con thumbnails optimizadas; no cargar full-size en miniaturas.
