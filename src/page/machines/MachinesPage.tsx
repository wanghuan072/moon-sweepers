import { sourceRel } from '@/lib/data/source-label';
import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import EntryFacts from '@/components/content/EntryFacts';
import ItemList from '@/seo/ItemList';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import EntryBrowser from '@/components/content/EntryBrowser';
import Icon from '@/components/common/Icon';
import { machines } from '@/lib/data/catalog';
import { routeMetadata } from '@/seo/metadata';
import s from '@/style/common/listing.module.css';
export const metadata = routeMetadata('/wiki/machines');
const source='https://wikily.gg/moon-sweepers/machines/';
export default function MachinesPage() {
  const production=machines.filter(m=>m.category==='Production');
  const solar=machines.filter(m=>m.category==='Power');
  const logistics=machines.filter(m=>['Logistics','Services'].includes(m.category));
  return <div className={`container ${s.page}`}><PageSchema path="/wiki/machines" collection/>
    <ItemList name="Moon Sweepers Machines" items={machines.filter(e=>e.isDetails===true).map(e=>({title:e.title,href:`/wiki/machines/${e.slug}`}))}/>
    <Breadcrumb items={[{title:'Wiki',href:'/wiki'},{title:'Machines'}]}/>
    <PageHero background="wiki" eyebrow={<><Icon name="gear" size={16}/> EQUIPMENT FIELD MANUAL</>} title={<>Moon Sweepers Machines — Prices, Recipes &amp; Power</>} description={<>Choose equipment for moving dust, processing sand and stone, or powering your base. Compare 11 machines by price, recipe, storage and power needs before connecting a new line.</>}><a className={s.introLink} href="/wiki/machines"><Icon name="compare" size={18}/>Compare equipment side by side <Icon name="arrow" size={16}/></a></PageHero>
    <EntryBrowser entries={machines} kind="machines"/>
    <section className={s.section}><EntryFacts entry={{tables:[
      {title:'Production recipes and operating power',columns:['Machine','Price','Demand','Cycle','Inputs','Output / minute'],rows:production.map(m=>[m.title,`$${m.cost?.toLocaleString('en-US')}`,`${m.power} kW`,`${m.cycle} s`,m.input,m.slug==='pressure-chamber'?'25 kg sand':'10 × 2 kg stone blocks']),rowLinks:production.map(m=>`/wiki/machines/${m.slug}`),note:'Continuous full batches at full power. Machines stop below 8% of required power. Output emission timing is separate from recipe cycle time.',source},
      {title:'Solar panels, batteries and wireless range',columns:['Panel','Price','Full sun','Battery','Range','Follows the Sun'],rows:solar.map(m=>[m.title,`$${m.cost}`,`${m.powerOutput} kW`,m.battery?`${m.battery} kWh`:'None',`${m.range} m`,m.slug==='solar-tracker'?'Yes':'No']),rowLinks:solar.map(m=>`/wiki/machines/${m.slug}`),note:'Fixed panels must face the Sun. Batteries charge from spare generation at 92% efficiency. Peak kW does not guarantee all-night power.',source},
      {title:'Logistics and services',columns:['Equipment','Price','Storage','Footprint','Role'],rows:logistics.map(m=>[m.title,`$${m.cost}${m.costUnit==='metre'?' / m':''}`,m.storage?`${m.storage.toLocaleString('en-US')} kg`:'—',m.footprint||m.stats?.find(item=>item.label==='Footprint')?.value||'See details',m.role]),rowLinks:logistics.map(m=>`/wiki/machines/${m.slug}`),note:'Conveyors run at 1.1 m/s with 0.75 m capsule spacing: an ideal 88 capsules/min. Splitters divide routes; mergers alternate inputs into a shared output.',source}
    ]}}/></section>
    <section className={s.section}><h2>Garage vehicles</h2><p>Compare all five vehicles, including cleaning width, hopper capacity, speed, capsule slots, seats and every upgrade level.</p><div className={s.relatedLinks}><a href="/wiki/joonas-robots">Compare autonomous robots →</a><a href="/wiki/vehicles">Vehicle images &amp; specifications →</a><a href="/guides/automation-guide">Build a production line →</a><a href={source} target="_blank" rel={sourceRel(source)}>Equipment data source: Wikily ↗</a></div></section>
  </div>;
}
