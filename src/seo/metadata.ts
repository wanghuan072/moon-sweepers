import type { Metadata } from 'next';
import { site } from '@/config/site';
import {pageDates} from './dates';
import { tdk } from './tdk.js';
import type { Entry } from '@/types/content';
export function pageMetadata(title: string, description: string, path: string, index = true, article = false): Metadata {
  const url = new URL(path, site.url).href;
  return {
    title: {absolute: title}, description, metadataBase: new URL(site.url),
    icons: {icon: [{url:'/favicon.ico',sizes:'any'}, {url:'/favicon.svg',type:'image/svg+xml'}], apple:'/apple-touch-icon.png'},
    alternates: {canonical:url}, robots: {index, follow:true},
    openGraph: {type:article ? 'article' : 'website',title,description,url,siteName:site.name,locale:'en_US',images:[{url:new URL(site.image,site.url).href,width:1200,height:630,alt:'Moon Sweepers Wiki — guides, machines and lunar exploration'}]},
    twitter: {card:'summary_large_image',title,description,images:[new URL(site.image,site.url).href]},
  };
}
export function routeMetadata(path: string): Metadata {
  const copy = tdk[path];
  if (!copy) throw new Error(`Missing page TDK: ${path}`);
  return pageMetadata(copy.title,copy.description,path,path !== '/search');
}
export function entryMetadata(entry: Entry, path: string): Metadata {
  const metadata=pageMetadata(entry.tdk.title,entry.tdk.description,path,true,true);
  const dates=pageDates(path);
  return {...metadata,openGraph:{...metadata.openGraph,type:'article',modifiedTime:dates.modifiedAt,...(dates.publishedAt?{publishedTime:dates.publishedAt}:{})}};
}
