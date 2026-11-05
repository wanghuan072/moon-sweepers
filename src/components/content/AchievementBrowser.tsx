'use client';
import {useState} from 'react';
import Icon from '@/components/common/Icon';
import s from '@/style/common/listing.module.css';
import tableStyles from '@/style/common/detail.module.css';

export default function AchievementBrowser({rows}:{rows:string[][]}){
 const [query,setQuery]=useState('');
 const [group,setGroup]=useState('All');
 const [sort,setSort]=useState('group');
 const groups=['All',...new Set(rows.map(row=>row[2]))];
 const shown=rows.filter(row=>(group==='All'||row[2]===group)&&row.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 if(sort==='name')shown.sort((a,b)=>a[0].localeCompare(b[0]));
 return <section aria-labelledby="achievement-checklist"><h2 id="achievement-checklist">Achievement checklist</h2>
  <p>Track 22 cumulative goals, four Moon-cleaning milestones and seven one-off events. Search an achievement or choose a group to see what counts toward its unlock.</p>
  <div className={s.controls}><div className={s.search}><Icon name="search" size={18}/><label className="sr-only" htmlFor="achievement-search">Search achievements</label><input id="achievement-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Achievement, goal or group…"/></div><label className={s.sort}>Sort by<select value={sort} onChange={event=>setSort(event.target.value)}><option value="group">Group order</option><option value="name">Name A–Z</option></select></label></div>
  <div className={s.filters} aria-label="Achievement groups">{groups.map(name=><button key={name} type="button" className={group===name?s.selected:''} aria-pressed={group===name} onClick={()=>setGroup(name)}>{name}<span>{name==='All'?rows.length:rows.filter(row=>row[2]===name).length}</span></button>)}</div>
  <p className={s.count} aria-live="polite">{shown.length} of {rows.length} achievements</p>
  <ul className={s.achievementList}>
   {shown.map(([name, condition, group, visibility]) => (
    <li key={name}>
     <Icon name="trophy" size={24} />
     <div><strong>{name}</strong><p>{condition}</p><small>{group} · {visibility === 'Hidden' ? 'Hidden on Steam' : 'Public on Steam'}</small></div>
    </li>
   ))}
  </ul>
  {!shown.length&&<div className={s.empty}><h3>No matching achievements</h3><p>Try another name or clear the selected group.</p><button type="button" onClick={()=>{setQuery('');setGroup('All');}}>Clear filters</button></div>}
  <p className={tableStyles.tableNote}>Dust, delivery, launch and money goals use cumulative counters. Moon-cleaned percentages exclude empty regions. The belt-loop achievement is hidden on Steam.</p>
 </section>;
}
