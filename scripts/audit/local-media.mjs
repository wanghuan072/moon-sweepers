import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
const manifest = JSON.parse(readFileSync('.local-media/manifest.json', 'utf8'));
const errors = [];
const reference = [...JSON.parse(readFileSync('src/data/machines/equipment-visuals.json', 'utf8')), ...JSON.parse(readFileSync('src/data/wiki/content-visuals.json', 'utf8')), ...JSON.parse(readFileSync('src/data/map/assets.json', 'utf8'))];
for (const item of reference) {
  const file = join('.local-media', `${item.id}.webp`);
  if (!existsSync(file) || (await sharp(file).metadata()).format !== 'webp') errors.push(`${item.id}: missing or invalid reference frame`);
}
for (const item of manifest) {
  for (const file of [item.optimized, item.thumbnail]) {
    if (!file || !existsSync(join('.local-media', file))) { errors.push(`${item.id}: missing optimized asset`); continue; }
    const metadata = await sharp(join('.local-media', file)).metadata();
    if (metadata.format !== 'webp' || !metadata.width || !metadata.height) errors.push(`${file}: invalid WebP`);
  }
}
function files(dir) { return readdirSync(dir).flatMap(name => { const p = join(dir, name); return statSync(p).isDirectory() ? files(p) : [p]; }); }
for (const file of files('.next/server')) {
  if (file.endsWith('.html') && /\/api\/local-media\/(?:steam-screenshot-|reference-(?:equipment|content|map)-)/.test(readFileSync(file, 'utf8'))) errors.push(`${file}: local screenshot leaked into production HTML`);
  if (file.endsWith('.nft.json')) {
    const trace = JSON.parse(readFileSync(file, 'utf8'));
    if (trace.files?.some(path => path.replaceAll('\\', '/').includes('/.local-media/'))) errors.push(`${file}: local media included in production file trace`);
  }
}
if (files('public').some(p => /(?:steam-screenshot-|reference-(?:equipment|content|map)-)/.test(p))) errors.push('Development screenshots must not be placed in public/');
console.log(`${manifest.length} official screenshots and ${reference.length} isolated equipment images validated; production HTML and file traces checked.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; } else console.log('Local-only media audit passed.');
