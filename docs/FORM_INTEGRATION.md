# FORM_INTEGRATION: Newsletter Amorismo → Mautic

> **Proyecto:** `web_amorismo` (`amorismoelmusical.com`)
> **Documento relacionado:** `docs/PLAN.md`
> **Estado:** Configuración de producción aplicada — Frontend activo + Mautic `FORM_ID = 18`
> **Fecha:** 2026-07-04

---

## 1. Definición

**Un único formulario de newsletter.** Captura solo email. Todas las instancias en el sitio cargan el mismo script y envían al formulario Mautic `FORM_ID = 18`.

Nota de rigor: los tests locales validan HTML, script y configuración, pero no ejecutan una suscripción real contra Mautic. Para afirmar operación end-to-end hay que conservar una prueba real de contacto creado, tags y segmento.

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

5 formularios en 4 archivos HTML. En el working tree actual todos cargan `assets/js/forms.js`.

| Archivo | HTML `id` | Ubicación |
|---|---|---|
| `index.html` | `#hero-form` | Landing Hero (CTA principal) |
| `index.html` | `#contact-form` | Sección "Correo" (pre-footer) |
| `vol-1.html` | `#contact-form` | Sección "Correo" |
| `vol-2.html` | `#contact-form` | Sección "Correo" |
| `vol-3.html` | `#contact-form` | Sección "Correo" |

> `escuchar.html` y `partituras.html` no tienen formulario.

### Estado actual del working tree

Los formularios están visualmente activos:

- Inputs sin `disabled`.
- Botones con texto `Entrar`.
- Copy visible: `Newsletter de Amorismo`.
- Feedback accesible: `<p class="am-contact__feedback" aria-live="polite"></p>`.
- Script cargado: `assets/js/forms.js`.

El backend está configurado con `FORM_ID = 18` apuntando a `https://news.amorismoelmusical.com`.

### Estado anterior deshabilitado

```html
<input ... disabled>
<button ... class="am-cta am-cta--disabled" disabled>Próximamente</button>
```

```html
<p class="am-contact__text">El formulario de correo estará disponible próximamente.</p>
```

---

## 3. Archivos Involucrados

### Estado de cambios aplicados

| Archivo | Acción |
|---|---|
| `assets/js/forms.js` | `FORM_ID = 18` — Producción configurada ✅ |
| `index.html`, `vol-1.html`, `vol-2.html`, `vol-3.html` | Copy: `Newsletter de Amorismo` / botón `Entrar` ✅ |
| `tests/audit.test.js` | Valida `forms.js`, estados activos, feedback y ausencia de `console.log`; suite 202/202 ✅ |

### No requieren cambios

| Archivo | Por qué está listo |
|---|---|
| `assets/css/contact.css` | `.am-contact__feedback`, `--visible`, `--success`, `--error` ya definidos |
| `assets/css/components.css` | `.am-cta`, `.am-cta--disabled` ya definidos |
| `assets/css/hero.css` | `.am-landing-hero__form` spacing ya definido |
| `assets/css/tokens.css` | Tokens `--am-feedback-success`, `--am-input-placeholder` ya existen |
| `assets/css/responsive.css` | Form responsive cubierto en breakpoints `<=768px` y `<=480px` |

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

> **Código fuente**: [`assets/js/forms.js`](../assets/js/forms.js) (fuente de verdad).
> No se duplica aquí para evitar drift con el working tree.

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

**Estado activo actual:**
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

**Cambios ya aplicados en el working tree:**
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

### 7.1. Mautic: Formulario creado ✅

**Form ID = 18**, alias `amorismo_newsletter`.

> **NOTA**: La API de Mautic (`/api/forms/new`) tiene un bug conocido en `FormSubscriber.php:135` — pasa `null` properties de `lead_fields` a `FieldCrate` que espera `array`.
> Se creó vía SQL directo en MariaDB (`mariadb_mautic` container).
> Fix aplicado: `UPDATE lead_fields SET properties = 'a:0:{}' WHERE properties IS NULL` (8 filas).
> Fix adicional: `UPDATE form_fields SET properties = 'a:0:{}' WHERE properties IS NULL` (24 filas).

