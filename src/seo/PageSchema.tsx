import JsonLd from './JsonLd';
import {tdk} from './tdk.js';
import {pageDates} from './dates';
import {site} from '@/config/site';
export default function PageSchema({path,collection=false}:{path:string;collection?:boolean}){
 const copy=tdk[path],dates=pageDates(path);
 return <JsonLd data={{'@context':'https://schema.org','@type':collection?'CollectionPage':'WebPage','@id':site.url+path+'#page',url:site.url+path,name:copy.title,description:copy.description,dateModified:dates.modifiedAt,...(dates.publishedAt?{datePublished:dates.publishedAt}:{}),isPartOf:{'@id':site.url+'/#website'},publisher:{'@id':site.url+'/#organization'},inLanguage:'en'}}/>;
}
