import backdrop from '@/style/common/content-backdrop.module.css';
import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import ItemList from '@/seo/ItemList';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import {GuideCard} from '@/components/content/Cards';
import {guides} from '@/lib/data/catalog';
import {routeMetadata} from '@/seo/metadata';
import Icon from '@/components/common/Icon';
import s from '@/style/common/listing.module.css';
export const metadata=routeMetadata('/guides');
export default function GuidesPage(){
 return <div className={`container ${s.page} ${backdrop.scene}`} data-scene="guides"><PageSchema path="/guides" collection/><ItemList name="Moon Sweepers Guides" items={guides.map(e=>({title:e.title,href:`/guides/${e.slug}`}))}/><Breadcrumb items={[{title:'Guides'}]}/><PageHero background="guides" eyebrow={<><Icon name="compass" size={16}/> A GUIDE FOR THE JOB IN FRONT OF YOU</>} title="Moon Sweepers Guides — Help With Your Next Job" description="Choose the guide for what you are doing now: making your first sale, connecting a Packager, building a sand-and-stone line or backing up your world. Each one walks through the setup and the problems to check along the way."/>
 <div className={s.guideGrid} data-layout="guide-cards">{guides.map(entry=><GuideCard entry={entry} key={entry.slug}/>)}</div>
 <section className={s.section}><h2>Keep the useful numbers close</h2><p>Use the Wiki for equipment prices and specifications, the calculators for a particular load or purchase, and the map when you are ready to explore.</p><div className={s.relatedLinks}><a href="/wiki">Equipment and upgrades →</a><a href="/tools">Income and upgrade planning →</a><a href="/map">Flags and lunar sites →</a></div></section></div>;
}
