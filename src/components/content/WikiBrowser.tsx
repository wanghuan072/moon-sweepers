'use client';
import {useState} from 'react';
import Image from 'next/image';
import Icon from '@/components/common/Icon';
import type {Entry} from '@/types/content';
import s from '@/style/common/wiki-browser.module.css';
export default function WikiBrowser({entries,category}:{entries:Entry[];category:string}){
  const [query,setQuery]=useState('');
  const ordered=category==='cleaning-tools'?[...entries].sort((a,b)=>Number(a.stats?.find(stat=>stat.label==='Base price')?.value.replace(/[$,]/g,''))-Number(b.stats?.find(stat=>stat.label==='Base price')?.value.replace(/[$,]/g,''))):entries;
  const filtered=ordered.filter(e=>`${e.title} ${e.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className={s.browser} data-category={category}><div className={s.controls}><label><Icon name="search" size={18}/><span className="sr-only">Search {category}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${category}…`} /></label><span aria-live="polite">{filtered.length} entries</span></div>
    <div className={s.grid}>{filtered.map(entry=>{const image=entry.image && entry.imageKind !== 'concept' && entry.imageKind !== 'diagram';const stats=entry.stats?.filter(stat=>!stat.label.includes('source')).slice(0,4);const Card = entry.isDetails === true ? "a" : "div"; return <Card key={entry.slug} data-text-only={!image || undefined} className={`${s.card} ${entry.imageRole==='icon'?s.iconCard:''}`} href={entry.isDetails !== true ? undefined : entry.slug==='achievements'?'/wiki/achievements':`/wiki/${entry.category}/${entry.slug}`}>{image && <div className={s.visual}><Image src={entry.image!} alt={entry.imageAlt||entry.title} fill sizes={entry.imageRole==='icon'?'90px':'(max-width:768px) 90vw, 350px'} unoptimized={entry.imageKind==='reference'||entry.imageKind==='official'}/></div>}<div className={s.body}><small>{category.replaceAll('-',' ')}</small><h2>{entry.title}</h2><p>{entry.description}</p>{Boolean(stats?.length)&&<dl>{stats?.map(stat=><div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>}{entry.isDetails === true && <span className={s.link}>View details <span>↗</span></span>}</div></Card>})}</div>{!filtered.length&&<p>No matching entries. Try another name or clear the filter.</p>}
  </section>;
}
