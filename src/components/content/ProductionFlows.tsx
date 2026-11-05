import {wikiLinkOrCategory} from '@/lib/data/wiki-publication';
import Image from 'next/image';
import {machines,wiki,entryPath} from '@/lib/data/catalog';
import type { ProductionFlow } from '@/types/content';
import s from '@/style/common/production-flow.module.css';
export default function ProductionFlows({ flows }: { flows: ProductionFlow[] }) {
  const pictures=new Map([...machines.map(e=>[`/wiki/machines/${e.slug}`,e] as const),...wiki.map(e=>[entryPath('wiki',e),e] as const)]);
  return <div className={s.flows}>{flows.map(flow => <section key={flow.title} className={s.lane}><h3>{flow.title}</h3><ol>{flow.nodes.map((node,i) => {const picture=pictures.get(node.href);return <li key={`${node.label}-${i}`}><a href={wikiLinkOrCategory(node.href)}><span>{String(i+1).padStart(2,'0')}</span>{picture?.image && picture.imageKind === "reference" && <div className={s.equipment}><Image src={picture.image} alt={picture.imageAlt || picture.title} width={104} height={80} unoptimized /></div>}<strong>{node.label}</strong><small>{node.detail}</small></a></li>})}</ol></section>)}</div>;
}
