import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const read = p => readFileSync(p, 'utf8');
const manifest = JSON.parse(read('.next/prerender-manifest.json'));
const normal = Object.keys(manifest.routes).filter(p => !p.startsWith('/_') && !p.endsWith('.xml') && !p.endsWith('.txt'));
const routes = new Set([...normal, '/search', '/robots.txt', '/sitemap.xml']);
const errors = [];
let links = 0, images = 0, schemas = 0;
const titles = new Map();
const descriptions = new Map();
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code)));
const documents=new Map(normal.map(path=>[path,read(`.next/server/app${path==='/'?'/index':path}.html`)]));
const ids=new Map([...documents].map(([path,html])=>[path,new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>decode(match[1])))]));
const checkLink=(from,href)=>{
  const url=new URL(href,`https://moon-sweepers.org${from}`);
  if(url.origin!=='https://moon-sweepers.org')return;
  const target=url.pathname;
  if(!routes.has(target)&&!existsSync(`public${target}`))errors.push(`${from}: broken internal link ${href}`);
  if(url.hash&&ids.has(target)&&!ids.get(target).has(decodeURIComponent(url.hash.slice(1))))errors.push(`${from}: missing target anchor ${href}`);
};
for (const path of normal) {
  const file = `.next/server/app${path === '/' ? '/index' : path}.html`;
  if (!existsSync(file)) { errors.push(`Missing prerendered HTML: ${path}`); continue; }
  const html = read(file);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${path}: expected one H1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title) errors.push(`${path}: missing title`);
  if (!description) errors.push(`${path}: missing description`);
  if (titles.has(title)) errors.push(`Duplicate title: ${path} and ${titles.get(title)}`);
  if (descriptions.has(description)) errors.push(`Duplicate description: ${path} and ${descriptions.get(description)}`);
  titles.set(title, path); descriptions.set(description, path);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical || new URL(decode(canonical)).pathname !== path) errors.push(`${path}: invalid canonical`);
  if (!html.includes('property="og:title"') || !html.includes('name="twitter:card"')) errors.push(`${path}: missing social metadata`);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = decode(match[1]); links++;
    if(href.startsWith('#')||href.startsWith('/')||href.startsWith('https://moon-sweepers.org'))checkLink(path,href);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    const tag = match[0]; const src = decode(tag.match(/src="([^"]+)"/)?.[1] || '');
    if (!tag.match(/alt="[^"]+"/)) errors.push(`${path}: missing useful alt`);
    const resource = src.startsWith('/_next/image?') ? new URL(src, 'https://local.example').searchParams.get('url') : src;
    if (resource?.startsWith('/') && !existsSync(`public${resource}`)) errors.push(`${path}: missing image ${resource}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
    try { const schema = JSON.parse(match[1]); if (!schema['@type']) throw new Error(); schemas++; } catch { errors.push(`${path}: invalid JSON-LD`); }
  }
}
const drafts = new Set([
  ...JSON.parse(read('src/data/wiki/entries.json')).filter(entry=>entry.isDetails!==true).map(entry=>entry.slug==='achievements'?'/wiki/achievements':`/wiki/${entry.category}/${entry.slug}`),
  ...JSON.parse(read('src/data/machines/machines.json')).filter(entry=>entry.isDetails!==true).map(entry=>`/wiki/machines/${entry.slug}`),
]);
for(const hit of JSON.parse(read('src/data/search/search-index.json')))if(!drafts.has(hit.href))checkLink('/search',hit.href);
for(const match of read('README.md').matchAll(/\]\((https:\/\/moon-sweepers\.org[^)\s]*)\)/g))checkLink('/README.md',match[1]);
const redirects=JSON.parse(read('.next/routes-manifest.json')).redirects;
for(const redirect of redirects)if(!redirect.destination.includes(':')&&redirect.destination.startsWith('/'))checkLink(redirect.source,redirect.destination);
for (const [path, data] of Object.entries(manifest.dynamicRoutes)) if (data.fallback !== false) errors.push(`${path}: unknown slugs must have no fallback`);
if (manifest.routes['/_not-found']?.initialStatus !== 404) errors.push('Missing real 404 status in prerender manifest');
function walk(dir) { return readdirSync(dir).flatMap(name => { const p = join(dir, name); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
for (const file of walk('src').filter(p => p.endsWith('.tsx'))) {
  const text = read(file);
  const cssFile = text.match(/import s from ['"]@\/([^'"]+\.module\.css)['"]/)?.[1];
  if (cssFile) {
    const css = read(`src/${cssFile}`);
    for (const name of new Set([...text.matchAll(/\bs\.([A-Za-z]\w*)/g)].map(m => m[1]))) if (!css.includes(`.${name}`)) errors.push(`${file}: missing CSS class ${name}`);
  }
  if (/from ['"]next\/link/.test(text)) errors.push(`${file}: client-side navigation violates document-navigation rule`);
}
for (const file of walk('src/data')) {
  if (!file.endsWith('.json')) errors.push(`${file}: data directory must contain JSON only`);
  else JSON.parse(read(file));
}
const total = { prerenderedContentPages: normal.length, internalAndExternalLinksChecked: links, imageInstancesChecked: images, jsonLdBlocksChecked: schemas, errors: errors.length };
console.log(JSON.stringify(total, null, 2));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Static build audit passed. Live browser navigation, hydration and visual layout were not tested.');
