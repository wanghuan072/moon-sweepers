'use client';
import {useId,useState} from 'react';
import type {FactTable} from '@/types/content';
import s from '@/style/common/detail.module.css';
export default function SearchableReferenceTable({table, categoryColumn, searchPlaceholder = 'Name, coordinate or category…'}:{
  table: FactTable;
  categoryColumn?: number;
  searchPlaceholder?: string;
}){
  const id=useId();const [query,setQuery]=useState('');
  const [category, setCategory] = useState('');
  const categories = categoryColumn === undefined ? [] : [...new Set(table.rows.map(row => row[categoryColumn]))].sort();
  const rows=table.rows.map((row,index)=>({row,index})).filter(({row})=>
    (categoryColumn === undefined || !category || row[categoryColumn] === category) &&
    row.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <><div className={s.directoryControls}><label htmlFor={id}>Search this directory<input id={id} value={query} onChange={e=>setQuery(e.target.value)} placeholder={searchPlaceholder}/></label>{categories.length > 0 && <label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(option => <option key={option}>{option}</option>)}</select></label>}<span aria-live="polite">{rows.length} / {table.rows.length} entries</span></div><div className={`${s.tableScroll} ${s.directoryScroll}`} role="region" tabIndex={0} aria-label={`${table.title}: scroll to see all entries and columns`}><table><thead><tr>{table.columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map(({row,index})=><tr key={index}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{table.rowLinks?.[index]?<a href={table.rowLinks[index]}>{cell}</a>:cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></>;
}