- Fields: email (required, leadField mapping) + submit button
- Actions: `lead.changetags` (brand:amorismo, lead:newsletter) + `lead.changelist` (segment ID 14)
- Segmento: `brand-amorismo` (ID 14) creado vía API

### 7.2. DNS: Subdominio creado ✅

`CNAME news → d6dde178-cf51-489e-96b0-53ff894c4e95.cfargotunnel.com` (Proxied)

### 7.3. Cloudflare Tunnel configurado ✅

> **IMPORTANTE**: El tunnel usa `source: cloudflare` (API-managed). Las ingress rules
> del archivo local `/etc/cloudflared/config.yml` son **ignoradas**. Las reglas se
> gestionan SOLO vía la API de Cloudflare (`PUT /cfd_tunnel/{id}/configurations`).

**Ingress rules activas (API, versión 39):**
1. `^/s(/.*)?$` → `http_status:403` (bloquear panel admin)
2. `^/$` → `http_status:403` (bloquear landing)
3. catch-all → `http://localhost:8090`

### 7.4. CORS: Transform Rule activa ✅

Expression: `(http.host eq "news.amorismoelmusical.com" and http.request.uri.path eq "/form/submit")`
Headers: `Access-Control-Allow-Origin: https://amorismoelmusical.com`

---

## 8. Gotchas

| # | Gotcha | Mitigación |
|---|---|---|
| 1 | **CORS bloqueado** sin Transform Rule | Crear regla ANTES de activar forms |
| 2 | **`mode: 'no-cors'`** PROHIBIDO | Usar `redirect: 'manual'` siempre |
| 3 | **Mautic 302** = éxito | `response.type === 'opaqueredirect'` → OK |
| 4 | **`name` mismatch** HTML vs Mautic alias | HTML usa `name="email"` y coincide con alias nativo |
| 5 | **Form no Published** en Mautic | Verificar `isPublished: true` antes de deploy |
| 6 | **Feedback `<p>`** debe existir cerca del formulario | Está en HTML; el JS también lo crea dinámicamente como fallback |
| 7 | **Mautic API FieldCrate bug** | `lead_fields.properties IS NULL` causa 500 en CUALQUIER form save vía API. Fix: `UPDATE lead_fields SET properties = 'a:0:{}' WHERE properties IS NULL` |
| 8 | **Tunnel source: cloudflare** ignora config local | Archivo `/etc/cloudflared/config.yml` define tunnel ID pero las ingress rules se leen de la API. Añadir hostnames vía `PUT /configurations`, no editando el YAML local |

---

## 9. Orden de Ejecución

```
 1. ✅ INFRA  → DNS CNAME (news.amorismoelmusical.com)
 2. ✅ INFRA  → Cloudflare Tunnel config + restart
 3. ✅ INFRA  → Transform Rule CORS en zona CF
 4. ✅ MAUTIC → Segmento brand-amorismo (ID 14) + Form ID 18 (vía SQL)
 5. ✅ CODE   → FORM_ID = 18 en forms.js
 6. ✅ CODE   → Copy: "Newsletter de Amorismo" / botón "Entrar"
 7. ✅ TEST   → E2E verificado (2026-07-04): POST → 302, contacto creado (ID 1357), tags `brand:amorismo` + `lead:newsletter`, segmento `brand-amorismo`, contacto eliminado tras test ✅
 8. ✅ TEST   → 202/202 tests passing
 9. ✅ DEPLOY → Pushed to deploy branch
10. ✅ DOC    → Este documento actualizado
```

---

## 10. Referencias

| Documento | Ruta |
|---|---|
| Mautic Forms Integration Guide | Referencia externa local: `D:\Code Projects\Instalar Home Server\docs\guides\MAUTIC_FORMS_INTEGRATION_GUIDE.md` |
| Mautic CORS Forms | Referencia externa local: `D:\Code Projects\Instalar Home Server\docs\guides\MAUTIC_CORS_FORMS.md` |
| Mautic Brand Separation | Referencia externa local: `D:\Code Projects\Instalar Home Server\docs\guides\MAUTIC_BRAND_SEPARATION_GUIDE.md` |
| Cloudflare Auth (zone IDs, tokens) | Personal Context MCP → `cloudflare-auth` |
| Project Roadmap | `docs/PLAN.md` |
