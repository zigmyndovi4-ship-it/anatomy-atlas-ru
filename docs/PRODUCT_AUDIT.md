# Product audit

Date: 2026-09-12

## Current state

The repository is an independent `main` branch with a separate `origin` repository. The viewer is a Vite/React/Three.js application with local BodyParts3D assets, Russian/English UI switching, translated anatomy data, aliases, search, system visibility controls, structure inspection, isolation, and exploded layouts.

- 3,432 / 3,432 anatomical concepts have Russian translations.
- `Missing: 0`; `review-needed.tsv` has no data rows.
- The working tree was clean at the start of the pass.
- `npm run check` and `npm run build` were already known to pass; they are rerun in the final verification.

## Origin and project-owned work

The application is based on [Human Atlas by ashemag](https://github.com/ashemag/human-atlas). The original MIT license, author attribution, BodyParts3D attribution, source links, model geometry, `atlas.json`, English fields, concept IDs, and approved Russian anatomical data are retained.

This repository owns the Russian localization, translation audit artifacts, search aliases and bilingual search behavior, product documentation, temporary product presentation as **Anatomy Atlas RU**, and additional maintenance changes.

## What previously reduced standalone-product clarity

- Browser title, package name, README, and visible header used `Human Atlas` or `anatomy-studio` without clearly identifying the modified product.
- About content described BodyParts3D but did not clearly state the modified-product relationship to Human Atlas, the original author, MIT code license, or the separate CC BY 4.0 data license.
- Several accessibility labels and camera-control titles were hard-coded in English while Russian was the default UI.
- Search normalized only a basic lowercase/trim path and did not explicitly collapse repeated whitespace or apply Unicode normalization.

These safe items were addressed without changing the data contract or architecture.

## Legal requirements

Keep the MIT notice and original author information. Keep full BodyParts3D attribution and the CC BY 4.0 link. Preserve source identity and adaptation notes when redistributing model assets. Keep the distinction between application-code licensing and anatomy-data licensing visible in README, About/Credits, and attribution files.

## Technical debt and risks

- The 3D assets are large and browser/device performance is not fully tested on physical mobile hardware.
- Runtime WebGL/model-loading fallback messages in `scene.tsx` and `model-download.ts` are still English-only because those paths do not currently receive the selected language.
- The app has no browser automation test suite; validation is contract-level and build/type checking.
- The optional Cloudflare/Vercel-related development toolchain adds audit surface even though the viewer itself is static and does not call external APIs.

## Dependency audit

`npm audit` reported 11 vulnerabilities: 1 low, 2 moderate, and 8 high. The affected dependency chains are:

- `@cloudflare/vite-plugin` → `miniflare` / `wrangler` / `ws`;
- `wrangler` → `esbuild` / `miniflare`;
- `miniflare` → `sharp` / `undici` / `ws`;
- `vinext` → `image-size`;
- direct `react-server-dom-webpack`;
- direct `vite`.

The report identifies non-major candidate versions such as `@cloudflare/vite-plugin@1.54.8`, `vinext@1.0.0-beta.9`, `react-server-dom-webpack@19.3.0`, and `vite@8.3.0`. However, ordinary `npm audit fix --dry-run` proposed only 138 added platform-specific optional packages and no vulnerability remediation. No audit fix or lockfile rewrite was applied. Do not use `npm audit fix --force`; review those candidates in a separate dependency-maintenance change, with check/build and deployment validation.

## Safe improvements completed or identified

- neutral product presentation as Anatomy Atlas RU;
- user-facing About/Credits explanation;
- README for the current repository;
- localized obvious UI accessibility labels and tooltips;
- Unicode-aware search normalization with whitespace collapsing;
- upstream and Tauri feasibility documentation;
- roadmap and nightly report.
