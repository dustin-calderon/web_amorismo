# CONTENT: Amorismo - Copy Publicado y Referencias

> Fuente de verdad editorial del sitio.
> Última actualización: 2026-07-04
> Alcance: textos publicados en HTML, estados de CTA, enlaces oficiales y contenido pendiente.

## Reglas de Contenido

- No publicar copy provisional.
- No simular disponibilidad de entradas, partituras, discos o formularios.
- Mantener el tono íntimo, contemporáneo y editorial.
- Cuando una función esté pendiente, decirlo de forma explícita: `Próximamente`, `Entradas no disponibles` o `El formulario de correo estará disponible próximamente.`
- Las páginas deben conservar un único `h1`.
- Los nombres propios y créditos deben coincidir exactamente con el HTML.

## SEO Global

### Dominio

- Producción: `https://amorismoelmusical.com/`

### Imagen social principal

- Home, escuchar, partituras y 404 usan:
  - `https://amorismoelmusical.com/assets/images/amorismo-cartel.webp`

### Imagen social por volumen

| Página | OG image |
|---|---|
| Vol. I | `https://amorismoelmusical.com/assets/images/covers/portada-vol-1.webp` |
| Vol. II | `https://amorismoelmusical.com/assets/images/covers/portada-vol-2.webp` |
| Vol. III | `https://amorismoelmusical.com/assets/images/covers/portada-vol-3.webp` |

## Navegación

### Menú principal

- `Inicio` -> `index.html`
- `Escuchar` -> `escuchar.html`
- `Partituras` -> `partituras.html`

### Menú de volúmenes

- `Vol I` -> `vol-1.html`
- `Vol II` -> `vol-2.html`
- `Vol III` -> `vol-3.html`

### Correo

- En home y páginas de volumen: `#correo`
- En escuchar, partituras y 404: `index.html#correo`
- `aria-label`: `Newsletter – suscríbete al correo`

## Home (`index.html`)

### Meta

- `title`: `AMORISMO – El Micromusical`
- `description`: `AMORISMO – El Micromusical de Dustin Calderón. Tres volúmenes de historias condensadas en música y verdad.`
- `og:title`: `AMORISMO – El Micromusical`
- `og:description`: `Tres volúmenes de historias condensadas en música y verdad. Música y letra de Dustin Calderón.`
- `canonical`: `https://amorismoelmusical.com/`

### Hero

- Logo: `assets/images/amorismo-logo-hero.png`
- Alt del logo: `AMORISMO — Un musical de Dustin Calderón`
- Fondo:
  - `assets/images/hero/fondo-vol1.jpeg`
  - `assets/images/hero/fondo-vol2.jpeg`
  - `assets/images/hero/fondo-vol3.jpeg`
- Formulario hero:
  - `id="hero-form"`
  - Input placeholder: `Tu correo electrónico`
  - Input deshabilitado.
  - Botón: `Próximamente`
  - Botón deshabilitado.

### Statement

Headline publicado:

```text
Amorismo es una historia de amor sobre las personas con las que no acabas.
```

Primer párrafo:

```text
Escrito y compuesto por Dustin Calderón, con concepto original desarrollado junto a David Gregory, Amorismo es un micromusical contemporáneo e íntimo que explora el amor, la soledad, la vulnerabilidad y esas pequeñas decisiones que pueden cambiar por completo el rumbo de una relación.
```

Segundo párrafo:

```text
Contado a través de tres volúmenes independientes conectados por un mismo universo emocional, Amorismo sigue distintas versiones de Él y Ella mientras atraviesan el deseo, la incertidumbre, el apego, la ruptura y la frágil esperanza de que el amor todavía sea posible. Con una partitura poética de teatro musical contemporáneo y un lenguaje escénico interactivo, la obra plantea una pregunta tan sencilla como peligrosa: cuando el amor deja de seguir el guion que habíamos imaginado, ¿seguimos adelante, nos marchamos o dejamos que el público ayude a decidir?
```

### Citas Publicadas

