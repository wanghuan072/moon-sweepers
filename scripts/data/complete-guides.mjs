import {readFileSync} from 'node:fs';
const base='https://wikily.gg/moon-sweepers/';
export function completeGuides({machines,guides,save,section,entry}) {
  const wiki=JSON.parse(readFileSync('src/data/wiki/entries.json','utf8'));
  const table=(title,columns,rows,source,note)=>({title,columns,rows,source,note});
  const definitions={
    'beginners-guide':[
      ['Learn one complete loop','Start with the free Toothbrush: 0.5 kg capacity and a 0.12 m sweep. Clean near North Station, carry dust to the deposit intake and press its launch button. Watch the shared balance before spending.',['Sweep until the container fills.','Return to the station and complete the deposit.','Use G to inspect the region boundary and remaining dust.','Finish a region for its $10 base completion reward.']],
      ['First purchases with prices','A Household Broom costs $25 and carries 3 kg. Its first container costs $30 and doubles that to 6 kg. A Building Tool costs $50. These are separate purchases: broom plus first container plus Building Tool totals $105 before discounts.'],
      ['Choose manual or automatic feed','A $100 Packager accepts hand-tool dust. A $250 Mk I robot instead cleans 19 hexes around its dock. Both need a useful outgoing belt. Ten metres of conveyor costs $5, so a Packager route costs $155 including a new Building Tool, or a Mk I route $305.'],
      ['Avoid the first production trap','A Pressure Chamber costs $500 but also needs 10 kW of nearby solar generation. A $300 Tracker supplies up to 16 kW in full sun. Build a working raw-dust selling route before converting materials.'],
    ],
    'best-early-upgrades':[
      ['Diagnose the interruption','If the container fills constantly, compare a larger broom and container. If walking dominates, consider a closer selling route. If manual deposits dominate, Rapid Transfer reduces deposit time. These solve different interruptions.'],
      ['A priced comparison','Household Broom costs $25, its first container $30, Wide Broom $75, and Rapid Transfer I $30. Market Contracts I costs $120 and adds 6% launch payout. The latter increases sale value, not cleaning speed.'],
      ['Understand shared purchases','The crew shares matrix, container and suit levels. Tools remain individually owned. Supplier Network I / II costs $250 / $700 and discounts tools and containers 5% / 10%; it is not a discount on every shop purchase.'],
      ['Do not confuse the two packers','The $100 Packager is a building that accepts dust and feeds a belt. The $2,000 Auto-Packer is a matrix upgrade requiring Dust Compactor II; it drops packed dust at the player’s feet.'],
    ],
    'how-to-make-money-fast':[
      ['Earn from the stage you can sustain','Base material values are $1/kg dust, $3/kg sand and $7/kg stone. Regions, flags, sites and tricks are separate income streams. Flags pay $100 and lunar sites $250; collecting them can fund an early purchase without a powered factory.'],
      ['Processing has an input cost','A chamber makes 25 kg sand/min at full power: $75 gross output, less $25 alternative raw-dust sales, giving $50/min processing value added. One press makes 20 kg stone/min: $140 gross, less $40 of dust and sand value, giving $100/min value added.'],
      ['Spend against the whole route','Stone production requires fresh dust as well as sand. A larger processor does not solve missing feed, a full catcher or a dark battery. Use the recipe table and the actual belt queue to decide which stage to expand.'],
      ['Apply income upgrades correctly','Contracts I / II / III add 6% / 12% / 18% launch payout. Lunar Exchange adds 10 percentage points, reaching 1.28× at maximum. These modify material sales and do not multiply kilograms, recipe speed or trick rewards.'],
    ],
    'automation-guide':[
      ['Start with a raw-dust route','Use a Packager for manual dust or a local robot dock for automatic collection. Build the output connection first, follow the arrows and terminate at a collector intake. Belts cost $0.50/m and each segment spans 0.75–30 m.'],
      ['Commission each stage','Use a small batch before adding the next component.',['Confirm dust leaves the source.','Confirm capsules move in the intended direction.','Confirm the collector pays on arrival.','Add one powered processor with full input and clear output.','Observe the route through sunset before expanding.']],
      ['Build a real production ratio','One chamber produces 25 kg sand/min and one press consumes 10 kg sand/min plus 10 kg fresh dust. Two chambers feed five presses at the recipe level. Their full nominal load is 110 kW, and the raw dust demand is 100 kg/min.'],
      ['Respect transport and power limits','A single belt carries an ideal 88 capsules/min. With 1 kg capsules, it cannot supply a 100 kg/min factory. A Tracker’s 16 kW is peak generation; solar angle, charging and battery energy determine sustained night operation.'],
    ],
    'machine-troubleshooting':[
      ['Trace the first stalled stage','Start at the collector and walk upstream. A full final intake route blocks outputs, which can block processors and then collection. Check direction and actual port attachment before deleting equipment.'],
      ['Processor idle','A chamber needs dust and power; a press needs both dust and sand. The chamber starts at 5 kg, or after three seconds with a partial load. Both processors stop below 8% of nominal power.',['Check the required input material at each port.','Confirm panels are in wireless range.','Check sunset and remaining battery charge.','Clear a blocked output before adding another source.']],
      ['Robot or garage idle','Vacuum robots return at 98% bin fill. Their docks store 100 / 300 kg and must drain by belt. Garage storage is 6,000 kg; 600 kg/s unloading can fill it faster than downstream belts clear it. J.O.O.N.A.S. requires a catcher and uses its receiver groups.'],
      ['Large-world packing stops','Patch 1.0.5 raises the capsule limit to 90,000 across the world. Packing pauses at that limit until material is delivered or emptied. Update all crew members: earlier patches also fixed multiplayer splitters, merger alternation and stuck packing.'],
    ],
    'multiplayer-guide':[
      ['Choose the host and privacy','The host’s save contains the Moon. Choose Friends only, Invite only or Public and invite through Steam. Up to 16 players includes the host. Everyone must use the same game version; the session ends when the host leaves.'],
      ['Plan shared and personal purchases','The wallet, matrix, containers, suit gear, waypoints and clock are shared. Tools and vehicles belong to individual players. Only a vehicle’s owner purchases its upgrades, using shared money.'],
      ['Divide work without starving the factory','Assign collection areas and leave delivery paths open. Local robots clear their dock regions; J.O.O.N.A.S. chooses dusty sectors across the Moon. A shared processing line still needs fresh dust on the press branch.'],
      ['Moderate and preserve the world','Pause → Your Crew provides kick, ban and unban. Kick permits rejoining; a ban persists with that save until removed. Public crew members can spend money and alter buildings. Backups begin after one minute and repeat every 30 minutes, up to five per slot.'],
    ],
  };
  const extras=[
    ['carrying-capacity-guide','Carrying Capacity & Container Upgrade Guide','Progression','Calculate container levels, Dust Compactor stacking and eligible purchase discounts.',[
      ['Four capacity multipliers','Each tool starts with its own base capacity. Container levels I–III use ×2, ×4 and ×8. A 12 kg Extra Wide Broom therefore holds 24, 48 or 96 kg before Dust Compactor.'],
      ['Dust Compactor stacks separately','Compactor I / II / III applies ×1.15 / ×1.30 / ×1.45 after the container level. The largest listed broom combination is 12 × 8 × 1.45 = 139.2 kg. This expands carrying time; it does not widen the brush.'],
      ['Discounted purchases','Supplier Network discounts tools and their individual container upgrades by 5% / 10%. A $480 Extra Wide Broom Container III costs $456 / $432 with those discounts. Matrix nodes themselves do not receive that reduction.'],
    ],'containers'],
    ['exploration-flags-and-sites','Flags, Lunar Sites & Exploration Route Guide','Exploration','Plan exploration with 195 flag coordinates, 26 lunar sites and four station destinations.',[
      ['Rewards to plan around','There are 195 flags at $100 each and 26 lunar sites at $250 each: $19,500 and $6,500 in base collection rewards. These are distinct from per-kilogram launch payments.'],
      ['Use the complete directories','The Wiki contains a searchable flag coordinate table and all 26 site coordinates. M opens the map. Up to 12 waypoints are shared by the crew; clear old targets before marking a new route.'],
      ['Visit station destinations','North and South are at the poles; East and West are on the equator at 90°E / 90°W. Visit a station before teleporting to it. Each teleport costs $50, and you must exit your vehicle first.'],
    ],'flags'],
    ['vehicle-upgrade-guide','Vehicle Progression & Upgrade Buying Guide','Vehicles','Compare every garage vehicle and choose between hopper, motor, suction and unload upgrades.',[
      ['Compare the base vehicle','Push Sweeper costs $300, Ride-on $1,000, Crew Transport $2,000, Lunar Sweeper $2,500 and Mega Vacuum Rover $6,000. Crew Transport has eight seats and no cleaner. Vehicle ownership is individual even though money is shared.'],
      ['Choose the interruption to fix','Big Hopper raises dust capacity 30% / 60% / 90%. Tuned Motors raises speed and pull 10% / 20% / 30%. Quick Release raises unloading speed 50% / 100%. Suction settings widen cleaning 25% / 50% / 75%, while reducing sweeping speed to ×0.85 / ×0.72 / ×0.6.'],
      ['Complete the downstream connection','Garage unloading flows at 600 kg/s into a 6,000 kg silo. Connect the two outfeed ports before emptying a large rover. Upgrading unloading cannot increase a conveyor’s downstream capacity.'],
    ],'vehicles'],
    ['save-recovery-guide','Save Backups & Recovery Guide','Troubleshooting','Locate backups, preserve the host world and check patch compatibility before a restore.',[
      ['Identify the affected slot','The game has five world slots. In multiplayer, the host’s slot is authoritative. Note the slot and game version before changing files.'],
      ['Keep both originals and backups','Automatic backups keep up to five copies per slot. Look under AppData/LocalLow/DragDropGames/MoonSweepers/Backups/slot-<n>.',['Exit the game.','Copy the affected save and the whole backup folder to a separate location.','Select a backup from before the problem.','Use the current game version when testing recovery; keep the copied originals.']],
      ['Check known patch changes','1.0.3 repaired some worlds that appeared corrupted and added protection before save replacement. 1.0.4 improved backups and crash recovery; its saves cannot open in older builds. Do not treat a downgrade as a guaranteed recovery method.'],
    ],'save-slots-and-backups'],
    ['pc-performance-and-crash-fixes','PC Performance, Loading & Crash Troubleshooting','Troubleshooting','Check official requirements and the documented DirectX, large-save and co-op fixes.',[
      ['Compare official specifications','Minimum requirements include Windows 10, 8 GB RAM and GTX 1650 / RX 570. Recommended requirements list Windows 11, 16 GB and GTX 1660 Super / RX 5600 XT. Storage requirements are 2 GB minimum / 4 GB recommended.'],
      ['Use documented graphics behaviour','Patch 1.0.4 defaults AMD systems to DX11 and documents -force-d3d12 for opting into DX12. Start from the default before changing graphics API. The official patch also fixes Proton startup; that does not establish native Linux support.'],
      ['Match the issue to the patch','1.0.3 improves large saves and streaming. 1.0.4 repairs several ground, robot and co-op issues. 1.0.5 addresses loading freezes, leaks and large-base packing failures.',['Verify the current patch through Steam.','Match all crew members’ versions.','Preserve a save copy before testing world-specific failures.','Compare a small world with the affected large world to isolate scope.']],
    ],'https://store.steampowered.com/app/5335510/Moon_Sweepers/'],
    ['night-power-planning','Solar Batteries & Night Power Planning','Automation','Separate peak kW, battery kWh and the energy needed over the full day/night cycle.',[
      ['Read the three panel ratings','Solar Post costs $75: 3 kW, no battery, 16 m range. Twin costs $150: 7.5 kW, 4 kWh, 24 m. Tracker costs $300: 16 kW, 10 kWh, 34 m, with Sun tracking. Spare generation charges batteries at 92% efficiency.'],
      ['Compute the storage requirement','Using the listed energy units, a constant 46 kW load over a 30-minute night requires 23 kWh. Three Tracker batteries can store 30 kWh, but battery capacity alone does not establish that they recharge every day.'],
      ['Check daily recharge as well','Even assuming all 30 daylight minutes stay at the 48 kW peak of three Trackers, only 2 kW remains after a 46 kW load. Half an hour at 92% charging efficiency adds just 0.92 kWh, far below the 23 kWh night requirement. Real sunlight fades near the horizon, making this optimistic bound less favourable.'],
      ['Test the complete cycle','Observe charge after sunrise, near midday and before sunset. Add generation in range, reduce simultaneous production or allow night downtime. Community layouts using more Trackers are examples, not independently tested guarantees.'],
    ],'day-and-night'],
  ];
  for(const [slug,title,category,description,parts,source] of extras){guides.push({...entry(slug,title,description,category,parts.map(([h,p,steps])=>section(h,p,steps)),[source.startsWith('https://')?source:base+source],'community'),updatedAt:'2026-11-04'});}
  for(const g of guides){
    if(definitions[g.slug])g.sections=definitions[g.slug].map(([h,p,steps])=>section(h,p,steps));
    g.updatedAt='2026-11-04';
    g.related=['beginners-guide','automation-guide','how-to-make-money-fast'].filter(s=>s!==g.slug);
    g.faqs=[{question:'Which reference build does this guide use?',answer:'Community parameter tables identify patch 1.0.5. The linked developer announcements describe their named releases; later builds may change the numbers.'}];
    if(['beginners-guide','best-early-upgrades','carrying-capacity-guide'].includes(g.slug)){g.tables=[{...JSON.parse(readFileSync('src/data/wiki/category-overviews.json')).tools.tables[0]},wiki.find(e=>e.slug==='extra-wide-broom'&&e.category==='tools').tables[2]];g.sources.push(base+'cleaning-tools',base+'containers');g.faqs.unshift({question:'Do I need Auto-Packer to use a Packager?',answer:'No. The $100 building and $2,000 matrix upgrade are different purchases. A Packager accepts manual dust without requiring Auto-Packer.'});}
    if(['how-to-make-money-fast','automation-guide'].includes(g.slug))g.faqs.unshift({question:'Is gross production revenue extra profit?',answer:'No. The inputs could also have been sold. At base prices, one chamber adds $50/min and one press $100/min of processing value under continuous full-power supply, before infrastructure and downtime.'});
    if(['multiplayer-guide','save-recovery-guide'].includes(g.slug))g.tables=wiki.find(e=>e.slug===(g.slug==='multiplayer-guide'?'multiplayer':'save-backups')).tables;
    if(g.slug==='vehicle-upgrade-guide')g.tables=[JSON.parse(readFileSync('src/data/wiki/category-overviews.json')).vehicles.tables[0]];
    if(g.slug==='pc-performance-and-crash-fixes')g.tables=wiki.find(e=>e.slug==='system-requirements').tables;
    if(g.slug==='night-power-planning')g.tables=[table('46 kW load: optimistic daylight energy bound',['Tracker count','Peak power','Battery capacity','Daytime stored energy after load','Night need'],[['3','48 kW','30 kWh','0.92 kWh','23 kWh'],['6','96 kW','60 kWh','23 kWh','23 kWh']],base+'production-chains','Calculated with a constant 30-minute peak-output day, 30-minute night and 92% charging efficiency. Real solar output is lower near the horizon. This is an illustrative energy model, not a measured solar layout.')];
    if(g.slug==='exploration-flags-and-sites')g.tables=[table('Exploration budget',['Activity','Count','Base reward'],[['Flags','195','$19,500'],['Lunar sites','26','$6,500'],['Station teleport','Per trip','Costs $50']],base+'flags')];
    const map={'how-to-use-packager':'packager','conveyor-belt-guide':'conveyor-belt','pressure-chamber-guide':'pressure-chamber','stone-press-guide':'stone-press','solar-power-guide':'solar-tracker','joonas-capsule-delivery':'joonas'};
    if(map[g.slug]){const m=machines.find(m=>m.slug===map[g.slug]);g.tables=m.tables;g.stats=m.stats;g.faqs.unshift({question:'Which part should I check when output stops?',answer:g.slug==='solar-power-guide'?'Check instantaneous generation, wireless range and remaining battery energy. Peak power and stored energy are different quantities.':g.slug==='joonas-capsule-delivery'?'Check whether a Capsule Catcher exists and whether its receiver group can still accept dust. Then trace the outgoing belt to a valid destination.':'Inspect the destination and outgoing port first, then input material and power where applicable. A blocked outfeed can stop upstream production.'});}
    g.sources=[...new Set(g.sources)];
  }
  save('src/data/guides/guides.json',guides);
}
