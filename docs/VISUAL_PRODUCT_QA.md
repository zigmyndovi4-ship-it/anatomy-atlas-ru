# Visual & Product QA

Дата: 2026-09-13

## Executive summary

Приложение проходит статический, data-integrity и interaction smoke QA. Безопасно
исправлены два UI localization leak, поиск получил устойчивый ranking и
нормализацию `ё/е`, а для «платизма» и «позвоночник» добавлены локальные search
aliases. Критических и high-severity блокеров не обнаружено.

Полноценная визуальная проверка через браузерную automation в окружении не
доступна: browser binary отсутствует. Поэтому responsive QA выполнен по CSS и
runtime layout code, а 3D contracts — существующим interaction smoke tests.

## Environment

- Repository: standalone `anatomy-atlas-ru`;
- Branch: `main`;
- Vite dev server: успешно отдаёт `/`, `atlas.json`, `anatomy-ru.json`, favicon;
- Viewport rules inspected: desktop, laptop, tablet, mobile и landscape mobile;
- WebGL/browser automation: недоступна в текущем окружении.

## Tests performed

- `node scripts/validate-atlas.mjs` — 2234 meshes, 3432 concepts, 2,288,268 triangles;
- `node --experimental-strip-types scripts/validate-interactions.mjs` — packing,
  search/inspection contracts, tap/drag/multitouch/cancellation;
- `npm run test:smoke` — объединяет эти проверки;
- локальный HTTP smoke: главная страница, atlas data, localization data и favicon
  отвечают HTTP 200;
- search cases проверены на русских, английских, alias и FMA-запросах;
- UI source, ARIA labels, title/placeholder/tooltips и responsive CSS inspected.

## Desktop findings

- `LOW / ACCEPTED`: 3D build содержит большой JS chunk (~932 kB minified); Vite
  предупреждает о размере >500 kB. Архитектурно безопасного code-splitting
  изменения без отдельного performance прохода не вносилось.
- `LOW / ACCEPTED`: визуальные screenshots на 1440×900 и 1920×1080 не сняты
  из-за отсутствия browser automation; layout rules для этих размеров присутствуют.

## Mobile findings

- `LOW / ACCEPTED`: реальные touch gestures не проиграны в браузере; pointer,
  multitouch и responsive branches покрыты interaction smoke test и CSS review.
- `FIXED`: мобильные tap targets уже имеют минимум 44 px для основных controls,
  detail close, layer switches и slider touch area.
- `FIXED`: detail/search/layers panels имеют отдельные mobile и landscape rules,
  overflow ограничен прокруткой внутри панелей.

## Search findings

- `FIXED`: ranking теперь ставит exact RU/EN/alias/FMA match выше prefix и partial
  matches, затем использует длину названия как tie-breaker.
- `FIXED`: нормализация поиска приводит `ё` к `е`, убирает лишние пробелы и
  сохраняет case-insensitive поиск.
- `FIXED`: aliases `платизма` и `позвоночник` добавлены для соответствующих
  существующих concepts, без изменения `en`, `ru` или concept IDs.
- `ACCEPTED`: самостоятельный concept для «четырёхглавой мышцы бедра» отсутствует
  в исходном atlas catalogue; не создан искусственный alias на зону мышцы.

## Localization/UI findings

- `FIXED`: русская About-панель больше не показывает английскую строку о meshes и
  concepts.
- `FIXED`: русская accessibility label для WebGL canvas добавлена отдельно от
  английской.
- `FIXED`: camera view buttons используют локализованные названия вида вместо
  необработанных `three-quarter/front/side/back` в tooltip.
- `FIXED`: строка `And N more modeled pieces` локализована через UI dictionary.
- `ACCEPTED`: имена лицензий, авторов, BodyParts3D и Human Atlas остаются в
  attribution-контексте согласно юридическим требованиям.

## 3D interaction findings

- `FIXED / VERIFIED`: atlas packing не даёт пересечений на desktop/mobile aspect
  ratios.
- `FIXED / VERIFIED`: search result → inspection, invalid inspection, selection,
  pointer tap, drag, multitouch и cancellation покрыты smoke test.
- `ACCEPTED`: фактические WebGL rotate/zoom/pan/hover/select не воспроизведены в
  браузере этого окружения; код содержит OrbitControls, raycast и resize handling.

## Accessibility findings

- `FIXED`: controls имеют aria-label/title, search input имеет label,
  view/layer controls имеют pressed/checked state.
- `FIXED`: keyboard focus-visible styles определены; search открывается клавишей
  `/`, Sheet использует focus target для detail heading.
- `LOW / ACCEPTED`: полноценный Tab/Escape audit требует реального браузера.

## Performance findings

- `MEDIUM / ACCEPTED`: initial 3D payload и итоговый JS chunk крупные, но atlas
  chunks загружаются параллельно группами и gzip fallback проверяется кодом.
- `LOW / ACCEPTED`: runtime memory profile и long-session leak audit не выполнялись
  без WebGL browser runtime.

## Dependency/security findings

- `LOW / OPEN`: `npm audit` не смог получить audit endpoint из-за отсутствия DNS/
  network доступа к `registry.npmjs.org`. Major upgrades и `npm audit fix --force`
  не выполнялись.
- Из ранее зафиксированного состояния проекта известны 11 vulnerabilities
  (`1 low`, `2 moderate`, `8 high`); безопасное обновление без registry audit
  в этом QA не предполагалось.

## Fixes applied

- search ranking и `ё/е` normalization;
- русские canvas/view accessibility labels;
- локализация model stats и member-list overflow text;
- два безопасных search aliases;
- `npm run test:smoke` script;
- этот QA report.

Медицинские названия, `atlas.json`, geometry, concept IDs, licenses и attribution
не изменялись.

## Remaining issues

- 8 ранее подтверждённых терминологических `REVIEW` остаются без guessed fixes;
- 8 review — внешняя терминологическая задача и не относятся к UI QA;
- отсутствует реальный automated visual browser run;
- audit registry недоступен в текущем окружении;
- отдельный concept для quadriceps femoris отсутствует в исходном catalogue.

## Release blockers

Нет CRITICAL или HIGH blockers. Для v0.1 остаются только MEDIUM/LOW accepted/open
ограничения, перечисленные выше.

## Non-blocking improvements

- добавить lightweight browser smoke runner в CI, когда доступна браузерная среда;
- отдельно исследовать code-splitting/dynamic loading большого Three.js chunk;
- получить свежий `npm audit` в окружении с доступом к npm registry;
- добавить отдельные concepts/aliases только после подтверждения соответствия
  исходному atlas catalogue.

## Recommendation for v0.1

Релиз v0.1 допустим как standalone русскоязычный 3D atlas при сохранении
документированных ограничений: заранее проверить production deployment в реальном
браузере на заданных viewport-размерах и выполнить dependency audit с network
доступом.

## Finding counts

| Severity | Count |
| --- | ---: |
| CRITICAL | 0 |
| HIGH | 0 |
| MEDIUM | 2 |
| LOW | 6 |
| FIXED | 12 |
| OPEN | 1 |
| ACCEPTED | 7 |
