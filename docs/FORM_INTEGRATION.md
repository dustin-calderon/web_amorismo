# FORM_INTEGRATION: Newsletter Amorismo → Mautic

> **Proyecto:** `web_amorismo` (`amorismoelmusical.com`)
> **Fase:** 6 del `PLAN.md`
> **Estado:** Spec técnica pendiente de confirmar contra Mautic real
> **Fecha:** 2026-07-04

---

## 1. Definición

**Un único formulario de newsletter.** Captura solo email. Todas las instancias en el sitio deberían enviar al mismo formulario Mautic y compartir un único `FORM_ID`.

### Flujo

```
Visitante escribe email → forms.js POST a Mautic → contacto creado → feedback visual
```

### Mautic: acciones al recibir

1. Crear/actualizar contacto (campo `email`)
2. Asignar tags: `brand:amorismo`, `lead:newsletter`
3. Añadir al segmento `brand-amorismo`

---

## 2. Inventario de Instancias

5 formularios en 4 archivos HTML. **Todos envían al mismo `FORM_ID`.**

| Archivo | HTML `id` | Ubicación |
|---|---|---|
| `index.html` | `#hero-form` | Landing Hero (CTA principal) |
| `index.html` | `#contact-form` | Sección "Correo" (pre-footer) |
| `vol-1.html` | `#contact-form` | Sección "Correo" |
| `vol-2.html` | `#contact-form` | Sección "Correo" |
| `vol-3.html` | `#contact-form` | Sección "Correo" |

> `escuchar.html` y `partituras.html` no tienen formulario.

### Estado actual: todo deshabilitado

```html
<input ... disabled>
<button ... class="am-cta am-cta--disabled" disabled>Próximamente</button>
```

```html
<p class="am-contact__text">El formulario de correo estará disponible próximamente.</p>
```

---

## 3. Archivos Involucrados

### Requieren cambios

| Archivo | Acción |
|---|---|
| `index.html` | Quitar `disabled` en ambos forms, cambiar CTA "Suscribirme", actualizar copy, añadir `<script>` |
| `vol-1.html` | Quitar `disabled`, cambiar CTA, actualizar copy, añadir `<script>` |
| `vol-2.html` | Quitar `disabled`, cambiar CTA, actualizar copy, añadir `<script>` |
| `vol-3.html` | Quitar `disabled`, cambiar CTA, actualizar copy, añadir `<script>` |
| `assets/js/forms.js` | **CREAR** — script de envío a Mautic |

### No requieren cambios

| Archivo | Por qué está listo |
|---|---|
| `assets/css/contact.css` | `.am-contact__feedback`, `--visible`, `--success`, `--error` ya definidos (L55-72) |
| `assets/css/components.css` | `.am-cta`, `.am-cta--disabled` ya definidos |
| `assets/css/hero.css` | `.am-landing-hero__form` spacing ya definido |
| `assets/css/tokens.css` | Tokens `--am-feedback-success`, `--am-input-placeholder` ya existen |
| `assets/css/responsive.css` | Form responsive ≤768px (L90-92) y ≤480px (L194-195) ya cubierto |

---

## 4. Arquitectura de Envío

```
amorismoelmusical.com                    news.amorismoelmusical.com
┌────────────────────────┐               ┌──────────────────────────┐
│  forms.js              │  POST         │  Cloudflare Transform    │
│                        │  FormData     │  Rule inyecta CORS       │
│  preventDefault()      │──────────────►│                          │
│  buildPayload(email)   │               │  Cloudflare Tunnel       │
│  fetch(redirect:manual)│               │  → localhost:8090        │
│                        │◄──────────────│                          │
│  302 opaqueredirect    │  (= éxito)    │  Mautic procesa form     │
│  → showFeedback()      │               │  → crea contacto         │
└────────────────────────┘               │  → asigna tags           │
                                         │  → añade a segmento      │
                                         └──────────────────────────┘
```

### Payload exacto

```
mauticform[formId]  = {FORM_ID}
mauticform[email]   = usuario@ejemplo.com
mauticform[return]  =
```

### Respuesta esperada

Mautic devuelve **302 Redirect**. Con `redirect: 'manual'`:
- `response.type === 'opaqueredirect'` y `response.status === 0`
- **Esto es éxito** — el contacto ya se creó

---

## 5. Script: `assets/js/forms.js`

