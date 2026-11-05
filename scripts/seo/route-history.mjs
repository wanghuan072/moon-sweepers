import ts from 'typescript';
import {createHash} from 'node:crypto';
export function fingerprint(value){return createHash('sha256').update(JSON.stringify(value)).digest('hex');}
export function updateHistory(inputs, previous, day){
 const firstRun=Object.keys(previous).length===0;
 return Object.fromEntries(Object.entries(inputs).sort(([a],[b])=>a.localeCompare(b)).map(([path,value])=>{
  const hash=fingerprint(value),old=previous[path];
  return [path,old?.hash===hash?old:{hash,modifiedAt:day,...(old?.publishedAt?{publishedAt:old.publishedAt}:!old&&!firstRun?{publishedAt:day}:{})}];
 }));
}

export function semanticCopy(text){
 const tree=ts.createSourceFile('page.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),parts=[];
 function visit(node){
  if(ts.isImportDeclaration(node))return;
  if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(tree)==='footer')return;
  if(ts.isJsxAttribute(node)&&['className','sizes','dateTime','id'].includes(node.name.getText(tree)))return;
  if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)||ts.isJsxText(node)){const value=node.text.replace(/\s+/g,' ').trim();if(value&&!/^\d{4}-\d{2}-\d{2}$/.test(value))parts.push(value);}
  ts.forEachChild(node,visit);
 }visit(tree);return parts;
}
