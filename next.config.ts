import {isPublicWikiLink} from './src/lib/data/wiki-publication';
import machines from './src/data/machines/machines.json';
import migrations from './src/data/wiki/route-migrations.json';
import updateArchive from './src/data/updates/updates.json';
import guideMigrations from './src/data/guides/route-migrations.json';
import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects(){return [
    ...updateArchive.map(entry=>({source:`/updates/${entry.slug}`,destination:`/updates#${entry.slug}`,permanent:true})),
    ...Object.entries(guideMigrations).filter(([,destination])=>destination).map(([source,destination])=>({source,destination:destination!,permanent:true})),
    {source:'/machines',destination:'/wiki/machines',permanent:true},
    ...machines.filter(entry=>entry.isDetails===true).map(entry=>({source:`/machines/${entry.slug}`,destination:`/wiki/machines/${entry.slug}`,permanent:true})),
    
    {source:'/wiki/tools',destination:'/wiki/cleaning-tools',permanent:true},
    ...Object.entries(migrations).filter(([from,to])=>to && from!==to && isPublicWikiLink(to)).map(([source,destination])=>({source,destination:destination!,permanent:true})),
    {source:'/about',destination:'/legal/about-us',permanent:true},
    {source:'/contact',destination:'/legal/contact-us',permanent:true},
    {source:'/privacy-policy',destination:'/legal/privacy-policy',permanent:true},
  ];},
  poweredByHeader: false, reactStrictMode: true,
  outputFileTracingExcludes: { '/*': ['./.local-media/**/*'] },
};
export default config;