| Cita | Fuente | Clase visual |
|---|---|---|
| `Cuando las cosas se hacen con gusto, cuidado y honestidad salen pequeñas obras de arte. Ojalá los productores confiaran en el producto autóctono. Hay mucho talento en este país.` | Xenia Garcias | `am-statement__quote--featured` |
| `Creo que es uno de los musicales más difíciles que he visto, pero gracias a esa dificultad crea un resultado mágico.` | Nacho Rodríguez | `am-statement__quote--v1` |
| `No creo que un producto nacional esté tan cargado de sensibilidad como este.` | María Jaraíz | `am-statement__quote--v3` |
| `Ayer me hiciste recordar porqué me quiero dedicar al teatro musical. Es precioso lo que habéis creado.` | Maribel Sicilia | `am-statement__quote--v2` |

### Equipo Creativo

#### Dustin Calderón

- Rol: `Dirección musical, composición y letra`
- Imagen: `assets/images/DUSTIN_fondo-verde.webp`
- Alt: `Dustin Calderón`

Texto publicado:

```text
Compositor, director musical y pedagogo peruano afincado en España. Especializado en teatro musical, ha trabajado con las principales compañías del sector en Madrid y Gran Vía. Director musical en producciones como La Vida Chulapa (Veranos de la Villa), Jekyll & Hyde, Annie, Tina Turner — El Musical y Un Chico de Revista.
```

```text
Su grupo vocal 6ID fue finalista en Got Talent 7 España y subcampeón del mundo en la ICCa World Competition. Su música suena en Netflix (serie Élite). Ganador del BroadwayWorld Award al Mejor Musical. Desde 2026, dirige el CITEM, escuela online de referencia para teatro musical hispanohablante.
```

#### David Gregory

- Rol: `Dirección de escena`
- Imagen: `assets/images/DAVID_fondo-verde.webp`
- Alt: `David Gregory`

Texto publicado:

```text
Nacido en España, ha trabajado profesionalmente en los EEUU estos últimos 20 años como director, actor y productor. Obras destacadas incluyen Ragtime, Brooklyn, The Wild Party, Dreamgirls y Songs For A New World. Estuvo al frente creativo del estreno mundial del musical 7:32, finalista en los premios del Kennedy Center Theatre.
```

```text
Fundador y Director Artístico de Teatro101, con obras premiadas por BroadwayWorld y publicaciones regionales como The Little Dog Laughed, Side Show, Violet y Brooklyn.
```

### Correo

- Heading: `Mantente al tanto`
- Texto: `El formulario de correo estará disponible próximamente.`
- Placeholder: `Tu correo electrónico`
- Botón: `Próximamente`
- Estado: input y botón deshabilitados.

## Escuchar (`escuchar.html`)

### Meta

- `title`: `Escuchar – AMORISMO`
- `description`: `Escucha AMORISMO – El Micromusical de Dustin Calderón. Próximamente más contenido.`
- `og:title`: `Escuchar – AMORISMO`
- `og:description`: `Escucha AMORISMO. Próximamente más contenido.`
- `canonical`: `https://amorismoelmusical.com/escuchar.html`

### Contenido

- `h1`: `Escuchar`
- Vol. I:
  - Label: `Vol. I`
  - Spotify embed: `https://open.spotify.com/embed/album/2z9biYhBAbUPlokl17H5z0?utm_source=generator&theme=0`
- Vol. II:
  - Label: `Vol. II`
  - Spotify embed: `https://open.spotify.com/embed/album/5YmceQBudLtEer75utcBX6?utm_source=generator&theme=0`
- Vol. III:
  - Label: `Vol. III`
  - Imagen: `assets/images/covers/portada-vol-3.webp`
  - Texto: `Próximamente en Spotify`

## Partituras (`partituras.html`)

### Meta

- `title`: `Partituras – AMORISMO`
- `description`: `Partituras de AMORISMO – El Micromusical de Dustin Calderón. Próximamente disponibles.`
- `og:title`: `Partituras – AMORISMO`
- `og:description`: `Partituras de AMORISMO. Próximamente disponibles.`
- `canonical`: `https://amorismoelmusical.com/partituras.html`

### Contenido

- Icono visual: `🎼`
- `h1`: `Partituras`
- Texto:

```text
Estamos preparando algo especial. Las partituras de Amorismo estarán disponibles próximamente.
```

- CTA outline: `Volver a Inicio`
- Link: `index.html`

## Vol. I (`vol-1.html`)

### Meta

