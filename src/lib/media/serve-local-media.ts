import mapMedia from '@/data/map/assets.json';
import contentMedia from '@/data/wiki/content-visuals.json';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import equipment from '@/data/machines/equipment-visuals.json';
import media from '@/data/wiki/official-media.json';
import { permitsLocalMedia, permittedMediaId } from './local-media-policy';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!permitsLocalMedia(process.env.NODE_ENV)) return new Response('Not found', { status: 404 });
  const { id } = await params;
  if (!permittedMediaId(id, [...media, ...equipment, ...contentMedia, ...mapMedia].map(item => item.id))) return new Response('Not found', { status: 404 });
  try {
    const bytes = await readFile(join(process.cwd(), '.local-media', `${id}.webp`));
    return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, noimageindex', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return new Response('Not found', { status: 404 }); }
}
