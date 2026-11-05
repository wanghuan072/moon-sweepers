import type {MetadataRoute} from 'next';
import {site} from '@/config/site';
import history from '@/data/seo/page-history.json';
import {isPublicWikiLink} from '@/lib/data/wiki-publication';
export default function sitemap():MetadataRoute.Sitemap {
 return Object.entries(history).filter(([path])=>isPublicWikiLink(path)).map(([path,record])=>({url:site.url+path,lastModified:record.modifiedAt}));
}
