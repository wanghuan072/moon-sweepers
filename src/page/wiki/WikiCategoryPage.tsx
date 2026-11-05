import {isPublicWikiLink} from '@/lib/data/wiki-publication';
import AchievementsPage, { achievementsPublished, metadata as achievementsMetadata } from './AchievementsPage';
import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import VehicleCards from '@/components/content/VehicleCards';
import WikiBrowser from '@/components/content/WikiBrowser';
import EntryFacts from '@/components/content/EntryFacts';
import overview from '@/data/wiki/category-overviews.json';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import { categories, wiki } from '@/lib/data/catalog';
import { routeMetadata } from '@/seo/metadata';
import s from '@/style/common/listing.module.css';
export function generateStaticParams() {
  return [...categories.map(c => ({ category: c.slug })), ...(achievementsPublished ? [{ category: 'achievements' }] : [])];
}
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (category === 'achievements') return achievementsMetadata; const c = categories.find(c => c.slug === category); return c ? routeMetadata(`/wiki/${c.slug}`) : {}; }
export default async function WikiCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (category === 'achievements') return <AchievementsPage />;
  const c = categories.find(c => c.slug === category); if (!c) notFound();
  return <div className={`container ${s.page}`}><PageSchema path={`/wiki/${c.slug}`} collection/><Breadcrumb items={[{ title: 'Wiki', href: '/wiki' }, { title: c.title }]} /><PageHero background="wiki" eyebrow={<><Icon name={c.icon} size={16} /> WIKI / {c.title.toUpperCase()}</>} title={c.heroTitle || `Moon Sweepers ${c.title}`} description={<>{c.description}</>}></PageHero>{category === "vehicles" && <VehicleCards vehicles={wiki.filter(e=>e.category==="vehicles" && e.stats?.some(stat=>stat.label==="Base purchase"))} />}{category === "vehicles" && <><section className={s.section} id="vehicle-upgrades"><h2>Vehicle Upgrades</h2><p>Each vehicle keeps its own upgrade levels. Compare motors, hopper capacity, boost, cleaning width, unloading and lights before spending crew funds.</p></section><WikiBrowser entries={wiki.filter(e=>e.category==="vehicles"&&e.slug!=="vehicle-tricks"&&!e.stats?.some(stat=>stat.label==="Base purchase"))} category={category}/><section className={s.section} id="vehicle-tricks"><h2>Vehicle Tricks</h2><p>Flips, rolls, spins and airtime pay on a clean landing, with a $25 cap. A wipeout earns nothing.</p>{isPublicWikiLink("/wiki/vehicles/vehicle-tricks") && <a href="/wiki/vehicles/vehicle-tricks">Check trick rewards and combo rules →</a>}</section></>}{category !== "vehicles" && <WikiBrowser entries={wiki.filter(e=>e.category===category&&e.slug!=='achievements')} category={category}/>}<EntryFacts entry={overview[category as keyof typeof overview]} />{category==='buildings'&&<section className={s.section}><h2>Build Menu Rules and Styles</h2><p>All 98 pieces are paid from crew funds. The 84 structures include foundations, walls, floors, roofs, railings and catwalks. Removing structures or belts refunds their full price.</p><p>Use R with the Building Tool to move a piece and the objects standing on it. Check belt connections afterward. Square foundation pieces offer Concrete, Diamond Plate, Grating, Lit and Hazard Stripes finishes at the same price.</p></section>}<section className={s.section}><h2>Continue exploring</h2><div className={s.relatedLinks}>{c.relatedLinks?.map(link => <a href={link.href} key={link.href}>{link.title} →</a>)}<a href="/wiki">All wiki categories →</a></div></section></div>;
}
