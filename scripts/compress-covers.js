/**
 * compress-covers.js
 * Convierte las portadas de los volúmenes al formato WebP optimizado para web.
 * Output: assets/images/covers/portada-vol-{1,2,3}.webp
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const COVERS_DIR = path.join(ROOT, 'assets', 'images', 'covers');

// Crea la carpeta si no existe
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

const jobs = [
  {
    input: path.join(ROOT, 'Amorismo Portada Álbum.jpg'),
    output: path.join(COVERS_DIR, 'portada-vol-1.webp'),
    label: 'Vol I',
  },
  {
    input: path.join(ROOT, 'AMORISMO_VOL_2 - -PORTADA.jpg'),
    output: path.join(COVERS_DIR, 'portada-vol-2.webp'),
    label: 'Vol II',
  },
  {
    // Vol III ya existía en assets/images — la movemos/recomprimimos aquí
    input: path.join(ROOT, 'assets', 'images', 'amorismo-cartel.webp'),
    output: path.join(COVERS_DIR, 'portada-vol-3.webp'),
    label: 'Vol III',
  },
];

for (const job of jobs) {
  if (!fs.existsSync(job.input)) {
    console.warn(`⚠️  No encontrado: ${job.input}`);
    continue;
  }

  await sharp(job.input)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(job.output);

  const sizeBefore = Math.round(fs.statSync(job.input).size / 1024);
  const sizeAfter  = Math.round(fs.statSync(job.output).size / 1024);
  console.log(`✅ ${job.label}: ${sizeBefore}KB → ${sizeAfter}KB → ${job.output}`);
}
