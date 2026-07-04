/**
 * process-cast-photos.js
 * Converts cast PNG photos from Downloads → optimized WebP in assets/images/.
 * Also generates 360×360 square thumbs (not needed for cast cards, but consistent).
 *
 * Output spec (matches existing Vol III cast photos):
 *   - Main:  540×675 (3:4 ratio), WebP, quality 82
 *   - Name:  lowercase, hyphenated, e.g. "alba-saiz.webp"
 *
 * Special: omar-ruiz.png gets 250px cropped from top before resize (excess headroom).
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DOWNLOADS = 'C:\\Users\\dusti\\Downloads';
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images');
const WIDTH = 540;
const HEIGHT = 675;
const QUALITY = 82;

/** @type {Array<{src: string, out: string, cropTop?: number}>} */
const photos = [
  // Vol I — Elenco
  { src: 'Fernando Palacio.png', out: 'fernando-palacio.webp' },
  { src: 'Marta tur.png',       out: 'marta-tur.webp' },
  { src: 'pablo lopez.png',     out: 'pablo-lopez.webp' },
  { src: 'Beatriz Villar.png',  out: 'beatriz-villar.webp' },
  // Vol I — Elenco Valenciano
  { src: 'omar ruiz.png',       out: 'omar-ruiz.webp', cropTop: 250 },
  { src: 'Carmen Peinado.png',  out: 'carmen-peinado.webp' },
  // Vol II — Elenco
  { src: 'Héctor Vazquez.png',  out: 'hector-vazquez.webp' },
  { src: 'Alba Saiz.png',       out: 'alba-saiz.webp' },
  { src: 'Luis Leon.png',       out: 'luis-leon.webp' },
  // Vol II — Elenco Valenciano
  { src: 'Miguel Sanchez.png',  out: 'miguel-sanchez.webp' },
  { src: 'Patri Sanchez.png',   out: 'patri-sanchez.webp' },
  // Vol II — Grabación del Disco
  { src: 'María Jaráiz.png',    out: 'maria-jaraiz.webp' },
  // Note: Héctor Vázquez already processed above, reused in HTML
  // Vol III — Elenco Valenciano
  { src: 'mary porcar.png',     out: 'mary-porcar.webp' },
  { src: 'sergio escribano.png', out: 'sergio-escribano.webp' },
];

async function processPhoto({ src, out, cropTop }) {
  const inputPath = path.join(DOWNLOADS, src);
  const outputPath = path.join(OUT_DIR, out);

  if (!fs.existsSync(inputPath)) {
    console.error(`  ✗ NOT FOUND: ${src}`);
    return;
  }

  let pipeline = sharp(inputPath);

  // Special crop for photos with excess headroom
  if (cropTop) {
    const meta = await sharp(inputPath).metadata();
    pipeline = pipeline.extract({
      left: 0,
      top: cropTop,
      width: meta.width,
      height: meta.height - cropTop,
    });
  }

  await pipeline
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' })
    .webp({ quality: QUALITY })
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  console.log(`  ✓ ${out}  (${(stat.size / 1024).toFixed(0)} KB)`);
}

async function main() {
  console.log(`Processing ${photos.length} cast photos → ${OUT_DIR}\n`);
  for (const photo of photos) {
    await processPhoto(photo);
  }
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
