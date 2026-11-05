import PageSchema from '@/seo/PageSchema';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import IncomeCalculator from './components/IncomeCalculator';
import UpgradeCalculator from './components/UpgradeCalculator';
import UpgradeMatrix from './components/UpgradeMatrix';
import SellingAndIncome from './components/SellingAndIncome';
import pages from '@/data/tools/pages.json';
import {notFound} from 'next/navigation';
import {routeMetadata} from '@/seo/metadata';
import s from '@/style/page/tools/tools.module.css';
export const generateStaticParams=()=>pages.map(p=>({slug:p.slug}));
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return pages.some(p=>p.slug===slug)?routeMetadata(`/tools/${slug}`):{};}
export default async function ToolDetailPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,page=pages.find(p=>p.slug===slug);if(!page)notFound();
 return <div className={`container ${s.page}`}><PageSchema path={`/tools/${slug}`}/><Breadcrumb items={[{title:'Tools',href:'/tools'},{title:page.title}]}/><header className={s.toolHeading}><Icon name={page.icon} size={32}/><div><span className={s.manualBadge}>GAME RULES / 1.0.5</span><h1>{page.title}</h1><p>{page.description}</p></div></header>
 {slug==='selling-and-income'?<SellingAndIncome/>:slug==='income-calculator'?<IncomeCalculator/>:slug==='upgrade-calculator'?<UpgradeCalculator/>:<><UpgradeMatrix/><section className={s.explanation}><h2>Budget your matrix purchases</h2><p>Use the same level prices and prerequisites to plan a shopping list. Tools and suit gear can be included alongside matrix upgrades.</p></section><UpgradeCalculator/></>}
 <section className={s.explanation}><h2>{slug==='income-calculator'||slug==='selling-and-income'?'How income is calculated':'How upgrade costs are calculated'}</h2>{slug==='income-calculator'||slug==='selling-and-income'?<><div className={s.formula}>Launch = (dust kg + 3 × sand kg + 7 × stone kg) × (1 + 0.06 × Contracts level + 0.10 × Exchange)<br/>Container kg = tool base capacity × 2^container level × (1 + 0.15 × Compactor level)<br/>Region reward = regions × (10 + 15 × Bounty level), with player credit only</div><p>Full containers and material launches are separate estimates of the same sale system. Do not count the same dust twice. If you are comparing raw dust with processed materials, <a href="/guides/automation-guide">see how the sand and stone production line works</a>. Team-credited regions receive the $10 base reward without Region Bounty.</p></>:<><div className={s.formula}>Budget = unowned selected levels + missing fixed prerequisites<br/>Discounted tool / container price = base price × (1 − 0.05 × Supplier level), rounded to cents</div><p>The planner buys fixed prerequisites first and counts shared requirements once. A chosen container also needs its cleaning tool. If Dust Compactor has no chosen or owned container, the total stays incomplete and lists the alternatives without inventing a purchase.</p><p>Purchase order matters: Supplier Network affects eligible purchases after it. Already-owned levels are not charged again; an owned upgrade implies its fixed prerequisites are already owned. For garage purchases, <a href="/wiki/vehicles#vehicle-upgrades">compare vehicle upgrades separately</a>.</p></>}
 <div className={s.related}>{pages.filter(p=>p.slug!==slug).map(p=><a key={p.slug} href={`/tools/${p.slug}`}>{p.title} →</a>)}<a href={`https://wikily.gg/moon-sweepers/${slug}`} target="_blank" rel="noopener noreferrer">Game data: Wikily ↗</a></div></section></div>;
}
