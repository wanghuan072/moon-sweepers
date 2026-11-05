import {site} from '@/config/site';
import {isPublicWikiLink} from '@/lib/data/wiki-publication';
import PageSchema from '@/seo/PageSchema';
import Image from 'next/image';
import Icon from '@/components/common/Icon';
import { GuideCard, MachineCard } from '@/components/content/Cards';
import { machines, guides, categories, updates } from '@/lib/data/catalog';
import { routeMetadata } from '@/seo/metadata';
import s from '@/style/page/home/home.module.css';
import {navigation} from '@/config/navigation';
import toolPages from '@/data/tools/pages.json';
import modCatalog from '@/data/mods/mods.json';
export const metadata = routeMetadata('/');
const quickDescriptions:Record<string,string>={
  '/wiki':'Equipment & achievements',
  '/guides':'First steps, factories & saves',
  '/tools':'Payouts & upgrade budgets',
  '/mods':'Additions & requirements',
  '/map':'Flags, lunar sites & stations',
  '/updates':'Released patches & future plans',
};
const quick=navigation.filter(item=>item.href in quickDescriptions);
const wikiSections=[...categories.slice(0,4),{slug:'machines',title:'Machines',icon:'gear'},...categories.slice(4),{slug:'achievements',title:'Achievements',icon:'trophy'}];
const modHighlights=modCatalog.entries.filter(mod=>['quickstart','moon-sweepers-qol','moon-skimmer'].includes(mod.slug));
const playQuestion = "Where can I play Moon Sweepers?";
export const faqs = [
  [playQuestion, "Moon Sweepers is available on Steam for Windows PC."],
  ['What do you do in Moon Sweepers?', 'Collect lunar dust, deliver it to a station and spend the earnings on better tools, vehicles and upgrades. Later, robots and conveyor-connected machines can take over parts of the cleanup.'],
  ['Can I play alone or with friends?', 'Both. The game supports single-player and online co-op with up to 16 players. A crew shares the host’s world, wallet and Upgrade Matrix, while purchased vehicles belong to individual players.'],
  ['How do I sell my first load?', 'Carry your tool to the station’s deposit intake, unload it and use the launch control. A connected conveyor can deliver dust and stone to the intake automatically.'],
  ['Do I need a Packager to start?', 'No. You can clean and deliver by hand first. A $100 Packager transfers hand-tool dust onto a belt; a robot vacuum collects around its own dock instead. Both belt routes need a receiving destination.'],
  ['Why is my Stone Press not working?', 'The press needs both raw dust and sand, enough power and space for its output. Turning every incoming dust capsule into sand removes one of its required ingredients.'],
  ['Where can I find flags and lunar sites?', 'Use the interactive map to search 195 flags, 26 lunar sites and four stations. Select a marker for its coordinates and reward, then mark visited locations in your browser.'],
  ['Where are save backups stored?', 'Windows backups are under AppData/LocalLow/DragDropGames/MoonSweepers/Backups/slot-<n>. Exit the game and copy the current world and backups before attempting a restore.'],
  ['Where can I find community mods?', 'Open Mods to compare community additions, required loaders and co-op notes. Each entry links to its author’s page for files and installation instructions. Check compatibility and keep a world backup before adding a plugin.'],
  ['Is this the official website?', 'No. This is an independent fan wiki. Use the official Steam listing for purchases and developer announcements; use this site for equipment details, setup guides, maps and planning tools.'],
];
export default function HomePage() {
  const guideIntros:Record<string,string>={
    'beginners-guide':'Make your first sale and choose what to buy next.',
    'how-to-use-packager':'Connect a delivery route and find where capsules get stuck.',
    'automation-guide':'Keep dust, sand, belts and power working together.',
  };
  const bySlug=new Map(guides.map(entry=>[entry.slug,{...entry,description:guideIntros[entry.slug] || entry.description}]));
  const starterGuides=['beginners-guide','how-to-use-packager','automation-guide'].flatMap(slug=>bySlug.has(slug)?[bySlug.get(slug)!]:[]);
  const updateHighlights=[...updates.filter(entry=>entry.version).slice(0,2),...updates.filter(entry=>entry.category==='Roadmap').slice(0,1)];
  return <div className={s.home}><PageSchema path="/"/>
    <section className={s.hero} aria-labelledby="home-title">
      <Image className={s.heroArtwork} src="/images/home/cleanup-hero.webp" alt="Original concept illustration of an astronaut sweeping beside an orange lunar factory" fill priority sizes="100vw" />
      <div className={s.heroShade} /><div className={`container ${s.heroContent}`}><span className={s.tag}>THE FIELD MANUAL FOR YOUR MOON</span><h1 id="home-title">Moon Sweepers<br /><span>Your Next Step on the Moon</span></h1><p className={s.subtitle}>{quick.map(item=>item.title).join(' · ')}</p><p className={s.intro}>From your first dust delivery to a conveyor-fed factory, find help with the next job. Compare equipment, follow a guide, check your budget, browse community mods or choose where to explore next.</p><div className={s.buttons}><a href="/wiki" className={s.primary}><Icon name="rocket" size={18} />Explore Wiki <Icon name="arrow" size={18} /></a><a href="/guides" className={s.secondary}><Icon name="compass" size={18} />Start Guides</a></div></div><span className={s.artCredit}>ORIGINAL CONCEPT ART · MOON SWEEPERS WIKI</span>
    </section>
    <div className={`container ${s.dashboard}`}>
      <section className={s.quickNav} aria-label="Explore Moon Sweepers">{quick.map(item => <a key={item.href} href={item.href}><Icon name={item.icon} size={32} /><div><strong>{item.title}</strong><span>{quickDescriptions[item.href]}</span></div><Icon name="chevron" size={20} /></a>)}</section>
      <div className={s.topRow}>
        <section className={s.panel} aria-labelledby="getting-started"><div className={s.panelHeading}><h2 id="getting-started"><span />Guides for Your Next Job</h2><a href="/guides">All guides <Icon name="arrow" size={14} /></a></div><div className={s.starterGrid}>{starterGuides.map(entry => <GuideCard key={entry.slug} entry={entry} />)}</div></section>
        <section className={s.panel} aria-labelledby="machines-title"><div className={s.panelHeading}><h2 id="machines-title"><span />Machines</h2><a href="/wiki/machines">View all <Icon name="arrow" size={14} /></a></div><div className={s.machineGrid}>{machines.slice(0, 4).map(machine => <MachineCard key={machine.slug} machine={machine} compact />)}</div><p className={s.microcopy}>Compare prices, power and production recipes.</p></section>
      </div>
      <div className={s.middleRow}>
        <section className={s.panel} aria-labelledby="tools-title"><div className={s.panelHeading}><h2 id="tools-title"><span />Tools &amp; Calculators</h2><a href="/tools">All tools <Icon name="arrow" size={14} /></a></div><p className={s.panelIntro}>Check your delivery payout and budget for the next upgrade.</p><div className={s.toolLinks}>{toolPages.map(tool=><a key={tool.slug} href={`/tools/${tool.slug}`}><Icon name={tool.icon} size={24}/><strong>{tool.title}</strong><Icon name="chevron" size={17}/></a>)}</div></section>
        <section className={s.panel} aria-labelledby="wiki-title"><div className={s.panelHeading}><h2 id="wiki-title"><span />Explore the Wiki</h2><a href="/wiki">All categories <Icon name="arrow" size={14} /></a></div><p className={s.panelIntro}>Compare equipment before spending your crew’s funds.</p><div className={s.wikiGrid}>{wikiSections.filter(c=>isPublicWikiLink(`/wiki/${c.slug}`)).map(c => <a key={c.slug} href={`/wiki/${c.slug}`}><Icon name={c.icon} size={27} /><strong>{c.title}</strong></a>)}</div></section>
        <section className={s.panel} aria-labelledby="mods-title"><div className={s.panelHeading}><h2 id="mods-title"><span />Community Mods</h2><a href="/mods">All mods <Icon name="arrow" size={14}/></a></div><p className={s.panelIntro}>Try a quicker start, a landmark scanner or a flying cleaner. Check the loader and compatibility notes before installing.</p><div className={s.toolLinks}>{modHighlights.map(mod=><a href={`/mods#${mod.slug}`} key={mod.slug}><Icon name={mod.icon} size={24}/><strong>{mod.title}</strong><Icon name="chevron" size={17}/></a>)}</div><p className={s.microcopy}>Open each listing for requirements and the author’s download page.</p></section>
      </div>
      <div className={s.bottomRow}>
        <section className={s.panel} aria-labelledby="map-title"><div className={s.panelHeading}><h2 id="map-title"><span />Explore the Moon</h2><a href="/map">Open map <Icon name="arrow" size={14}/></a></div><p className={s.panelIntro}>Pick a destination among 195 flags, 26 lunar sites and four stations. Search by name or coordinate, check discovery rewards and mark the places you have visited.</p><div className={s.topicLinks}><a href="/map"><Icon name="compass" size={20}/> Find your next stop on the interactive map →</a></div><p className={s.microcopy}>Visited places stay in your browser; the map does not read your game save.</p></section>
        <section className={s.panel} aria-labelledby="updates-title"><div className={s.panelHeading}><h2 id="updates-title"><span />Updates &amp; Plans</h2><a href="/updates">View all <Icon name="arrow" size={14} /></a></div><div className={s.updatesList}>{updateHighlights.map(e => <a key={e.slug} href={`/updates#${e.slug}`}><span>{e.version ? `v${e.version}` : 'PLANNED'}</span><strong>{e.title}</strong><time dateTime={(e.announcedAt || e.updatedAt)}>{new Date((e.announcedAt || e.updatedAt) + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</time></a>)}</div><p className={s.microcopy}>Version labels mark released patches. Planned work is not a released feature.</p></section>

      </div>
        <section className={s.panel} aria-labelledby="buy-title"><div className={s.panelHeading}><h2 id="buy-title"><span />Where to Buy &amp; Play</h2></div><p className={s.panelIntro}>Moon Sweepers is available on Steam for Windows PC.</p><nav className={s.topicLinks} aria-label="Buying Moon Sweepers"><a href={site.steam} target="_blank" rel="noopener noreferrer">Buy Moon Sweepers on Steam ↗</a><a href="/where-to-play">Check price and supported platforms →</a></nav></section>
        <section className={`${s.panel} ${s.faq}`} aria-labelledby="faq-title"><div className={s.panelHeading}><h2 id="faq-title"><span />Frequently Asked Questions</h2></div>{faqs.map(([q, a]) => <div className={s.faqItem} key={q}><h3>{q}</h3><p>{a}{q === playQuestion && <> <a href="/where-to-play">See the price and platform details.</a></>}</p></div>)}</section>
      <section className={s.panel} aria-labelledby="about-game-title"><div className={s.panelHeading}><h2 id="about-game-title"><span />A Whole Moon to Clean</h2></div><p className={s.panelIntro}>Moon Sweepers starts with a toothbrush and a dusty lunar surface. Sell what you collect, carry more on each trip and work toward brooms, cleaning vehicles and automated production. Play on your own or divide the work with a crew of up to 16 players.</p><p className={s.panelIntro}>This wiki helps with the decisions between deliveries: which upgrade changes your route, why a machine has stopped, how much power a line needs and where to explore next. Look up equipment, follow a guide, use the map and calculators, or compare community mods before changing your setup. The Updates page separates released changes from future plans.</p><nav className={s.topicLinks} aria-label="Learn about the game and site"><a href="/guides/beginners-guide">Start with your first delivery →</a><a href="/legal/about-us">How this fan wiki is maintained →</a></nav></section>
      <section className={s.panel} aria-labelledby="field-reference-title"><div className={s.panelHeading}><h2 id="field-reference-title"><span />Plan Your Next Step</h2></div><nav className={s.topicLinks} aria-label="Game guides and references"><a href="/guides/how-to-use-packager">Packager setup &amp; fixes →</a><a href="/guides/automation-guide#how-the-stone-press-works">How the Stone Press works →</a><a href="/wiki/joonas-robots">Joonas robot specifications →</a><a href="/map">Interactive map &amp; flag locations →</a><a href="/guides/save-recovery-guide">Save files &amp; backups →</a>{isPublicWikiLink("/wiki/achievements") && <a href="/wiki/achievements">Choose an achievement goal →</a>}<a href="/mods">Community mods &amp; requirements →</a></nav></section>
      <div className={s.bottomNote}><span><Icon name="verified" size={15} /> Independent fan wiki · Game details and version notes included</span><a href="/legal/about-us">About this wiki &amp; corrections <Icon name="arrow" size={14} /></a></div>
    </div>
  </div>;
}
