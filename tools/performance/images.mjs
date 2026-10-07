import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../..');
const assets = resolve(root, 'src/assets');
const inventory = [];
async function convert(source, output, width, format, options) {
  const input = resolve(assets, source);
  const destination = resolve(assets, output);
  await sharp(input).rotate().resize({ width, withoutEnlargement: true }).toFormat(format, options).toFile(destination);
  inventory.push({ source, output, width, originalBytes: (await stat(input)).size, bytes: (await stat(destination)).size });
}
for (const width of [480, 800, 960]) {
  await convert('banner/familia.jpg', `banner/familia-${width}.avif`, width, 'avif', { quality: 55, effort: 6 });
  await convert('banner/familia.jpg', `banner/familia-${width}.webp`, width, 'webp', { quality: 82, effort: 6 });
}
for (const width of [480, 800, 1280]) {
  await convert('fachada/Fachada.jpg', `fachada/fachada-${width}.avif`, width, 'avif', { quality: 55, effort: 6 });
  await convert('fachada/Fachada.jpg', `fachada/fachada-${width}.webp`, width, 'webp', { quality: 80, effort: 6 });
}
for (const [source, output, width] of [
  ['logo/logo-color-splink.png', 'logo/logo-color-splink.webp', 380],
  ['logo/logo-rodape.png', 'logo/logo-rodape.webp', 352],
  ['banner/ondas-bottom.png', 'banner/ondas-bottom.webp', 620],
  ['whatsapp/wpp-white.png', 'whatsapp/wpp-white.webp', 128],
  ['logo-apps/android.png', 'logo-apps/android.webp', 270],
]) await convert(source, output, width, 'webp', { lossless: true, effort: 6 });
await mkdir(resolve(root, 'docs/performance'), { recursive: true });
await writeFile(resolve(root, 'docs/performance/images.json'), JSON.stringify(inventory, null, 2));
console.log(JSON.stringify(inventory, null, 2));
