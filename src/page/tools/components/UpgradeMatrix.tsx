'use client';
import {useState} from 'react';
import UpgradeTree from './UpgradeTree';
import data from '@/data/tools/upgrade-catalog.json';
import type {UpgradeNode} from '@/types/upgrade';
import {money} from '@/lib/tools/format';
import Icon from '@/components/common/Icon';
import s from '@/style/page/tools/tools.module.css';
const nodes=(data as UpgradeNode[]).filter(n=>n.kind==='matrix'||n.kind==='container');
const branches=['Containers','Cleaning','Suit','Logistics','Economy'];
const paid=nodes.filter(n=>n.id!=='collector-uplink');
function Dependency({node,level,trail=[]}:{node:UpgradeNode;level:number;trail?:string[]}){
 if(trail.includes(node.id))return null;
 return <li><strong>{node.title} · Level {level}</strong>{node.requires.length>0&&<ul>{node.requires.map(r=>{const required=(data as UpgradeNode[]).find(n=>n.id===r.id)!;return <Dependency key={r.id} node={required} level={r.level} trail={[...trail,node.id]}/>;})}</ul>}{node.requiresAny&&<p className={s.warning}>Any one container at level I. The choice is yours; all six are not required.</p>}</li>;
}
export default function UpgradeMatrix(){
 const [query,setQuery]=useState(''),[branch,setBranch]=useState('All'),[view,setView]=useState('tree');
 const [selected,setSelected]=useState('market-contracts');
 const entry=nodes.find(n=>n.id===selected)!;
 const filtered=paid.filter(n=>(branch==='All'||n.branch===branch)&&`${n.title} ${n.effects.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
 const card=(node:UpgradeNode)=><button type="button" key={node.id} className={s.matrixCard} aria-pressed={selected===node.id} onClick={()=>setSelected(node.id)}><span>{node.branch} · {node.costs.length} {node.costs.length===1?'level':'levels'}</span><strong>{node.title}</strong><p>{node.effects.at(-1)}</p><small>{money(node.costs.reduce((a,b)=>a+b,0))} · all levels</small></button>;
 return <div className={s.workspace}><div className={s.metrics}><div><small>PAID MATRIX UPGRADES</small><strong>23</strong></div><div><small>BASE COST · ALL LEVELS</small><strong>{money(paid.reduce((total,n)=>total+n.costs.reduce((a,b)=>a+b,0),0))}</strong></div><div><small>STARTING NODE</small><strong>Collector Uplink</strong></div></div>
 <section className={s.inputs}><div className={s.matrixControls}><label className={s.field}>Find an upgrade<input type="search" placeholder="Search names or effects…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className={s.viewButtons} aria-label="Matrix display"><button type="button" aria-pressed={view==='list'} onClick={()=>setView('list')}>List view</button><button type="button" aria-pressed={view==='tree'} onClick={()=>setView('tree')}>Tree view</button></div></div><div className={s.filters} aria-label="Upgrade branch">{['All',...branches].map(b=><button key={b} type="button" aria-pressed={branch===b} onClick={()=>setBranch(b)}>{b}</button>)}</div><p aria-live="polite">{filtered.length} upgrades {view==='tree'?'matched. Other nodes stay visible to preserve the tree.':'shown.'} Click a node to inspect its prices, effects and prerequisite path.</p>
 {view==='list'?<div className={s.matrixGrid}>{filtered.map(card)}</div>:<UpgradeTree nodes={nodes} selected={selected} matches={new Set(filtered.map(n=>n.id))} onSelect={setSelected}/> }{!filtered.length&&<p>No matching upgrades. Clear the search or choose another branch.</p>}</section>
 {view==='list'&&<section className={s.nodeDetails} aria-live="polite"><div><span className={s.kicker}><Icon name="network" size={16}/>{entry.branch.toUpperCase()} BRANCH</span><h2>{entry.title}</h2><div className={s.tableScroll}><table><thead><tr><th scope="col">Level</th><th scope="col">Price</th><th scope="col">Effect</th></tr></thead><tbody>{entry.costs.map((cost,i)=><tr key={i}><th scope="row">{i+1}</th><td>{money(cost)}</td><td>{entry.effects[i]}</td></tr>)}</tbody></table></div><p>Every price is an individual level purchase. The total excludes other nodes, required cleaning tools and Supplier Network discounts.</p></div><div><h2>Prerequisite path</h2><p>All fixed prerequisites below must be met. An “any one” requirement needs only one of its alternatives.</p><ul className={s.dependencyTree}><Dependency node={entry} level={1}/></ul><a className={s.textLink} href="/tools/upgrade-calculator">Price the complete purchase path →</a></div></section>}
 </div>;
}
