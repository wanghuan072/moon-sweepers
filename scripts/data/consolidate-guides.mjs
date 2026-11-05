import {readFileSync} from 'node:fs';
const read=file=>JSON.parse(readFileSync(file,'utf8'));
export function consolidateGuides({save,guides,machines,updates}){
 const copy=read('src/data/editorial/guide-consolidation.json'),routes=read('src/data/guides/route-migrations.json');
 const original=new Map(guides.map(e=>[e.slug,e]));
 const next=copy.map(({mergeFrom,tableSources,...editorial})=>{
  const base=original.get(editorial.slug),merged=mergeFrom.map(slug=>original.get(slug));
  if(!base||merged.some(e=>!e))throw new Error(`Missing consolidation input: ${editorial.slug}`);
  const tables=tableSources.map(([slug,title])=>{
   const table=structuredClone(original.get(slug)?.tables?.find(t=>t.title===title));
   if(!table)throw new Error(`Missing guide table ${slug}: ${title}`);
   const seen=new Set();table.rows=table.rows.filter(row=>{const key=JSON.stringify(row);if(seen.has(key))return false;seen.add(key);return true;});return table;
  });
  const sources=[...new Set(merged.flatMap(e=>e.sources))];
  for(const update of updates.filter(e=>['patch-1-0-3','patch-1-0-4','patch-1-0-5'].includes(e.slug)))sources.push(...update.sources);
  const article={...base};delete article.stats;delete article.flows;
  const dataNote=editorial.slug==='save-recovery-guide'?'Folder details apply to Windows. Preserve the original files; active-save filenames and recovery steps can differ by build.':editorial.slug==='automation-guide'?'Version 1.0.5. Production rates assume full power, uninterrupted feed and a clear output. Night-power figures are calculated examples.':'Version 1.0.5. Prices are base purchase costs before eligible discounts; upgrades and vehicle purchases follow the ownership rules described above.';
  return {...article,...editorial,dataNote,tables,sources:[...new Set(sources)],related:copy.filter(e=>e.slug!==editorial.slug).map(e=>e.slug),relatedLinks:[{title:'Equipment and specifications',href:'/wiki'},{title:'Income and upgrade planning',href:'/tools'}]};
 });
 const oldSlugTarget=Object.fromEntries(Object.entries(routes).map(([path,destination])=>[path.split('/').at(-1),destination?.startsWith('/guides/')?destination.split('#')[0].split('/').at(-1):null]));
 const migrate=value=>{
  if(typeof value==='string'&&value.startsWith('/guides/')){const [path,hash]=value.split('#');return routes[path]===null?'/guides':routes[path]||path+(hash?'#'+hash:'');}
  if(Array.isArray(value))return value.map(migrate);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,key==='related'? [...new Set(item.map(slug=>slug in oldSlugTarget?oldSlugTarget[slug]:slug).filter(Boolean))]:key==='relatedLinks'?migrate(item.filter(link=>routes[link.href?.split('#')[0]]!==null)):migrate(item)]));
  return value;
 };
 guides.splice(0,guides.length,...migrate(next));
 for(const [file,entries] of [['guides/guides',guides],['machines/machines',machines],['updates/updates',updates],['wiki/entries',read('src/data/wiki/entries.json')],['wiki/category-overviews',read('src/data/wiki/category-overviews.json')]])save(`src/data/${file}.json`,migrate(entries));
}
