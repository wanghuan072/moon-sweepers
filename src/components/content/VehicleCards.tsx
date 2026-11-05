import Image from 'next/image';
import type { Entry } from '@/types/content';
import s from '@/style/common/vehicle-cards.module.css';
const labels=['Cruise speed','Boost speed','Cleaning width','Dust hopper','Capsule slots','Seats'];
export default function VehicleCards({ vehicles }: { vehicles: Entry[] }) {
  return <div className={s.grid}>{vehicles.map(vehicle => { const image = vehicle.imageKind !== "concept" && vehicle.imageKind !== "diagram" ? vehicle.image : undefined; const Card = vehicle.isDetails === true ? "a" : "div"; return <Card data-text-only={!image || undefined} href={vehicle.isDetails === true ? `/wiki/vehicles/${vehicle.slug}` : undefined} className={s.card} key={vehicle.slug}>
    {image && <div className={s.visual}><Image src={image} alt={vehicle.imageAlt || vehicle.title} fill sizes="(max-width:768px) 90vw, (max-width:1024px) 45vw, 400px" unoptimized={vehicle.imageKind==='reference'} /><span>{vehicle.slug==='crew-transport'?'CREW TRANSPORT':'CLEANING VEHICLE'}</span></div>}
    <div className={s.body}><div className={s.title}><h2>{vehicle.title}</h2><strong>{vehicle.stats?.find(stat=>stat.label==='Base purchase')?.value}</strong></div><dl>{labels.map(label=>{const value=vehicle.stats?.find(stat=>stat.label===label)?.value;return <div key={label}><dt>{label}</dt><dd>{!value || value.startsWith('Not ')?'—':value}</dd></div>})}</dl>{vehicle.isDetails === true && <span className={s.link}>Specifications &amp; upgrade levels <span>↗</span></span>}</div>
  </Card>})}</div>;
}
