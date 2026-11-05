import {readFileSync} from 'node:fs';

// Keyword intent is mapped to existing canonical pages, never duplicate routes.
export function optimizeKeywords({save, machines, guides}) {
  const collections = Object.fromEntries(['machines/machines', 'guides/guides', 'wiki/entries'].map(name => [name, JSON.parse(readFileSync(`src/data/${name}.json`, 'utf8'))]));
  const link = (title, href) => ({title, href});
  const update = (collection, slug, patch) => {
    const entry = collections[collection].find(item => item.slug === slug);
    if (!entry) throw new Error(`Keyword target missing: ${collection}/${slug}`);
    Object.assign(entry, patch);
  };
  update('machines/machines', 'packager', {
    seoTitle: 'Moon Sweepers Packager: Price, Capacity & Connections',
    heading: 'Moon Sweepers Packager',
    description: 'Check the Moon Sweepers Packager’s $100 price, 100 kg storage, conveyor connections and role in dust delivery. Compare it with Auto-Packer.',
    relatedLinks: [link('How to use the Packager: placement, loading and fixes', '/guides/how-to-use-packager'), link('Conveyor Belt speed and capsule spacing', '/wiki/machines/conveyor-belt'), link('Moon Sweepers automation and production layouts', '/guides/automation-guide')],
  });
  update('machines/machines', 'stone-press', {
    seoTitle: 'Moon Sweepers Stone Press: Recipe, Power & Output',
    heading: 'Moon Sweepers Stone Press',
    description: 'Find the Stone Press recipe, $1,000 price, 18 kW power demand and ideal 20 kg/min output. Understand dust and sand inputs before building a stone line.',
    relatedLinks: [link('How the Stone Press works: setup and troubleshooting', '/guides/stone-press-guide'), link('Sand-to-stone production layout', '/guides/automation-guide'), link('Calculate production revenue and value added', '/tools/selling-and-income')],
  });
  update('machines/machines', 'joonas', {
    seoTitle: 'Moon Sweepers Joonas: Robot Price & Catcher Delivery',
    heading: 'Moon Sweepers J.O.O.N.A.S. Robot',
    description: 'Learn how the Moon Sweepers Joonas robot collects dust, chooses capsule catchers and reports delivery problems. Includes its $20,000 price and bin capacity.',
    relatedLinks: [link('Joonas capsule delivery setup and troubleshooting', '/guides/joonas-capsule-delivery'), link('Robot and catcher network layout', '/guides/joonas-capsule-delivery'), link('Capsule Catcher capacity and connections', '/wiki/machines/capsule-catcher')],
  });
  update('guides/guides', 'how-to-use-packager', {
    title: 'How to Use the Packager in Moon Sweepers',
    seoTitle: 'Moon Sweepers Packager Guide: Setup & Troubleshooting',
    description: 'Set up a Moon Sweepers Packager, connect a conveyor, load dust and trace delivery to a station. Fix blocked output and distinguish Auto-Packer upgrades.',
    relatedLinks: [link('Packager price, storage and equipment specifications', '/wiki/machines/packager'), link('Conveyor placement and connection guide', '/guides/conveyor-belt-guide'), link('Efficient factory layouts and production ratios', '/guides/automation-guide')],
  });
  update('guides/guides', 'stone-press-guide', {
    title: 'How Does the Stone Press Work in Moon Sweepers?',
    seoTitle: 'Moon Sweepers Stone Press Guide: Setup, Recipe & Fixes',
    description: 'Supply dust and sand to the Stone Press, plan enough power and diagnose stalled production. Compare gross stone revenue with actual processing value added.',
    relatedLinks: [link('Stone Press specifications and production cycle', '/wiki/machines/stone-press'), link('Pressure Chamber sand production guide', '/guides/pressure-chamber-guide'), link('Two chambers and five presses: balanced production', '/guides/automation-guide')],
  });
  update('guides/guides', 'automation-guide', {
    title: 'Moon Sweepers Automation Guide: Efficient Production',
    seoTitle: 'Moon Sweepers Automation Guide: Efficient Production',
    description: 'Build efficient Moon Sweepers production lines with dust and sand branches, chamber-to-press ratios, belt capacity checks and day-to-night power planning.',
    relatedLinks: [link('Factory layouts, production ratios and belt limits', '/guides/automation-guide'), link('Packager setup for a first dust delivery route', '/guides/how-to-use-packager'), link('Plan solar generation and night power', '/guides/night-power-planning')],
  });
  update('guides/guides', 'joonas-capsule-delivery', {
    title: 'Moon Sweepers Joonas Delivery Guide',
    seoTitle: 'Moon Sweepers Joonas Guide: Catcher Setup & Delivery Fixes',
    description: 'Set up J.O.O.N.A.S. capsule delivery, keep catcher groups draining and diagnose a full bin or stalled receiver using robot status messages.',
    relatedLinks: [link('J.O.O.N.A.S. robot price, capacity and behaviour', '/wiki/machines/joonas'), link('Build a robot and catcher network', '/guides/joonas-capsule-delivery')],
  });
  update('guides/guides', 'beginners-guide', {
    seoTitle: 'Moon Sweepers Beginner Guide: Tips & Early Progression',
    heading: 'Moon Sweepers Beginner Guide & Tips',
    description: 'Start Moon Sweepers with practical beginner tips: collect and sell dust, choose early upgrades, plan delivery routes and prepare your first automation setup.',
    relatedLinks: [link('Moon Sweepers walkthroughs and equipment guides', '/guides'), link('Best early upgrades and what to buy next', '/guides/best-early-upgrades'), link('How to make money in Moon Sweepers', '/guides/how-to-make-money-fast')],
  });
  update('guides/guides', 'save-recovery-guide', {
    title: 'Moon Sweepers Save Backup & Recovery Guide',
    seoTitle: 'Moon Sweepers Save Recovery: Backup & Restore Checks',
    description: 'Find Moon Sweepers backups, preserve the host’s world and check save-version compatibility before attempting recovery. Includes the Windows backup folder.',
    relatedLinks: [link('Save file folders, slots and automatic backup schedule', '/wiki/mechanics/save-backups'), link('PC crash and loading troubleshooting', '/guides/pc-performance-and-crash-fixes'), link('Multiplayer host saves and shared progression', '/wiki/mechanics/multiplayer')],
  });
  update('wiki/entries', 'save-backups', {
    title: 'Moon Sweepers Save Files, Slots & Backups',
    seoTitle: 'Moon Sweepers Save File Location, Slots & Backups',
    description: 'Find the Moon Sweepers Windows backup location, five world slots and automatic backup schedule. Understand host ownership and save compatibility before restoring.',
    relatedLinks: [link('Step-by-step save recovery precautions', '/guides/save-recovery-guide'), link('Multiplayer saves and shared progression', '/wiki/mechanics/multiplayer')],
  });
  update('wiki/entries', 'flags', {
    title: 'Moon Sweepers Flags: Locations, Coordinates & Rewards',
    seoTitle: 'Moon Sweepers Flags: All 195 Locations & Coordinates',
    description: 'Find all 195 Moon Sweepers flags with coordinates and nearby targets. Each discovery pays $100; use the interactive map to plan your exploration route.',
    relatedLinks: [link('Find flags on the Moon Sweepers interactive map', '/map'), link('Flag hunting and lunar site exploration guide', '/guides/exploration-flags-and-sites'), link('Lunar site coordinates and discovery rewards', '/wiki/items/lunar-sites')],
  });
  update('wiki/entries', 'languages-and-platforms', {
    seoTitle: 'Moon Sweepers Platforms: PC, Mac, PS5 & Languages',
    heading: 'Moon Sweepers Platforms, Release & Languages',
    description: 'Check Moon Sweepers PC availability, what the Steam listing confirms about Mac and PS5 support, release details and all 19 interface languages.',
    relatedLinks: [link('Moon Sweepers PC system requirements', '/wiki/mechanics/system-requirements'), link('PC performance and crash fixes', '/guides/pc-performance-and-crash-fixes')],
  });

  const packagerGuide = collections['guides/guides'].find(item => item.slug === 'how-to-use-packager');
  packagerGuide.sections[2].heading = 'How to connect and load the Packager';
  packagerGuide.sections[3].heading = 'Why is my Packager not working?';
  const pressGuide = collections['guides/guides'].find(item => item.slug === 'stone-press-guide');
  pressGuide.sections[0].heading = 'How the Stone Press recipe works';
  pressGuide.sections.push({heading: 'Why is the Stone Press not producing stone?', paragraphs: ['Check for both raw dust and sand before changing the layout. Then inspect available power and the receiving belt or storage. Sand alone cannot complete the recipe, and a blocked output can stop an otherwise supplied press. Follow the first failed stage instead of adding more presses to the same bottleneck.']});
  const automation = collections['guides/guides'].find(item => item.slug === 'automation-guide');
  automation.sections[2].heading = 'Efficient production: balance chambers and presses';
  const robot = collections['machines/machines'].find(item => item.slug === 'joonas');
  robot.sections[0].paragraphs.push('Joonas is the unpunctuated name used here for J.O.O.N.A.S.; both refer to the same robot. Use the equipment reference for its specifications and the delivery guide for a working catcher layout.');
  const platforms = collections['wiki/entries'].find(item => item.slug === 'languages-and-platforms');
  platforms.faqs = [
    {question: 'Is Moon Sweepers available on Mac?', answer: 'The linked Steam listing specifies Windows system requirements and does not list a native macOS version. Running through a compatibility tool is different from official native Mac support; this reference does not promise that such a setup works.'},
    {question: 'Is Moon Sweepers on PS5?', answer: 'The source linked on this page is the PC Steam release. It does not establish PS5 availability or a console release date. Check developer announcements before treating a console release claim as confirmed.'},
    {question: 'Where can I download and play Moon Sweepers?', answer: 'Open the official Steam store page linked in the sources for purchase and installation details. Check the PC requirements before installing; regional pricing and offers can change.'},
  ];
  for (const [name, data] of Object.entries(collections)) save(`src/data/${name}.json`, data);
  machines.splice(0, machines.length, ...collections['machines/machines']);
  guides.splice(0, guides.length, ...collections['guides/guides']);
}
