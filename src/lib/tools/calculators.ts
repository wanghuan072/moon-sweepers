import type {UpgradeNode,PlanItem,Purchase} from '../../types/upgrade';
const nonnegative=(values:number[])=>values.every(value=>Number.isFinite(value)&&value>=0);
export function processingValue(cycleSeconds:number,outputPerCycle:number,unitPrice:number,inputValue:number){
 if(!nonnegative([cycleSeconds,outputPerCycle,unitPrice,inputValue])||cycleSeconds===0)return null;
 const unitsPerMinute=60/cycleSeconds*outputPerCycle,grossPerMinute=unitsPerMinute*unitPrice,inputPerMinute=60/cycleSeconds*inputValue,addedPerMinute=grossPerMinute-inputPerMinute;
 return [unitsPerMinute,grossPerMinute,inputPerMinute,addedPerMinute].every(Number.isFinite)?{unitsPerMinute,grossPerMinute,inputPerMinute,addedPerMinute}:null;
}
export interface SaleInput {dust:number;sand:number;stone:number;marketContracts:number;lunarExchange:boolean;regions:number;regionBounty:number;personalCredit:boolean}
export function calculateSale(input:SaleInput){
 const {dust,sand,stone,marketContracts,lunarExchange,regions,regionBounty,personalCredit}=input;
 if(!nonnegative([dust,sand,stone,regions])||!Number.isInteger(regions)||![0,1,2,3].includes(marketContracts)||![0,1,2].includes(regionBounty))return null;
 const multiplier=1+marketContracts*.06+(lunarExchange ? 0.1 : 0);
 const dustPay=dust*multiplier,sandPay=sand*3*multiplier,stonePay=stone*7*multiplier;
 const materials=(dust+sand*3+stone*7)*multiplier;
 const perRegion=10+(personalCredit?15*regionBounty:0),regionPay=regions*perRegion,total=materials+regionPay;
 return nonnegative([dustPay,sandPay,stonePay,materials,regionPay,total])?{multiplier,dustPay,sandPay,stonePay,materials,perRegion,regionPay,total}:null;
}
export function calculateContainers(base:number,level:number,compactor:number,count:number,multiplier:number){
 if(!nonnegative([base,count,multiplier])||base<=0||!Number.isInteger(count)||![0,1,2,3].includes(level)||![0,1,2,3].includes(compactor))return null;
 const capacity=base*2**level*(1+.15*compactor),onePay=capacity*multiplier,total=onePay*count;
 return nonnegative([capacity,onePay,total])?{capacity,onePay,total}:null;
}
export function calculateShoppingList(nodes:UpgradeNode[],items:PlanItem[],supplierOwned:number){
 if(![0,1,2].includes(supplierOwned))return null;
 const catalog=new Map(nodes.map(n=>[n.id,n]));
 if(new Set(items.map(i=>i.id)).size!==items.length||items.some(i=>{const n=catalog.get(i.id);return !n||!Number.isInteger(i.owned)||!Number.isInteger(i.target)||i.owned<0||i.target<i.owned||i.target>n.costs.length;}))return null;
 const owned=new Map<string,number>([['collector-uplink',1],['tool-toothbrush',1],['supplier-network',supplierOwned]]);
 for(const item of items)owned.set(item.id,Math.max(owned.get(item.id)||0,item.owned));
 const inferred=new Set<string>();
 function infer(id:string){if(inferred.has(id))return;inferred.add(id);for(const req of catalog.get(id)?.requires||[]){owned.set(req.id,Math.max(owned.get(req.id)||0,req.level));infer(req.id);}}
 for(const [id,level] of [...owned])if(level>0)infer(id);
 const selected:Purchase[]=[],prerequisites:Purchase[]=[],unresolved=new Map<string,{title:string;options:string[]}>();
 const active=new Set<string>();
 function buy(id:string,target:number,neededFor?:string):void{
  if((owned.get(id)||0)>=target)return;
  const node=catalog.get(id);if(!node||active.has(id))throw new Error('Invalid upgrade dependency graph');
  active.add(id);
  for(const req of node.requires)buy(req.id,req.level,node.title);
  if(node.requiresAny&&!(owned.get(id)||0)&&!node.requiresAny.some(r=>(owned.get(r.id)||0)>=r.level)){
   const chosen=node.requiresAny.find(r=>items.some(i=>i.id===r.id&&i.target>=r.level));
   if(chosen)buy(chosen.id,chosen.level,node.title);
   else unresolved.set(id,{title:node.title,options:node.requiresAny.map(r=>`${catalog.get(r.id)?.title} I`)});
  }
  for(let level=(owned.get(id)||0)+1;level<=target;level++){
   const discount=['tool','container'].includes(node.kind)?(owned.get('supplier-network')||0)*.05:0;
   const basePrice=node.costs[level-1],price=Math.round((basePrice*(1-discount)+Number.EPSILON)*100)/100;
   const purchase={id,title:node.title,level,effect:node.effects[level-1],basePrice,price,discount,...(neededFor?{neededFor}:{})};
   (neededFor?prerequisites:selected).push(purchase);owned.set(id,level);
  }
  active.delete(id);
 }
 try{for(const item of items)buy(item.id,item.target);}catch{return null;}
 const sum=(rows:Purchase[])=>Math.round(rows.reduce((n,p)=>n+p.price,0)*100)/100;
 const selectedCost=sum(selected),prerequisiteCost=sum(prerequisites),total=Math.round((selectedCost+prerequisiteCost)*100)/100;
 return {selected,prerequisites,unresolved:[...unresolved.values()],selectedCost,prerequisiteCost,total,savings:Math.round([...selected,...prerequisites].reduce((n,p)=>n+p.basePrice-p.price,0)*100)/100};
}
