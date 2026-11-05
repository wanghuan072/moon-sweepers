'use client';
import s from '@/style/page/tools/tools.module.css';
export function LevelPicker({label,value,max,onChange}:{label:string;value:number;max:number;onChange:(level:number)=>void}){
 return <fieldset className={s.levelPicker}><legend>{label}</legend><div>{Array.from({length:max+1},(_,i)=><button type="button" key={i} aria-pressed={value===i} onClick={()=>onChange(i)}>{['None','I','II','III'][i]}</button>)}</div></fieldset>;
}
export function NumberField({label,value,onChange,integer=false}:{label:string;value:string;onChange:(value:string)=>void;integer?:boolean}){
 return <label className={s.field}>{label}<input type="number" min="0" step={integer?'1':'any'} inputMode={integer?'numeric':'decimal'} value={value} onChange={e=>onChange(e.target.value)}/></label>;
}
