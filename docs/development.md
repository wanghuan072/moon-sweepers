# Maintaining Moon Sweepers Wiki

The public README is for players. This document covers local maintenance.

## Commands

- npm run data: regenerate content, apply keyword and editorial records, rebuild search entries and synchronise page dates.
- npm run typecheck and npm run lint: static checks.
- npm test: calculators, local-media policy, content consistency and page-history regression tests.
- npm run build: synchronise dates, then make the production build.
- npm run audit: inspect prerendered HTML, links, schemas, metadata, width breakpoints and sitemap coverage after a build.

Start or restart a persistent server only when explicitly requested. The existing localhost service can be inspected without launching another process. This task did not deploy or change a remote repository.

## Content and metadata

Edit factual import definitions in scripts/data and curated player-facing copy in src/data/editorial/entries.json. Regeneration deliberately fails when a new detail entry has no editorial record. Descriptions introduce the page to a player; the separate tdk object supplies search titles and descriptions. Do not restore legacy seoTitle or heading fields.

Fixed-route metadata lives in src/seo/tdk.js. This JavaScript file has JSDoc checking enabled. Keywords are internal topic labels and search aliases, not an HTML meta-keywords ranking mechanism. Keep page-specific wording and do not pad short descriptions with unrelated claims.

All public canonical URLs use https://moon-sweepers.org. Search is noindex and is absent from sitemap.xml. Old /about, /contact and /privacy-policy URLs redirect permanently to /legal equivalents. Unknown detail slugs return 404.

## Modification dates

Commit src/data/seo/page-history.json with content changes. It stores each public route's semantic hash and modification date. Keep it between deployments; deleting it would lose date history.

Detail inputs include their editorial text, parameters and shared article copy. Listings include the content they render; guide cards also depend on the underlying article revision because the card shows its update date. A schema change is tracked separately. CSS files, imports, class names, image sizes and the shared footer copyright year do not refresh the content date.

The initial baseline has no invented historical publication dates. Routes added after the baseline receive a publication date; later edits preserve it. Game announcements retain announcedAt, separately from article modification. Run the data command twice: the second pass should report zero changed URLs.

## Source handling

Keep a source link, applicable game version and necessary limitations with numerical data. Developer announcements take precedence for patch behaviour. Community specifications remain labelled in the consolidated data note. A derived production rate is not an independent gameplay benchmark.

The website has no accounts, submission form, analytics or advertising integration. Search sends requests to /api/search; submitted queries appear in the URL. The map uses localStorage for its visited list. Update the privacy notice when actual behaviour changes.

## Artwork

The brand uses an original vector Moon-and-sweep mark. The OG image is original concept illustration generated with the built-in imagegen tool, not a game screenshot. See brand-assets.md for the prompt and assets.

Official screenshots and community equipment images remain local-development previews only. Production tracing excludes .local-media; route policy blocks those assets outside development. This work does not establish new public reuse permission.

## Responsive and browser checks

Only 1024px and 768px width media breakpoints are used. Reduced-motion and pointer capability queries are separate accessibility/input features. Test more sizes than the two breakpoints, including 360px, 390px and landscape. Keep overflow inside table wrappers.

The current browser QA covers representative templates and interaction flows. It is not a physical-device test or a claim of ranking performance. Search Console, real-device touch behaviour and live social-card caches require separate observation after publication.
