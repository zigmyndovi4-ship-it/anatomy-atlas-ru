import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('web/index.html','utf8');
const analytics=await readFile('app/analytics.ts','utf8');
const page=await readFile('app/page.tsx','utf8');
assert.match(html,/%BASE_URL%favicon\.svg/);
assert.match(analytics,/https:\/\/cloud\.umami\.is\/script\.js/);
assert.match(analytics,/4e14b236-ced8-49c3-84ab-d3183031b210/);
for(const event of ['search','structure_opened','language_toggle','about_opened'])assert.match(page,new RegExp(`trackEvent\\('${event}'`));
assert.match(page,/BASE_URL.*models\/atlas\.json/s);
console.log('E2E contract checks passed. Full browser QA requires a deployed Pages URL; no Playwright dependency is installed in this repository.');
