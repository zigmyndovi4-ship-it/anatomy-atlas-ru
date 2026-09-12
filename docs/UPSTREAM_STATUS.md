# Upstream status

Date: 2026-09-12

Remotes were checked as configured:

- `origin` → `zigmyndovi4-ship-it/anatomy-atlas-ru`
- `upstream` → `ashemag/human-atlas`

`git fetch upstream` completed successfully. `main..upstream/main` is empty: upstream has no commits that are absent from this repository. `upstream/main..main` contains the six local Russian-localization commits:

```text
3c84154 fix: finalize Russian anatomical terminology
7b10afd fix: refine Russian anatomical terminology
524f9b2 feat: complete Russian anatomy localization
ca28463 feat: translate first 367 anatomy concepts
7de571b feat: add Russian anatomy translations and search aliases
5c28709 feat: add Russian localization and bilingual anatomy search
```

Nothing was merged or rebased. There are no new upstream changes to port now. Future upstream updates should be reviewed manually, especially changes touching `atlas.json`, geometry, `app/page.tsx`, localization contracts, or attribution.
