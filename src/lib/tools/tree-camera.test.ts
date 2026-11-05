import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error Node runs explicit TypeScript extensions, as in the existing tests.
import {focusTreeNode} from './tree-camera.ts';

test('phone focus leaves the node above the detail drawer and inside the canvas',()=>{
  const camera=focusTreeNode([2200,740],{x:0,y:0,scale:.12},{width:295,height:510,panelLeft:10,panelTop:243,stacked:true});
  const left=camera.x+2100*camera.scale,top=camera.y+690*camera.scale;
  assert.ok(left>=12 && left+200*camera.scale<=283);
  assert.ok(top>=8 && top+100*camera.scale<223);
  assert.equal(camera.scale,.95);
});

test('tablet focus leaves space for the side panel after a phone-to-tablet resize',()=>{
  const camera=focusTreeNode([2200,740],{x:0,y:0,scale:.95},{width:717,height:580,panelLeft:418,panelTop:14,stacked:false});
  const right=camera.x+2300*camera.scale;
  assert.ok(right<398);
  assert.equal(camera.y+740*camera.scale,290);
});

test('short landscape canvases reduce zoom enough to keep the whole node visible',()=>{
  const camera=focusTreeNode([120,270],{x:0,y:0,scale:2},{width:288,height:260,panelLeft:10,panelTop:118,stacked:true});
  const top=camera.y+220*camera.scale;
  assert.ok(top>=8);
  assert.ok(top+100*camera.scale<=98);
  assert.ok(camera.scale<2);
});
