# Using Impeccable with this project

Upstream: https://github.com/pbakaus/impeccable

Impeccable is a development-time design toolkit for coding agents. It is not required to run or deploy this app. Its engine is not bundled in this ZIP.

From this folder, install with the upstream command:

```bash
npx impeccable install
```

Choose the project scope and your coding tool, then reload that tool. Review any hook settings offered by the installer. In Codex:

```text
$impeccable init
$impeccable document
$impeccable critique the directory results
$impeccable animate the homepage illustration
$impeccable audit the mobile experience
$impeccable polish the service detail page
```

Keep the static-data architecture and existing coverage logic. PRODUCT.md and DESIGN.md provide the project context. Use stronger animation only where it helps; preserve reduced-motion alternatives.

Standalone source review:

```bash
npx impeccable detect src/
```

Rendered review while the dev server runs:

```bash
npx impeccable detect http://localhost:3000
```

These are development commands, not Vercel build steps. The delivered design is implemented directly in React/CSS and does not require a runtime Impeccable service.
