# Browser & WebGL QA

## Executive summary

The application passed the final Playwright Chromium browser/WebGL suite. All
10 tests passed across desktop, laptop, tablet and mobile viewports. WebGL
contexts were created successfully, canvases rendered with non-zero bounds, and
no application console/page/network errors were recorded.

## Environment

- Playwright: 1.63.0
- Chromium: Chrome for Testing 153.0.8010.12, Playwright build v1243
- Browser: real headless Chromium with WebGL enabled
- Local server: Vite on `127.0.0.1:3000`
- Suite: `npm run test:e2e`

## Viewport matrix

Passed at all requested sizes:

| Class | Viewports | Result |
| --- | --- | --- |
| Desktop | 1440×900, 1920×1080 | PASS |
| Laptop | 1280×800 | PASS |
| Tablet | 1024×768, 768×1024 | PASS |
| Mobile | 430×932, 390×844, 375×667 | PASS |

The suite checked canvas visibility and dimensions, WebGL context creation,
horizontal overflow, search/control visibility and repeated viewport loading.

## Search matrix

Russian queries checked: `сердце`, `мозг`, `позвоночник`, `платизма`, `аорта`,
`печень`, `почка`, `желудок`, `лопатка`, `тощая кишка`, `бедренная артерия`.

English queries checked: `heart`, `brain`, `spine`, `platysma`, `aorta`,
`liver`, `kidney`, `scapula`, `jejunum`.

Also checked case-insensitivity, leading/trailing spaces and `ё/е`
normalization. The English `spine` case exposed a missing alias for the
existing `vertebral column` concept; the safe alias was added without changing
`en` or concept identity.

## WebGL and interaction

- Canvas exists and has a live WebGL/WebGL2 context.
- Canvas dimensions and bounding boxes are non-zero at every viewport.
- Search result → detail card selection works.
- Selecting a second structure updates the card.
- Deselect works.
- Real canvas click completed without a page crash.
- Canvas remains present after search and RU/EN switching.

## Accessibility smoke

- Search input has an accessible name in both languages.
- Search, language, camera and detail controls expose accessible names.
- Tab focus remains available.
- Escape/keyboard interaction did not produce errors.

## Console and network

Final suite telemetry:

- console errors: 0
- page errors: 0
- failed requests: 0
- HTTP responses ≥400: 0

The initial failed run contained only test-selector/assertion issues, not
application errors. Those assertions were corrected and the complete suite
then passed.

## Screenshots

Generated under `test-results/visual-qa/`:

- `desktop-home.png`
- `desktop-search-heart.png`
- `desktop-selected-structure.png`
- `desktop-ru.png`
- `desktop-en.png`
- `desktop-1440.png`
- `desktop-1920.png`
- `laptop-1280.png`
- `tablet.png`
- `tablet-1024.png`
- `tablet-768.png`
- `mobile-430.png`
- `mobile-390.png`
- `mobile-375.png`

## Findings

| Severity | Finding | Status |
| --- | --- | --- |
| MEDIUM | English `spine` search had no result despite the existing vertebral-column concept | FIXED |
| LOW | Initial QA assertions used visible button text instead of localized aria-labels | FIXED in test suite |
| LOW | Initial spine assertion expected a literal lexical form rather than the correct “vertebral column” result | FIXED in test suite |

## Release blockers

None found. No geometry, atlas semantics, licensing, attribution or major
dependencies were changed.

## Repeatable tests

The suite is in `tests/e2e/app.spec.ts` and runs with:

```sh
npm run test:e2e
```

The existing `npm run test:smoke` command remains unchanged.
