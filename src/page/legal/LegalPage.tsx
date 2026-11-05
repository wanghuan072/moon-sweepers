import {notFound} from 'next/navigation';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import JsonLd from '@/seo/JsonLd';
import {routeMetadata} from '@/seo/metadata';
import {pageDates} from '@/seo/dates';
import {site} from '@/config/site';
import pages from '@/data/legal/pages.json';
import s from '@/style/page/legal/legal.module.css';
export const generateStaticParams=()=>Object.keys(pages).map(legal=>({legal}));
export async function generateMetadata({params}:{params:Promise<{legal:string}>}){
 const {legal}=await params;return legal in pages?routeMetadata(`/legal/${legal}`):{};
}
export default async function LegalPage({params}:{params:Promise<{legal:string}>}){
 const {legal}=await params;const page=pages[legal as keyof typeof pages];if(!page)notFound();
 const path=`/legal/${legal}`,dates=pageDates(path);
 return <div className={`container ${s.page}`}><Breadcrumb items={[{title:page.title}]}/><article>
 <JsonLd data={{'@context':'https://schema.org','@type':legal==='about-us'?'AboutPage':legal==='contact-us'?'ContactPage':'WebPage',name:page.title,url:site.url+path,dateModified:dates.modifiedAt,isPartOf:{'@id':site.url+'/#website'}}}/>
 <header className={s.documentHeading}><small>MOON-SWEEPERS.ORG / UPDATED <time dateTime={dates.modifiedAt}>{dates.modifiedAt}</time></small><h1>{page.title}</h1><p>{page.description}</p></header>
 {page.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(text=><p key={text}>{text}</p>)}</section>)}
 <section><h2>Related information</h2><p><a href="mailto:support@moon-sweepers.org">support@moon-sweepers.org</a></p><ul>{Object.entries(pages).filter(([slug])=>slug!==legal).map(([slug,item])=><li key={slug}><a href={`/legal/${slug}`}>{item.title}</a></li>)}</ul></section>
 </article></div>;
}
