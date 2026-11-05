import { notFound } from 'next/navigation';
import EntryDetail from '@/components/content/EntryDetail';
import { guides } from '@/lib/data/catalog';
import { entryMetadata } from '@/seo/metadata';
export const generateStaticParams = () => guides.map(e => ({ slug: e.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const e = guides.find(e => e.slug === slug); return e ? entryMetadata(e, `/guides/${e.slug}`) : {}; }
export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const e = guides.find(e => e.slug === slug); if (!e) notFound(); return <EntryDetail entry={e} kind="guides" />; }
