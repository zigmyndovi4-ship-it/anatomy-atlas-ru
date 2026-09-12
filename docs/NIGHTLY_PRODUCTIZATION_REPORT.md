# Nightly productization report

Date: 2026-09-12

## Result

The project was prepared as the temporary standalone product **Anatomy Atlas RU**. The working tree was clean before the pass. Protected model/data contracts were not changed: `public/models/atlas.json`, geometry, concept IDs, English fields, BodyParts3D attribution, MIT license, and approved Russian anatomical terms remain intact.

## Changed

- renamed package metadata, browser title, HTML language/description, and visible app heading to Anatomy Atlas RU;
- added a user-facing About/Credits section that identifies Human Atlas by ashemag, MIT code licensing, BodyParts3D, CC BY 4.0, and the localization work;
- localized obvious Russian-mode accessibility labels, panel labels, search labels, and camera tooltips;
- improved search normalization with Unicode NFKC, trimming, repeated-whitespace collapsing, and case-insensitive matching while retaining `en`, `ru`, aliases, and concept/FMA ID search;
- rewrote README for the current product and added `public/CREDITS.md`;
- added product audit, upstream status, Tauri feasibility plan, and roadmap documentation;
- added unit-like search normalization assertions to `scripts/validate-interactions.mjs`.

## Files added

- `public/CREDITS.md`
- `docs/PRODUCT_AUDIT.md`
- `docs/UPSTREAM_STATUS.md`
- `docs/TAURI_PLAN.md`
- `docs/ROADMAP.md`
- `docs/NIGHTLY_PRODUCTIZATION_REPORT.md`

## Dependency audit

`npm audit` reported 11 vulnerabilities: 1 low, 2 moderate, and 8 high. The concrete affected chains are documented in [PRODUCT_AUDIT.md](PRODUCT_AUDIT.md): Cloudflare/Vite tooling through miniflare, wrangler, esbuild, sharp, undici and ws; vinext through image-size; direct `react-server-dom-webpack`; and direct Vite.

The ordinary `npm audit fix --dry-run` did not propose vulnerability remediation; it only proposed adding platform-specific optional packages. No `npm audit fix`, `npm audit fix --force`, dependency upgrade, or lockfile cleanup was performed. The candidate non-major updates need a separate controlled maintenance change and full deployment validation.

## Verification

- `npm run check` — passed.
- `npm run build` — passed. Existing warning: the minified JS chunk is larger than 500 kB.
- `node scripts/translation/status.mjs` — passed: Total 3432, Translated 3432, Missing 0, Progress 100%.
- `node scripts/validate-atlas.mjs` — passed: 2234 meshes, 3432 concepts, 2,288,268 triangles and binary buffers verified.
- `node scripts/validate-interactions.mjs` — passed: layout, search/inspection, tap/drag, multitouch, cancellation, empty-view, and search-normalization checks.
- `git diff --check` — passed.
- `git fetch upstream` — passed; no upstream commits ahead of `main`.

## Risks and open items

- runtime WebGL/model-loading fallback messages remain English-only because those lower-level paths do not receive the selected language;
- physical-device GPU/memory and multitouch performance are not fully tested;
- the production JS chunk is large; code-splitting would be a separate performance task;
- the dependency audit remains open and should be handled without force upgrades;
- Tauri is feasible but intentionally not installed or configured.

## Deliberately not done

No merge/rebase, force push, upstream push, Pull Request, public-repository change, geometry/data edit, major dependency update, `npm audit fix --force`, Tauri installation, P1/P2 feature implementation, analytics, telemetry, advertising, payment system, or external API was added. No potentially destructive cleanup was performed.

## Next recommended step

Review the dependency candidates in an isolated maintenance change, then add a small browser smoke-test layer for RU/EN switching, search, About/Credits, mobile layout, and WebGL loading before starting the Tauri packaging work.
