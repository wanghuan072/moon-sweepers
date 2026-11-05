import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { processingValue } from '../src/lib/tools/calculators.ts';
const read = file => JSON.parse(readFileSync(new URL(`../src/data/${file}.json`, import.meta.url), 'utf8'));
const machines = read('machines/machines');
const presets = read('tools/production-presets');

test('equipment copy keeps transport roles distinct and related destinations unique',()=>{
  const wiki=read('wiki/entries');
  const van=wiki.find(entry=>entry.slug==='crew-transport');
  const route=van.sections.find(section=>section.heading==='Plan a complete delivery route');
  assert.ok(route.paragraphs.some(text=>text.includes('no dust hopper')));
  assert.ok(!route.paragraphs.some(text=>text.includes('unload cleaning-vehicle dust')));
  for(const entry of [...wiki,...machines]){
    const links=entry.relatedLinks || [];
    assert.equal(links.length,new Set(links.map(link=>link.href)).size,entry.slug);
  }
  for(const container of wiki.filter(entry=>entry.category==='containers')){
    assert.ok(container.relatedLinks.some(link=>link.href===`/wiki/cleaning-tools/${container.slug.replace(/-container$/,'')}`));
  }
});

test('mods are a single list route with author links and requirements, not detail pages',()=>{
  const mods=read('mods/mods');
  const history=read('seo/page-history');
  const index=read('search/search-index').filter(entry=>entry.kind==='mods');
  assert.ok(history['/mods']);
  assert.ok(!Object.keys(history).some(path=>path.startsWith('/mods/')));
  assert.equal(new Set(mods.entries.map(mod=>mod.slug)).size,mods.entries.length);
  assert.equal(index.length,mods.entries.length);
  for(const mod of mods.entries){
    assert.ok(mod.author && mod.requirements && mod.compatibility);
    assert.match(mod.url,/^https:\/\/www\.nexusmods\.com\/moonsweepers\/mods\/\d+$/);
    assert.ok(index.some(hit=>hit.href===`/mods#${mod.slug}`));
  }
});

