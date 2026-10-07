import sharp from 'sharp';
import { resolve } from 'node:path';
const directory=resolve(import.meta.dirname,'../../src/assets/banner');
for (const width of [480,800,1280,1512]) {
  for (const format of ['avif','webp']) {
    await sharp(resolve(directory,'familia-aberta.png')).resize({width,withoutEnlargement:true})
      .toFormat(format,{quality:format === 'avif' ? 55 : 82,effort:6})
      .toFile(resolve(directory,`familia-aberta-${width}.${format}`));
  }
}
console.log('Variantes do enquadramento aberto geradas, sem recorte adicional.');
