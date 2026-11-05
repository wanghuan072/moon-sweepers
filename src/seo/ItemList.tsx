import { site } from '@/config/site';
import JsonLd from './JsonLd';
export default function ItemList({ name, items }: { name: string; items: { title: string; href: string }[] }) {
  return <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', name, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.title, url: `${site.url}${item.href}` })) }} />;
}
