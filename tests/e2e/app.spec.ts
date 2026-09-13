import {expect, test, type Page} from '@playwright/test';
import fs from 'node:fs';

const visualDir = 'test-results/visual-qa';
fs.mkdirSync(visualDir, {recursive: true});

type Telemetry = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  badResponses: string[];
};

function collectTelemetry(page: Page): Telemetry {
  const telemetry: Telemetry = {consoleErrors: [], pageErrors: [], failedRequests: [], badResponses: []};
  page.on('console', message => {
    if (message.type() === 'error') telemetry.consoleErrors.push(message.text());
  });
  page.on('pageerror', error => telemetry.pageErrors.push(error.message));
  page.on('requestfailed', request => {
    const failure = request.failure()?.errorText ?? '';
    if (!failure.includes('ERR_ABORTED')) telemetry.failedRequests.push(`${request.url()} (${failure})`);
  });
  page.on('response', response => {
    if (response.status() >= 400) telemetry.badResponses.push(`${response.status()} ${response.url()}`);
  });
  return telemetry;
}

async function openAtlas(page: Page, viewport: {width: number; height: number}) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  await expect(page).toHaveTitle('Anatomy Atlas RU');
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible({timeout: 30_000});
  await page.waitForTimeout(1_500);
  return canvas;
}

async function assertCanvasAndLayout(page: Page, canvas: ReturnType<Page['locator']>, viewport: {width: number; height: number}) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  expect(Math.max(metrics.scrollWidth, metrics.bodyScrollWidth)).toBeLessThanOrEqual(viewport.width + 4);
  const box = await canvas.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(200);
  expect(box?.height ?? 0).toBeGreaterThan(200);
  const webgl = await canvas.evaluate(element => {
    const canvasElement = element as HTMLCanvasElement;
    const gl = canvasElement.getContext('webgl2') ?? canvasElement.getContext('webgl');
    return {context: Boolean(gl), width: canvasElement.width, height: canvasElement.height};
  });
  expect(webgl.context).toBeTruthy();
  expect(webgl.width).toBeGreaterThan(0);
  expect(webgl.height).toBeGreaterThan(0);
  await expect(page.getByRole('button', {name: /Поиск анатомии|Search anatomy/})).toBeVisible();
  await expect(page.locator('.view-controls')).toBeVisible();
  await expect(page.locator('.bottom-dock')).toBeVisible();
}

const viewports = [
  ['desktop-1440', {width: 1440, height: 900}],
  ['desktop-1920', {width: 1920, height: 1080}],
  ['laptop-1280', {width: 1280, height: 800}],
  ['tablet-1024', {width: 1024, height: 768}],
  ['tablet-768', {width: 768, height: 1024}],
  ['mobile-430', {width: 430, height: 932}],
  ['mobile-390', {width: 390, height: 844}],
  ['mobile-375', {width: 375, height: 667}],
] as const;

for (const [name, viewport] of viewports) {
  test(`WebGL/layout smoke: ${name}`, async ({page}) => {
    const telemetry = collectTelemetry(page);
    const canvas = await openAtlas(page, viewport);
    await assertCanvasAndLayout(page, canvas, viewport);
    await page.screenshot({path: `${visualDir}/${name}.png`, fullPage: true});
    if (name === 'tablet-1024') await page.screenshot({path: `${visualDir}/tablet.png`, fullPage: true});
    expect(telemetry.pageErrors, `${name} page errors`).toEqual([]);
    expect(telemetry.consoleErrors, `${name} console errors`).toEqual([]);
    expect(telemetry.failedRequests, `${name} failed requests`).toEqual([]);
    expect(telemetry.badResponses, `${name} bad responses`).toEqual([]);
  });
}

