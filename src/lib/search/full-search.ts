import rawMachines from '@/data/machines/machines.json';
import rawWiki from '@/data/wiki/entries.json';
import rawGuides from '@/data/guides/guides.json';
import mods from '@/data/mods/mods.json';
import rawUpdates from '@/data/updates/updates.json';
import index from '@/data/search/search-index.json';
import type {Entry} from '@/types/content';
export interface SearchHit {title:string;description:string;kind:string;href:string}
const normalize=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[°,$]/g,'').replace(/[^a-z0-9\u4e00-\u9fff]+/g,' ').trim();
const entries=Object.entries({machines:rawMachines,wiki:rawWiki,guides:rawGuides,updates:rawUpdates}).flatMap(([kind,items])=>(items as Entry[]).filter(e => (kind !== 'wiki' && kind !== 'machines') || e.isDetails === true).map(e=>({title:e.title,description:e.description,kind,href:kind==='updates'?`/updates#${e.slug}`:kind==='machines'?`/wiki/machines/${e.slug}`:kind==='wiki'&&e.slug==='achievements'?'/wiki/achievements':kind==='wiki'?`/wiki/${e.category}/${e.slug}`:`/${kind}/${e.slug}`,chunks:[e.description,e.tdk.title,...e.tdk.keywords,...(e.stats||[]).map(s=>`${s.label}: ${s.value}`),...e.sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.steps||[])]),...(e.tables||[]).flatMap(t=>t.rows.map(row=>`${t.title}: ${row.join(' · ')}`)),...(e.faqs||[]).map(f=>`${f.question} ${f.answer}`)]})));
const modHits=mods.entries.map(mod=>({title:mod.title,description:mod.description,kind:'mods',href:`/mods#${mod.slug}`,chunks:['Moon Sweepers mods',mod.description,mod.requirements,mod.compatibility,mod.author]}));
const all=[...entries,...modHits,{title:'Moon Sweepers Mods',description:'Browse community mods, loader requirements and co-op notes. Open each author’s page for downloads and installation instructions.',kind:'mods',href:'/mods',chunks:['moon sweepers mods mod loader BepInEx community plugins installation']},...index.filter(e=>e.kind==='tools').map(e=>({...e,chunks:[e.description]})),{title:'Moon Sweepers Interactive Map',description:'225 locations: flags, lunar sites and stations. Search coordinates and plan exploration.',kind:'map',href:'/map',chunks:['225 locations flags lunar sites stations map coordinates']}];
export function searchContent(query:string,limit=100):SearchHit[]{
 const terms=normalize(query.slice(0,200)).split(' ').filter(Boolean);if(!terms.length)return [];
 return all.map(e=>{const title=normalize(e.title),chunks=e.chunks.map(normalize),combined=title+' '+chunks.join(' ');if(!terms.every(term=>combined.includes(term)))return null;const matching=e.chunks.find((_,i)=>terms.every(term=>chunks[i].includes(term)))||e.description;return {hit:{title:e.title,description:matching.length>300?matching.slice(0,297)+'…':matching,kind:e.kind,href:e.href},score:terms.reduce((n,t)=>n+(title===t?30:title.includes(t)?10:1),0)+(normalize(matching).includes(normalize(query))?5:0)};}).filter((r):r is NonNullable<typeof r>=>Boolean(r)).sort((a,b)=>b.score-a.score||a.hit.title.localeCompare(b.hit.title)).slice(0,limit).map(r=>r.hit);
}
