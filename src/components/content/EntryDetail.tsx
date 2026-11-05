import AchievementBrowser from '@/components/content/AchievementBrowser';
import {isPublicWikiLink} from '@/lib/data/wiki-publication';
import Image from 'next/image';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import { MachineCard, SourceNote } from '@/components/content/Cards';
import EntryFacts from '@/components/content/EntryFacts';
import ProductionFlows from '@/components/content/ProductionFlows';
import { guides, machines, entryPath } from '@/lib/data/catalog';
import type { Entry } from '@/types/content';
import type { Machine } from '@/types/machine';
import JsonLd from '@/seo/JsonLd';
import { site } from '@/config/site';
import s from '@/style/common/detail.module.css';
const anchor = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export default function EntryDetail({ entry, kind }: { entry: Entry; kind: 'guides' | 'machines' | 'updates' | 'wiki' }) {
  const machine = kind === 'machines' ? entry as Machine : null;
  const label = { guides: 'Guides', machines: 'Machines', updates: 'Updates', wiki: 'Wiki' }[kind];
  const path = entryPath(kind,entry);
  const crumbs = [...(kind==='machines'?[{title:'Wiki',href:'/wiki'}]:[]), { title: label, href: kind==='machines'?'/wiki/machines':`/${kind}` }, ...(kind === 'wiki' && entry.slug!=='achievements' ? [{ title: entry.category==='joonas-robots'?'J.O.O.N.A.S. Robots':entry.category.split('-').map(word=>word[0].toUpperCase()+word.slice(1)).join(' '), href: `/wiki/${entry.category}` }] : []), { title: entry.title }];
  const saveGuide=entry.slug==='save-recovery-guide';
  const guideSlugs=saveGuide?['beginners-guide']:kind==='guides'?entry.related || []:kind==='machines'?entry.category==='Power'||entry.category==='Services'?['automation-guide']:['how-to-use-packager','automation-guide']:entry.category==='joonas-robots'||entry.category==='buildings'?['automation-guide']:['beginners-guide'];
  const relevantTools=saveGuide?[{title:'Released patches and save fixes',href:'/updates#released'}]:entry.category==='vehicles'?[{title:'Compare vehicle upgrade prices',href:'/wiki/vehicles#vehicle-upgrades'}]:entry.category==='achievements'?[{title:'Find flags and lunar sites',href:'/map'}]:kind==='machines'||entry.category==='joonas-robots'?[{title:'Selling and income',href:'/tools/selling-and-income'}]:[{title:'Plan upgrade costs',href:'/tools/upgrade-calculator'}];
  const candidates=[...(saveGuide?[]:entry.relatedLinks || []),...relevantTools,...guides.filter(guide=>guide.slug!==entry.slug && guideSlugs.includes(guide.slug)).map(guide=>({title:guide.title,href:`/guides/${guide.slug}`}))];
  const nextLinks=[...new Map(candidates.filter(link=>isPublicWikiLink(link.href)).map(link=>[link.href,link])).values()];
  const relatedMachines=machine?machines.filter(other=>other.slug!==entry.slug && other.category===machine.category).slice(0,3):[];
  return <article className={`container ${s.page}`}><Breadcrumb items={crumbs} />
    {<JsonLd data={{ '@context': 'https://schema.org', '@type': kind === 'machines' ? 'TechArticle' : 'Article', headline: entry.title, description: entry.description, dateModified: entry.updatedAt, ...(entry.publishedAt ? {datePublished:entry.publishedAt} : {}), author: { '@type': 'Organization', '@id':site.url+'/#organization',name:site.name,url:`${site.url}/legal/about-us` }, mainEntityOfPage: `${site.url}${path}`, ...(entry.image ? { image: `${site.url}${entry.image}` } : {}) }} />}
    <div className={s.masthead} data-kind={kind}><header className={s.heading}><span className={s.kicker}>{label.toUpperCase()} / {entry.slug==='achievements'?'ACHIEVEMENTS':entry.category.toUpperCase()}</span><h1>{entry.title}</h1><p>{entry.description}</p><div className={s.meta}><span><Icon name="clock" size={14} />Updated <time dateTime={entry.updatedAt}>{entry.updatedAt}</time></span><span>{kind === 'updates' ? entry.version ? `Released patch ${entry.version}` : entry.category === 'Developer letter' ? 'Developer letter' : 'Roadmap · not released' : entry.version ? `Game version ${entry.version}` : 'Version details below'}</span><span>{entry.announcedAt ? `Game announcement: ${entry.announcedAt}` : entry.status === 'community' ? 'Version & data notes below' : 'Developer documentation linked below'}</span></div></header>
    {entry.image && kind !== 'machines' && <figure className={`${s.figure} ${entry.imageRole === "icon" ? s.iconFigure : entry.imageKind === "reference" ? s.equipmentFigure : ""}`}><div className={s.cover}><Image src={entry.image} unoptimized={entry.imageKind === "official" || entry.imageKind === "reference"} alt={entry.imageAlt || "Lunar cleanup concept illustration; not a gameplay screenshot"} fill sizes="(max-width: 768px) 100vw, 1000px" priority /></div><figcaption>{entry.imageCaption || "Concept illustration supplied with the design brief. Not a gameplay screenshot."}{entry.imageSource && <> <a href={entry.imageSource} target="_blank" rel="noopener noreferrer">View original ↗</a></>}</figcaption></figure>}
    </div>
    {machine && <div className={s.machineOverview}><div className={s.blueprint}><Image src={machine.image!} unoptimized={machine.imageKind === "reference"} alt={machine.imageAlt || `${machine.title} parameter diagram`} width={720} height={420} loading="eager" /><small>{machine.imageKind === "reference" ? machine.imageCaption : "PARAMETER DIAGRAM / NOT AN IN-GAME MODEL"}{machine.imageSource && <> <a href={machine.imageSource} target="_blank" rel="noopener noreferrer">Source ↗</a></>}</small></div><div><span className={s.kicker}>MACHINE STATS</span><h2>Equipment at a glance</h2><dl className={s.stats}>{(machine.stats || []).map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl><a href="/wiki/machines" className={s.inlineLink}>Compare this machine <Icon name="arrow" size={16} /></a></div></div>}
    {entry.flows && <ProductionFlows flows={entry.flows} />}
    <div className={s.articleLayout}><aside className={s.toc}><strong>ON THIS PAGE</strong><nav aria-label="Table of contents">{entry.slug==='achievements'&&<a href="#achievement-checklist">All 33 achievements</a>}{entry.sections.map(section => <a key={section.heading} href={`#${anchor(section.heading)}`}>{section.heading}</a>)}</nav><a href={relevantTools[0].href} className={s.tocTool}><Icon name={entry.category==='vehicles'?'truck':'calculator'} size={22}/>{relevantTools[0].title} →</a></aside><div className={s.prose} data-kind={kind}>
      {entry.slug==='achievements'?<AchievementBrowser rows={entry.tables?.[0]?.rows || []}/>:<EntryFacts entry={entry} showStats={!machine} />}
      {entry.sections.map((section,index) => <section key={section.heading} id={anchor(section.heading)}><h2><span className={s.chapterNumber} aria-hidden="true">{String(index+1).padStart(2,"0")}</span>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}{section.steps && <ol>{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}</section>)}
      {entry.faqs && <section><h2>Frequently asked questions</h2>{entry.faqs.map(faq=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
      <SourceNote entry={entry} />
    </div></div>
    <section className={s.related}><h2>Next steps</h2><div className={s.relatedLinks}>{nextLinks.map(link=><a key={link.href} href={link.href}>{link.title} →</a>)}</div></section>
    {relatedMachines.length>0 && <section className={s.related}><h2>Compare related equipment</h2><div className={s.machineGrid}>{relatedMachines.map(other=><MachineCard machine={other} key={other.slug} compact/>)}</div></section>}
  </article>;
}
