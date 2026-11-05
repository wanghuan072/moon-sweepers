import { notFound } from 'next/navigation';
import EntryDetail from '@/components/content/EntryDetail';
import { machines } from '@/lib/data/catalog';
import { entryMetadata } from '@/seo/metadata';
export const generateStaticParams = () => machines.filter(e => e.isDetails === true).map(e => ({ slug: e.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const e = machines.find(e => e.isDetails === true && e.slug === slug); return e ? entryMetadata(e, `/wiki/machines/${e.slug}`) : {}; }
export default async function MachineDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const e = machines.find(e => e.isDetails === true && e.slug === slug); if (!e) notFound(); return <EntryDetail entry={e} kind="machines" />; }
