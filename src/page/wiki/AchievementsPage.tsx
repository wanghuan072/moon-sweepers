import {notFound} from 'next/navigation';
import EntryDetail from '@/components/content/EntryDetail';
import {wiki} from '@/lib/data/catalog';
import {entryMetadata} from '@/seo/metadata';
const entry=wiki.find(item=>item.slug==='achievements')!;
export const achievementsPublished = entry.isDetails === true;
export const metadata=achievementsPublished ? entryMetadata(entry,'/wiki/achievements') : {};
export default function AchievementsPage(){if (entry.isDetails !== true) notFound(); return <EntryDetail entry={entry} kind="wiki"/>;}
