import Image from 'next/image';
import type { Entry } from '@/types/content';
import type { Machine } from '@/types/machine';
import { sourceLabel } from '@/lib/data/source-label';
import Icon from '@/components/common/Icon';
import s from '@/style/common/content.module.css';
export function GuideCard({ entry, compact = false }: { entry: Entry; compact?: boolean }) {
  return <a className={compact ? s.compactGuide : s.guideCard} href={`/guides/${entry.slug}`}>
    {entry.image && <div className={`${s.guideImage} ${entry.imageKind === "reference" ? s.equipmentGuideImage : ""}`}><Image src={entry.image} unoptimized={entry.imageKind === "official" || entry.imageKind === "reference"} alt={entry.imageAlt || "Lunar cleanup concept illustration — not a gameplay screenshot"} fill sizes={compact ? '90px' : '(max-width: 768px) 100vw, 33vw'} /><span>{entry.imageKind === "reference" ? "GAME EQUIPMENT · WIKILY" : entry.imageKind === "diagram" ? "DATA DIAGRAM" : entry.imageKind === "official" ? "© DRAGDROP GAMES / STEAM" : "CONCEPT ART"}</span></div>}
    <div className={s.guideText}><span className={s.eyebrow}>{entry.category}</span><strong>{entry.title}</strong><p>{entry.description}</p>{!compact && <small>Updated {entry.updatedAt} <span>Read guide ↗</span></small>}</div><Icon name="chevron" size={18} />
  </a>;
}
export function MachineCard({ machine, compact = false }: { machine: Machine; compact?: boolean }) {
  const showVisual = compact || Boolean(machine.image && machine.imageKind !== "diagram" && machine.imageKind !== "concept");
  const Card = compact || machine.isDetails === true ? "a" : "div";
  return <Card data-text-only={!showVisual || undefined} href={machine.isDetails === true ? `/wiki/machines/${machine.slug}` : compact ? "/wiki/machines" : undefined} className={`${s.machineCard} ${compact ? s.machineCompact : ''}`}>{showVisual && <div className={s.machineVisual}><div className={s.machineGrid} />{machine.image ? <Image src={machine.image} unoptimized={machine.imageKind === "reference"} alt={machine.imageAlt || `${machine.title} data diagram`} fill sizes={compact ? "180px" : "340px"} /> : <Icon name={machine.slug} size={compact ? 51 : 64} />}<span className={s.techLabel}>EQUIPMENT / {machine.category.toUpperCase()}</span></div>}<strong>{machine.title}</strong><span className={s.machinePrice}>${machine.cost?.toLocaleString("en-US")}{machine.costUnit === "metre" ? " / m" : ""}</span>{!compact && <><p>{machine.role}</p><dl className={s.cardSpecs}>{(machine.stats || []).filter(stat=>["Nominal demand","Peak generation","Storage","Full-power cycle","Wireless radius","Robot bin"].includes(stat.label)).slice(0,3).map(stat=><div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl><span className={s.status}>{machine.status === 'verified' ? 'Officially documented' : 'Community specs'}</span></>}{(compact || machine.isDetails === true) && <Icon name="chevron" size={16} />}</Card>;
}
export function SourceNote({ entry }: { entry: Entry }) {
  return <aside className={s.sourceNote}><Icon name="book" /><div><strong>{'Version, data & credits'}</strong><p>Updated {entry.updatedAt}{entry.version ? ` · Game version ${entry.version}` : ' · Exact build not independently verified'}. {entry.dataNote || 'Check the documented version when your game panel differs.'}</p><div className={s.sourceLinks}>{[...new Set(entry.sources)].filter(url => !entry.tables?.some(table => table.source === url)).map(url => <a key={url} href={url} rel="noopener noreferrer" target="_blank">{sourceLabel(url)} ↗</a>)}</div></div></aside>;
}
