import type {CSSProperties, ReactNode} from 'react';
import {developmentScreenshot} from '@/lib/media/development-media';
import s from '@/style/common/page-hero.module.css';

type HeroBackground = 'guides' | 'wiki' | 'tools' | 'mods' | 'updates';
const screenshots: Record<HeroBackground, number> = {
 guides: 7,
 wiki: 3,
 tools: 6,
 mods: 2,
 updates: 11,
};

export default function PageHero({eyebrow,title,description,children,background}:{eyebrow?:ReactNode;title:ReactNode;description:ReactNode;children?:ReactNode;background?:HeroBackground}){
 const screenshot = background && developmentScreenshot(screenshots[background], '');
 const style = screenshot ? {'--hero-image': `url("${screenshot.image}")`} as CSSProperties : undefined;
 return <header className={background ? s.hero + ' ' + s[background] : s.hero} style={style}>
  <div className={s.content}>
   {eyebrow&&<div className={s.eyebrow}>{eyebrow}</div>}
   <h1>{title}</h1><p className={s.description}>{description}</p>
   {children&&<div className={s.actions}>{children}</div>}
  </div>
  <div className={s.coordinates}><span>{screenshot ? 'STEAM SCREENSHOT · © DRAGDROP GAMES' : 'FIELD GUIDE / LUNAR OPERATIONS'}</span><i/><span>MOON SWEEPERS WIKI</span></div>
 </header>;
}
