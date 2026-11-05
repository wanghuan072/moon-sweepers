import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// @ts-expect-error Node runs explicit TypeScript extensions.
import {calculateSale,calculateContainers,calculateShoppingList} from './calculators.ts';
import type {UpgradeNode} from '../../types/upgrade';
const nodes=JSON.parse(readFileSync(new URL('../../data/tools/upgrade-catalog.json',import.meta.url),'utf8')) as UpgradeNode[];
const row=(id:string,target:number,owned=0)=>({id,target,owned});
test('sale bonuses are additive and region credit uses separate rules',()=>{
 const input={dust:100,sand:10,stone:2,marketContracts:3,lunarExchange:true,regions:2,regionBounty:2,personalCredit:true};
 const r=calculateSale(input)!;assert.equal(r.materials,184.32);assert.equal(r.regionPay,80);assert.equal(r.total,264.32);
 assert.equal(calculateSale({...input,personalCredit:false})?.regionPay,20);
 assert.equal(calculateSale({...input,marketContracts:0})?.multiplier,1.1);
 for(const change of [{dust:-1},{sand:NaN},{regions:1.5},{stone:Infinity},{marketContracts:4},{regionBounty:3},{dust:Number.MAX_VALUE,stone:Number.MAX_VALUE}])assert.equal(calculateSale({...input,...change}),null);
});
test('full containers apply capacity and compactor multiplicatively without early rounding',()=>{
 assert.deepEqual(calculateContainers(.5,0,0,10,1),{capacity:.5,onePay:.5,total:5});
 const r=calculateContainers(12,3,3,10,1.28)!;
 assert.ok(Math.abs(r.capacity-139.2)<1e-10);assert.ok(Math.abs(r.total-1781.76)<1e-10);
 assert.equal(calculateContainers(.5,1,0,1.5,1),null);
 assert.equal(calculateContainers(.5,4,0,1,1),null);
 assert.equal(calculateSale({dust:.001,sand:0,stone:0,marketContracts:3,lunarExchange:true,regions:0,regionBounty:0,personalCredit:false})?.materials,.00128);
});
test('matrix contains 23 paid upgrades totaling 18138 at base prices',()=>{
 const paid=nodes.filter(n=>(n.kind==='matrix'&&n.id!=='collector-uplink')||n.kind==='container');
 assert.equal(paid.length,23);assert.equal(paid.reduce((sum,n)=>sum+n.costs.reduce((a,b)=>a+b,0),0),18138);
 for(const n of nodes){assert.equal(n.costs.length,n.effects.length);for(const r of [...n.requires,...(n.requiresAny||[])])assert.ok(nodes.some(x=>x.id===r.id&&x.costs.length>=r.level));}
});
test('reference shopping list separates 3620 selected and 600 required with an unresolved container choice',()=>{
 const r=calculateShoppingList(nodes,[row('market-contracts',3),row('auto-packer',1)],0)!;
 assert.equal(r.selectedCost,3620);assert.equal(r.prerequisiteCost,600);assert.equal(r.total,4220);assert.equal(r.unresolved.length,1);
 const complete=calculateShoppingList(nodes,[row('market-contracts',3),row('auto-packer',1),row('toothbrush-container',1)],0)!;
 assert.equal(complete.total,4225);assert.equal(complete.unresolved.length,0);
 assert.equal([...complete.selected,...complete.prerequisites].filter(p=>p.id==='toothbrush-container').length,1);
});
test('shared prerequisites are counted once and owned levels imply their prerequisites',()=>{
 const r=calculateShoppingList(nodes,[row('surge-heads',1),row('long-reach',2)],0)!;
 assert.equal(r.total,2740);assert.equal([...r.selected,...r.prerequisites].filter(p=>p.id==='wide-heads'&&p.level===1).length,1);
 const owned=calculateShoppingList(nodes,[row('auto-packer',1,1),row('dust-compactor',3)],0)!;
 assert.equal(owned.total,1200);assert.equal(owned.unresolved.length,0);
});
test('Supplier Network discounts only eligible purchases after it and rounds each level to cents',()=>{
 const tool=nodes.find(n=>n.id==='tool-extra-wide-broom')!;
 const before=calculateShoppingList(nodes,[row('supplier-network',2),row(tool.id,1)],0)!;
 const after=calculateShoppingList(nodes,[row(tool.id,1),row('supplier-network',2)],0)!;
 assert.equal(after.total-before.total,tool.costs[0]*.1);
 const discounted=calculateShoppingList(nodes,[row('nail-brush-container',3)],2)!;
 assert.equal(discounted.total,52.2); // tool $4.50 + three container levels $47.70
 const gear=calculateShoppingList(nodes,[row('tool-belt',1)],2)!;assert.equal(gear.total,15);
});
test('invalid or duplicate plans fail and an empty list costs zero',()=>{
 assert.equal(calculateShoppingList(nodes,[row('unknown',1)],0),null);
 assert.equal(calculateShoppingList(nodes,[row('market-contracts',4)],0),null);
 assert.equal(calculateShoppingList(nodes,[row('market-contracts',1,2)],0),null);
 assert.equal(calculateShoppingList(nodes,[row('market-contracts',1),row('market-contracts',2)],0),null);
 assert.equal(calculateShoppingList(nodes,[],0)?.total,0);
});
