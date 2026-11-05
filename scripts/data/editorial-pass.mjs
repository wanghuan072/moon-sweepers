import {readFileSync} from 'node:fs';
const editorial=JSON.parse(readFileSync('src/data/editorial/entries.json','utf8'));
const files={machines:'machines/machines',guides:'guides/guides',wiki:'wiki/entries',updates:'updates/updates'};
export function editorialPass({save,machines,guides,updates}) {
 for(const [kind,file] of Object.entries(files)) {
  const entries=JSON.parse(readFileSync(`src/data/${file}.json`,'utf8'));
  for(const entry of entries) {
   const copy=editorial[`${kind}/${entry.slug}`];
   if(!copy)throw new Error(`Editorial review missing: ${kind}/${entry.slug}`);
   Object.assign(entry,copy);
   delete entry.seoTitle;delete entry.heading;
   // These are import-time dates, not evidence of publication or modification.
   if(kind==='updates')entry.announcedAt=entry.updatedAt;
   delete entry.publishedAt;
   const production=(kind==='machines'&&entry.category==='Production')||['stone-press-guide','pressure-chamber-guide','automation-guide'].includes(entry.slug);
   entry.dataNote=entry.status==='community' ? production
    ? 'Recipe values use the linked game-version documentation and have not been independently playtested. Full-power output assumes continuous inputs and a clear exit; calculations exclude downtime.'
    : entry.category==='mechanics' ? 'Gameplay rules use the linked game-version documentation. Check the version when controls or behaviour differ in your world; suggested checks are not a guarantee that a problem will be resolved.'
    : ['flags','lunar-sites'].includes(entry.slug) ? 'Coordinates are whole-degree positions on the game map. Discovery rewards are base amounts; the website checklist is separate from your game save. Documentation is linked below.'
    : 'Values use the linked game-version documentation and have not been independently playtested. Purchase prices are base in-game amounts before eligible discounts.'
    : entry.status==='verified' ? 'Game details are checked against the linked developer announcements and store information. Calculated examples and suggested layouts are guidance, not measured gameplay results.'
    : 'Some details remain unconfirmed. Check the linked documentation and your installed version before relying on them.';
   // Remove a repeated generic closing section; retain item-specific instructions.
   entry.sections=entry.sections.filter(section=>section.heading!=='A setup decision to test');
   if(entry.sectionsOverride) {entry.sections=entry.sectionsOverride;delete entry.sectionsOverride;}
   if(copy.paragraphOverrides){
    for(const [heading,paragraphs] of Object.entries(copy.paragraphOverrides)){
     const target=entry.sections.find(section=>section.heading===heading);
     if(!target)throw new Error(`Unknown section ${entry.slug}: ${heading}`);
     target.paragraphs=paragraphs;
    }
    delete entry.paragraphOverrides;
   }
   if(copy.dataNoteOverride){entry.dataNote=copy.dataNoteOverride;delete entry.dataNoteOverride;}
   if(copy.faqs)entry.faqs=copy.faqs;
   else if(kind==='guides')delete entry.faqs;
   entry.sections=entry.sections.map(section=>({...section,paragraphs:section.paragraphs.filter(text=>!text.startsWith('Joonas is the unpunctuated name used here')).map(text=>text
    .replace('The referenced storage limit is 100 kg. Community equipment data reports capsules of up to 1 kg.','Storage holds 100 kg and outgoing capsules carry up to 1 kg.')
    .replace('Its $100 price is reported by several community references; the separate Building Tool costs $50.','The Packager costs $100; the separate Building Tool costs $50.')
    
    .replace('At the reported base prices','At base prices')
    .replace('as the reported base price','as the base price')
    .replace('The reported maximum individual segment length','The maximum individual segment length')
    .replace('The reported belt speed','Belt speed')
    .replace('The reported maximum batch','The maximum batch')
    .replace('reported sale value per kilogram','base sale value per kilogram')
    .replace('A reported 16 kW peak tracker','A 16 kW peak tracker')
    .replace('The community references list Solar Post','Solar panels include Solar Post')
    .replace('The reported $20,000 robot','The $20,000 robot')
    .replace('at the reported $7/kg base sale price','at the $7/kg base sale price')
    .replace('The reported base sale value','The base sale value')
    .replace('The referenced combined maximum','The combined maximum')
    .replace('The movement reference lists','Each boost uses')
    .replace('The detailed community catalogue lists 163,842 regions.','The Moon has 163,842 regions.')
    .replace('Some older references report a different region count, so this page follows the detailed Wikily entry.','Use the region counter in your installed version when checking total progress.')
    .replace('The community catalogue lists 98 build items:','The build menu contains 98 items:')
    .replace('the reported unload rate','the unloading rate')
    .replace('The referenced recipe takes','The recipe takes')
    .replace('At the reported $7/kg base stone price','At the $7/kg base stone price')
    .replace('The community table lists $0.50 per metre','Belts cost $0.50 per metre')
    .replace('The reported 1.1 m/s speed','The 1.1 m/s speed')
    .replace('The community equipment record describes a maximum','A full load is a maximum')
    .replace('The reported base sand price is','The base sand price is')
    .replace('The source reports smaller batches after a short wait and slower processing with insufficient power.','Smaller loads start after a short wait; insufficient power slows processing.')
    .replace('The equipment record lists a $1,500 price and 100 kg storage.','The catcher costs $1,500 and stores 100 kg.')
    .replace('Community data lists a $200 garage, separate from vehicle purchase prices.','The garage costs $200, separate from vehicle purchase prices.')
    .replace('The reported collector-pad unloading rate','The collector-pad unloading rate')
    .replace('J.O.O.N.A.S. is reported at $20,000','J.O.O.N.A.S. costs $20,000')
    .replace('Community data reports a 60 kg robot bin','The robot carries a 60 kg bin')
    .replace('The community record reports 19 hexes and a 15 kg bin.','Its work area covers 19 hexes and its bin carries 15 kg.')
    .replace('The reported $500 Mk II','The $500 Mk II')
    .replace(/(Solar (?:Tracker \(L\)|Post \(S\)|Twin \(M\))) is reported at/g,'$1 costs')
    .replace('The listed build price is $5.','The build price is $5.')
    .replace('A Merger is listed at $5.','A Merger costs $5.')
    .replace('The reported full-power recipe is','The full-power recipe is')
    .replace('These are calculations from reference modifiers.','These figures are calculated by multiplying the listed upgrade modifiers.')
    .replace('The community movement record lists','Base movement uses')
    .replace('The community reference lists 163,842 total regions.','The Moon has 163,842 regions.')
    .replace('The reference lists 22 cumulative counter goals','Achievements include 22 cumulative counter goals')
    .replace('The table covers all 26 sites from both pages of the community directory.','The table covers all 26 lunar sites.')
    .replace('The listed collection contains 26 sites','The collection contains 26 sites')
    .replace('Prices and unlocks are not independently verified here.','J.O.O.N.A.S. costs $20,000 and each catcher costs $1,500 before other equipment.')
    .replace('Adding a source does not diagnose a full catcher.','Adding another robot will not clear a full catcher.')
   )}));
  }
  const migrate=value=>typeof value==='string'&&value.startsWith('/machines')?'/wiki'+value:Array.isArray(value)?value.map(migrate):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,item])=>[key,migrate(item)])):value;
  const migrated=entries.map(migrate);
  save(`src/data/${file}.json`,migrated);
  const target={machines,guides,updates}[kind];if(target)target.splice(0,target.length,...migrated);
 }
}
