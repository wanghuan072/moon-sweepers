'use client';
import {useCallback,useEffect,useRef,useState,type SetStateAction,type CSSProperties,type PointerEvent} from 'react';
import type {UpgradeNode} from '@/types/upgrade';
import {money} from '@/lib/tools/format';
import {focusTreeNode} from '@/lib/tools/tree-camera';
import Icon from '@/components/common/Icon';
import s from '@/style/page/tools/upgrade-tree.module.css';
const width=2440,height=1080,nodeWidth=200,nodeHeight=100;
const positions:Record<string,[number,number]>={
 'collector-uplink':[1030,970],
 'servo-stride':[120,740],'lunar-leap':[120,500],'exo-frame':[120,270],
 'rapid-transfer':[410,740],'capsule-tether':[410,560],'throw-assist':[410,380],'express-dock':[410,200],
 'toothbrush-container':[750,750],'nail-brush-container':[1030,750],'hand-brush-container':[1310,750],
 'household-broom-container':[750,600],'wide-broom-container':[1030,600],'extra-wide-broom-container':[1310,600],
 'dust-compactor':[1030,410],'auto-packer':[1030,210],
 'wide-heads':[1570,740],'long-reach':[1460,500],'deep-heads':[1680,500],'surge-heads':[1570,270],
 'market-contracts':[2200,740],'supplier-network':[2090,500],'region-bounty':[2310,500],'lunar-exchange':[2200,270],
};
const colors:Record<string,string>={Root:'#ffb03c',Suit:'#bfa3ff',Logistics:'#75d6f4',Containers:'#ffb340',Cleaning:'#72d8b4',Economy:'#f2d77c'};
const icons:Record<string,string>={Root:'network',Suit:'upgrade',Logistics:'network',Containers:'box',Cleaning:'brush',Economy:'coins'};
type Camera={x:number;y:number;scale:number};
const clamp=(n:number)=>Math.max(.12,Math.min(2.5,n));
export default function UpgradeTree({nodes,selected,matches,onSelect}:{nodes:UpgradeNode[];selected:string;matches:Set<string>;onSelect:(id:string)=>void}){
 const inspector=useRef<HTMLElement>(null),viewport=useRef<HTMLDivElement>(null),pointers=useRef(new Map<number,{x:number;y:number}>()),gesture=useRef({distance:0,moved:false});
 const [camera,setCameraState]=useState<Camera>({x:0,y:0,scale:.9}),[dragging,setDragging]=useState(false),[details,setDetails]=useState(false);
 const focusedSelection=useRef({id:selected,open:false});
 const liveCamera=useRef<Camera>({x:0,y:0,scale:.9}),motionFrame=useRef(0),zoomTarget=useRef<Camera|null>(null);
 const setCamera=useCallback((update:SetStateAction<Camera>)=>{const next=typeof update==='function'?update(liveCamera.current):update;liveCamera.current=next;setCameraState(next);},[]);
 const stopMotion=useCallback(()=>{cancelAnimationFrame(motionFrame.current);motionFrame.current=0;zoomTarget.current=null;},[]);
 const animateCamera=useCallback((target:Camera,duration=320)=>{
  stopMotion();
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){setCamera(target);return;}
  const start=liveCamera.current,started=performance.now();
  const frame=(now:number)=>{const progress=Math.min(1,(now-started)/duration),ease=1-(1-progress)**3;setCamera({x:start.x+(target.x-start.x)*ease,y:start.y+(target.y-start.y)*ease,scale:start.scale+(target.scale-start.scale)*ease});if(progress<1)motionFrame.current=requestAnimationFrame(frame);else {motionFrame.current=0;zoomTarget.current=null;}};
  motionFrame.current=requestAnimationFrame(frame);
 },[setCamera,stopMotion]);
 const smoothZoomAt=useCallback((factor:number,x:number,y:number)=>{
  const current=liveCamera.current,scale=clamp((zoomTarget.current?.scale??current.scale)*factor),ratio=scale/current.scale;
  const target={scale,x:x-(x-current.x)*ratio,y:y-(y-current.y)*ratio};
  animateCamera(target,140);zoomTarget.current=motionFrame.current?target:null;
 },[animateCamera]);
 useEffect(()=>()=>stopMotion(),[stopMotion]);
 const entry=nodes.find(n=>n.id===selected)!;
 const centerOnNode=useCallback((id:string)=>{
  const el=viewport.current,panel=inspector.current;if(!el||!panel)return;
  const bounds=el.getBoundingClientRect(),overlay=panel.getBoundingClientRect();
  animateCamera(focusTreeNode(positions[id],liveCamera.current,{width:el.clientWidth,height:el.clientHeight,panelLeft:overlay.left-bounds.left,panelTop:overlay.top-bounds.top,stacked:window.matchMedia('(max-width:768px)').matches}));
 },[animateCamera]);
 useEffect(()=>{focusedSelection.current={id:selected,open:details};},[selected,details]);
 const choose=(id:string)=>{
  stopMotion();onSelect(id);setDetails(true);focusedSelection.current={id,open:true};
  motionFrame.current=requestAnimationFrame(()=>centerOnNode(id));
 };
 const fit=()=>{const el=viewport.current;if(!el)return;const scale=clamp(Math.min((el.clientWidth-36)/width,(el.clientHeight-36)/height));animateCamera({x:(el.clientWidth-width*scale)/2,y:(el.clientHeight-height*scale)/2,scale});};
 useEffect(()=>{
  const el=viewport.current;if(!el)return;
  let previousWidth=0,previousHeight=0;
  const resize=new ResizeObserver(()=>{stopMotion();const w=el.clientWidth,h=el.clientHeight;if(!previousWidth){const scale=clamp(Math.min((w-36)/width,(h-36)/height));setCamera({x:(w-width*scale)/2,y:(h-height*scale)/2,scale});}else if(focusedSelection.current.open)motionFrame.current=requestAnimationFrame(()=>centerOnNode(focusedSelection.current.id));else setCamera(c=>({...c,x:c.x+(w-previousWidth)/2,y:c.y+(h-previousHeight)/2}));previousWidth=w;previousHeight=h;});
  resize.observe(el);
  const wheel=(event:WheelEvent)=>{
   if((event.target as Element).closest('[data-tree-controls]'))return;event.preventDefault();if(pointers.current.size)return;
   const rect=el.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
   const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?el.clientHeight:1);
   smoothZoomAt(Math.exp(-Math.max(-100,Math.min(100,delta))*.006),x,y);
  };
  el.addEventListener('wheel',wheel,{passive:false});return()=>{resize.disconnect();el.removeEventListener('wheel',wheel);};
 },[setCamera,smoothZoomAt,stopMotion,centerOnNode]);
 const zoom=(factor:number)=>{const el=viewport.current;if(el)smoothZoomAt(factor,el.clientWidth/2,el.clientHeight/2);};
 const down=(event:PointerEvent<HTMLDivElement>)=>{if(event.button!==0&&event.pointerType==='mouse')return;const target=event.target as Element;if(target.closest('[data-tree-controls]'))return;stopMotion();if(!pointers.current.size)gesture.current={distance:0,moved:false};pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});target.setPointerCapture(event.pointerId);setDragging(true);};
 const move=(event:PointerEvent<HTMLDivElement>)=>{
  const points=pointers.current,old=points.get(event.pointerId);if(!old)return;
  const before=[...points.values()];points.set(event.pointerId,{x:event.clientX,y:event.clientY});const after=[...points.values()];
  gesture.current.distance+=Math.hypot(event.clientX-old.x,event.clientY-old.y);if(gesture.current.distance>5||points.size>1)gesture.current.moved=true;
  if(!gesture.current.moved)return;
  if(before.length===1)setCamera(c=>({...c,x:c.x+event.clientX-old.x,y:c.y+event.clientY-old.y}));
  else {const rect=viewport.current!.getBoundingClientRect(),a=before.slice(0,2),b=after.slice(0,2),distance=(p:typeof a)=>Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);const d=distance(a);if(d<1)return;const cx=(a[0].x+a[1].x)/2-rect.left,cy=(a[0].y+a[1].y)/2-rect.top,nx=(b[0].x+b[1].x)/2-rect.left,ny=(b[0].y+b[1].y)/2-rect.top;setCamera(c=>{const scale=clamp(c.scale*distance(b)/d),ratio=scale/c.scale;return {scale,x:nx-(cx-c.x)*ratio,y:ny-(cy-c.y)*ratio};});}
 };
 const release=(event:PointerEvent<HTMLDivElement>)=>{pointers.current.delete(event.pointerId);if(!pointers.current.size)setDragging(false);};
 const ancestors=new Set<string>();
 function trace(id:string){if(ancestors.has(id))return;ancestors.add(id);const node=nodes.find(n=>n.id===id);if(!node)return;for(const req of [...node.requires,...(node.requiresAny||[])])if(positions[req.id])trace(req.id);if(node.kind==='container')trace('collector-uplink');}
 trace(selected);
 const edges=nodes.flatMap(node=>[...node.requires.filter(r=>positions[r.id]),...(node.kind==='container'?[{id:'collector-uplink',level:1}]:[]),...(node.requiresAny||[])].map(req=>({from:req.id,to:node.id,level:req.level,any:Boolean(node.requiresAny?.some(r=>r.id===req.id))})));
 return <div className={s.shell}><div className={s.toolbar}><span><Icon name="network" size={17}/> UPGRADE RESEARCH TREE</span><div data-tree-controls><button type="button" onClick={()=>zoom(1/1.25)} aria-label="Zoom out upgrade tree">−</button><output aria-label="Tree zoom">{Math.round(camera.scale*100)}%</output><button type="button" onClick={()=>zoom(1.25)} aria-label="Zoom in upgrade tree">+</button><button type="button" onClick={fit}>Fit tree</button></div></div>
 <div ref={viewport} className={`${s.viewport} ${dragging?s.dragging:''}`} role="region" aria-label="Interactive upgrade tree. Drag to pan, scroll or pinch to zoom. Use arrow keys to pan and plus or minus to zoom." tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onClickCapture={event=>{if((event.target as Element).closest('[data-tree-controls]'))return;if(event.detail!==0&&gesture.current.moved){event.preventDefault();event.stopPropagation();}}} onKeyDown={event=>{if(event.target!==event.currentTarget)return;const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0'];if(!keys.includes(event.key))return;event.preventDefault();stopMotion();if(event.key==='+'||event.key==='=')zoom(1.25);else if(event.key==='-')zoom(1/1.25);else if(event.key==='0')fit();else setCamera(c=>({...c,x:c.x+(event.key==='ArrowLeft'?60:event.key==='ArrowRight'?-60:0),y:c.y+(event.key==='ArrowUp'?60:event.key==='ArrowDown'?-60:0)}));}}>
 <div className={s.canvas} style={{width,height,transform:`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`}}>
 <svg width={width} height={height} className={s.connections} aria-hidden="true">{edges.map(edge=>{const [x1,y1]=positions[edge.from],[x2,y2]=positions[edge.to],start=y1-nodeHeight/2,end=y2+nodeHeight/2,mid=(start+end)/2,active=ancestors.has(edge.from)&&ancestors.has(edge.to);return <path key={`${edge.from}-${edge.to}`} d={`M ${x1} ${start} C ${x1} ${mid},${x2} ${mid},${x2} ${end}`} fill="none" stroke={active?'#ffb340':'#4b7189'} strokeWidth={active?3:2} strokeDasharray={edge.any?'8 7':undefined} opacity={active?1:.6}/>;})}</svg>
 {['Suit','Logistics','Containers','Cleaning','Economy'].map((branch,i)=><div key={branch} className={s.branchLabel} style={{left:[120,410,1030,1570,2200][i],color:colors[branch]}}>{branch.toUpperCase()}</div>)}
 {nodes.map(node=>{const [x,y]=positions[node.id],dim=node.id!=='collector-uplink'&&!matches.has(node.id);return <button type="button" key={node.id} data-upgrade-node={node.id} className={`${s.node} ${selected===node.id?s.selected:''} ${dim?s.dim:''}`} style={{left:x-nodeWidth/2,top:y-nodeHeight/2,width:nodeWidth,height:nodeHeight,'--branch-color':colors[node.branch]} as CSSProperties} aria-pressed={selected===node.id} aria-label={`${node.title}, ${node.id==='collector-uplink'?'owned from start':`${node.costs.length} ${node.costs.length===1?'level':'levels'}, ${money(node.costs.reduce((a,b)=>a+b,0))} total`}. Show prices, effects and prerequisites.`} onFocus={event=>{if(!event.currentTarget.matches(':focus-visible'))return;const el=viewport.current!;setCamera(c=>{const nx=x*c.scale+c.x,ny=y*c.scale+c.y;if(nx>100&&nx<el.clientWidth-100&&ny>65&&ny<el.clientHeight-65)return c;return {...c,x:el.clientWidth/2-x*c.scale,y:el.clientHeight/2-y*c.scale};});}} onClick={()=>choose(node.id)}><Icon name={icons[node.branch]} size={23}/><strong>{node.title}</strong><span>{node.id==='collector-uplink'?'OWNED FROM START':`${['','I','II','III'][node.costs.length]} · ${money(node.costs.reduce((a,b)=>a+b,0))}`}</span></button>;})}
 <span className={s.anyLabel}>ANY ONE CONTAINER I</span></div>
 {details&&<aside data-tree-controls ref={inspector} className={s.inspector} aria-label="Selected upgrade details"><div className={s.inspectorTitle}><span style={{color:colors[entry.branch]}}>{entry.branch} / RESEARCH</span><button type="button" aria-label="Close upgrade details" onClick={()=>setDetails(false)}><Icon name="close" size={18}/></button></div><h2>{entry.title}</h2><p>{entry.id==='collector-uplink'?'Owned from the start':`${money(entry.costs.reduce((a,b)=>a+b,0))} for all levels · prerequisites extra`}</p><ol>{entry.costs.map((price,i)=><li key={i}><strong>Level {i+1}<span>{money(price)}</span></strong><p>{entry.effects[i]}</p></li>)}</ol><h3>Prerequisites</h3>{!entry.requires.length&&!entry.requiresAny?<p>None. This is the starting research connection.</p>:<><p>{entry.requires.length?'All of these are required:':'Choose any one container upgrade at level I:'}</p>{entry.requires.map(req=>{const parent=(nodes.find(n=>n.id===req.id));return parent?<button key={req.id} type="button" className={s.requirement} onClick={()=>choose(req.id)}>{parent.title} · Level {req.level} →</button>:<p key={req.id}>{req.id.replace('tool-','').replaceAll('-',' ')} cleaning tool must be owned.</p>;})}{entry.kind==='container'&&<p>Collector Uplink is owned from the start.</p>}{entry.requiresAny&&<><p>Any one of the following, not all six:</p>{entry.requiresAny.map(req=><button key={req.id} type="button" className={s.requirement} onClick={()=>choose(req.id)}>{nodes.find(n=>n.id===req.id)?.title} · Level {req.level} →</button>)}</>}</>}<a href="/tools/upgrade-calculator">Budget this purchase path →</a></aside>}
</div><div className={s.legend}><span>Drag to pan · Scroll / pinch to zoom</span><span><i/>Required path <i className={s.dashed}/>Any one alternative</span><span>Click a node to inspect it</span></div></div>;
}