```javascript
/**
 * forms.js — Amorismo Newsletter
 * Envía email a Mautic Form API (POST /form/submit).
 * Sin auth, sin CORS hack, sin modules.
 */
(function () {
  'use strict';

  /** @type {string} */
  var MAUTIC_URL = 'https://news.amorismoelmusical.com';

  /** @type {number} Actualizar tras crear el form en Mautic */
  var FORM_ID = 0; // ← TODO: ID real

  /**
   * @param {string} email
   * @returns {FormData}
   */
  function buildPayload(email) {
    var fd = new FormData();
    fd.append('mauticform[formId]', FORM_ID);
    fd.append('mauticform[email]', email);
    fd.append('mauticform[return]', '');
    return fd;
  }

  /**
   * @param {HTMLFormElement} form
   * @param {'success'|'error'} type
   * @param {string} msg
   */
  function showFeedback(form, type, msg) {
    var el = form.closest('.am-contact')
      ? form.closest('.am-contact').querySelector('.am-contact__feedback')
      : null;
    if (!el) {
      el = document.createElement('p');
      el.className = 'am-contact__feedback';
      form.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
    el.className = 'am-contact__feedback am-contact__feedback--visible '
                 + 'am-contact__feedback--' + type;
  }

  /** @param {SubmitEvent} e */
  function handleSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('button[type="submit"]');
    if (!input || !btn) return;

    var email = input.value.trim();
    if (!email) return;

    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    fetch(MAUTIC_URL + '/form/submit', {
      method: 'POST',
      body: buildPayload(email),
      redirect: 'manual'
    })
    .then(function (res) {
      if (res.type === 'opaqueredirect' || res.ok || res.status === 302) {
        showFeedback(form, 'success', '¡Gracias! Te mantendremos al tanto.');
        input.value = '';
        btn.textContent = '✓ Enviado';
      } else {
        throw new Error('Status ' + res.status);
      }
    })
    .catch(function (err) {
      console.error('[AmorismoForm]', err);
      showFeedback(form, 'error', 'Error al enviar. Inténtalo de nuevo.');
      btn.disabled = false;
      btn.textContent = originalText;
    });
  }

  document.querySelectorAll('#hero-form, #contact-form')
    .forEach(function (f) { f.addEventListener('submit', handleSubmit); });
})();
```

**Decisiones tomadas:**
- IIFE (consistente con `nav.js`, `gallery.js` — no hay bundler)
- `FORM_ID` como constante numérica (un solo form Mautic para todo el sitio)
- Feedback visual reutiliza clases CSS existentes (`.am-contact__feedback--success/--error`)
- No redirect a `/gracias/` — feedback inline (el sitio es MPA, redirigir rompe el flow)

---

## 6. Cambios HTML

### 6.1. Patrón — Qué cambia en cada form

**Antes (disabled):**
```html
<p class="am-contact__text">El formulario de correo estará disponible próximamente.</p>
<form class="am-contact__form" id="contact-form">
  <input type="email" name="email" class="am-contact__input"
         placeholder="Tu correo electrónico" required autocomplete="email"
         id="contact-email" disabled>
  <button type="submit" class="am-cta am-cta--disabled"
          id="contact-submit" disabled>Próximamente</button>
</form>
```

**Después (activo):**
```html
<p class="am-contact__text">Newsletter de Amorismo</p>
<form class="am-contact__form" id="contact-form">
  <input type="email" name="email" class="am-contact__input"
         placeholder="Tu correo electrónico" required autocomplete="email"
         id="contact-email">
  <button type="submit" class="am-cta"
          id="contact-submit">Entrar</button>
</form>
<p class="am-contact__feedback" aria-live="polite"></p>
```

**Cambios atómicos:**
1. ~~`disabled`~~ del `<input>`
2. ~~`disabled`~~ y ~~`am-cta--disabled`~~ del `<button>`
3. Texto botón: `Próximamente` → `Entrar`
4. Copy: `…disponible próximamente.` → `Newsletter de Amorismo`
5. Añadir `<p class="am-contact__feedback" aria-live="polite"></p>` tras el `</form>`

### 6.2. Script tag (en los 4 archivos)

Añadir antes de `</body>` (en los 4 archivos):
```html
<script defer src="assets/js/forms.js"></script>
```

### 6.3. Hero form (`index.html`, `#hero-form`)

