import { site } from '@/config/site';
import JsonLd from '@/seo/JsonLd';
import s from '@/style/common/content.module.css';
export default function Breadcrumb({ items }: { items: { title: string; href?: string }[] }) {
  const all = [{ title: 'Home', href: '/' }, ...items];
  return <><nav className={s.breadcrumb} aria-label="Breadcrumb"><ol>{all.map((item, i) => <li key={i}>{i > 0 && <span aria-hidden="true">/</span>}{item.href ? <a href={item.href}>{item.title}</a> : <span aria-current="page">{item.title}</span>}</li>)}</ol></nav><JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: all.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.title, ...(item.href ? { item: `${site.url}${item.href}` } : {}) })) }} /></>;
}
