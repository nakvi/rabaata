# V3 verification

- 319 resource records, 181 location nodes (country + seven regions + 173 district references), 14 categories.
- Original 194-entry import manifest reconciles to actual resources.
- 18 automated tests pass, covering district counts, inherited/exact coverage, local priority, irrelevant district exclusions, keywords, spelling aliases and translation data presence.
- Static Next.js build, TypeScript compilation and data validation pass.
- Browser checks on generated output: English/Urdu/Roman Urdu switching; translated names/descriptions/filters; RTL for Urdu and LTR for Roman Urdu; light/dark selectors; language/theme persistence after reload; all 41 Punjab options visible; Lahore-first results.
- Dark-theme text/background colors checked on keyword buttons and primary navigation action.
- Desktop visual inspection completed. Mobile breakpoints are implemented, but a separate mobile-device visual pass was not performed.
- District reference statuses are documented; current legal completeness is not certified. Urdu/Roman Urdu names are editorial localizations and should be reviewed by the owner for official nomenclature.
- Favicons are remote with a local category-symbol fallback. Individual government service workflows were not submitted or tested.

- Final exported HTML reference check: 325 HTML files, zero missing internal targets. Favicon, touch icon and flag assets are present.
