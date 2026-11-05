// Equipment sources already use WebP. Validate and build a visual inspection sheet.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const media=JSON.parse(readFileSync('src/data/machines/equipment-visuals.json','utf8'));
mkdirSync('.cache',{recursive:true});
const tiles=await Promise.all(media.map(async(item,i)=>{
  const file=`.local-media/${item.id}.webp`;
  const metadata=await sharp(file).metadata();
  item.width=metadata.width;item.height=metadata.height;item.sha256=createHash('sha256').update(readFileSync(file)).digest('hex');
  if(metadata.format!=='webp')throw new Error(`Invalid equipment image: ${item.id}`);
  return {input:await sharp(file).resize(240,180,{fit:'contain',background:'#15293b'}).extend({bottom:26,background:'#15293b'}).composite([{input:Buffer.from(`<svg width="240" height="206"><text x="8" y="199" fill="white" font-family="Arial" font-size="11">${item.slug}</text></svg>`)}]).png().toBuffer(),left:i%4*240,top:Math.floor(i/4)*206};
}));
await sharp({create:{width:960,height:Math.ceil(media.length/4)*206,channels:3,background:'#15293b'}}).composite(tiles).png().toFile('.cache/wikily-equipment-contact-sheet.png');
console.log('Validated all isolated equipment assets and generated contact sheet.');

writeFileSync('src/data/machines/equipment-visuals.json',JSON.stringify(media,null,2)+'\n');
