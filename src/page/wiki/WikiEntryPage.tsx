import { notFound } from 'next/navigation';
import EntryDetail from '@/components/content/EntryDetail';
import { wiki, entryPath } from '@/lib/data/catalog';
import { entryMetadata } from '@/seo/metadata';
export const generateStaticParams = () => wiki.filter(e=>e.isDetails===true && e.slug!=='achievements').map(e => ({ category: e.category, slug: e.slug }));
export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) { const { category, slug } = await params; const e = wiki.find(e => e.isDetails === true && e.slug !== 'achievements' && e.slug === slug && e.category === category); return e ? entryMetadata(e, entryPath('wiki', e)) : {}; }
export default async function WikiEntryPage({ params }: { params: Promise<{ category: string; slug: string }> }) { const { category, slug } = await params; const e = wiki.find(e => e.isDetails === true && e.slug !== 'achievements' && e.slug === slug && e.category === category); if (!e) notFound(); return <EntryDetail entry={e} kind="wiki" />; }
