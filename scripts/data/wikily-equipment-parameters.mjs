const source='https://wikily.gg/moon-sweepers/';
const money=n=>`$${n.toLocaleString('en-US')}`;
const number=n=>Number(n.toFixed(2)).toLocaleString('en-US');
export function applyEquipmentParameters(machines,wiki,vehicleSpecs,upgradeSpecs) {
  const geometry={'packager':['2.8 × 3 m',2.4],'splitter':['2.4 × 3.3 m',1.2],'merger':['2.4 × 3.3 m',1.2],'garage':['20 × 18 m',8.3],'robot-vacuum-mk-i':['2.5 × 2.2 m',1.8],'robot-vacuum-mk-ii':['4.3 × 3.7 m',2.6],'joonas':['5.1 × 5.1 m',2.8]};
  const parameters={
    packager:[['Height','2.4 m'],['Hopper','100 kg'],['Capsule payload','1 kg'],['Output emission interval','0.35 seconds']],
    splitter:[['Footprint','2.4 × 3.3 m'],['Height','1.2 m'],['Input ports','1'],['Output ports','2']],
    merger:[['Footprint','2.4 × 3.3 m'],['Height','1.2 m'],['Input ports','2 (alternating)'],['Output ports','1']],
    'conveyor-belt':[['Length range','0.75–30 m'],['Height adjustment','0.4–6 m'],['Speed','1.1 m/s'],['Capsule spacing','0.75 m'],['Maximum slope','45°'],['Minimum turn radius','0.49 m'],['Ideal capsule throughput','88 capsules / minute (calculated)']],
    'pressure-chamber':[['Batch start','5 kg loaded, or after 3 seconds with a partial batch'],['Capsule payload','1 kg sand'],['Output emission interval','0.35 seconds'],['Power cutoff','Below 8% of 10 kW demand']],
    'stone-press':[['Output block mass','2 kg'],['Output emission interval','0.35 seconds'],['Power cutoff','Below 8% of 18 kW demand']],
    garage:[['Height','8.3 m'],['Footprint','20 × 18 m'],['Vehicle unloading','600 kg/s'],['Capsule payload','1 kg'],['Output emission interval','0.35 seconds'],['Silo output ports','2']],
    'capsule-catcher':[['Capsule payload','1 kg on its output belt'],['Output emission interval','0.35 seconds'],['Reception range','Moon-wide J.O.O.N.A.S. launches']],
    'solar-post':[['Sun tracking','No; fixed orientation']],
    'solar-twin':[['Sun tracking','No; fixed orientation'],['Battery charging efficiency','92% of spare generation']],
    'solar-tracker':[['Sun tracking','Yes'],['Tracking tilt','35°–50°'],['Battery charging efficiency','92% of spare generation']],
    'robot-vacuum-mk-i':[['Turn rate','150°/s'],['Dock unloading rate','6 kg/s'],['Can be pushed','Yes'],['Return-to-dock threshold','98% robot bin capacity'],['Interaction distance','4 m'],['Dock capsule payload','Up to 1 kg']],
    'robot-vacuum-mk-ii':[['Turn rate','112.5°/s'],['Dock unloading rate','12 kg/s'],['Can be pushed','Yes'],['Return-to-dock threshold','98% robot bin capacity'],['Interaction distance','4 m'],['Dock capsule payload','Up to 1 kg']],
    joonas:[['Turn rate','120°/s'],['Cleaning arms','6'],['Can be pushed','No'],['Unattended cleaning','4.41 m²/s, checked every 2 seconds'],['Untouched sector time','54–74 seconds, depending on sector area (community model)'],['Interaction distance','12 m'],['Catcher grouping distance','100 m'],['Preferred catcher threshold','At most 80% full']],
  };
  const aliases={'solar-post':'solar-post-s','solar-twin':'solar-twin-m','solar-tracker':'solar-tracker-l','joonas':'j-o-o-n-a-s'};
  for(const m of machines){
    const robot=m.category==='Robots';
    const url=source+(robot?'joonas-robots/':'machines/')+(aliases[m.slug]||m.slug);
    if(!m.sources.includes(url))m.sources.unshift(url);
    const rows=[...(parameters[m.slug]||[])];
    if(geometry[m.slug]) { m.footprint=geometry[m.slug][0];m.height=geometry[m.slug][1];rows.unshift(['Footprint',m.footprint],['Height',`${m.height} m`]); }
    for(const [label,value] of rows){const old=m.stats.find(s=>s.label===label);if(old){old.value=value;old.source=url;}else m.stats.push({label,value,source:url});}
    (m.tables ||= []).push({title:'Operating parameters',columns:['Parameter','Value'],rows,source:url});
    if(['pressure-chamber','stone-press'].includes(m.slug))m.sections.push({heading:'Partial loads, output and power cutoff',paragraphs:[m.slug==='pressure-chamber'?'The chamber starts when 5 kg is loaded, or after waiting 3 seconds with a smaller load. It preserves the loaded mass when turning dust into sand.':'The press needs both raw dust and sand. Its recipe produces one 2 kg block; a missing ingredient prevents a complete cycle.','The output emission interval is 0.35 seconds, separate from the production cycle. Processing stops below 8% of the required power. Belt spacing and a blocked destination can still limit outgoing flow.']});
    if(robot)m.sections.push({heading:'Dock and receiver checks',paragraphs:[m.slug==='joonas'?'J.O.O.N.A.S. uses the emptiest receiver in the nearest catcher group with a catcher at most 80% full. Catchers within 100 m form a group. If all are over 80%, it uses the nearest group with a receiver that is not full. With no catcher, the robot waits when its bin fills.':'The robot returns at 98% bin capacity. Its dock packages collected dust into capsules of up to 1 kg. Check both dock storage and the outgoing belt when the robot reports Dock full.','The robot panel reports states such as Cleaning, Heading home, Unloading, All clean, Dock full, Bin full, Switched off and Waiting. These states identify the stalled stage more precisely than an assumed fixed income rate.']});
  }
  vehicleSpecs.forEach((v,index)=>{
    const [slug,title,price,cruise,boost,width,hopper,capsules,seats]=v;
    const e=wiki.find(x=>x.slug===slug&&x.category==='vehicles');
    const url=source+'vehicles/'+slug;
    e.sources=[url,source+'vehicle-upgrades'];
    e.description=width?`${title}: ${money(price)}, ${number(hopper)} kg hopper, ${width} m cleaning width and ${capsules} capsule slot${capsules===1?'':'s'}. Cruise at ${cruise} m/s or boost to ${boost} m/s before upgrades.`:`An eight-seat ${money(price)} crew van with four capsule slots. Cruise at ${cruise} m/s or boost to ${boost} m/s; this vehicle does not clean dust.`;
    const total=upgradeSpecs.reduce((sum,u)=>sum+(u[3][index]||[]).reduce((a,b)=>a+b,0),0);
    e.stats.push({label:'Wheels',value:String([2,4,4,4,6][index]),source:url},{label:'All vehicle upgrades',value:money(total),source:url},{label:'Purchase + all upgrades',value:money(price+total),source:url});
    const rows=upgradeSpecs.flatMap(([upgradeSlug,upgrade,effects,prices])=>(prices[index]||[]).map((cost,i)=>{
      let result='Applies to this vehicle';
      if(upgradeSlug==='tuned-motors')result=`${number(cruise*(1+.1*(i+1)))} m/s cruise (base vehicle)`;
      if(upgradeSlug==='big-hopper')result=`${number(hopper*(1+.3*(i+1)))} kg hopper`;
      if(upgradeSlug==='turbo-kit')result=`${number(cruise*[1.5,1.65][i])} m/s boost before motor upgrades`;
      if(upgradeSlug==='suction-control')result=`${number(width*[1.25,1.5,1.75][i])} m width; ×${[.85,.72,.6][i]} sweeping speed`;
      if(upgradeSlug==='quick-release')result=`${[900,1200][i].toLocaleString('en-US')} kg/s unloading`;
      if(upgradeSlug==='cruise-control')result='C toggles; brake releases cruise';
      if(upgradeSlug==='floodlights')result=effects[i];
      return [upgrade,['I','II','III'][i],money(cost),effects[i],result];
    }));
    e.tables=[{title:'Every vehicle upgrade level',columns:['Upgrade','Level','Price','Effect','Result / baseline calculation'],rows,note:'Each level is a separate purchase. Speed examples use the base vehicle; Turbo Kit scales current cruise speed when combined with Tuned Motors. Upgrades are vehicle-specific and paid from crew money.',source:url},{title:'Driving controls',columns:['Input','Action'],rows:[['W / S','Drive / brake and reverse'],['A / D','Steer'],['Shift','Boost'],['F','Exit'],['T','Capsule cargo'],...(width?[['Left mouse','Toggle cleaning'],['Mouse wheel','Suction setting with upgrade']]:[]),['C','Cruise control with upgrade'],['L','Lights']],source:source+'controls'}];
    e.sections[0].paragraphs=[`${title} costs ${money(price)} through a garage. The garage itself costs $200. Ownership belongs to the purchasing player. Any garage can recall, store and upgrade that player’s vehicles; removing a garage preserves them.`];
    e.sections[1].paragraphs=[width?`Base cleaning width is ${width} m and the hopper holds ${number(hopper)} kg. Capsule cargo has ${capsules} slot${capsules===1?'':'s'}, separately from loose dust. Suction Control widens the sweep while reducing sweeping speed; Big Hopper expands stored dust.`:'Crew Transport has eight seats and four capsule slots. It carries crew and cargo without a cleaning hopper. Only Tuned Motors, Turbo Kit, Cruise Control and Floodlights apply.'];
    if(!seats)e.dataNote='The source leaves Push Sweeper seats blank; this walk-behind vehicle is not assigned an invented passenger seat. Base speeds are unupgraded. Source data identifies patch 1.0.5.';
  });
}
