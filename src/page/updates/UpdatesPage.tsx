import backdrop from '@/style/common/content-backdrop.module.css';
import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import ItemList from '@/seo/ItemList';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import { updates } from '@/lib/data/catalog';
import { site } from '@/config/site';
import { routeMetadata } from '@/seo/metadata';
import s from '@/style/common/listing.module.css';
export const metadata = routeMetadata('/updates');
const groups = [
  {id:'released',title:'Released patches',description:'Changes shipped in the patches below. Check your installed version before looking for a feature or fix.',entries:updates.filter(e=>e.version)},
  {id:'plans',title:'Future plans',description:'Announced work, kept separate from released features. A target month is a plan, not a confirmed release date.',entries:updates.filter(e=>!e.version && e.category==='Roadmap')},
  {id:'developer-notes',title:'Developer notes',description:'Messages about development priorities and known problems. These are not additional patch releases.',entries:updates.filter(e=>!e.version && e.category!=='Roadmap')},
];
const dateLabel=(date:string)=>new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
export default function UpdatesPage() {
  return <div className={`container ${s.page} ${backdrop.scene}`} data-scene="updates">
    <PageSchema path="/updates" collection/>
    <ItemList name="Moon Sweepers Updates" items={groups.flatMap(group=>group.entries.map(e=>({title:e.title,href:`/updates#${e.slug}`})))}/>
    <Breadcrumb items={[{title:'Updates'}]}/>
    <PageHero background="updates" eyebrow={<><Icon name="megaphone" size={16}/> PATCHES &amp; DEVELOPMENT PLANS</>} title="Moon Sweepers Updates — Patch Notes & Plans" description="See what changed for your machines, base and crew. Read the main fixes in each released patch, then check future plans separately so you can tell what is ready to use and what is still being developed.">
      <a className={s.introLink} href={site.news} target="_blank" rel="noopener noreferrer">Official Steam announcements <Icon name="external" size={16}/></a>
    </PageHero>
    <nav className={s.relatedLinks} aria-label="Update categories">{groups.filter(group=>group.entries.length).map(group=><a href={`#${group.id}`} key={group.id}>{group.title} <span>({group.entries.length})</span></a>)}</nav>
    <p className={s.note}>Checking a patch before reopening your world? <a className={s.introLink} href="/guides/save-recovery-guide">Back up your save first</a>. If you use plugins, <a className={s.introLink} href="/mods#installation">check your mod and loader versions</a> before loading the world.</p>
    {groups.filter(group=>group.entries.length).map(group=><section className={s.section} id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
      <h2 id={`${group.id}-title`}>{group.title}</h2><p>{group.description}</p>
      <ul className={s.timeline} data-layout="chronology">{group.entries.map(e=>{
        const date=e.announcedAt || e.updatedAt;
        return <li key={e.slug} id={e.slug} className={s.update}>
          <div className={s.updateTag}><span>{e.version?`v${e.version}`:e.category==='Roadmap'?'PLANNED':'STUDIO NOTE'}</span><small>{e.version?'Released':'Announced'}</small><time dateTime={date}>{dateLabel(date)}</time></div>
          <article><h3>{e.title}</h3><p>{e.description}</p><ul>{e.sections.map(part=><li key={part.heading}><strong>{part.heading}.</strong> {part.paragraphs.join(' ')}{part.steps?.length?<ul>{part.steps.map(step=><li key={step}>{step}</li>)}</ul>:null}</li>)}</ul><a className={s.introLink} href={e.sources[0] || site.news} target="_blank" rel="noopener noreferrer">Read the developer announcement <Icon name="external" size={14}/></a></article>
        </li>;
      })}</ul>
    </section>)}
    <p className={s.note}>This archive covers announcements dated October 24–30, 2026. The October 30 roadmap targeted December 2026 for update 1.1; it did not confirm an exact release day. Check Steam for announcements published after this archive.</p>
  </div>;
}
