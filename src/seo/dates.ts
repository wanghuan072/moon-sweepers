import history from '@/data/seo/page-history.json';
interface PageDates {modifiedAt:string;publishedAt?:string}
export function pageDates(path:string):PageDates {
 const record=(history as Record<string,PageDates>)[path];
 if(!record)throw new Error(`Missing content history: ${path}`);
 return record;
}
