import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const media = JSON.parse(readFileSync('.local-media/manifest.json', 'utf8'));
for (const item of media) {
  const original = `.local-media/${item.id}.jpg`;
  await sharp(original).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`.local-media/${item.id}.webp`);
  await sharp(original).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`.local-media/${item.id}-thumb.webp`);
}
mkdirSync('.cache', { recursive: true });
const tiles = await Promise.all(media.map(async (item, i) => ({ input: await sharp(`.local-media/${item.id}-thumb.webp`).resize(320, 180).extend({ bottom: 24, background: '#102438' }).composite([{ input: Buffer.from(`<svg width="320" height="204"><text x="10" y="198" fill="white" font-family="Arial" font-size="16">${item.id}</text></svg>`) }]).png().toBuffer(), left: (i % 3) * 320, top: Math.floor(i / 3) * 204 })));
await sharp({ create: { width: 960, height: Math.ceil(media.length / 3) * 204, channels: 3, background: '#102438' } }).composite(tiles).png().toFile('.cache/official-screenshot-contact-sheet.png');
writeFileSync('.local-media/manifest.json', JSON.stringify(media.map(item => ({ ...item, optimized: `${item.id}.webp`, thumbnail: `${item.id}-thumb.webp` })), null, 2) + '\n');
console.log(`Optimized ${media.length} screenshots and thumbnails for development only.`);
