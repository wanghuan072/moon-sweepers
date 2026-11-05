import {readFileSync,readdirSync,statSync} from 'node:fs';
import {tdk} from '../../src/seo/tdk.js';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const history=read('src/data/seo/page-history.json');
const errors=[];
const decode=text=>text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code)));
const entries=Object.entries({machines:'machines/machines',guides:'guides/guides',wiki:'wiki/entries'}).flatMap(([kind,file])=>read(`src/data/${file}.json`).filter(entry=>kind==="guides" || entry.isDetails===true).map(entry=>({path:kind==='machines'?`/wiki/machines/${entry.slug}`:kind==='wiki'&&entry.slug==='achievements'?'/wiki/achievements':kind==='wiki'?`/wiki/${entry.category}/${entry.slug}`:`/${kind}/${entry.slug}`,entry})));
const all=[...Object.entries(tdk).map(([path,copy])=>({path,copy})),...entries.map(({path,entry})=>({path,copy:entry.tdk}))];
const titles=new Set(),descriptions=new Set();
for(const {path,copy} of all){
 if(!copy){errors.push(`${path}: no TDK`);continue;}
 if(titles.has(copy.title)||descriptions.has(copy.description))errors.push(`${path}: repeated TDK`);
 titles.add(copy.title);descriptions.add(copy.description);
 if(!copy.title.includes('Moon Sweepers')||!copy.description.toLowerCase().includes(path.startsWith('/legal/')?'moon-sweepers.org':'moon sweepers'))errors.push(`${path}: topic missing from TDK`);
 if((copy.title.length<40||copy.title.length>60||copy.description.length<140||copy.description.length>160)&&!copy.lengthNote)errors.push(`${path}: TDK outside target without editorial reason`);
 if(path!=='/search'&&!history[path])errors.push(`${path}: missing date record`);
}
const expected=new Set(all.filter(item=>item.path!=='/search').map(item=>item.path));
const built=Object.keys(read('.next/prerender-manifest.json').routes).filter(path=>!path.startsWith('/_')&&!path.endsWith('.xml')&&!path.endsWith('.txt'));
for(const path of built)if(!expected.has(path))errors.push(`Built page absent from SEO inventory: ${path}`);
for(const path of Object.keys(history))if(!expected.has(path))errors.push(`Unexpected sitemap route ${path}`);
for(const {path,entry} of entries){
 if(!entry.sources?.length)errors.push(`${path}: missing provenance`);
 if(entry.heading||entry.seoTitle)errors.push(`${path}: legacy copy conflicts with TDK`);
 if(!entry.sections.length)errors.push(`${path}: no content`);
 if(entry.sections.some(section=>section.heading==='A setup decision to test'))errors.push(`${path}: generic placeholder section`);
}
const xml=readFileSync('.next/server/app/sitemap.xml.body','utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
const sitemapDates=new Map([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match=>[match[1].match(/<loc>(.*?)<\/loc>/)?.[1],match[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1]]));
if(new Set(urls).size!==urls.length||urls.length!==expected.size)errors.push('Sitemap coverage or duplicate error');
for(const path of expected)if(!urls.includes(`https://moon-sweepers.org${path}`))errors.push(`Sitemap missing ${path}`);
for(const path of expected){
 const html=readFileSync(`.next/server/app${path==='/'?'/index':path}.html`,'utf8');
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 if(!canonical||new URL(canonical).origin!=='https://moon-sweepers.org')errors.push(`${path}: wrong canonical host`);
 if(!html.includes('https://moon-sweepers.org/images/og-image.png'))errors.push(`${path}: missing OG asset`);
 if(html.includes('noindex'))errors.push(`${path}: unexpectedly excluded from indexing`);
 const copy=all.find(item=>item.path===path).copy;
 const actualTitle=decode(html.match(/<title>(.*?)<\/title>/)?.[1]||'');
 const actualDescription=decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'');
 if(actualTitle!==copy.title||actualDescription!==copy.description)errors.push(`${path}: rendered TDK differs from content`);
 if(new URL(canonical||'https://invalid.example').pathname!==path)errors.push(`${path}: canonical path mismatch`);
 for(const [name,value] of [['og:url',canonical],['og:title',copy.title],['og:description',copy.description]]){
  const actual=decode(html.match(new RegExp(`<meta property="${name}" content="([^"]*)"`))?.[1]||'');
  if(actual!==value)errors.push(`${path}: ${name} differs from canonical or TDK`);
 }
 const sitemapDate=sitemapDates.get(`https://moon-sweepers.org${path}`);
 if(!sitemapDate||!sitemapDate.startsWith(history[path]?.modifiedAt||'invalid'))errors.push(`${path}: sitemap date differs from content history`);
 const sourceEntry=entries.find(item=>item.path===path)?.entry;
 const category=path.startsWith('/wiki/')?read('src/data/wiki/categories.json').find(item=>`/wiki/${item.slug}`===path):null;
 const expectedH1=sourceEntry?.title||category?.heroTitle;
 const heading=decode((html.match(/<h1\b[^>]*>(.*?)<\/h1>/)?.[1]||'').replace(/<[^>]*>/g,''));
 if(expectedH1&&heading!==expectedH1)errors.push(`${path}: H1 differs from content name`);
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)){
  const schema=JSON.parse(match[1]);
  if(schema.mainEntityOfPage&&schema.mainEntityOfPage!==canonical)errors.push(`${path}: article schema URL differs from canonical`);
  if(['Article','TechArticle'].includes(schema['@type'])&&schema.headline!==heading)errors.push(`${path}: article headline differs from H1`);
 }
}
const walk=dir=>readdirSync(dir).flatMap(name=>{const path=`${dir}/${name}`;return statSync(path).isDirectory()?walk(path):[path];});
for(const path of walk('src/style').filter(path=>path.endsWith('.css'))){
 const css=readFileSync(path,'utf8');
 for(const match of css.matchAll(/@media[^{}]*?(?:min|max)-width\s*:\s*(\d+)px/g))if(!['768','1024'].includes(match[1]))errors.push(`${path}: unexpected width breakpoint ${match[1]}`);
}
console.log(JSON.stringify({metadataPages:all.length,indexableUrls:expected.size,details:entries.length,errors},null,2));
if(errors.length)process.exitCode=1;
