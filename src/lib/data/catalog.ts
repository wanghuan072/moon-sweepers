import history from '@/data/seo/page-history.json';
import machineData from '@/data/machines/machines.json';
import guideData from '@/data/guides/guides.json';
import wikiData from '@/data/wiki/entries.json';
import categoryData from '@/data/wiki/categories.json';
import updateData from '@/data/updates/updates.json';
import type { Entry, WikiCategory } from '@/types/content';
import type { Machine } from '@/types/machine';
import { withDevelopmentScreenshot } from '@/lib/media/development-media';
function dated<T extends Entry>(entries:T[],kind:string):T[]{return entries.map(entry=>{
 const path=entryPath(kind,entry);
 const record=(history as Record<string,{modifiedAt:string;publishedAt?:string}>)[path];
 return record?{...entry,updatedAt:record.modifiedAt,...(record.publishedAt?{publishedAt:record.publishedAt}:{})}:entry;
});}
export const machines = dated(machineData as Machine[],'machines').map(withDevelopmentScreenshot);
export const guides = dated(guideData as Entry[],'guides').map(withDevelopmentScreenshot);
export const wiki = dated(wikiData as Entry[], 'wiki').map(withDevelopmentScreenshot);
export const categories = categoryData as WikiCategory[];
export const updates = dated(updateData as Entry[],'updates');
export const collections: Record<string, Entry[]> = { machines, guides, updates };
export function entryPath(kind:string,e:Entry){return kind==='updates'?`/updates#${e.slug}`:kind==='machines'?`/wiki/machines/${e.slug}`:kind==='wiki'&&e.slug==='achievements'?'/wiki/achievements':kind==='wiki'?`/wiki/${e.category}/${e.slug}`:`/${kind}/${e.slug}`;}
export const findEntry = (kind: string, slug: string) => collections[kind]?.find(e => e.slug === slug);
