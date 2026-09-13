# Web deployment QA

## Deployment

GitHub Actions workflow `.github/workflows/web-deploy.yml` builds the existing
Vite/React frontend with `VITE_DEPLOY_TARGET=pages` and deploys `dist` through
the official GitHub Pages actions. The application uses
`/anatomy-atlas-ru/` only for that deployment; local Vite and Tauri builds use
`/`.

Expected URL:

<https://zigmyndovi4-ship-it.github.io/anatomy-atlas-ru/>

## Checks

- [x] Page title is `Anatomy Atlas RU`.
- [x] JavaScript and CSS load under the repository base path.
- [x] `atlas.json`, `anatomy-ru.json`, model chunks, and compressed chunks load
      under the repository base path.
- [x] Russian search for `сердце` returns a result and opens the detail card.
- [x] RU/EN toggle works after selection.
- [x] WebGL canvas renders.
- [x] No console errors, page errors, failed requests, or HTTP 4xx/5xx responses
      occurred during the smoke flow.

Result: PASS against the public URL on 2026-09-13. The captured browser
evidence is [web-public.png](screenshots/web-public.png).

The public URL check is performed after GitHub Pages is enabled and the first
main-branch deployment has completed.
