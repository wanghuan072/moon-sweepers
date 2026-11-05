import wiki from '../../data/wiki/entries.json';
import machines from '../../data/machines/machines.json';

const draftPaths = new Set([
  ...wiki.filter(entry => entry.isDetails !== true).map(entry =>
    entry.slug === 'achievements' ? '/wiki/achievements' : `/wiki/${entry.category}/${entry.slug}`),
  ...machines.filter(entry => entry.isDetails !== true).map(entry => `/wiki/machines/${entry.slug}`),
]);

export function isPublicWikiLink(href: string) {
  return !draftPaths.has(href.split(/[?#]/, 1)[0]);
}

export function wikiLinkOrCategory(href: string) {
  return isPublicWikiLink(href) ? href : href.split('/').slice(0, -1).join('/');
}
