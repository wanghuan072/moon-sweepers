export function sourceLabel(url: string) {
  const parsed = new URL(url);
  if (parsed.hostname.includes('steam') && (parsed.pathname.includes('announcements') || parsed.pathname.includes('news'))) return 'Developer announcement';
  if (parsed.hostname === 'wikily.gg') return `Wikily · ${parsed.pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ')}`;
  if (parsed.hostname === 'store.steampowered.com') return 'Steam game page';
  return `${parsed.hostname.replace(/^www\./, '')} · reference`;
}
export function sourceRel(url: string) {
  const hostname = new URL(url, 'https://moon-sweepers.org').hostname;
  return hostname === 'wikily.gg' || hostname.endsWith('.wikily.gg')
    ? 'nofollow noopener noreferrer'
    : 'noopener noreferrer';
}
