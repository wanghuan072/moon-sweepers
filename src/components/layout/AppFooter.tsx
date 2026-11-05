import Image from 'next/image';
import {navigation} from '@/config/navigation';
import {site} from '@/config/site';
import s from '@/style/layout/footer.module.css';
const legal=[['Privacy Policy','privacy-policy'],['Terms of Service','terms-of-service'],['Copyright','copyright'],['About Us','about-us'],['Contact Us','contact-us']];
export default function AppFooter(){return <footer className={s.footer}><div className={`container ${s.grid}`}>
 <div><a className={s.brand} href="/"><Image src="/images/logo.svg" width={40} height={40} alt="Moon and sweeping trail"/> MOON SWEEPERS <span>WIKI</span></a><p>Find your next tool, fix a stalled production line or plan a trip across the Moon. Browse equipment, practical guides, calculators, community mods and the interactive map.</p><span className={s.note}>A fan-made guide for your cleanup crew.</span></div>
 <div><strong>EXPLORE</strong>{navigation.slice(0,3).map(item=><a key={item.href} href={item.href}>{item.title}</a>)}</div>
 <div><strong>PLAN YOUR BASE</strong>{navigation.slice(3).map(item=><a key={item.href} href={item.href}>{item.title}</a>)}<a href={site.steam} target="_blank" rel="noopener noreferrer">Game on Steam ↗</a><a href="/sitemap.xml">Sitemap</a></div>
 <div><strong>LEGAL</strong>{legal.map(([title,slug])=><a key={slug} href={`/legal/${slug}`}>{title}</a>)}</div>
 </div><div className={`container ${s.bottom}`}><p>Copyright © {new Date().getUTCFullYear()} moon-sweepers.org. All rights reserved.</p><p>Independent fan site. Not affiliated with or endorsed by DragDrop Games or the game’s publisher. Game assets belong to their respective owners.</p></div></footer>;}
