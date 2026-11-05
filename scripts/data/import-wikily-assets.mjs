import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const output = 'src/data/machines/equipment-visuals.json';
const machineSlugs = ['packager','splitter','merger','conveyor-belt','pressure-chamber','stone-press','capsule-catcher','garage','solar-post','solar-twin','solar-tracker','robot-vacuum-mk-i','robot-vacuum-mk-ii','joonas'];
const vehicleSlugs = ['push-sweeper','ride-on-sweeper','crew-transport','lunar-sweeper','mega-vacuum-rover'];
const aliases = {'robot-dock-mk1':'robot-vacuum-mk-i','robot-dock-mk2':'robot-vacuum-mk-ii'};
const sourceSlug = {'solar-post':'solar-post-s','solar-twin':'solar-twin-m','solar-tracker':'solar-tracker-l','joonas':'j-o-o-n-a-s'};
const records = new Map();
mkdirSync('.local-media',{recursive:true});
const manifests = process.argv.slice(2);
if (!manifests.length) throw new Error('Pass pageAssets manifest paths exported from the two reference directories and robot directory.');
for (const path of manifests) {
  const manifest = JSON.parse(readFileSync(path,'utf8'));
  for (const asset of manifest.assets) {
    if (!asset.url.startsWith('https://img.wikily.gg/')) continue;
    const originalUrl = Buffer.from(asset.url.split('/').at(-1),'base64url').toString();
    const filename = basename(originalUrl);
    if (!filename.includes('-icon-')) continue;
    let slug = filename.split('-icon-').at(-1).replace(/\.webp$/,'').replace(/^vehicle_/,'').replaceAll('_','-');
    slug = aliases[slug] || slug;
    if (![...machineSlugs,...vehicleSlugs].includes(slug)) continue;
    const bytes=readFileSync(asset.path);
    const metadata=await sharp(bytes).metadata();
    if (records.has(slug) && records.get(slug).width >= metadata.width) continue;
    const id=`reference-equipment-${slug}`;
    await sharp(bytes).webp({lossless:true}).toFile(`.local-media/${id}.webp`);
    const kind=vehicleSlugs.includes(slug)?'vehicles':'machines';
    const folder=slug.startsWith('robot-vacuum')||slug==='joonas'?'joonas-robots':kind;
    records.set(slug,{id,slug,title:slug.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),kind,originalUrl,sourcePage:`https://wikily.gg/moon-sweepers/${folder}/${sourceSlug[slug]||slug}`,alt:`Moon Sweepers ${slug.replaceAll('-',' ')} isolated equipment image`,caption:'Game equipment image via Wikily · © respective rights holders',reviewedAt:'2026-11-04',useScope:'Local development preview; public reuse clearance pending',sha256:createHash('sha256').update(bytes).digest('hex'),width:metadata.width,height:metadata.height});
  }
}
const missing=[...machineSlugs,...vehicleSlugs].filter(s=>!records.has(s));
if(missing.length) throw new Error(`Missing isolated images: ${missing.join(', ')}`);
writeFileSync(output,JSON.stringify([...records.values()],null,2)+'\n');
const tiles=await Promise.all([...records.values()].map(async(item,i)=>({input:await sharp(`.local-media/${item.id}.webp`).resize(240,180,{fit:'contain',background:'#15293b'}).extend({bottom:26,background:'#15293b'}).composite([{input:Buffer.from(`<svg width="240" height="206"><text x="8" y="199" fill="white" font-family="Arial" font-size="11">${item.slug}</text></svg>`)}]).png().toBuffer(),left:i%4*240,top:Math.floor(i/4)*206})));
if(!existsSync('.cache'))mkdirSync('.cache');
await sharp({create:{width:960,height:Math.ceil(records.size/4)*206,channels:3,background:'#15293b'}}).composite(tiles).png().toFile('.cache/wikily-equipment-contact-sheet.png');
console.log(`Imported ${records.size} distinct equipment images with source metadata.`);
