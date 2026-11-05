import { readFileSync } from 'node:fs';
import { machineSpecs, tools, vehicles, upgrades, suitGear, base } from './researched-specs.mjs';
import { guideSetups } from './guide-setups.mjs';
const usd = n => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const stat = (label, value, source) => ({ label, value: String(value), source });
const note = 'Community-reported numeric data, reviewed 2026-11-04. References identify patch 1.0.5 where stated; no independent playtest is claimed. Prices are base game-currency values before applicable discounts.';
export function enrichContent({ machines, guides, save, section, entry }) {
  const official = 'https://store.steampowered.com/news/app/5335510';
  const wiki = JSON.parse(readFileSync('src/data/wiki/entries.json', 'utf8'));
  for (const spec of machineSpecs) {
    let e = machines.find(m => m.slug === spec.slug);
    if (!e) { e = {}; machines.push(e); }
    const sections = spec.sections || [
      ['Output and coverage', `${spec.title} is reported at ${usd(spec.cost)}, with ${spec.powerOutput} kW peak generation and ${spec.range} m wireless range. ${spec.battery ? `The ${spec.battery} kWh battery is stored energy, not additional kW output.` : 'No battery is listed, so this panel alone cannot supply stored energy after sunlight ends.'}`],
      ['Sunlight and storage', `${spec.slug === 'solar-tracker' ? 'This model follows the Sun.' : 'This fixed model must face the Sun.'} Peak output assumes sufficient sunlight. Spare generation, charging losses and the duration of darkness determine how long a battery can sustain a load. Do not treat nameplate peak output as a guaranteed all-day average.`],
      ['Match the connected load', 'A 10 kW pressure chamber and an 18 kW stone press draw different nominal loads. Sum simultaneously running consumers and keep them within the panel’s range. Storage capacity and generation capacity must be checked separately.'],
    ];
    Object.assign(e, entry(spec.slug, spec.title, `${spec.title} costs ${usd(spec.cost)}${spec.costUnit === 'metre' ? ' per metre' : ''}. Review its ${spec.category.toLowerCase()} role, reported specifications and setup requirements.`, spec.category, sections.map(([h, p]) => section(h, p)), [spec.source, ...(spec.extraSources || []).filter(s => !s.includes('moonsweepers.wiki/guide/'))], 'community'));
    for (const key of ['role', 'cost', 'costUnit', 'storage', 'powerMode', 'powerOutput', 'battery', 'range', 'footprint', 'height', 'recipe', 'input', 'output']) if (spec[key] !== undefined) e[key] = spec[key];
    e.power = spec.power ?? null; e.cycle = spec.cycle ?? null;
    e.unlock = `Building Tool ($50) → ${spec.category === 'Robots' ? 'Services' : spec.category} menu (community reference)`;
    e.dataNote = note;
    e.stats = [
      stat('Base purchase price', `${usd(spec.cost)}${spec.costUnit === 'metre' ? ' / m' : ''}`, spec.source),
      ...(spec.power ? [stat('Nominal demand', `${spec.power} kW`, spec.source)] : spec.powerMode === 'generator' ? [stat('Peak generation', `${spec.powerOutput} kW`, spec.source)] : [stat('Power demand', 'No requirement listed in community build panel', spec.source)]),
      ...(spec.cycle ? [stat('Full-power cycle', `${spec.cycle} seconds`, spec.source)] : []),
      ...(spec.storage ? [stat('Storage', `${spec.storage.toLocaleString('en-US')} kg`, spec.source)] : []),
      ...(spec.battery !== undefined ? [stat('Battery energy', `${spec.battery} kWh`, spec.source)] : []),
      ...(spec.range ? [stat('Wireless radius', `${spec.range} m`, spec.source)] : []),
      ...(spec.footprint ? [stat('Footprint', spec.footprint, spec.source)] : []),
      ...(spec.height ? [stat('Height', `${spec.height} m`, spec.source)] : []),
      ...(spec.stats || []).map(([label, value]) => stat(label, value, spec.source)),
    ];
    e.image = `/images/machines/${spec.slug}-data.svg`; e.imageKind = 'diagram';
    e.imageAlt = `${spec.title} data diagram with community-reported parameters; not a picture of the game model`;
    e.imageCaption = 'Original parameter diagram based on the linked community references. Not an in-game render.';
    if (spec.recipe) e.tables = [{ title: 'Full-power recipe and derived output', columns: ['Property', 'Reported / calculated value'], rows: [['Inputs / cycle', spec.input], ['Output / cycle', `${spec.recipe.outputKg} kg ${spec.recipe.outputMaterial.replaceAll('-', ' ')}`], ['Cycle / power', `${spec.cycle} s / ${spec.power} kW`], ['Ideal output / minute', `${spec.recipe.outputKg * 60 / spec.cycle} kg`], ['Base sale value / kg', usd(spec.recipe.basePrice)]], source: spec.source, note: 'Full batches, continuous supply and full power. Rates are calculated from the reported recipe, not measured throughput.' }];
  }
  save('src/data/machines/machines.json', machines);
  function upsert(e) { const i = wiki.findIndex(w => w.slug === e.slug && w.category === e.category); if (i < 0) wiki.push(e); else wiki[i] = e; }
  for (const [slug, title, price, capacity, width, costs] of tools) {
    const source = base + `cleaning-tools/${slug}`;
    const e = entry(slug, title, `${title}: ${price === 0 ? 'free' : usd(price)} base price, ${capacity} kg container and ${width} m cleaning width. Review container levels and discounts.`, 'tools', [
      section('Base equipment', `${title} is listed at the supply wall with a ${capacity} kg container and ${width} m cleaning width. ${price === 0 ? 'It is the starting tool, with no purchase cost.' : `Its base purchase price is ${usd(price)} before any Supplier Network discount.`}`),
      section('Capacity progression', 'Container levels multiply this tool’s base capacity by 2, 4 and 8. The table shows the separate price for each upgrade level; the tool itself is purchased separately. Dust Compactor applies another capacity modifier and should not be confused with the individual container level.'),
      section('What the numbers do not establish', 'Cleaning width and container size are equipment parameters, not guaranteed income rates. Surface dust, delivery distance and player technique still affect a complete work interval. Compare observed deliveries before choosing solely by price.'),
    ], [source, base + 'containers', base + 'cleaning-tools'], 'community');
    e.dataNote = note; e.stats = [stat('Base price', usd(price), source), stat('Base capacity', `${capacity} kg`, source), stat('Cleaning width', `${width} m`, source)];
    e.tables = [{ title: 'Container upgrade levels', columns: ['Level', 'Capacity', 'Level purchase', 'Cumulative upgrades'], rows: [['Base', `${capacity} kg`, 'Included with tool', '$0'], ...costs.map((cost, i) => [['I', 'II', 'III'][i], `${capacity * 2 ** (i + 1)} kg`, usd(cost), usd(costs.slice(0, i + 1).reduce((a, b) => a + b, 0))])], source: base + 'containers', note: 'Base prices before Supplier Network. Tool purchase is excluded from cumulative upgrade cost.' }];
    if (slug === 'household-broom') e.stats.push(stat('Stroke time', '0.86 seconds', source), stat('Reach', '5.5 m', source), stat('Cleaning depth', '0.1 m', source));
    upsert(e);
    const container = entry(`${slug}-container`, `${title} Container`, `${title} capacity levels and individual upgrade prices, from ${capacity} kg to ${capacity * 8} kg.`, 'upgrades', [section('Individual container levels', 'Each level is a separate purchase for this specific tool. The numerical progression is listed below. Buying a larger container delays delivery interruptions; it does not by itself change the cleaning width.'), section('Related modifiers', 'Supplier Network discounts tool and container purchases. Dust Compactor increases all tool capacities separately. Use each modifier only once when estimating the capacity of your current build.')], [base + 'containers', source], 'community');
    container.tables = e.tables; container.dataNote = note; upsert(container);
  }
  const buildTool = wiki.find(e => e.slug === 'building-tool');
  buildTool.stats = [stat('Base price', '$50', base + 'cleaning-tools')]; buildTool.sources.push(base + 'cleaning-tools'); buildTool.dataNote = 'The $50 price is community-reported. Move-mode controls are supported by official patch 1.0.5.';
  for (const [slug, title, cost, cruise, boost, width, hopper, capsuleSlots, seats] of vehicles) {
    const source = base + 'vehicles';
    const e = entry(slug, title, `${title} costs ${usd(cost)} at a garage. Compare base movement, cargo and cleaning attributes before vehicle upgrades.`, 'vehicles', [
      section('Purchase and ownership', `${title} is listed at ${usd(cost)}, purchased through a garage. The $200 garage is a separate building cost. The community reference describes individual vehicle ownership, while official patch notes allow management through any garage.`),
      section('Base specifications', 'The table lists unupgraded speeds. Capsule carrying slots are separate from loose-dust hopper capacity. A transport vehicle is not assigned a fictitious cleaning width or hopper when the source does not list one.'),
      section('Plan a complete delivery route', 'Use the garage collector pad to unload cleaning-vehicle dust. Its silo and outfeed belts can become the next constraint even when driving is faster. Compare the entire cleanup and return loop, rather than cruise speed alone.'),
    ], [source, official], 'community');
    e.stats = [stat('Base purchase', usd(cost), source), stat('Cruise speed', `${cruise} m/s`, source), stat('Boost speed', `${boost} m/s`, source), stat('Cleaning width', width === null ? 'Not applicable / not listed' : `${width} m`, source), stat('Dust hopper', hopper === null ? 'Not applicable / not listed' : `${hopper.toLocaleString('en-US')} kg`, source), stat('Capsule slots', capsuleSlots, source), stat('Seats', seats ?? 'Not listed', source)];
    e.dataNote = note; upsert(e);
  }
  for (const u of upgrades) {
    const source = base + `upgrade-matrix/${u.slug}`;
    const total = u.total ?? u.costs.reduce((a, b) => a + b, 0);
    const e = entry(u.slug, u.title, `${u.title}: ${u.branch} progression, ${usd(total)} ${u.costs?.length === 1 ? 'purchase' : 'total across levels'}, reported effects and prerequisites.`, 'upgrades', [
      section('Purpose and branch', `${u.title} is part of the ${u.branch.toLowerCase()} branch. ${u.effect || u.effects.at(-1)}. The listed requirement is ${u.prerequisite}. Total cost refers to this upgrade’s own levels and excludes prerequisite purchases.`),
      section('How to interpret the effect', u.slug === 'market-contracts' || u.slug === 'lunar-exchange' ? 'The payout modifier changes sale value, not kilograms produced. The referenced combined maximum is +28% from Market Contracts III plus Lunar Exchange: the bonuses add, rather than compounding into 29.8%.' : u.slug === 'supplier-network' ? 'The reported discount applies to supply-wall tools and container upgrades. It is not a universal discount on machines or every upgrade-matrix purchase.' : u.slug === 'auto-packer' ? 'This creates a capsule at your feet when the held tool fills. It does not automatically build a route to a station or replace the separate Packager building.' : 'A parameter increase is not automatically the same increase in total income. Use comparable delivery intervals when estimating financial payback.'),
      section('Purchase planning', 'Check the current in-game matrix for prerequisites and ownership before spending. Where an individual level price has not been checked, this page shows the source’s total instead of inventing a distribution across levels.'),
    ], [source, base + 'upgrade-matrix'], 'community');
    e.stats = [stat('Branch', u.branch, source), stat('Levels', u.levels ?? u.costs.length, source), stat('Own levels total', usd(total), source), stat('Requires', u.prerequisite, source), stat('Top effect', u.effect || u.effects.at(-1), source)];
    if (u.costs) e.tables = [{ title: 'Individual upgrade levels', columns: ['Level', 'Purchase price', 'Cumulative price', 'Effect'], rows: u.costs.map((cost, i) => [String(i + 1), usd(cost), usd(u.costs.slice(0, i + 1).reduce((a, b) => a + b, 0)), u.effects[i]]), source, note: 'Excludes prerequisite costs. No Supplier Network discount is applied to these non-container matrix upgrades.' }];
    e.dataNote = note; upsert(e);
  }
  for (const [slug, title, costs, effects] of suitGear) {
    const source = base + 'suit-gear';
    const old = wiki.find(w => w.slug === slug && w.category === 'upgrades');
    const e = entry(slug, title, `${title} supply-wall levels, costs and equipment effects. Distinguish suit gear from the upgrade matrix.`, 'upgrades', old?.sections || [section('Supply-wall equipment', `${title} is suit gear bought level by level. The referenced table describes shared crew levels. This equipment is separate from similarly named movement or logistics upgrades in the matrix.`), section('Choosing a level', 'Use the listed effect for its actual purpose. More quick slots or a longer lamp beam does not imply a verified income percentage. Compare convenience, visibility and work interruptions using your own route.')], [...(old?.sources || []), source], 'community');
    e.tables = [{ title: 'Suit gear levels', columns: ['Level', 'Level price', 'Effect'], rows: costs.map((cost, i) => [String(i + 1), usd(cost), effects[i]]), source }]; e.dataNote = note; upsert(e);
  }
  const materials = [['lunar-dust', 'Lunar Dust', 1, 'Collected from the surface; used by both processors.'], ['moon-sand', 'Moon Sand', 3, 'Made from dust in a Pressure Chamber; one ingredient for stone.'], ['moon-stone', 'Moon Stone', 7, 'Made from dust and sand in a Stone Press; exported as 2 kg blocks.']];
  for (const [slug, title, price, description] of materials) {
    const source = base + 'resources-and-capsules';
    const e = entry(slug, title, `${title} base value is reported at ${usd(price)} per kg before payout upgrades. ${description}`, 'materials', [
      section('Base material value', description + ` The reported base sale value is ${usd(price)}/kg. Price multipliers change payout and must not be read as extra mass produced.`),
      section('Payout modifiers', 'Market Contracts increases launch payout by 6%, 12% or 18%, and Lunar Exchange adds 10%. The referenced combined maximum is 1.28× base value. Apply the crew multiplier to sales, not to kilograms or machine cycle speed.'),
      section('Production context', slug === 'moon-sand' ? 'At the reported maximum batch, 5 kg dust becomes 5 kg sand in 12 seconds at 10 kW. That is 25 kg/min under uninterrupted full-power operation.' : slug === 'moon-stone' ? 'A 6-second recipe combines 1 kg dust and 1 kg sand into one 2 kg block at 18 kW. At the base price each block is worth $14. Both inputs must remain available.' : 'A kilogram of dust can be sold as collected or fed into processing. Counting its potential raw sale value as an opportunity cost helps distinguish gross output sales from processing value added.'),
    ], [source, base + 'production-chains'], 'community');
    e.stats = [stat('Base sale value', `${usd(price)} / kg`, source), stat('At +28% payout', `${usd(price * 1.28)} / kg`, base + 'upgrade-matrix/market-contracts')]; e.dataNote = note; upsert(e);
  }
  const capsules = wiki.find(e => e.slug === 'capsules');
  capsules.tables = [{ title: 'Reported material forms', columns: ['Form', 'Mass', 'Base sale value'], rows: [['Dust capsule', 'Up to 1 kg', '$1/kg'], ['J.O.O.N.A.S. delivery capsule', '20 kg', '$20 at full size'], ['Sand capsule', '1 kg', '$3'], ['Stone block', '2 kg', '$14']], source: base + 'resources-and-capsules', note: 'All prices exclude payout upgrades. Partial hand-packed capsules can contain less than 1 kg.' }];
  capsules.sources.push(base + 'resources-and-capsules'); capsules.dataNote = note; capsules.status = 'community';
  const mediaEntry = entry('official-media', 'Official Screenshots & Media Sources', 'Open original Steam screenshot sources and review image credits and reuse status.', 'mechanics', [
    section('Publisher screenshot sources', 'The source directory below comes from the public Steam app-details API. These links open the publisher-hosted originals. They are not competitor screenshots, generated machine art or locally rehosted files.'),
    section('Image use status', 'The publisher and source are identified, but no explicit reuse license was located. This website currently links to the originals while permission remains unresolved. Original parameter diagrams provide local equipment visuals without claiming to show the game models.'),
  ], ['https://store.steampowered.com/app/5335510/Moon_Sweepers/', 'https://store.steampowered.com/api/appdetails?appids=5335510'], 'verified');
  upsert(mediaEntry);
  save('src/data/wiki/entries.json', wiki);
  const toolsTable = { title: 'Base cleaning tools', columns: ['Tool', 'Base price', 'Container', 'Width'], rows: tools.map(([, title, price, capacity, width]) => [title, usd(price), `${capacity} kg`, `${width} m`]), source: base + 'cleaning-tools', note };
  const recipeTable = { title: 'Production at full power', columns: ['Machine', 'Recipe', 'Cycle / power', 'Output / minute', 'Gross base sales / min'], rows: [['Pressure Chamber', '5 kg dust → 5 kg sand', '12 s / 10 kW', '25 kg sand', '$75'], ['Stone Press', '1 kg dust + 1 kg sand → 2 kg stone', '6 s / 18 kW', '20 kg stone', '$140']], source: base + 'production-chains', note: 'Ideal gross output sales are not processing value added. No guarantee of real uptime or a fully supplied line.' };
  for (const g of guides) {
    g.dataNote = note;
    if (['beginners-guide', 'best-early-upgrades'].includes(g.slug)) { g.tables = [toolsTable]; g.sources.push(base + 'cleaning-tools', base + 'containers'); }
    if (['how-to-make-money-fast', 'automation-guide'].includes(g.slug)) { g.tables = [recipeTable]; g.sources.push(base + 'production-chains', base + 'resources-and-capsules'); }
    if (g.slug === 'beginners-guide') g.sections.unshift(section('A priced first milestone', 'Community tables list the Household Broom at $25, its first container increase from 3 to 6 kg at $30, and the Building Tool at $50. These are base prices, not a required purchase order. A separate $100 Packager plus a 30 m belt at $0.50/m adds $115 once the Building Tool is owned.'));
    if (g.slug === 'how-to-make-money-fast') g.sections.unshift(section('Separate revenue from added value', 'At the reported full-power recipes, sand output sells for $75/min and stone output for $140/min at base prices. Subtracting the inputs’ alternative sale values gives $50/min and $100/min of processing value added respectively. These are theoretical rates with continuous feed, not observed passive income.'));
  }
  const topics = [
    ['how-to-use-packager', 'How to Use the Packager', 'Machines', 'packager'], ['conveyor-belt-guide', 'Conveyor Belt Cost & Throughput Guide', 'Machines', 'conveyor-belt'], ['pressure-chamber-guide', 'Pressure Chamber Recipe & Power Guide', 'Machines', 'pressure-chamber'], ['stone-press-guide', 'Stone Press Recipe & Value Added', 'Machines', 'stone-press'], ['solar-power-guide', 'Solar Power, Battery & Night Planning', 'Automation', 'solar-tracker'], ['joonas-capsule-delivery', 'J.O.O.N.A.S. & Catcher Delivery Guide', 'Automation', 'joonas'],
  ];
  for (const [slug, title, category, machineSlug] of topics) {
    const m = machines.find(e => e.slug === machineSlug);
    const g = entry(slug, title, `Plan ${m.title.toLowerCase()} setup using reported prices, actual roles and clearly stated operating assumptions.`, category, guideSetups[slug].map(([h, p]) => section(h, p)), [...m.sources, base + 'production-chains'], 'community');
    g.stats = m.stats; g.tables = m.tables; g.image = m.image; g.imageKind = m.imageKind; g.imageAlt = m.imageAlt; g.imageCaption = m.imageCaption; g.dataNote = note; g.related = ['automation-guide', 'how-to-make-money-fast'];
    // Canonical equipment reference remains the machine page. Guides focus on setup decisions.
    g.sections.push(section('A setup decision to test', machineSlug === 'solar-tracker' ? 'One tracker has 16 kW peak output. It can cover a 10 kW chamber in full sunlight but cannot alone meet an 18 kW press load. A chamber plus two presses totals 46 kW: three trackers total 48 kW peak, with little charging margin. That arithmetic does not guarantee night operation.' : 'Keep the destination and access path clear, then observe a complete small batch. Change one connection at a time. Record any difference between your current panel and the reference table rather than forcing your game to match a stale number.'));
    guides.push(g);
  }
  save('src/data/guides/guides.json', guides);
  save('src/data/tools/production-presets.json', machines.filter(m => m.recipe).map(m => ({ slug: m.slug, title: m.title, cycleSeconds: m.cycle, outputPerCycle: m.recipe.outputKg, unitPrice: m.recipe.basePrice, investmentPerMachine: m.cost, inputOpportunityValue: m.recipe.inputs.reduce((sum, i) => sum + i.amount * (i.material === 'moon-sand' ? 3 : 1), 0), inputMaterial: m.input, outputMaterial: m.recipe.outputMaterial.replaceAll('-', ' '), sources: m.sources, status: 'community', version: '1.0.5', assumptions: 'Full-power, full-batch community recipe. Machine cost excludes generation and logistics. Input sale value is an opportunity cost, not a cash fee.' })));
  return { wiki };
}