- `title`: `AMORISMO Vol. I`
- `description`: `AMORISMO Vol. I – Una noche puede parecer el principio de algo. Entre ilusión, amistad y deseo, esta historia mira de frente ese lugar incómodo donde alguien se enamora mientras la otra persona solo intenta no hacer daño.`
- `og:title`: `AMORISMO Vol. I`
- `og:description`: `Una noche puede parecer el principio de algo. Entre ilusión, amistad y deseo, esta historia mira de frente ese lugar incómodo donde alguien se enamora mientras la otra persona solo intenta no hacer daño.`
- `canonical`: `https://amorismoelmusical.com/vol-1.html`

### Hero

- `h1`: `AMORISMO · VOL. I`
- Portada: `assets/images/covers/portada-vol-1.webp`
- Alt portada: `Portada de AMORISMO Vol. I`
- Frase hero:

```text
Una noche puede parecer el principio de algo.
```

- CTA: `Escuchar en Spotify`
- Link Spotify: `https://open.spotify.com/intl-es/album/2z9biYhBAbUPlokl17H5z0`

### Sinopsis Publicada

```text
Una noche puede parecer el principio de algo. También puede ser solo una confusión. Él cree haber encontrado una posibilidad real de amor; ella, en cambio, descubre demasiado tarde que quizá confundió la intimidad con algo que no estaba dispuesta a sostener. Entre ilusión, amistad y deseo, esta historia mira de frente ese lugar incómodo donde alguien se enamora mientras la otra persona solo intenta no hacer daño.
```

### Elenco Publicado

- Fernando Palacio
- Marta Tur
- Pablo López
- Beatriz Villar

### Secciones Presentes Sin Nombres Publicados

- `Elenco Valenciano`: dos placeholders visuales, sin nombres.

### Galería

- Thumbnails: 8.
- Full-size:
  - `assets/images/vol1-foto-01.jpg`
  - `assets/images/vol1-foto-02.jpg`
  - `assets/images/vol1-foto-03.jpg`
  - `assets/images/vol1-foto-04.jpg`
  - `assets/images/vol1-foto-05.jpg`
  - `assets/images/vol1-foto-06.jpg`
  - `assets/images/vol1-foto-07.jpg`
  - `assets/images/vol1-foto-08.jpg`
- Thumbnails:
  - `assets/images/thumbs/vol1-foto-01.webp`
  - `assets/images/thumbs/vol1-foto-02.webp`
  - `assets/images/thumbs/vol1-foto-03.webp`
  - `assets/images/thumbs/vol1-foto-04.webp`
  - `assets/images/thumbs/vol1-foto-05.webp`
  - `assets/images/thumbs/vol1-foto-06.webp`
  - `assets/images/thumbs/vol1-foto-07.webp`
  - `assets/images/thumbs/vol1-foto-08.webp`

## Vol. II (`vol-2.html`)

### Meta

- `title`: `AMORISMO Vol. II`
- `description`: `AMORISMO Vol. II – Dos personas se desean, se buscan y se hieren sin saber muy bien cómo parar. Esta historia entra en la parte menos cómoda del amor: esa en la que amar no cura nada si nadie sabe mirarse de verdad.`
- `og:title`: `AMORISMO Vol. II`
- `og:description`: `Dos personas se desean, se buscan y se hieren sin saber muy bien cómo parar. Una historia que entra en la parte menos cómoda del amor: esa en la que amar no cura nada si nadie sabe mirarse de verdad.`
- `canonical`: `https://amorismoelmusical.com/vol-2.html`

### Hero

- `h1`: `AMORISMO · VOL. II`
- Portada: `assets/images/covers/portada-vol-2.webp`
- Alt portada: `Portada de AMORISMO Vol. II`
- Frase hero:

```text
Dos personas se desean, se buscan y se hieren sin saber muy bien cómo parar.
```

- CTA: `Escuchar en Spotify`
- Link Spotify: `https://open.spotify.com/intl-es/album/5YmceQBudLtEer75utcBX6`

### Sinopsis Publicada

```text
Dos personas se desean, se buscan y se hieren sin saber muy bien cómo parar. Ella necesita sentirse elegida; él se acerca y se escapa con la misma intensidad. Entre ansiedad, evasión, culpa, deseo y decisiones que cruzan límites, esta historia entra en la parte menos cómoda del amor: esa en la que amar no cura nada si nadie sabe mirarse de verdad.
```