Mismo patrón que el contact form: quitar `disabled`, quitar `am-cta--disabled`, texto `Entrar`. El hero form no tiene `<p class="am-contact__text">`, así que no hay copy que cambiar.

---

## 7. Infraestructura — Checklist

### 7.1. Mautic: Crear formulario

```
□ Mautic UI → Components → Forms → New
□ Name: "Amorismo — Newsletter"
□ Alias: amorismo_newsletter
□ Fields:
│   □ email (Email, required, alias: email, leadField: email)
│   □ submit (Button, alias: submit)
□ Actions:
│   □ Modify tags: +brand:amorismo, +lead:newsletter
│   □ Add to segment: brand-amorismo (crear segmento si no existe)
□ Publish → anotar Form ID → poner en forms.js FORM_ID
```

> Si la API de Mautic rechaza actions con 400, insertarlas via SQL siguiendo la guía externa de Mautic indicada al final de este documento.

### 7.2. DNS: Crear subdominio

```
□ Cloudflare → Zona amorismoelmusical.com → DNS
□ CNAME: news → d6dde178-cf51-489e-96b0-53ff894c4e95.cfargotunnel.com (Proxied)
```

### 7.3. Cloudflare Tunnel

```yaml
# /etc/cloudflared/config.yml — añadir:
  - hostname: news.amorismoelmusical.com
    service: http://localhost:8090
```
```bash
sudo systemctl restart cloudflared
```

### 7.4. CORS: Transform Rule

```
□ Zona amorismoelmusical.com → Rules → Transform Rules → Modify Response Header
□ Expression:
    (http.host eq "news.amorismoelmusical.com" and
     http.request.uri.path eq "/form/submit")
□ Headers:
│   Access-Control-Allow-Origin:  https://amorismoelmusical.com
│   Access-Control-Allow-Methods: POST, OPTIONS
│   Access-Control-Allow-Headers: Content-Type
```

---

## 8. Gotchas

| # | Gotcha | Mitigación |
|---|---|---|
| 1 | **CORS bloqueado** sin Transform Rule | Crear regla ANTES de activar forms |
| 2 | **`mode: 'no-cors'`** PROHIBIDO | Usar `redirect: 'manual'` siempre |
| 3 | **Mautic 302** = éxito | `response.type === 'opaqueredirect'` → OK |
| 4 | **`name` mismatch** HTML vs Mautic alias | HTML usa `name="email"` y coincide con alias nativo |
| 5 | **Form no Published** en Mautic | Verificar `isPublished: true` antes de deploy |
| 6 | **Feedback `<p>`** no existe en HTML actual | Añadirlo en HTML; el JS también lo crea dinámicamente como fallback |

---

## 9. Orden de Ejecución

```
 1. INFRA  → Crear DNS CNAME (news.amorismoelmusical.com)
 2. INFRA  → Añadir hostname al Cloudflare Tunnel config + restart
 3. INFRA  → Crear Transform Rule CORS en zona CF
 4. MAUTIC → Crear form "Amorismo — Newsletter" + actions (tags + segmento)
 5. CODE   → Crear assets/js/forms.js con FORM_ID real
 6. CODE   → Actualizar 4 HTML: quitar disabled, nuevo copy, feedback element, script tag
 7. TEST   → Enviar suscripción de prueba → verificar contacto en Mautic
 8. TEST   → Ejecutar node --test tests/audit.test.js
 9. DEPLOY → Commit + push → CF Pages auto-deploy
10. DOC    → Actualizar `docs/PLAN.md`, `docs/CONTENT.md` y este documento
```

---

## 10. Referencias

| Documento | Ruta |
|---|---|
| Mautic Forms Integration Guide | `D:\Code Projects\Instalar Home Server\docs\guides\MAUTIC_FORMS_INTEGRATION_GUIDE.md` |
| Mautic CORS Forms | `D:\Code Projects\Instalar Home Server\docs\guides\MAUTIC_CORS_FORMS.md` |
| Mautic Brand Separation | `D:\Code Projects\Instalar Home Server\docs\guides\MAUTIC_BRAND_SEPARATION_GUIDE.md` |
| Cloudflare Auth (zone IDs, tokens) | Personal Context MCP → `cloudflare-auth` |
| Project Roadmap | `docs/PLAN.md` (Fase 6) |
