import {readFileSync, writeFileSync} from 'node:fs';
import {prepareManifest} from './seo-manifest-lib.mjs';

const siteUrl = 'https://moon-sweepers.org';
const output = 'public/seo-manifest.json';
const production = process.env.VERCEL_ENV === 'production';
const history = JSON.parse(readFileSync('src/data/seo/page-history.json', 'utf8'));
const generatedAt = new Date().toISOString();
let previous = null;
if (production) {
  const response = await fetch(new URL('/seo-manifest.json', siteUrl), {redirect: 'error'});
  if (response.ok) previous = await response.json();
  else if (response.status !== 404) throw new Error(`Production manifest: HTTP ${response.status}`);
}
const candidate = {
  schemaVersion: 1,
  fingerprintVersion: 'content-v1',
  siteUrl,
  generatedAt,
  entries: Object.keys(history).sort().map(path => ({
    path,
    canonicalUrl: new URL(path, siteUrl).href,
    indexable: true,
    contentFingerprint: 'sha256:' + history[path].hash,
    lastModified: new Date(history[path].modifiedAt).toISOString(),
  })),
};
const manifest = prepareManifest(candidate, previous);
writeFileSync(output, JSON.stringify({...manifest, production, commit: process.env.VERCEL_GIT_COMMIT_SHA}, null, 2));
for (const entry of manifest.entries) history[entry.path].modifiedAt = entry.lastModified.slice(0, 10);
writeFileSync('src/data/seo/page-history.json', JSON.stringify(history, null, 2) + '\n');