test('search ranking, normalization, selection, and screenshots', async ({page}) => {
  const telemetry = collectTelemetry(page);
  const viewport = {width: 1440, height: 900};
  const canvas = await openAtlas(page, viewport);
  await page.screenshot({path: `${visualDir}/desktop-home.png`, fullPage: true});
  const searchButton = page.getByRole('button', {name: 'Поиск анатомии'});
  await searchButton.click();
  const input = page.getByRole('combobox', {name: 'Поиск по названиям анатомических структур'});
  await expect(input).toBeVisible();

  const ruQueries: Array<[string, RegExp]> = [
    ['сердце', /сердце/i], ['мозг', /мозг/i], ['позвоночник', /позвоночн/i],
    ['платизма', /платизма|мышца шеи/i], ['аорта', /аорт/i], ['печень', /печень/i],
    ['почка', /почк/i], ['желудок', /желудок/i], ['лопатка', /лопатк/i],
    ['тощая кишка', /тощая кишка/i], ['бедренная артерия', /бедренная артерия/i],
  ];
  for (const [query, expected] of ruQueries) {
    await input.fill(query);
    const results = page.locator('[data-slot="combobox-item"]');
    await expect(results.first()).toBeVisible();
    await expect(results.first()).toContainText(expected);
  }

  await input.fill('  СЕРДЦЕ  ');
  await expect(page.locator('[data-slot="combobox-item"]').first()).toContainText(/сердце/i);
  await input.fill('легкое');
  const plainECount = await page.locator('[data-slot="combobox-item"]').count();
  await input.fill('лёгкое');
  await expect(page.locator('[data-slot="combobox-item"]').first()).toBeVisible();
  expect(await page.locator('[data-slot="combobox-item"]').count()).toBe(plainECount);

  const englishQueries = ['heart', 'brain', 'spine', 'platysma', 'aorta', 'liver', 'kidney', 'scapula', 'jejunum'];
  for (const query of englishQueries) {
    await input.fill(query);
    await expect(page.locator('[data-slot="combobox-item"]').first(), `English search result for ${query}`).toBeVisible();
  }

  await input.fill('heart');
  await page.screenshot({path: `${visualDir}/desktop-search-heart.png`, fullPage: true});
  await page.locator('[data-slot="combobox-item"]').first().click();
  await expect(page.locator('.detail-sheet')).toBeVisible();
  await expect(page.locator('.structure-title')).toContainText(/сердце/i);
  await page.screenshot({path: `${visualDir}/desktop-selected-structure.png`, fullPage: true});
  const firstTitle = await page.locator('.structure-title').innerText();

  await searchButton.click();
  await input.fill('печень');
  await page.locator('[data-slot="combobox-item"]').first().click();
  await expect(page.locator('.structure-title')).toContainText(/печень/i);
  expect(await page.locator('.structure-title').innerText()).not.toBe(firstTitle);
  await page.getByRole('button', {name: 'Снять выделение'}).click();
  await expect(page.locator('.detail-sheet')).toBeHidden();
  await canvas.click({position: {x: 300, y: 300}});
  await page.waitForTimeout(250);
  expect(telemetry.pageErrors).toEqual([]);
  expect(telemetry.consoleErrors).toEqual([]);
  expect(telemetry.failedRequests).toEqual([]);
  expect(telemetry.badResponses).toEqual([]);
});

test('RU/EN toggle, keyboard access, and language screenshots', async ({page}) => {
  const telemetry = collectTelemetry(page);
  const canvas = await openAtlas(page, {width: 1440, height: 900});
  await page.screenshot({path: `${visualDir}/desktop-ru.png`, fullPage: true});
  const toggle = page.getByRole('button', {name: 'Switch to English'});
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.getByRole('button', {name: 'Search anatomy'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Переключить на русский'})).toBeVisible();
  await page.screenshot({path: `${visualDir}/desktop-en.png`, fullPage: true});
  await page.getByRole('button', {name: 'Search anatomy'}).click();
  const input = page.getByRole('combobox', {name: 'Search named anatomical structures'});
  await input.fill('heart');
  await page.locator('[data-slot="combobox-item"]').first().click();
  await expect(page.locator('.structure-title')).toContainText(/heart/i);
  await expect(canvas).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  expect(await page.locator(':focus').count()).toBeGreaterThan(0);
  expect(telemetry.pageErrors).toEqual([]);
  expect(telemetry.consoleErrors).toEqual([]);
});
