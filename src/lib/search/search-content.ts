import index from '@/data/search/search-index.json';
import {isPublicWikiLink} from '@/lib/data/wiki-publication';
export const searchIndex = index.filter(entry => isPublicWikiLink(entry.href));
