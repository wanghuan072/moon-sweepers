import {consolidateGuides} from './consolidate-guides.mjs';
import {applyWikiCopy} from './apply-wiki-copy.mjs';
import {buildToolCatalog} from './build-tool-catalog.mjs';
import {reorganizeWiki} from './reorganize-wiki.mjs';
import {editorialPass} from './editorial-pass.mjs';
import { completeReference } from './complete-reference.mjs';
import { optimizeKeywords } from './optimize-keywords.mjs';
import { completeGuides } from './complete-guides.mjs';
import { expandReference } from './expand-reference.mjs';
// Source of truth for generated JSON. Edit this file, then run node scripts/data/build-content.mjs.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { enrichContent } from './enrich-content.mjs';
import { prepareDataDiagrams } from './prepare-data-diagrams.mjs';
const store = 'https://store.steampowered.com/app/5335510/Moon_Sweepers/';
// These are the exact source URLs returned by Steam's GetNewsForApp API.
const p3 = 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847286114039175';
const p4 = 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847286114042960';
const p5 = 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847920302229973';
const roadmap = 'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1847920302238715';
const community = 'https://wikily.gg/moon-sweepers/machines/';
const save = (path, data) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, JSON.stringify(data, null, 2) + '\n'); };
const section = (heading, text, steps) => ({ heading, paragraphs: Array.isArray(text) ? text : [text], ...(steps ? { steps } : {}) });
const entry = (slug, title, description, category, sections, sources, status = 'verified', version = '1.0.5') => ({ slug, title, description, category, sections, sources, status, version, updatedAt: '2026-11-03' });
const machineSpecs = [
  ['packager', 'Packager', 'Logistics', 'Packaging', 'Collected dust', 'Capsules', 'community'],
  ['splitter', 'Splitter', 'Logistics', 'Branching', 'One capsule route', 'Multiple routes', 'verified'],
  ['conveyor-belt', 'Conveyor Belt', 'Logistics', 'Transportation', 'Capsules', 'Destination intake', 'verified'],
  ['pressure-chamber', 'Pressure Chamber', 'Production', 'Processing', 'Lunar dust', 'Sand', 'community'],
  ['merger', 'Merger', 'Logistics', 'Combining', 'Multiple capsule routes', 'One route', 'verified'],
  ['stone-press', 'Stone Press', 'Production', 'Processing', 'Dust and sand', 'Stone blocks', 'community'],
  ['capsule-catcher', 'Capsule Catcher', 'Services', 'Receiving', 'Robot-launched capsules', 'Stored material', 'verified'],
  ['garage', 'Garage', 'Services', 'Vehicle management', 'Cleaning vehicles', 'Storage and upgrades', 'verified'],
  ['solar-tracker', 'Solar Tracker (L)', 'Power', 'Power supply', 'Sunlight', 'Power', 'community'],
];
const machines = machineSpecs.map(([slug, name, category, role, input, output, status]) => ({
  ...entry(slug, name, `${name}: ${role.toLowerCase()} equipment for your lunar operation. Explore documented roles, source status and practical setup checks.`, category, [
    section('Overview', `${name} serves the ${category.toLowerCase()} part of a lunar base. Its documented role is ${role.toLowerCase()}. This is a role reference, not a measured efficiency benchmark. Different machine jobs should not be treated as interchangeable upgrades.`),
    section('How to unlock', 'The exact unlock requirement has not been independently checked. Inspect your current build menu and upgrade matrix before reserving money for this equipment.'),
    section('Inputs & outputs', `Role summary: ${input} → ${output}. These describe the purpose, not a verified numerical recipe. Check the current in-game information panel for accepted materials and quantities.`),
    section('How to use', 'Our suggested test procedure makes a disconnected route easier to diagnose. It is editorial advice, not a developer-provided optimal layout.', ['Read the in-game requirements and inspect the ports.', 'Leave access beside the input and output.', 'Send a small batch through the intended route.', 'Confirm receipt at the destination before expanding.']),
    section('Production efficiency', 'Measure completed deliveries over an interval that includes interruptions. Record the game version, output and time. Use your observed values in the profit calculator rather than estimating income from a single fast cycle.'),
    section('Automation setup', 'A disconnected belt, a blocked destination or a missing input can resemble a slow machine. Check each link in sequence before buying duplicates. For equipment requiring power, inspect the current power information directly.'),
    section('Tips & strategies', 'Keep an inspection path beside your equipment. After moving foundations or applying a patch, repeat a small-batch test. The comparison tool displays roles without inventing missing costs or production rates.'),
  ], status === 'verified' ? [p3, p4, p5] : [community], status, undefined),
  role, input, output, cost: null, power: null, cycle: null, unlock: null, version: undefined,
}));
save('src/data/machines/machines.json', machines);
save('src/data/wiki/categories.json', [
  ['tools', 'Tools', 'Handheld equipment and building tools.', 'brush'], ['items', 'Items', 'Capsules and equipment for the cleanup loop.', 'box'],
  ['materials', 'Materials', 'Resources at the heart of lunar cleanup.', 'layers'], ['vehicles', 'Vehicles', 'All five garage vehicles: images, prices, speeds, cleaning width, hoppers, capsule slots, seats and upgrade levels.', 'truck'],
  ['upgrades', 'Upgrades', 'Equipment progression and crew improvements.', 'upgrade'], ['mechanics', 'Mechanics', 'Selling, cooperation, building and saves.', 'book'],
].map(([slug, title, description, icon]) => ({ slug, title, description, icon })));
const wikiSpecs = [
  ['toothbrush', 'Toothbrush', 'tools', 'The tool that starts your lunar career.', store, [
    section('The starting tool', 'The Steam introduction identifies a toothbrush as your initial cleaning equipment. Collect dust and use delivery income to expand. Exact collection speed is not independently verified.'),
    section('Planning your next step', 'Time a complete collection and delivery trip. If walking dominates the interval, consider distance and carrying capacity before assuming a faster tool solves the bottleneck.'),
  ]],
  ['building-tool', 'Building Tool', 'tools', 'Build and relocate a more accessible base.', p5, [
    section('Move mode', 'In the 1.0.5 announcement, R picks up a building piece and what stands on it. Right-click restores it; R or Esc leaves move mode. Check your bindings if controls were remapped.'),
    section('After moving', 'Reachable belts follow the moved piece according to the patch. Inspect every remaining connection and send a small test batch before restarting a large route.'),
  ]],
  ['capsules', 'Capsules', 'items', 'Packed material on your transport routes.', p3, [
    section('Capsule handling', 'Patch 1.0.3 allows a carried capsule to be placed on a belt at the aimed position. This gives you a simple way to test a short route.'),
    section('Trace a stopped capsule', 'Find the first point at which material stops and inspect the next connection. A full destination and a disconnected output require different changes; more upstream supply does not diagnose either.'),
  ]],
  ['lunar-dust', 'Lunar Dust', 'materials', 'The resource that funds your growing operation.', store, [
    section('Collect and sell', 'Dust is collected from the surface and sold to fund better equipment. The store describes increased carrying capacity as a way to work longer between deliveries.'),
    section('Measure your route', 'Record the money and time of a complete trip, including the return journey. Use those observations in the calculator. No universal dust sale price is assumed here.'),
  ]],
  ['cleaning-vehicles', 'Cleaning Vehicles', 'vehicles', 'Understand garage access and vehicle persistence.', p3, [
    section('Garage access', 'The 1.0.3 notes allow owned vehicles to be recalled, stored and upgraded at any garage. Removing a garage preserves its vehicles.'),
    section('Crew planning', 'Agree where shared vehicles should be returned. Keep delivery lanes open and compare complete routes before purchasing. Vehicle-specific prices and speeds are not yet independently checked.'),
  ]],
  ['shared-upgrades', 'Shared Upgrades', 'upgrades', 'One upgrade matrix across the crew.', p3, [
    section('Crew-wide progression', 'From 1.0.3, the crew uses the host upgrade matrix. Purchases apply to the crew; older saves preserve the highest previously purchased level.'),
    section('Plan purchases together', 'Discuss the current constraint with teammates before spending. Compare measured before-and-after income in the upgrade calculator instead of entering an assumed productivity multiplier.'),
  ]],
  ['night-vision', 'Night Vision Goggles', 'upgrades', 'A visibility option added in patch 1.0.4.', p4, [
    section('Visibility controls', 'The 1.0.4 update adds night vision goggles as a suit upgrade. N cycles helmet lamp, goggles and off states under the documented PC controls.'),
    section('Convenience versus payback', 'Better visibility can improve comfort without a verified income multiplier. Measure comparable work intervals before assigning a financial gain to the upgrade.'),
  ]],
  ['selling-dust', 'Selling Dust', 'mechanics', 'Understand delivery and belt-fed payment.', p3, [
    section('Belt-fed delivery', 'Patch 1.0.3 confirms payment as dust and stone enter the deposit intake by belt. Watch the intake screen and balance during a small delivery test.'),
    section('Validate the destination', 'Keep route diagnosis separate from production diagnosis. Material waiting on a belt is inventory, not realized income. Record sale values from your own current game rather than older screenshots.'),
  ]],
  ['multiplayer', 'Multiplayer', 'mechanics', 'Solo cleanup or an online crew of up to 16.', store, [
    section('Crew size', 'The Steam listing supports single-player and online co-op with up to 16 players. Agree on work areas so the crew does not crowd one small patch.'),
    section('Host controls', 'The 1.0.3 announcement adds kick, ban and unban under Your Crew in the host ESC menu. Discuss spending and building rules before opening the world to others.'),
  ]],
  ['save-backups', 'Save Backups', 'mechanics', 'World backup and compatibility information.', p4, [
    section('Automatic backups', 'The developer describes up to five backups for each save slot, separate from Steam Cloud. The stated schedule is one minute into a session, then every 30 minutes.'),
    section('Version compatibility', 'The 1.0.4 announcement warns that saves from that version cannot be opened in older versions. Preserve your files before attempting an older build and read the relevant patch notes.'),
  ]],
];
save('src/data/wiki/entries.json', wikiSpecs.map(([slug, title, category, description, source, sections]) => entry(slug, title, description, category, sections, source === store ? [source, p3] : [source])));
const guideSpecs = [
  ['beginners-guide', 'Moon Sweepers Beginner’s Guide', 'Beginner', 'Your first cleanup loop, from a toothbrush to a growing operation.', [
    ['Start with a complete loop', 'Treat your opening session as one repeatable route: clean a small area, collect material, finish a delivery and check the result. The official store description confirms collection, selling and equipment progression. It does not establish a universal best purchase order. Your first goal is to understand where time goes, rather than rush toward an equipment list copied from another player.'],
    ['Time collection and travel separately', 'Use a timer for an entire trip, including the walk back to the work area. Note how often carrying capacity interrupts cleaning. If travel takes most of the interval, a faster brush alone cannot remove that delay. Try to compare similarly sized work areas so a more convenient patch of terrain does not look like an equipment improvement.'],
    ['Make one purchase at a time', 'Record your starting money, make one change and repeat a comparable route. Separate the cost of new equipment from the income produced during the test. You want to know whether the route earns more consistently, not whether your balance happened to rise while several teammates delivered material. Keep a short note of the game version and conditions alongside the result.'],
    ['Test a small delivery route', 'The 1.0.3 developer announcement explicitly documents belt-fed payment at the deposit intake. Use a small batch to confirm a destination works before extending a large route. Observe the material from start to finish. If it stops, inspect the first downstream connection rather than adding more supply and making the blockage harder to see.'],
    ['Expand from observations', 'Choose the next improvement using the slowest part of the complete loop. The calculator can compare your observed batch value, cycle time and cost without assuming unverified prices. A comfort improvement may still be worthwhile even if it has no measured income gain. Keep those two reasons for purchasing separate so the financial estimate stays honest.'],
  ]],
  ['how-to-make-money-fast', 'How to Make Money Fast in Moon Sweepers', 'Money Making', 'Improve completed deliveries instead of chasing an unsupported income claim.', [
    ['Measure realized income', 'Take a starting balance, work for a fixed interval and finish the deliveries before taking the ending balance. Avoid buying equipment during the interval, or record those expenses separately. Material waiting in storage is not yet realized income. A long sample is more representative than one unusually fast delivery because it includes recurring travel, interruptions and full destinations.'],
    ['Find the longest delay', 'Break the route into collection, transport and delivery. The Steam store describes placing depots near your work, which makes destination placement worth examining. This is a planning suggestion, not a fixed income multiplier. Measure a new route before committing to a long extension; walking distance and the shape of the work area can change the result.'],
    ['Confirm payment first', 'Patch 1.0.3 addresses deposit payment and confirms that dust and stone arriving by belt are paid as they enter. Watch the intake display and your balance during a small controlled test. If the test fails, diagnose the route before expanding production. Increasing upstream throughput only creates a larger queue when the destination is disconnected or blocked.'],
    ['Account for uptime', 'A theoretical production cycle assumes the next input and destination are ready. Your observed route may pause. Enter a realistic uptime percentage in the calculator, or use a cycle measurement that already includes interruptions and keep uptime at 100 percent. Do not count the same downtime twice. The result is a scenario estimate, not a guarantee of live earnings.'],
    ['Check payback after expansion', 'Divide initial investment by positive net income per minute to estimate a new setup’s payback. For an upgrade to an existing route, use the increase in income instead of the whole new rate. Recheck after a patch or layout change. If the incremental improvement is zero or negative, the inputs do not support a positive financial payback.'],
  ]],
  ['best-early-upgrades', 'Best Early Game Upgrades: A Practical Checklist', 'Upgrades', 'Compare carrying capacity, cleaning time and shared crew benefits.', [
    ['Start with the bottleneck', 'The official description identifies better tools and carrying capacity as progression options. It does not name one optimal upgrade for every route. If storage repeatedly fills before an area is finished, capacity deserves investigation. If storage is rarely full, another constraint may matter more. Base the choice on what interrupts your own work.'],
    ['Compare complete trips', 'Measure income before and after a purchase under similar conditions. Keep delivery distance, work area and crew size as consistent as possible. An improvement in collection speed is only part of the route, so do not assume a displayed speed increase becomes the same percentage increase in total earnings. Record the conditions that changed.'],
    ['Coordinate shared spending', 'From patch 1.0.3, players use the host upgrade matrix and purchases apply to the crew. Discuss which constraint affects the most people before spending. Shared benefit does not mean every upgrade solves the same problem. Agree on a priority, then have the team repeat the same kind of work to evaluate the result.'],
    ['Use incremental payback', 'The upgrade calculator divides purchase cost by the difference between before and after net income per minute. A nonpositive difference has no positive financial payback under those assumptions. An upgrade can still improve comfort or accessibility. Keep that judgment distinct from income calculations instead of inventing a productivity boost to justify the purchase.'],
    ['Keep a short comparison log', 'Write down upgrade name, cost, measured before and after rates, observation interval and game version. If you cannot measure the effect yet, leave it blank. A small number of reliable observations is more useful than a complete table of guessed multipliers. Revisit the result when a patch changes the relevant equipment or route.'],
  ]],
  ['automation-guide', 'Moon Sweepers Automation Guide', 'Automation', 'Build a short working route, then add complexity deliberately.', [
    ['Choose the destination first', 'Decide where material should end up before placing the first connection. The 1.0.3 announcement confirms payment for dust and stone entering the deposit intake by belt. That gives a concrete success condition: the material arrives and money changes. This guide provides a test method; it does not claim a universal processing recipe or optimal machine ratio.'],
    ['Build a minimum test', 'Use one supply and one destination before branching. Observe the first successful transfer and inspect the direction at every port. A short route makes a disconnected output easier to find. Send a carried capsule onto a belt where you aim, a behavior documented in 1.0.3, and follow it to the destination before extending the route.'],
    ['Add branches one at a time', 'Patch 1.0.4 states that mergers alternate between inputs. This describes selection behavior, not a maximum throughput guarantee for all layouts. Test the inputs individually and then together. When something stops, trace the first stalled item downstream. Keep upstream supply steady so you can distinguish a routing issue from a shortage.'],
    ['Retest after moving foundations', 'Patch 1.0.5 introduces moving structures and their contents, with reachable belts following. Inspect the remaining connections after a move. A visually similar layout can still have an unconnected port. Keep an access path beside the route so inspection remains practical when the base becomes larger and more crowded.'],
    ['Scale completed delivery', 'Measure what reaches the destination over time. Count pauses, missing input and full receiving storage. Expand the stage limiting the complete route rather than the busiest-looking machine. Use the profit calculator with measured values and leave unverified prices blank. Repeat the test after a relevant patch, especially when packing or delivery behavior changes.'],
  ]],
  ['machine-troubleshooting', 'Moon Sweepers Machine Troubleshooting', 'Machines', 'A source-based checklist for stalled capsules and disconnected routes.', [
    ['Find the first failure', 'Start at the destination and inspect the route toward the source. The first stalled capsule helps localize the problem. Confirm a short isolated route before changing a large base.'],
    ['Check the installed version', 'The developer describes machine packing fixes in both 1.0.4 and 1.0.5, with the latter addressing large bases. Similar symptoms can have different causes across builds. Read the note for your version before applying an older workaround.'],
    ['Read the information panel', 'Patch 1.0.5 adds an explanation when a garage silo cannot send dust, such as an outfeed without a belt. Check what the game reports before guessing. If equipment requires power or multiple inputs, inspect those requirements directly.'],
    ['Keep reproducible observations', 'Record the version, first stalled item, destination capacity and whether an isolated route works. Change one connection at a time. These are useful diagnostic notes; this site does not submit reports or contact support for you.'],
  ]],
  ['multiplayer-guide', 'Moon Sweepers Multiplayer Guide', 'Multiplayer', 'Plan shared purchases and coordinate an online cleanup crew.', [
    ['Agree on the work', 'The official store supports up to 16 players. Assign cleanup areas, deliveries and construction so players do not work against one another. Rotate repetitive roles and keep vehicle return locations predictable.'],
    ['Plan crew upgrades', 'Patch 1.0.3 shares the host upgrade matrix across the crew. Discuss major purchases before spending. Measure the same kind of work before and after a shared upgrade so a changing crew size does not distort the comparison.'],
    ['Understand public access', 'The 1.0.5 patch adds a public-game warning. Read it before opening a world. The host controls for kicking, banning and unbanning players are documented under Your Crew in the ESC menu.'],
    ['Test without simultaneous edits', 'Ask teammates to pause changes around the route being checked. Send one recognizable test batch and watch the destination. Several players rebuilding different links at the same time makes a failure difficult to reproduce.'],
  ]],
];
const guides = guideSpecs.map(([slug, title, category, description, parts], i) => ({
  ...entry(slug, title, description, category, parts.map(([h, p]) => section(h, p)), [store, p3, p4, p5]),
  image: `/images/guides/editorial-${i % 3 + 1}.webp`, related: [guideSpecs[(i + 1) % guideSpecs.length][0], guideSpecs[(i + 3) % guideSpecs.length][0]],
}));
save('src/data/guides/guides.json', guides);
const updates = [
  ['update-1-1-preview', 'Update 1.1: December Plans', '2026-10-30', null, 'A preview of the next major update. Planned, not released.', roadmap, [
    ['What is planned', 'The developer plans update 1.1 for December 2026, with expanded production, materials, equipment and progression. The announcement says plans remain in development and may change.'],
    ['Release status', 'This source is a roadmap. It does not confirm a final recipe list, exact release day or machine prices.'],
  ]],
  ['patch-1-0-5', 'Patch 1.0.5: Building & Automation', '2026-10-28', '1.0.5', 'Move structures, build on dusty ground and improve capsule delivery.', p5, [
    ['Building changes', 'Move mode, construction on dusty ground and foundation alignment improve placement. Removing a building piece refunds its full price.'],
    ['Machine changes', 'J.O.O.N.A.S. targets the emptiest catcher in a nearby group. Garage silos explain why dust is not leaving.'],
    ['Bug fixes & performance', 'The developer addresses loading freezes, large-base packing failures, memory leaks and stutters. See the original announcement for the complete list.'],
  ]],
  ['patch-1-0-4', 'Patch 1.0.4: Robots, Backups & Co-op', '2026-10-25', '1.0.4', 'Robot delivery improvements, night vision and automatic backups.', p4, [
    ['New features', 'Night vision, map and teleport improvements, suit indicators and changes to J.O.O.N.A.S. were added.'],
    ['Backups & compatibility', 'Automatic backups and crash recovery are documented. Saves made in 1.0.4 cannot be opened in older builds.'],
    ['Machine & co-op fixes', 'Mergers alternate between inputs, and crewmates can attach splitters and mergers to another player’s belts. Machine and synchronization bugs are addressed.'],
  ]],
  ['patch-1-0-3', 'Patch 1.0.3: Shared Upgrades & Delivery', '2026-10-24', '1.0.3', 'Crew-wide upgrades, host controls and belt-fed deposit fixes.', p3, [
    ['Multiplayer', 'The host upgrade matrix is shared across the crew. Kick, ban and unban controls are added under Your Crew.'],
    ['Building & delivery', 'Dust and stone entering the deposit intake by belt are paid as they arrive. Carried capsules can be placed onto belts where you aim.'],
    ['Vehicles & saves', 'Owned vehicles can be managed through any garage. Removing a garage preserves its vehicles. Save recovery and performance improvements are also documented.'],
  ]],
].map(([slug, title, date, version, description, source, parts]) => ({ ...entry(slug, title, description, version ? 'Patch notes' : 'Roadmap', parts.map(([h, p]) => section(h, p)), [source]), version, updatedAt: date }));
save('src/data/updates/updates.json', updates);
enrichContent({ machines, guides, save, section, entry });
expandReference({ machines, guides, updates, save, section, entry });
completeReference({ machines, guides, updates, save, section, entry });
completeGuides({ machines, guides, save, section, entry });
optimizeKeywords({save, machines, guides});
editorialPass({save,machines,guides,updates});
prepareDataDiagrams();
reorganizeWiki({save,machines,guides,updates});
buildToolCatalog(save);
consolidateGuides({save,guides,machines,updates});
applyWikiCopy({save,machines});
const searchCollections = { machines, guides, wiki: JSON.parse(readFileSync('src/data/wiki/entries.json', 'utf8')), updates };
save('src/data/search/search-index.json', [
  ...Object.entries(searchCollections).flatMap(([kind, entries]) => entries.map(e => ({ title: e.title, description: e.description, kind, href: kind==='updates'?`/updates#${e.slug}`:kind==='machines'?`/wiki/machines/${e.slug}`:kind==='wiki'&&e.slug==='achievements'?'/wiki/achievements':kind === 'wiki' ? `/wiki/${e.category}/${e.slug}` : `/${kind}/${e.slug}` }))),
  ...JSON.parse(readFileSync('src/data/mods/mods.json','utf8')).entries.map(mod=>({title:mod.title,description:mod.description,kind:'mods',href:`/mods#${mod.slug}`})),
  ...JSON.parse(readFileSync('src/data/tools/pages.json','utf8')).map(page=>({title:page.title,description:page.description,kind:'tools',href:`/tools/${page.slug}`})),
]);
