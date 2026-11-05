import {readFileSync} from 'node:fs';

// Keep reviewed copy separate from the parameter import so regeneration preserves it.
export function applyWikiCopy({save,machines}) {
  const read=path=>JSON.parse(readFileSync(path,'utf8'));
  const copy=read('src/data/editorial/wiki-copy.json');
  const categoryCopy=read('src/data/editorial/wiki-categories.json');
  const apply=entries=>entries.map(entry=>{
    const reviewed=copy[entry.slug];
    if(!reviewed)throw new Error(`Missing Wiki editorial copy: ${entry.slug}`);
    const next={...entry,...reviewed};
    if(next.relatedLinks)next.relatedLinks=next.relatedLinks.filter((link,index,links)=>links.findIndex(other=>other.href===link.href)===index);
    return next;
  });
  const wiki=apply(read('src/data/wiki/entries.json'));
  const equipment=apply(read('src/data/machines/machines.json'));
  machines.splice(0,machines.length,...equipment);
  save('src/data/wiki/entries.json',wiki);
  save('src/data/machines/machines.json',equipment);
  save('src/data/wiki/categories.json',read('src/data/wiki/categories.json').map(category=>{
    const reviewed=categoryCopy[category.slug];
    if(!reviewed)throw new Error(`Missing Wiki category copy: ${category.slug}`);
    return {...category,...reviewed};
  }));
}
