import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Icon from '@/components/common/Icon';
import { searchContent } from '@/lib/search/full-search';
import s from '@/style/common/listing.module.css';
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams; const query = typeof params.q === 'string' ? params.q.trim().slice(0, 200) : '';
  const results = query ? searchContent(query) : [];
  return <div className={`container ${s.page}`}><Breadcrumb items={[{ title: 'Search' }]} /><PageHero eyebrow={<>FIND YOUR NEXT STEP</>} title={<>Search Moon Sweepers Wiki</>} description={<>Search equipment, wiki entries, guides, mods, updates and planning tools.</>}></PageHero><form action="/search" role="search" className={s.controls}><div className={s.search}><Icon name="search" size={18} /><label className="sr-only" htmlFor="full-search">Search query</label><input id="full-search" name="q" defaultValue={query} placeholder="Try dust, upgrades or automation…" maxLength={200} /></div><button className={s.searchButton} type="submit">Search</button></form><p className={s.count}>{query ? `${results.length} results for “${query}”` : 'Enter a search term to explore the wiki.'}</p><div className={s.entryList}>{results.map(e => <a key={e.href} href={e.href}><Icon name={e.kind === 'machines' ? 'gear' : e.kind === 'tools' ? 'calculator' : 'book'} size={27} /><div><small>{e.kind.toUpperCase()}</small><strong>{e.title}</strong><p>{e.description}</p></div><Icon name="arrow" size={18} /></a>)}</div>{query && !results.length && <div className={s.empty}><h2>No results yet</h2><p>Try a shorter term, or explore the wiki categories.</p><a href="/wiki">Browse wiki →</a></div>}</div>;
}
