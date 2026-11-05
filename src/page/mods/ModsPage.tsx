import backdrop from '@/style/common/content-backdrop.module.css';
import Image from 'next/image';
import modsStyles from '@/style/page/mods/mods.module.css';
import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import ItemList from '@/seo/ItemList';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import catalog from '@/data/mods/mods.json';
import {routeMetadata} from '@/seo/metadata';
import s from '@/style/common/listing.module.css';

export const metadata=routeMetadata('/mods');
const groups=[
  {id:'everyday-play',title:'Everyday play',description:'Spend less time in menus, find your next landmark or change how the game behaves while you use another window.'},
  {id:'vehicles-logistics',title:'Vehicles & logistics',description:'Try new ways to collect and move dust. These add equipment to a world, so read the author’s removal instructions before installing.'},
  {id:'visuals',title:'Visuals',description:'Change the view above your cleanup route without adding another production step.'},
];

export default function ModsPage(){
  return <div className={`container ${s.page} ${backdrop.scene}`} data-scene="mods">
    <PageSchema path="/mods" collection/>
    <ItemList name="Moon Sweepers Mods" items={catalog.entries.map(mod=>({title:mod.title,href:`/mods#${mod.slug}`}))}/>
    <Breadcrumb items={[{title:'Mods'}]}/>
    <PageHero background="mods" eyebrow={<><Icon name="layers" size={16}/> COMMUNITY MODS</>} title="Moon Sweepers Mods — Find Your Next Addition" description="Want a quicker start, help finding landmarks or a different way to move dust? Browse community mods by what they change, check the required loader and open the author’s page for files and installation instructions." />
    <nav className={s.relatedLinks} aria-label="Mod categories">{groups.map(group=><a href={`#${group.id}`} key={group.id}>{group.title}</a>)}<a href="#installation">Loaders &amp; installation</a></nav>
    <p className={s.note}>If you’re new to Moon Sweepers mods, start with one that solves a problem you already run into. QuickStart is a good starting point for solo play, while Moon Sweepers QoL is worth a look if you’re hunting flags. These picks are based on the authors’ release notes and requirements.</p>
    {groups.map(group=><section className={s.section} id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
      <h2 id={`${group.id}-title`}>{group.title}</h2><p>{group.description}</p>
      <ul className={s.timeline}>{catalog.entries.filter(mod=>mod.category===group.title).map(mod=><li className={`${s.update} ${modsStyles.row}`} id={mod.slug} key={mod.slug}>
        <div className={modsStyles.cover}>
          <Image src={mod.image} alt={`${mod.title} cover image`} fill unoptimized referrerPolicy="no-referrer" />
        </div>
        <article>
          <h3>{mod.recommendationTitle}</h3>
          <p>{mod.recommendation}</p>
          <ul>
            <li><strong>What it does.</strong> {mod.description}</li>
            <li><strong>Requires.</strong> {mod.requirements}</li>
            <li><strong>Before you install.</strong> {mod.compatibility}</li>
          </ul>
          <a className={s.introLink} href={mod.url} target="_blank" rel="noopener noreferrer">{mod.title} by {mod.author} on Nexus Mods <Icon name="external" size={14}/></a>
        </article>
      </li>)}</ul>
    </section>)}
    <section className={s.section} id="installation"><h2>Match the loader to the mod</h2><p>The releases listed here use BepInEx 6 IL2CPP with the MoonSweepers BepInEx Patcher. The patcher author specifies build 6.0.0-be.791 for Unity.IL2CPP Windows x64; the Mono, Framework and CoreCLR packages are different builds. Mass Driver also needs MoonFramework, linked in its author’s requirements.</p>
      <ol><li>Close the game and copy your current world and backups. Use the <a href="/guides/save-recovery-guide">Windows save and backup guide</a> to find the right host slot.</li><li>Read the mod’s Requirements and installation notes. Follow the <a href="https://www.nexusmods.com/moonsweepers/mods/9" target="_blank" rel="noopener noreferrer">MoonSweepers BepInEx Patcher instructions</a> for the loader and first launch.</li><li>Keep the folder layout supplied by the author. BepInEx plugins belong in the stated BepInEx folders; a different loader’s Mods folder is not interchangeable.</li><li>Try one addition in a separate world first. For co-op, follow each author’s host and client requirements rather than assuming everyone needs the same setup.</li></ol>
      <p>After a game patch, check the mod and loader pages before reopening a world that uses added equipment. Updating a mod is not the same as updating the game, and removing a plugin may need in-game cleanup first.</p>
      <div className={s.relatedLinks}><a href="/guides/save-recovery-guide">Back up your world →</a><a href="/updates">Game patches &amp; plans →</a><a href="/wiki">Unmodded equipment stats →</a></div>
    </section>
    <section className={s.section}><h2>Questions before you install</h2><details><summary>Where do I download these mods?</summary><p>Use the Nexus Mods link on each entry to reach its author’s release, requirements and file history. This site does not host plugin files or installers.</p></details><details><summary>Will a mod work with my current game version?</summary><p>Check the author’s compatibility notes and recent file updates. A recent upload alone does not confirm support for your game version, other installed mods or a shared world.</p></details><details><summary>Can I use several mods together?</summary><p>Start with the required loader and add one plugin at a time. Mods that change the same vehicle controls, upgrade tree or machine behaviour can conflict. Keep an untouched world copy before combining them.</p></details></section>
  </div>;
}
