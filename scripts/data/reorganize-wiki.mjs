import {readFileSync} from 'node:fs';
export function reorganizeWiki({save,machines,guides,updates}){
 const read=p=>JSON.parse(readFileSync(`src/data/${p}.json`,'utf8'));
 const all=read('wiki/entries'),oldOverview=read('wiki/category-overviews');
 const vehicles=['push-sweeper','ride-on-sweeper','crew-transport','lunar-sweeper','mega-vacuum-rover'];
 const gear=['tool-belt','forward-jetpack','gravity-boots','helmet-lamp','night-vision'];
 const upgrades=['tuned-motors','big-hopper','turbo-kit','cruise-control','suction-control','quick-release','floodlights'];
 const categories=[
 ['vehicles','Vehicles','Compare five garage vehicles, every vehicle upgrade and the tricks that earn your crew money.','truck'],
 ['cleaning-tools','Cleaning Tools','Choose between six cleaning tools by price, width, stroke time and dust capacity.','brush'],
 ['containers','Containers','Check all six tool containers, three upgrade levels, capacities and purchase prices.','box'],
 ['suit-gear','Suit Gear','Compare Tool Belt, Forward Jetpack, Gravity Boots, Helmet Lamp and Night Vision Goggles.','upgrade'],
 ['joonas-robots','J.O.O.N.A.S. Robots','Compare both docked robot vacuums and J.O.O.N.A.S. by price, cleaning area and storage.','gear'],
 ['buildings','Buildings','Browse all 98 build-menu pieces, structure prices, finishes, placement and refund rules.','layers']
 ].map(([slug,title,description,icon])=>({slug,title,description,icon}));
 const routes={},kept=[],buildings=all.find(e=>e.slug==='buildings');
 for(const e of all){const old=`/wiki/${e.category}/${e.slug}`;let category;
 if(e.slug==='achievements')category='achievements';
 else if(e.category==='tools'&&e.slug!=='building-tool')category='cleaning-tools';
 else if(e.slug==='building-tool')category='buildings';
 else if(e.slug.endsWith('-container'))category='containers';
 else if(gear.includes(e.slug))category='suit-gear';
 else if(vehicles.includes(e.slug)||upgrades.includes(e.slug)||e.slug==='vehicle-tricks')category='vehicles';
 if(!category){routes[old]=e.slug==='buildings'?'/wiki/buildings':null;continue;}
 e.category=category;routes[old]=e.slug==='achievements'?'/wiki/achievements':`/wiki/${category}/${e.slug}`;kept.push(e);
 }
 const robots=machines.filter(e=>e.category==='Robots');
 for(const e of robots){routes[`/wiki/machines/${e.slug}`]=`/wiki/joonas-robots/${e.slug}`;kept.push({...e,category:'joonas-robots'});}
 machines.splice(0,machines.length,...machines.filter(e=>e.category!=='Robots'));
 const tricks=kept.find(e=>e.slug==='vehicle-tricks');
 for(const e of kept.filter(e=>vehicles.includes(e.slug))){
 e.sections=e.sections.filter(s=>s.heading!=='How vehicle upgrades apply');
 e.sections.push({heading:'Vehicle Upgrades',paragraphs:['Buy upgrades at a garage using crew funds. Only the owner can upgrade a vehicle, and every level is a separate purchase. Motors, boost, hopper capacity and unloading solve different parts of a delivery route; compare the levels before spending.']},{heading:'Vehicle Tricks',paragraphs:['A clean landing pays for flips, rolls, spins and airtime, up to $25. A wipeout pays nothing. Pick open ground away from factory equipment before attempting a jump.']});
 const upgrade=e.tables?.find(t=>t.title==='Every vehicle upgrade level');if(upgrade)upgrade.title='Vehicle Upgrades: Prices, Effects and Results';
 e.tables=[...(e.tables||[]),{...structuredClone(tricks.tables[0]),title:'Vehicle Tricks: Landing Rewards'}];
 e.sources=[...new Set([...e.sources,'https://wikily.gg/moon-sweepers/vehicle-upgrades','https://wikily.gg/moon-sweepers/vehicle-tricks'])];
 e.relatedLinks=[{title:'Compare garage vehicles',href:'/wiki/vehicles'},{title:'Vehicle tricks and combo pay',href:'/wiki/vehicles/vehicle-tricks'}];
 }
 const overview={
 'cleaning-tools':oldOverview.tools,vehicles:oldOverview.vehicles,
 containers:{tables:[{title:'Container Capacity by Upgrade Level',columns:['Container','Base','Level I','Level II','Level III'],rows:[['Toothbrush','0.5 kg','1 kg','2 kg','4 kg'],['Nail Brush','0.75 kg','1.5 kg','3 kg','6 kg'],['Hand Brush','1 kg','2 kg','4 kg','8 kg'],['Household Broom','3 kg','6 kg','12 kg','24 kg'],['Wide Broom','6 kg','12 kg','24 kg','48 kg'],['Extra Wide Broom','12 kg','24 kg','48 kg','96 kg']],note:'Capacities before Dust Compactor modifiers.',source:'https://wikily.gg/moon-sweepers/containers'},{title:'Container Upgrade Prices',columns:['Container','Level I','Level II','Level III','Total'],rows:[['Toothbrush','$5','$10','$20','$35'],['Nail Brush','$8','$15','$30','$53'],['Hand Brush','$10','$20','$40','$70'],['Household Broom','$30','$60','$120','$210'],['Wide Broom','$60','$120','$240','$420'],['Extra Wide Broom','$120','$240','$480','$840']],note:'Each level is a separate purchase. Supplier Network I and II reduce prices by 5% and 10%.',source:'https://wikily.gg/moon-sweepers/containers'}]},
 'suit-gear':{tables:kept.filter(e=>gear.includes(e.slug)).flatMap(e=>(e.tables||[]).map(t=>({...t,title:`${e.title}: Every Level`})))},
 'joonas-robots':{tables:[{title:'Compare J.O.O.N.A.S. and Robot Vacuums',columns:['Robot','Price','Work area','Bin','Dock storage'],rows:robots.map(e=>[e.title,`$${e.cost.toLocaleString('en-US')}`,e.stats?.find(s=>s.label==='Working area')?.value||'See details',e.stats?.find(s=>s.label==='Robot bin')?.value||'See details',e.storage?`${e.storage} kg`:'Uses catchers']),source:'https://wikily.gg/moon-sweepers/joonas-robots'}]},
 buildings:{tables:[{title:'Machines and Robots in the Build Menu',columns:['Equipment','Price','Section'],rows:[...machines,...robots].map(e=>[e.title,`$${e.cost}${e.costUnit==='metre'?' / m':''}`,e.category]),source:'https://wikily.gg/moon-sweepers/buildings'},...buildings.tables]}
 };
 const fallback=p=>/flags|lunar-sites|regions|waypoint/.test(p)?'/map':p.includes('save')?'/guides/save-recovery-guide':p.includes('multiplayer')?'/guides/multiplayer-guide':/selling|dust|market/.test(p)?'/guides/how-to-make-money-fast':'/guides/beginners-guide';
 const categoryLinks={'/wiki/tools':'/wiki/cleaning-tools','/wiki/upgrades':'/wiki/suit-gear','/wiki/items':'/wiki/containers','/wiki/materials':'/guides/how-to-make-money-fast','/wiki/mechanics':'/guides'};
 const migrate=v=>typeof v==='string'&&v.startsWith('/wiki/')?(categoryLinks[v]||routes[v]||((v in routes)?fallback(v):v)):Array.isArray(v)?v.map(migrate):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k,x])=>k!=='rowLinks'||!x.some(link=>routes[link]===null)).map(([k,x])=>[k,migrate(k==='relatedLinks'?x.filter(link=>routes[link.href]!==null):x)])):v;
 for(const [file,data] of [['wiki/entries',kept],['machines/machines',machines],['wiki/category-overviews',overview],['guides/guides',guides],['updates/updates',updates]])save(`src/data/${file}.json`,migrate(data));
 for(const target of [guides,updates])target.splice(0,target.length,...migrate(target));
 save('src/data/wiki/categories.json',categories);save('src/data/wiki/route-migrations.json',routes);
}
