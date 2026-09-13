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

- [ ] Page title is `Anatomy Atlas RU`.
- [ ] JavaScript and CSS load under the repository base path.
- [ ] `atlas.json`, `anatomy-ru.json`, model chunks, and compressed chunks load
      under the repository base path.
- [ ] Russian and English search work.
- [ ] RU/EN toggle works.
- [ ] Search selection opens the detail card.
- [ ] WebGL canvas renders.
- [ ] No console errors, page errors, failed requests, or HTTP 4xx/5xx responses
      occur during the smoke flow.

The public URL check is performed after GitHub Pages is enabled and the first
main-branch deployment has completed.