### Elenco Publicado

- Héctor Vázquez
- Blanca Rodríguez
- Alba Sáiz
- Luis Leon

### Secciones Presentes

- `Elenco Valenciano`: dos placeholders visuales, sin nombres.
- `Grabación del Disco`:
  - Héctor Vázquez
  - María Jaraiz

### Galería

- Thumbnails: 11.
- Full-size:
  - `assets/images/vol2-foto-02.jpg`
  - `assets/images/vol2-foto-03.jpg`
  - `assets/images/vol2-foto-04.jpg`
  - `assets/images/vol2-foto-05.jpg`
  - `assets/images/vol2-foto-06.jpg`
  - `assets/images/vol2-foto-07.jpg`
  - `assets/images/vol2-foto-08.jpg`
  - `assets/images/vol2-foto-11.jpg`
  - `assets/images/vol2-foto-12.jpg`
  - `assets/images/vol2-foto-13.jpg`
  - `assets/images/vol2-foto-14.jpg`
- Thumbnails:
  - `assets/images/thumbs/vol2-foto-02.webp`
  - `assets/images/thumbs/vol2-foto-03.webp`
  - `assets/images/thumbs/vol2-foto-04.webp`
  - `assets/images/thumbs/vol2-foto-05.webp`
  - `assets/images/thumbs/vol2-foto-06.webp`
  - `assets/images/thumbs/vol2-foto-07.webp`
  - `assets/images/thumbs/vol2-foto-08.webp`
  - `assets/images/thumbs/vol2-foto-11.webp`
  - `assets/images/thumbs/vol2-foto-12.webp`
  - `assets/images/thumbs/vol2-foto-13.webp`
  - `assets/images/thumbs/vol2-foto-14.webp`

## Vol. III (`vol-3.html`)

### Meta

- `title`: `AMORISMO Vol. III`
- `description`: `AMORISMO Vol. III – Después de quince años de matrimonio, una pareja se enfrenta a una verdad que ya no cabe debajo de la alfombra. Una historia sobre ternura, identidad y el dolor de decir la verdad cuando todavía hay amor.`
- `og:title`: `AMORISMO Vol. III`
- `og:description`: `Después de quince años de matrimonio, una pareja se enfrenta a una verdad que ya no cabe debajo de la alfombra. Una historia sobre ternura, identidad y el dolor de decir la verdad cuando todavía hay amor.`
- `canonical`: `https://amorismoelmusical.com/vol-3.html`

### Hero

- `h1`: `AMORISMO · VOL. III`
- Portada: `assets/images/covers/portada-vol-3.webp`
- Alt portada: `Portada de AMORISMO Vol. III`
- Frase hero:

```text
Después de quince años de matrimonio, una pareja se enfrenta a una verdad que ya no cabe debajo de la alfombra.
```

- CTA visible como estado: `Entradas no disponibles`
- No hay link de entradas activo.

### Sinopsis Publicada

```text
Después de quince años de matrimonio, una pareja se enfrenta a una verdad que ya no cabe debajo de la alfombra. Él ha intentado ser el marido que todos esperaban; ella ha amado a un hombre que quizá nunca pudo entregarse por completo. No se trata de falta de amor, sino de una mentira demasiado larga. Una historia sobre ternura, identidad y el dolor de decir la verdad cuando todavía hay amor.
```

### Elenco Publicado

- Loa Miller
- Blanca Rodríguez
- Ángela Santos
- Braulio Chappell

### Equipo Creativo Adicional

- Rol: `Audiovisuales`
- Carmen Rodríguez

### Elenco Valenciano

- Mary Porcar
- Sergio Escribano

### Galería

- Thumbnails: 8.
- Full-size:
  - `assets/images/IMG_6612.webp`
  - `assets/images/IMG_6624.webp`
  - `assets/images/IMG_6632.webp`
  - `assets/images/IMG_6655.webp`
  - `assets/images/IMG_6660.webp`
  - `assets/images/IMG_6666.webp`
  - `assets/images/IMG_6670.webp`
  - `assets/images/IMG_6685.webp`