test('update archive replaces detail routes with list anchors and preserves announcement content',()=>{
  const updates=read('updates/updates');
  const history=read('seo/page-history');
  const index=read('search/search-index').filter(entry=>entry.kind==='updates');
  assert.ok(history['/updates']);
  assert.ok(!Object.keys(history).some(path=>path.startsWith('/updates/')));
  assert.ok(!existsSync(new URL('../src/app/updates/[slug]/page.tsx',import.meta.url)));
  assert.equal(index.length,updates.length);
  for(const entry of updates){
    assert.ok(entry.announcedAt && entry.sources.length && entry.sections.length);
    assert.ok(index.some(hit=>hit.href===`/updates#${entry.slug}`));
    assert.equal(Boolean(entry.version),entry.category==='Patch notes');
  }
});
test('community recipes conserve material mass and carry their sources', () => {
  for (const m of machines.filter(m => m.recipe)) {
    assert.equal(m.recipe.inputs.reduce((n, i) => n + i.amount, 0), m.recipe.outputKg);
    assert.ok(m.sources.length); assert.equal(m.status, 'community');
    assert.ok(m.power > 0 && m.cycle > 0);
  }
});
test('published presets distinguish gross output sales from processing value added', () => {
  for (const [slug, output, gross, valueAdded] of [['pressure-chamber', 25, 75, 50], ['stone-press', 20, 140, 100]]) {
    const p = presets.find(p => p.slug === slug);
    const result = processingValue(p.cycleSeconds,p.outputPerCycle,p.unitPrice,p.inputOpportunityValue);
    assert.ok(result); assert.equal(result.unitsPerMinute, output); assert.equal(result.grossPerMinute, gross); assert.equal(result.addedPerMinute, valueAdded);
  }
});
test('unit-based pricing and nonapplicable power do not become false fixed-price or zero-power stats', () => {
  assert.equal(machines.find(m => m.slug === 'conveyor-belt').costUnit, 'metre');
  assert.equal(machines.find(m => m.slug === 'conveyor-belt').cost, .5);
  for (const m of machines.filter(m => m.powerMode === 'not-listed')) assert.equal(m.power, null);
  const tracker = machines.find(m => m.slug === 'solar-tracker');
  assert.equal(tracker.powerOutput, 16); assert.equal(tracker.battery, 10);
});
test('every published machine has a local labeled diagram and search results reach the new records', () => {
  const index = read('search/search-index');
  assert.ok(!index.some(item=>item.href==='/automation'||item.href.startsWith('/automation/')));
  assert.ok(!existsSync(new URL('../src/data/automation/setups.json',import.meta.url)));
  for (const m of machines) {
    assert.ok(existsSync(new URL(`../public${m.image}`, import.meta.url)));
    assert.equal(m.imageKind, 'diagram');
    assert.ok(index.some(item => item.href === `/wiki/machines/${m.slug}`));
  }
  for (const path of ['/wiki/cleaning-tools/extra-wide-broom', '/wiki/vehicles/mega-vacuum-rover', '/wiki/containers/extra-wide-broom-container', '/guides/automation-guide']) assert.ok(index.some(item => item.href === path), path);
});
test('wiki categories retain equipment and map data after removing old sections',()=>{
 const wiki=read('wiki/entries'),categories=read('wiki/categories'),overview=read('wiki/category-overviews');
 assert.equal(categories[0].slug,'vehicles');
 assert.equal(machines.length,11);
 for(const [category,count] of [['joonas-robots',3],['containers',6],['suit-gear',5],['cleaning-tools',6]])assert.equal(wiki.filter(e=>e.category===category).length,count);
 assert.ok(!wiki.some(e=>['items','materials','upgrades','mechanics','tools'].includes(e.category)));
 assert.equal(overview.buildings.tables.reduce((n,t)=>n+t.rows.length,0),98);
 assert.equal(read('wiki/lunar-sites').length,26);
 for(const e of wiki.filter(e=>e.category==='vehicles'&&e.stats?.some(s=>s.label==='Base purchase'))){
  assert.ok(e.sections.some(s=>s.heading==='Vehicle Upgrades'));
  assert.ok(e.sections.some(s=>s.heading==='Vehicle Tricks'));
 }
});
test('four consolidated guides own their routes and legacy redirects reach real sections',()=>{
 const guides=read('guides/guides'),routes=read('guides/route-migrations'),index=read('search/search-index');
 const slugs=['beginners-guide','how-to-use-packager','automation-guide','save-recovery-guide'];
 assert.deepEqual(guides.map(e=>e.slug),slugs);
 assert.equal(index.filter(e=>e.kind==='guides').length,4);
 const anchor=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const [old,target] of Object.entries(routes)){
  assert.ok(!index.some(e=>e.href===old));
  if(!target?.startsWith('/guides/'))continue;
  const [path,hash]=target.split('#'),entry=guides.find(e=>path===`/guides/${e.slug}`);
  assert.ok(entry,target);if(hash)assert.ok(entry.sections.some(s=>anchor(s.heading)===hash),target);
 }
 for(const entry of guides){
  assert.ok(entry.sections.length>=5);
  assert.ok(!entry.relatedLinks.some(link=>link.href===`/guides/${entry.slug}`));
  for(const table of entry.tables)assert.equal(new Set(table.rows.map(row=>JSON.stringify(row))).size,table.rows.length);
 }
});
test('achievement checklist has 33 unique unlocks with the documented group counts',()=>{
  const entry=read('wiki/entries').find(item=>item.slug==='achievements');
  const rows=entry.tables[0].rows;
  assert.equal(rows.length,33);
  assert.equal(new Set(rows.map(row=>row[0])).size,33);
  assert.equal(rows.filter(row=>row[2]==='One-off').length,7);
  assert.equal(rows.filter(row=>row[2]==='Moon cleaned').length,4);
  assert.equal(rows.filter(row=>row[2]!=='One-off'&&row[2]!=='Moon cleaned').length,22);
  assert.equal(rows.filter(row=>row[3]==='Hidden').length,1);
  assert.ok(entry.sources.includes('https://wikily.gg/moon-sweepers/achievements'));
  const index=read('search/search-index');
  assert.ok(index.some(item=>item.href==='/wiki/achievements'));
  assert.ok(!index.some(item=>item.href.startsWith('/machines/')));
});
