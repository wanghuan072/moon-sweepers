import contentMedia from '@/data/wiki/content-visuals.json';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import equipment from '@/data/machines/equipment-visuals.json';
import media from '@/data/wiki/official-media.json';
import type { Entry } from '@/types/content';
import { permitsLocalMedia } from './local-media-policy';

const localFolder = join(process.cwd(), '.local-media');
export const developmentMediaEnabled = permitsLocalMedia(process.env.NODE_ENV) && existsSync(join(localFolder, 'manifest.json'));
export function developmentScreenshot(id: number, alt: string) {
  const record = media.find(item => item.id === `steam-screenshot-${id}`);
  if (!developmentMediaEnabled || !record || !existsSync(join(localFolder, `${record.id}.webp`))) return null;
  return { image: `/api/local-media/${record.id}`, imageKind: 'official' as const, imageAlt: alt,
    imageCaption: 'Official Steam screenshot · © DragDrop Games · Local development preview.',
    imageSource: record.originalUrl, imageCredit: record.copyright };
}
// Mappings are assigned only after visually inspecting the downloaded source images.
const assignments: Record<string, { id: number; alt: string }> = {
  'save-recovery-guide': { id:1, alt:'Official screenshot: Moon Sweepers lunar terrain and an astronaut' },
  'beginners-guide': { id: 1, alt: 'Official Moon Sweepers screenshot: a cleaning tool, astronaut and lunar station on dusty terrain' },
  'automation-guide': { id: 6, alt: 'Official Moon Sweepers screenshot: a lunar base connected by conveyor routes' },
  'how-to-use-packager': { id: 5, alt: 'Official Moon Sweepers screenshot: a station conveyor route, illustrating the delivery destination rather than the Packager itself' },
  'toothbrush': { id: 4, alt: 'Official Moon Sweepers screenshot: a held toothbrush and the astronaut’s shadow on lunar terrain' },
  'cleaning-vehicles': { id: 8, alt: 'Official Moon Sweepers screenshot: a large cleaning vehicle at work on the lunar surface' },
  'push-sweeper': { id: 7, alt: 'Official Moon Sweepers screenshot: a push sweeper operated by an astronaut' },
  'multiplayer': { id: 2, alt: 'Official Moon Sweepers screenshot: a crew of astronauts and a cleaning vehicle' },
};
export function withDevelopmentScreenshot<T extends Entry>(entry: T): T {
  if (entry.slug === 'official-media' && developmentMediaEnabled) return { ...entry, dataNote: 'Official screenshot previews are enabled only in local development. © DragDrop Games. Public reuse clearance remains pending.', sections: [
    { heading: 'Publisher screenshot sources', paragraphs: ['The gallery below previews the official Steam screenshots in this local development build. Each image links to the publisher-hosted original and retains its copyright credit.'] },
    { heading: 'Local preview scope', paragraphs: ['The site owner approved this local preview on November 4, 2026. This does not establish permission from the publisher for public republication. Screenshot files are kept outside public assets and are disabled in production builds until public use is separately cleared.'] },
  ] };
  const guideEquipment:Record<string,string>={'how-to-use-packager':'packager','moon-sand':'pressure-chamber','moon-stone':'stone-press','sand-production-line':'pressure-chamber','vehicle-garage-delivery':'garage','two-chamber-five-press':'stone-press','sand-to-stone-production':'pressure-chamber'};
  const reference = [...equipment.map(item=>({...item,imageRole:'equipment' as const})),...contentMedia].find(item => item.slug === (guideEquipment[entry.slug] || entry.slug));
  if (permitsLocalMedia(process.env.NODE_ENV) && reference && existsSync(join(localFolder, `${reference.id}.webp`))) return {...entry, image: `/api/local-media/${reference.id}`, imageKind: 'reference', imageRole:reference.imageRole as 'icon'|'equipment', imageAlt: reference.alt, imageCaption: reference.caption + ' · Local development preview', imageSource: reference.sourcePage};
  const assignment = assignments[entry.slug];
  const screenshot = assignment && developmentScreenshot(assignment.id, assignment.alt);
  return screenshot ? { ...entry, ...screenshot } : entry;
}
