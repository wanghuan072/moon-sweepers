import {isPublicWikiLink} from '@/lib/data/wiki-publication';
import backdrop from '@/style/common/content-backdrop.module.css';
import PageSchema from '@/seo/PageSchema';
import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import {categories,wiki,machines} from '@/lib/data/catalog';
import {routeMetadata} from '@/seo/metadata';
import s from '@/style/common/listing.module.css';
export const metadata=routeMetadata('/wiki');
export default function WikiPage(){
 const cards=categories.map(category=>({title:category.title,href:`/wiki/${category.slug}`,icon:category.icon,description:category.description,count:category.slug==='vehicles'?'5 vehicles · 7 upgrades':category.slug==='buildings'?'98 build-menu pieces':`${wiki.filter(entry=>entry.category===category.slug).length} entries`}));
 const sections=[cards[0],cards[1],cards[2],cards[3],{title:'Machines',href:'/wiki/machines',icon:'gear',description:'Compare 11 machines for logistics, production, power and vehicle servicing.',count:`${machines.length} machines`},cards[4],cards[5],{title:'Achievements',href:'/wiki/achievements',icon:'trophy',description:'Check all 33 unlock conditions, progress counters and the hidden belt-loop achievement.',count:'33 achievements · 8 groups'}].filter(section=>isPublicWikiLink(section.href));
 return <div className={`container ${s.page} ${backdrop.scene}`} data-scene="wiki"><PageSchema path="/wiki" collection/><Breadcrumb items={[{title:'Wiki'}]}/>
  <PageHero background="wiki" eyebrow={<><Icon name="book" size={16}/> YOUR LUNAR FIELD GUIDE</>} title="Moon Sweepers Wiki — Equipment, Stats & Recipes" description="Check prices, capacity and upgrade effects before your next purchase. Browse vehicles, cleaning tools, containers and suit gear, then look up machine recipes, robots, buildings or achievement requirements."/>
  <div className={s.categoryGrid} data-layout="index">{sections.map((section,index)=><a key={section.href} href={section.href} className={s.categoryCard}><span aria-hidden="true">{String(index+1).padStart(2,"0")}</span><Icon name={section.icon} size={28}/><h2>{section.title}</h2><p>{section.description}</p><small>{section.count}</small><Icon name="arrow" size={19}/></a>)}</div>
  <section className={s.section}><h2>Put the details to work</h2><p>Follow a setup guide when you are ready to build, compare equipment before spending, or use the map to plan your next trip across the Moon.</p><div className={s.relatedLinks}><a href="/guides">Step-by-step guides →</a><a href="/wiki/machines">Compare equipment →</a><a href="/map">Interactive map →</a></div></section>
 </div>;
}
