'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { navigation } from '@/config/navigation';
import type {SearchHit} from '@/lib/search/full-search';
import Icon from '@/components/common/Icon';
import s from '@/style/layout/header.module.css';
export default function AppHeader() {
  const pathname = usePathname();
  const menuToggle=useRef<HTMLButtonElement>(null);
  const headerRef=useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [results,setResults]=useState<SearchHit[]>([]);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>{if(!query.trim()){setResults([]);setLoading(false);return;}setLoading(true);fetch(`/api/search?q=${encodeURIComponent(query)}`,{signal:controller.signal}).then(r=>r.ok?r.json():[]).then(setResults).catch(()=>{if(!controller.signal.aborted)setResults([]);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});},180);return()=>{clearTimeout(timer);controller.abort();};},[query]);

  useEffect(()=>{
    if(!menu)return;
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setMenu(false);menuToggle.current?.focus();}};
    const outside=(event:PointerEvent)=>{if(!headerRef.current?.contains(event.target as Node))setMenu(false);};
    document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);};
  },[menu]);
  useEffect(()=>{
    const query=window.matchMedia('(max-width: 1024px)');const close=()=>setMenu(false);
    query.addEventListener('change',close);return()=>query.removeEventListener('change',close);
  },[]);
  return <header ref={headerRef} className={s.header}>
    <div className={`container ${s.inner}`}>
      <a className={s.logo} href="/" aria-label="Moon Sweepers Wiki home"><span className={s.planet}><Image src="/images/logo.svg" alt="Moon and sweeping trail" width={44} height={44} priority /></span><span>MOON<strong>SWEEPERS</strong></span></a>
      <nav aria-label="Main navigation" className={`${s.nav} ${menu ? s.open : ''}`} id="main-navigation" onKeyDown={event=>{if(event.key==='Escape'){setMenu(false);menuToggle.current?.focus();}}}>
        {navigation.map(item => { const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href); return <a key={item.href} href={item.href} className={active ? s.active : ''} aria-current={active ? 'page' : undefined}><Icon name={item.icon} size={20} />{item.title}</a>; })}
      </nav>
      <div className={s.search} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setSearchOpen(false); }}>
        <form action="/search" role="search" onSubmit={() => setSearchOpen(false)}><label className="sr-only" htmlFor="site-search">Search Moon Sweepers Wiki</label><Icon name="search" size={18} /><input autoComplete="off" id="site-search" name="q" placeholder="Search the wiki…" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setSearchOpen(true)} onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false); }} /><button type="submit" className="sr-only">Search</button></form>
        {searchOpen && query.trim() && <div className={s.results}><span className={s.searchLabel}>SEARCH RESULTS</span>{results.length ? results.map(e => <a key={e.href} href={e.href}><span>{e.title}<small>{e.kind}</small></span><Icon name="chevron" size={16} /></a>) : <p>{loading ? "Searching…" : "No results. Try dust, a parameter or a location."}</p>}<a className={s.allResults} href={`/search?q=${encodeURIComponent(query)}`}>View all results <Icon name="arrow" size={16} /></a></div>}
      </div>
      <button type="button" ref={menuToggle} className={s.menuButton} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'} /></button>
    </div>
  </header>;
}
