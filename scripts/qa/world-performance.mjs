import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const js = new Map(),
  errors = [],
  warnings = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
  if (m.type() === 'warning') warnings.push(m.text());
});
page.on('response', async (r) => {
  if (r.url().split('?')[0].endsWith('.js'))
    try {
      js.set(r.url(), gzipSync(await r.body()).byteLength);
    } catch {}
});
const start = performance.now();
await page.goto('http://127.0.0.1:3001/explore');
await page.waitForFunction(() => document.querySelector('canvas')?.dataset.project === 'island');
const readyMs = Math.round(performance.now() - start);
await page.waitForTimeout(1500);
const overview = await page.locator('canvas').evaluate((c) => ({ ...c.dataset }));
await page.getByRole('button', { name: 'Begin at Tuas Port' }).click();
await page.waitForFunction(() => document.querySelector('canvas')?.dataset.modelLoaded === 'tuas');
await page.waitForTimeout(1500);
const tuas = await page.locator('canvas').evaluate((c) => ({ ...c.dataset }));
await page.getByRole('button', { name: 'Inspect structure' }).click();
await page.waitForTimeout(1600);
await page.screenshot({ path: 'docs/qa/world/tuas-inspect.png' });
await page.getByRole('button', { name: 'Enter flight' }).click();
await page.keyboard.down('w');
const frames = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const ds = [];
      let last = performance.now();
      function frame(now) {
        ds.push(now - last);
        last = now;
        if (ds.length < 120) requestAnimationFrame(frame);
        else resolve(ds);
      }
      requestAnimationFrame(frame);
    }),
);
await page.keyboard.up('w');
await page.keyboard.press('Escape');
const sorted = frames.slice().sort((a, b) => a - b);
const result = {
  environment:
    'M4 Pro / Chrome / 1440×1000 / localhost production / unthrottled. Does not establish ordinary-laptop performance.',
  readyMs,
  totalRequestedJsGzipBytes: [...js.values()].reduce((a, b) => a + b, 0),
  overview,
  tuas,
  flightFrameIntervalMedianMs: sorted[Math.floor(sorted.length * 0.5)],
  flightFrameIntervalP95Ms: sorted[Math.floor(sorted.length * 0.95)],
  gpuMemory: 'Not measured',
  errors,
  warnings: [...new Set(warnings)],
};
writeFileSync('docs/qa/world/performance.json', JSON.stringify(result, null, 2) + '\n');
console.log(result);
await browser.close();
