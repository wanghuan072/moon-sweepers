import {upgrades,tools,suitGear} from './researched-specs.mjs';
const requirements={
 'supplier-network':[['market-contracts',1]],'dust-compactor':[], 'auto-packer':[['dust-compactor',2]],
 'lunar-exchange':[['market-contracts',3],['supplier-network',2],['region-bounty',1]],
 'capsule-tether':[['rapid-transfer',1]],'lunar-leap':[['servo-stride',1]],
 'long-reach':[['wide-heads',1]],'deep-heads':[['wide-heads',1]],'region-bounty':[['market-contracts',1]],
 'exo-frame':[['servo-stride',3],['lunar-leap',2]],'throw-assist':[['capsule-tether',1]],
 'surge-heads':[['wide-heads',3],['deep-heads',2],['long-reach',2]],'express-dock':[['rapid-transfer',3],['throw-assist',1]],
};
export function buildToolCatalog(save){
 const containers=tools.map(([slug,title,,capacity,,costs])=>({id:`${slug}-container`,title:`${title} Container`,branch:'Containers',kind:'container',costs,effects:[2,4,8].map(mult=>`${capacity*mult} kg capacity (${mult}× base)`),requires:[{id:`tool-${slug}`,level:1}],source:'https://wikily.gg/moon-sweepers/containers',tool:slug}));
 const nodes=[...upgrades.map(u=>({id:u.slug,title:u.title,branch:u.branch,kind:'matrix',costs:u.costs,effects:u.effects,requires:(requirements[u.slug]||(u.slug==='collector-uplink'?[]:[['collector-uplink',1]])).map(([id,level])=>({id,level})),...(u.slug==='dust-compactor'?{requiresAny:containers.map(c=>({id:c.id,level:1}))}:{}),source:`https://wikily.gg/moon-sweepers/upgrade-matrix/${u.slug}`})),...containers,
 ...tools.map(([slug,title,price,capacity])=>({id:`tool-${slug}`,title,branch:'Cleaning Tools',kind:'tool',costs:[price],effects:[`${capacity} kg base container`],requires:[],source:`https://wikily.gg/moon-sweepers/cleaning-tools/${slug}`})),
 ...suitGear.map(([slug,title,costs,effects])=>({id:slug,title,branch:'Suit Gear',kind:'gear',costs,effects,requires:[],source:'https://wikily.gg/moon-sweepers/suit-gear'}))];
 save('src/data/tools/upgrade-catalog.json',nodes);
 save('src/data/tools/cleaning-tools.json',tools.map(([slug,title,price,capacity,width,costs])=>({slug,title,price,width,capacity,costs})));
}
