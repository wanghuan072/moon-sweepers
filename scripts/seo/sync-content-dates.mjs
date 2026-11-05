import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
import {tdk} from '../../src/seo/tdk.js';
import {updateHistory,semanticCopy,fingerprint} from './route-history.mjs';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const files={machines:'machines/machines',guides:'guides/guides',wiki:'wiki/entries',updates:'updates/updates'};
const collections=Object.fromEntries(Object.entries(files).map(([kind,file])=>[kind,read(`src/data/${file}.json`)]));
const clean=value=>{if(Array.isArray(value))return value.map(clean);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!['updatedAt','publishedAt','reviewedAt','lengthNote'].includes(key)).map(([key,v])=>[key,clean(v)]));return value;};
// Extract visible copy and links, not imports, class names, CSS, comments or build timestamps.
const content=path=>semanticCopy(readFileSync(path,'utf8'));
const summary=(entries,dated=false)=>entries.map(entry=>{const {slug,title,description,image,imageAlt,category,stats,flows,role,cost,costUnit,isDetails,power,powerOutput,battery,range,storage,footprint,cycle,input}=entry;return {slug,title,description,image,imageAlt,category,stats,flows,role,cost,costUnit,isDetails,power,powerOutput,battery,range,storage,footprint,cycle,input,...(dated?{article:fingerprint([clean(entry),shared])}:{})};});
const input={};
const templates={machines:'machines/MachineDetailPage',guides:'guides/GuideDetailPage',wiki:'wiki/WikiEntryPage'};
const shared=['EntryDetail','EntryFacts','ProductionFlows','Cards'].map(name=>content(`src/components/content/${name}.tsx`));
shared.push(content('src/components/layout/PageHero.tsx'));
for(const [kind,entries] of Object.entries(collections).filter(([kind])=>kind!=='updates'))for(const entry of entries){if ((kind==='wiki'||kind==='machines') && entry.isDetails!==true) continue; const path=kind==='machines'?`/wiki/machines/${entry.slug}`:kind==='wiki'&&entry.slug==='achievements'?'/wiki/achievements':kind==='wiki'?`/wiki/${entry.category}/${entry.slug}`:`/${kind}/${entry.slug}`;input[path]={entry:clean(entry),template:content(`src/page/${templates[kind]}.tsx`),shared,schema:2};}
const top={'/':'home/HomePage','/wiki':'wiki/WikiPage','/wiki/machines':'machines/MachinesPage','/guides':'guides/GuidesPage','/map':'map/MapPage','/tools':'tools/ToolsPage','/updates':'updates/UpdatesPage'};
const categories=read('src/data/wiki/categories.json'),legal=read('src/data/legal/pages.json');
for(const [path,file] of Object.entries(top))input[path]={copy:content(`src/page/${file}.tsx`),tdk:tdk[path],data:path==='/'?{guides:summary(collections.guides.slice(0,6),true),machines:summary(collections.machines.slice(0,4)),categories:categories.map(({slug,title,icon})=>({slug,title,icon})),updates:summary([...collections.updates.filter(entry=>entry.version).slice(0,2),...collections.updates.filter(entry=>entry.category==='Roadmap').slice(0,1)]),navigation:readFileSync('src/config/navigation.ts','utf8').replace(/\r\n/g,'\n'),tools:read('src/data/tools/pages.json').map(({slug,title,icon})=>({slug,title,icon})),mods:read('src/data/mods/mods.json').entries.filter(mod=>['quickstart','moon-sweepers-qol','moon-skimmer'].includes(mod.slug)).map(({slug,title,icon})=>({slug,title,icon}))}:path==='/wiki'?{categories,counts:categories.map(c=>collections.wiki.filter(e=>e.category===c.slug).length),wiki:summary(collections.wiki.filter(e=>['save-backups','languages-and-platforms','controls','collector-and-stations','regions','day-and-night','buildings','flags','lunar-sites','market-contracts','big-hopper','suction-control','moon-sand','moon-stone'].includes(e.slug)))}:path==='/map'?{directory:read('src/data/wiki/exploration-directory.json').flags,sites:read('src/data/wiki/lunar-sites.json'),interaction:content('src/page/map/InteractiveMap.tsx')}:path==='/tools'?read('src/data/tools/pages.json'):path==='/wiki/machines'?summary(collections.machines):path==='/updates'?collections.updates.map(clean):summary(collections[path.slice(1)]||[],path==='/guides'),schema:2};
input['/mods']={copy:content('src/page/mods/ModsPage.tsx'),tdk:tdk['/mods'],catalog:read('src/data/mods/mods.json'),schema:2};
input['/where-to-play']={copy:content('src/page/where-to-play/WhereToPlayPage.tsx'),tdk:tdk['/where-to-play'],schema:2};
for(const category of categories){const path=`/wiki/${category.slug}`;input[path]={category,tdk:tdk[path],entries:summary(collections.wiki.filter(e=>e.category===category.slug&&e.slug!=='achievements')),overview:read('src/data/wiki/category-overviews.json')[category.slug],copy:content('src/page/wiki/WikiCategoryPage.tsx'),schema:2};}
for(const page of read('src/data/tools/pages.json')){const slug=page.slug,path=`/tools/${slug}`;const names={'selling-and-income':['SellingAndIncome','IncomeCalculator','ToolControls'],'income-calculator':['IncomeCalculator','ToolControls'],'upgrade-matrix':['UpgradeMatrix','UpgradeTree','UpgradeCalculator','ToolControls'],'upgrade-calculator':['UpgradeCalculator','ToolControls']}[slug];input[path]={tdk:tdk[path],page,copy:content('src/page/tools/ToolDetailPage.tsx'),ui:names.map(name=>content(`src/page/tools/components/${name}.tsx`)),formulas:readFileSync('src/lib/tools/calculators.ts','utf8').replace(/\r\n/g,'\n'),data:slug.includes('upgrade')?read('src/data/tools/upgrade-catalog.json'):read('src/data/tools/cleaning-tools.json'),schema:2};}
for(const [slug,page] of Object.entries(legal)){const path=`/legal/${slug}`;input[path]={page,tdk:tdk[path],copy:content('src/page/legal/LegalPage.tsx'),schema:2};}
const rendered={
 '/':['Cards'], '/wiki/machines':['EntryBrowser','Cards','EntryFacts'],
 '/guides':['EntryBrowser','Cards'],
 '/updates':['EntryFacts'],
};
for(const [path,names] of Object.entries(rendered))input[path].components=names.map(name=>content(`src/components/content/${name}.tsx`));
for(const category of categories)input[`/wiki/${category.slug}`].components=['WikiBrowser','VehicleCards','EntryFacts'].map(name=>content(`src/components/content/${name}.tsx`));
if (input['/wiki/achievements']) input['/wiki/achievements'].browser=content('src/components/content/AchievementBrowser.tsx');
for(const value of Object.values(input))value.hero=content('src/components/layout/PageHero.tsx');
const schemaFiles=['src/seo/PageSchema.tsx','src/seo/metadata.ts','src/seo/JsonLd.tsx'];
const schemaCode=schemaFiles.map(path=>{const scanner=ts.createScanner(ts.ScriptTarget.Latest,true,ts.LanguageVariant.Standard,readFileSync(path,'utf8'));const tokens=[];for(let token=scanner.scan();token!==ts.SyntaxKind.EndOfFileToken;token=scanner.scan())tokens.push(scanner.getTokenText());return tokens;});
for(const value of Object.values(input))value.schemaCode=schemaCode;
const historyPath='src/data/seo/page-history.json',previous=Object.fromEntries(Object.entries(read(historyPath)).map(([path,value])=>[path.startsWith('/machines')?'/wiki'+path:path==='/wiki/mechanics/achievements'?'/wiki/achievements':path,value])),day=new Date().toISOString().slice(0,10);
const next=updateHistory(clean(input),previous,day);writeFileSync(historyPath,JSON.stringify(next,null,2)+'\n');
console.log(`Page history: ${Object.keys(next).length} URLs, ${Object.entries(next).filter(([p,e])=>e.hash!==previous[p]?.hash).length} changed.`);
