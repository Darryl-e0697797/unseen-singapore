import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const js = new Map(),
  errors = [],
  pending = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('response', (r) => {
  if (/\.(m?js)(\?|$)/.test(r.url()))
    pending.push(
      r
        .body()
        .then((b) => js.set(r.url(), gzipSync(b).length))
        .catch(() => {}),
    );
});
mkdirSync('docs/qa/mrt', { recursive: true });
const start = performance.now();
await page.goto('http://127.0.0.1:3001/explore');
await page.getByRole('heading', { name: 'Singapore. Look closer.' }).waitFor();
const usefulTextMs = Math.round(performance.now() - start);
const before = await page.evaluate(
  () =>
    performance.getEntriesByType('resource').filter((r) => r.name.includes('world-mrt.glb')).length,
);
const enter = performance.now();
await page.getByRole('button', { name: /Explore 9 projects/ }).click();
await page.locator('.catalog-list>button').filter({ hasText: 'MRT' }).click();
const canvas = page.locator('.world-canvas canvas');
await page.waitForFunction(
  () => document.querySelector('.world-canvas canvas')?.dataset.modelLoaded === 'mrt',
);
const storyReadyMs = Math.round(performance.now() - enter);
await page.waitForTimeout(1800);
const high = await canvas.evaluate((c) => ({ ...c.dataset }));
await page.screenshot({ path: 'docs/qa/mrt/present.png' });
for (let i = 2; i < 9; i++) {
  await page.locator('.mrt-journey .dtss-stop-list button').nth(i).click();
  await page.waitForTimeout(1800);
  if ([3, 4, 5, 7].includes(i))
    await page.getByRole('slider', { name: 'MRT mechanism progress' }).fill('65');
  await page.screenshot({ path: `docs/qa/mrt/stop-${i + 1}.png` });
}
await page.locator('.mrt-journey .dtss-stop-list button').nth(5).click();
await page.getByRole('button', { name: 'Play mechanism' }).click();
const intervals = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const out = [];
      let last = performance.now();
      function frame(now) {
        out.push(now - last);
        last = now;
        if (out.length < 120) requestAnimationFrame(frame);
        else resolve(out);
      }
      requestAnimationFrame(frame);
    }),
);
await page.getByRole('button', { name: 'Pause mechanism' }).click();
await page.locator('.mrt-journey .dtss-stop-list button').nth(0).click();
await page.getByRole('checkbox', { name: 'Low graphics' }).check();
await page.waitForTimeout(1600);
const low = await canvas.evaluate((c) => ({ ...c.dataset }));
await Promise.all(pending);
const frames = intervals.sort((a, b) => a - b);
const result = {
  environment:
    'Local M4 Pro, Chrome, 1440x1000, unthrottled localhost production. Not ordinary-laptop/mobile evidence.',
  usefulTextMs,
  storyReadyMs,
  mrtRequestsBeforeEntry: before,
  requestedJsGzipBytes: [...js.values()].reduce((a, b) => a + b, 0),
  high,
  low,
  mechanismFrameIntervalMedianMs: frames[60],
  mechanismFrameIntervalP95Ms: frames[114],
  gpuMemory: 'Not measured',
  errors,
  openReleaseRequirements: [
    'Combined requested JavaScript exceeds the unchanged 650 KiB gzip budget',
    'Cold fast-4G timing',
    'Ordinary integrated-GPU laptop',
    'Real mobile device',
    'Decoded/GPU memory',
    'Whole-app acceptance',
  ],
};
writeFileSync('docs/qa/mrt/performance.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
await browser.close();
