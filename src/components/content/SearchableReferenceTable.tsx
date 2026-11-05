'use client';
import {useId,useState} from 'react';
import type {FactTable} from '@/types/content';
import s from '@/style/common/detail.module.css';
export default function SearchableReferenceTable({table}:{table:FactTable}){
  const id=useId();const [query,setQuery]=useState('');
  const rows=table.rows.map((row,index)=>({row,index})).filter(({row})=>row.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <><div className={s.directoryControls}><label htmlFor={id}>Search this directory<input id={id} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, coordinate or category…"/></label><span aria-live="polite">{rows.length} / {table.rows.length} entries</span></div><div className={`${s.tableScroll} ${s.directoryScroll}`} role="region" tabIndex={0} aria-label={`${table.title}: scroll to see all entries and columns`}><table><thead><tr>{table.columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map(({row,index})=><tr key={index}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{table.rowLinks?.[index]?<a href={table.rowLinks[index]}>{cell}</a>:cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></>;
}
