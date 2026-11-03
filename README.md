# Raabta — Pakistan Directory

A complete static Next.js + React + TypeScript project for finding government websites and apps. Deploy on Vercel without Laravel, a database or API keys.

## Start locally

Install Node.js 22 LTS or newer. Extract the ZIP, open a terminal inside `pakistan-service-directory`, then run:

```bash
npm ci
npm run dev
```

Open http://localhost:3000 . To generate the static production website:

```bash
npm run build
```

Output is in `out/`. A prebuilt copy is included. Serve it over HTTP; do not double-click the HTML. `next start` is not used with this static export.

## Deploy on Vercel

1. Push this project to a GitHub repository, including package-lock.json.
2. Import that repository in Vercel; choose Next.js.
3. If nested in a repository, select `pakistan-service-directory` as Root Directory.
4. Build command: `npm run build`. Static output: `out/`; framework detection usually handles this.
5. No environment variables are needed. Deploy and connect your domain.

## V3 features

- 319 resource records, retaining all 194 listings from the supplied Ask Pakistan snapshot.
- 173 district reference entries across all seven regions: Punjab 41, Sindh 30, KP 40, Balochistan 37, AJK 10, GB 14, ICT 1. These are directory reference entries, not a certified current administrative total. Karezat is explicitly marked status-under-review; new district notifications can change the dataset.
- Province → district → category → website/app filters; district resources rank before broader resources. Local-only mode excludes inherited resources.
- District-level scoping for selected electric utilities and Karachi resources. Province-wide departments and federal agencies remain available where assigned.
- English / Urdu / Roman Urdu selector; translated controls, district names and resource data. Urdu switches document direction to RTL; Roman Urdu stays LTR. Names/acronyms may retain recognisable official spellings. Localized names are editorial translations, not official issued translations.
- Light / dark / system theme. Preferences and bookmarks persist locally in the browser.
- Custom favicon, Apple touch icon, faint Pakistan flag background and dimensional card/logo styling.
- Static keyword and alias search, suggestions, native browser autocomplete, pagination and grid/list controls.
- Generated resource pages, sources, related links, printable preparation checklist, about/privacy and 404 pages.

## Edit the static data

- `src/data/resources.json`: names, department, type, URLs, categories, coverage IDs, keywords and source information.
- `src/data/locations.json`: region/district names, Urdu labels, IDs, source references and status.
- `src/data/location-metadata.json`: reference counts, dates and disputed/activation notes.
- `src/data/categories.json`: task categories.
- `src/data/translations.json`: exact English phrase → `{ "ur": "...", "roman": "..." }` catalogue. Add translations here whenever you add public-facing content.
- `src/data/search-config.json`: spelling aliases, stop words and suggestions.
- `src/data/import-manifest.json`: mapping for all 194 original imported entries.

Coverage examples:

```json
["pakistan"]
["punjab"]
["punjab-lahore"]
["sindh-karachi-east", "sindh-karachi-south"]
```

Only add district-owned websites you can verify. Not every district has an individual website recorded: broader matching regional/federal listings still appear, while local-only mode can correctly return an empty result.

Search is deterministic and uses stored fields only. Example: `mujhe CNIC banwana hai` normalizes to the meaningful stored term `cnic`. Unknown keywords return no invented answer. Add useful phrases to each resource's keywords array.

## Verify changes

```bash
npm run validate:data
npm test
npm run typecheck
npm run build
```

18 meaningful tests cover inherited/exact geographic coverage, district priority, wrong-district exclusion, search relevance, language record coverage and district reference counts.

## Icons and fonts

Favicons are fetched from Google's favicon service and fall back to category symbols on error. They are website icons, not guaranteed high-resolution app logos. Fonts load from Google Fonts; system fallback fonts are supplied. To avoid third-party requests, self-host approved fonts and icons in `public/` and update the CSS/iconUrl fields.

Custom branding assets: `public/favicon.svg`, `public/apple-touch-icon.png`, `public/pakistan-flag.svg`.

## Important data boundaries

The directory is independent and does not process government applications, identity documents, logins or payments. Most links lead to department homepages, not transaction forms. Sources establish discovery, not current availability, official endorsement or eligibility. Geographic assignments may require refinement; district inclusion is not a promise that every listed service is available to every resident.

Fees, processing times and document requirements are not invented. Contact/issue reporting requires owner configuration before public launch. No admin login, shared accounts, server submission system or backend is included because this is a static-data project.

Read SOURCES.md for provenance, DISTRICT-SOURCES.md for location notes, QA.md for verification, and IMPECCABLE.md for the optional design-agent workflow.