- Thumbnails:
  - `assets/images/thumbs/IMG_6612.webp`
  - `assets/images/thumbs/IMG_6624.webp`
  - `assets/images/thumbs/IMG_6632.webp`
  - `assets/images/thumbs/IMG_6655.webp`
  - `assets/images/thumbs/IMG_6660.webp`
  - `assets/images/thumbs/IMG_6666.webp`
  - `assets/images/thumbs/IMG_6670.webp`
  - `assets/images/thumbs/IMG_6685.webp`

## 404 (`404.html`)

### Contenido

- Página de error compartiendo design system.
- CTA principal: `Volver a Inicio`
- CTA secundaria: `Escuchar en Spotify`
- Link Spotify usado: Vol. I.
- Footer legal compartido.

## Footer Compartido

### Logo

- Imagen: `assets/images/amorismo-logo-hero.png`
- Alt: `AMORISMO — Un Musical de Dustin Calderón`

### Social

- Instagram: `https://www.instagram.com/amorismoelmusical/`
- Spotify footer: `https://open.spotify.com/intl-es/album/2z9biYhBAbUPlokl17H5z0`

### Legal

- Copyright:

```text
Copyright © 2026 Dustin Calderón · Derechos reservados.
```

- Aviso Legal: `https://dustincalderon.com/legal/aviso-legal/`
- Política de Privacidad: `https://dustincalderon.com/legal/privacidad/`

## Enlaces Oficiales

| Recurso | URL | Estado |
|---|---|---|
| Instagram | `https://www.instagram.com/amorismoelmusical/` | Activo |
| Spotify Vol. I | `https://open.spotify.com/intl-es/album/2z9biYhBAbUPlokl17H5z0` | Activo |
| Spotify Vol. II | `https://open.spotify.com/intl-es/album/5YmceQBudLtEer75utcBX6` | Activo |
| Spotify Vol. III | Pendiente | No publicado |
| Partituras | Pendiente | Coming soon |
| Newsletter/correo | Pendiente de backend | Formularios deshabilitados |

## Referencia de Bios Largas No Publicadas

Estas versiones se conservan como referencia editorial. No se publican completas en la web actual.

### Dustin Calderón

Compositor, director musical y pedagogo peruano afincado en España. Especializado en teatro musical, ha trabajado con las principales compañías del sector en Madrid y Gran Vía.

Su grupo vocal 6ID fue finalista en Got Talent 7 España (Telecinco, 2022) y subcampeón del mundo en la ICCa World Competition de música a capella. Su música suena en Netflix (serie Élite).

Como compositor, destaca su obra AMORISMO —teatro musical interactivo— que ha sido interpretada en diferentes ciudades de España y Perú. Ganador del BroadwayWorld Award al Mejor Musical. Ha sido director musical y pianista en producciones como La Vida Chulapa (Veranos de la Villa), Jekyll & Hyde, Annie, Tina Turner — El Musical y Un Chico de Revista, entre otros.

Desde 2026, dirige el CITEM (Centro Iberoamericano de Teatro Musical), una escuela online de referencia para actores y compositores de teatro musical hispanohablantes.

### David Gregory

Nacido en España, David Gregory ha trabajado profesionalmente en los EEUU estos últimos 20 años como director, actor, productor, director artístico, y ejecutivo de marketing. Obras destacadas de dirección incluyen: Ragtime, Brooklyn, Andrew Lippa's The Wild Party, Side Show, Café, For Whom The Southern Belle Tolls, A New Brain, Dreamgirls y Songs For A New World. Durante sus estudios universitarios, tradujo y co-dirigió la primera producción en inglés – y el estreno norteamericano – de Los Engranajes, escrito por el dramaturgo español Raúl Hernández Garrido. Estuvo al frente creativo del estreno mundial del nuevo musical 7:32, que fue galardonado como finalista en los premios nacionales del Kennedy Center Theatre (Washington, DC). Como coreógrafo, su trabajo ha estado en obras como: La Casa de Bernarda Alba, Bare, Falsettos, Sweeney Todd y A New Brain.

David ha tenido éxito de la crítica como fundador y Director Artístico de Teatro101, trabajo destacado con obras como The Little Dog Laughed, Side Show, Violet, The Wild Party, y Brooklyn, que han contado, además, con varios premios de BroadwayWorld y publicaciones regionales.
