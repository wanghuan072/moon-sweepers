import {isPublicWikiLink} from '@/lib/data/wiki-publication';
import SearchableReferenceTable from './SearchableReferenceTable';
import type { Entry } from '@/types/content';
import { sourceLabel } from '@/lib/data/source-label';
import s from '@/style/common/detail.module.css';
export default function EntryFacts({ entry, showStats = true }: { entry: Pick<Entry, 'stats' | 'tables'>; showStats?: boolean }) {
  if (!entry.stats?.length && !entry.tables?.length) return null;
  return <div className={s.facts}>
    {showStats && Boolean(entry.stats?.length) && <section><h2>Specifications</h2><dl className={s.factGrid}>{entry.stats?.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></section>}
    {entry.tables?.map(table => ({...table, rowLinks: table.rowLinks?.map(href => href && isPublicWikiLink(href) ? href : "")})).map(table => <section key={table.title}><h2>{table.title}</h2>{table.rows.length > 30 ? <SearchableReferenceTable table={table} /> : <div className={s.tableScroll} role="region" tabIndex={0} aria-label={`${table.title}: scroll horizontally to see all columns`}><table><thead><tr>{table.columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{table.rowLinks?.[i] ? <a href={table.rowLinks[i]}>{cell} ↗</a> : cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}{table.note && <p className={s.tableNote}>{table.note}</p>}{table.source && <a className={s.factSource} href={table.source} target="_blank" rel="noopener noreferrer">Source: {sourceLabel(table.source)} ↗</a>}</section>)}
  </div>;
}
