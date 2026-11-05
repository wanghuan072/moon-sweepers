'use client';
import { useState } from 'react';
import type { Entry } from '@/types/content';
import type { Machine } from '@/types/machine';
import { GuideCard, MachineCard } from '@/components/content/Cards';
import Icon from '@/components/common/Icon';
import s from '@/style/common/listing.module.css';
export default function EntryBrowser({ entries, kind }: { entries: Entry[]; kind: 'machines' | 'guides' }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const categories = ['All', ...new Set(entries.map(e => e.category))];
  const filtered = entries.filter(e => (category === 'All' || e.category === category) && `${e.title} ${e.description} ${e.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'price-low') filtered.sort((a, b) => ((a as Machine).cost ?? Infinity) - ((b as Machine).cost ?? Infinity));
  if (sort === 'price-high') filtered.sort((a, b) => ((b as Machine).cost ?? -Infinity) - ((a as Machine).cost ?? -Infinity));
  if (sort === 'newest') filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title));
  return <><div className={s.controls}><div className={s.search}><Icon name="search" size={18} /><label className="sr-only" htmlFor="entry-search">Search {kind}</label><input id="entry-search" value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${kind}…`} /></div><label className={s.sort}>Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="name">Name A–Z</option><option value="newest">Last updated</option>{kind === "machines" && <><option value="price-low">Base price: low to high</option><option value="price-high">Base price: high to low</option></>}</select></label></div>
    <div className={s.filters} aria-label="Filter by category">{categories.map(c => <button type="button" key={c} onClick={() => setCategory(c)} aria-pressed={category === c} className={category === c ? s.selected : ''}>{c}{c === 'All' && <span>{entries.length}</span>}</button>)}</div><p className={s.count} aria-live="polite">{filtered.length} {kind} found</p>
    <div className={kind === 'machines' ? s.machineGrid : s.guideGrid} data-layout={kind === 'machines' ? 'inventory' : undefined}>{filtered.map(e => kind === 'machines' ? <MachineCard machine={e as Machine} key={e.slug} /> : <GuideCard entry={e} key={e.slug} />)}</div>
    {!filtered.length && <div className={s.empty}><Icon name="search" size={35} /><h2>No matching {kind}</h2><p>Try another search or clear the category filter.</p><button type="button" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button></div>}
  </>;
}
