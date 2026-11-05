import test from 'node:test';
import assert from 'node:assert/strict';
import {updateHistory,semanticCopy} from '../scripts/seo/route-history.mjs';

test('rebuilding unchanged pages retains their dates and unknown publication dates',()=>{
 const input={'/':{title:'Moon Sweepers'},'/machines/packager':{cost:100}};
 const first=updateHistory(input,{},'2026-11-04');
 assert.deepEqual(updateHistory(input,first,'2026-12-01'),first);
 assert.equal(first['/'].publishedAt,undefined);
});
test('only changed and new routes receive a new modification date',()=>{
 const first=updateHistory({'/':{title:'Home'},'/guides':{count:18}},{},'2026-11-04');
 const next=updateHistory({'/':{title:'Home'},'/guides':{count:19},'/guides/new':{title:'New guide'}},first,'2026-11-10');
 assert.equal(next['/'].modifiedAt,'2026-11-04');
 assert.equal(next['/guides'].modifiedAt,'2026-11-10');
 assert.equal(next['/guides/new'].publishedAt,'2026-11-10');
 const revised=updateHistory({'/guides/new':{title:'Revised guide'}},next,'2026-11-12');
 assert.equal(revised['/guides/new'].publishedAt,'2026-11-10');
});
test('removed routes leave the sitemap history',()=>{
 const first=updateHistory({'/old':{title:'Old'},'/new':{title:'New'}},{},'2026-11-04');
 assert.deepEqual(Object.keys(updateHistory({'/new':{title:'New'}},first,'2026-11-10')),['/new']);
});
test('class and responsive image size changes are not editorial changes',()=>{
 assert.deepEqual(semanticCopy('<h1 className="old">Packager</h1><img sizes="40vw" src="/a.png"/>'),semanticCopy('<h1 className="new">Packager</h1><img sizes="80vw" src="/a.png"/>'));
 assert.notDeepEqual(semanticCopy('<h1>Packager</h1>'),semanticCopy('<h1>Packager Setup</h1>'));
 assert.notDeepEqual(semanticCopy('<a href="/old">Guide</a>'),semanticCopy('<a href="/new">Guide</a>'));
});
test('changing the shared copyright year does not refresh a page',()=>{
 const old=semanticCopy('<main><h1>Guides</h1></main><footer>Copyright 2026</footer>');
 const next=semanticCopy('<main><h1>Guides</h1></main><footer>Copyright 2027</footer>');
 const history=updateHistory({'/guides':old},{},'2026-11-04');
 assert.deepEqual(updateHistory({'/guides':next},history,'2027-01-01'),history);
});
test('changing a listed entry updates its parent listing but not another page',()=>{
 const snapshots={
  '/guides':{cards:[{title:'Packager',description:'Connect the output'}]},
  '/wiki':{categories:['Tools','Vehicles']},
 };
 const history=updateHistory(snapshots,{},'2026-11-04');
 const edited=structuredClone(snapshots);
 edited['/guides'].cards[0].description='Connect the output and load dust';
 const next=updateHistory(edited,history,'2026-11-10');
 assert.equal(next['/guides'].modifiedAt,'2026-11-10');
 assert.deepEqual(next['/wiki'],history['/wiki']);
});
