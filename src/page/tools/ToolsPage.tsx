import backdrop from '@/style/common/content-backdrop.module.css';
import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import pages from '@/data/tools/pages.json';
import {routeMetadata} from '@/seo/metadata';
import s from '@/style/page/tools/tools.module.css';
export const metadata=routeMetadata('/tools');
export default function ToolsPage(){return <div className={`container ${s.page} ${backdrop.scene}`} data-scene="tools"><PageSchema path="/tools" collection/><Breadcrumb items={[{title:'Tools'}]}/><PageHero background="tools" eyebrow={<><Icon name="calculator" size={16}/> YOUR LUNAR PLANNING DESK</>} title="Moon Sweepers Calculators — Income & Upgrades" description="Work out what a delivery will pay and how much to set aside for your next upgrade. Compare sale values, calculate a full load’s income, or use the upgrade tree and cost planner to check what you need to buy first."/>
 <div className={s.toolGrid}>{[{title:"Delivery and income",items:pages.slice(0,2)},{title:"Research and upgrades",items:pages.slice(2)}].map(({title,items})=><section className={s.toolLane} key={title}><h2>{title}</h2>{items.map((page,i)=><a className={s.toolCard} href={`/tools/${page.slug}`} key={page.slug}><div className={s.cardTop}><Icon name={page.icon} size={32}/><span>0{i+1}</span></div><small>{page.label}</small><h3>{page.title}</h3><p>{page.description}</p><span className={s.cardAction}>Open {page.title.toLowerCase()} <Icon name="arrow" size={18}/></span></a>)}</section>)}</div>
 <section className={s.explanation}><h2>Start with the decision you are making</h2><p>Use Selling and Income when you need to understand a payout. Open the Income Calculator for a specific launch or full tool load. The Upgrade Matrix shows where each purchase fits; the Upgrade Calculator adds the levels and prerequisites to a budget.</p><p>Game rules use version 1.0.5. Calculated sale values do not predict how much you will earn per hour: travel, dust supply, power and interruptions still affect your session.</p></section></div>;}
