import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const js = new Map();
page.on('response', async (r) => {
  if (r.url().split('?')[0].endsWith('.js'))
    try {
      js.set(r.url(), gzipSync(await r.body()).byteLength);
    } catch {}
});
const start = performance.now();
await page.goto(process.env.BASE_URL || 'http://127.0.0.1:3001');
await page.waitForFunction(() => document.querySelector('canvas')?.dataset.cameraPosition);
const interactiveMs = Math.round(performance.now() - start);
await page.getByRole('button', { name: 'Follow one drop', exact: true }).click();
await page.waitForTimeout(1000);
const frames = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let last = performance.now();
      const diffs = [];
      function step(now) {
        diffs.push(now - last);
        last = now;
        if (diffs.length < 120) requestAnimationFrame(step);
        else resolve(diffs);
      }
      requestAnimationFrame(step);
    }),
);
const sorted = frames.slice().sort((a, b) => a - b);
const full = await page.getByTestId('metrics').textContent();
await page.getByRole('button', { name: 'Low graphics quality' }).click();
await page.waitForTimeout(500);
const low = await page.getByTestId('metrics').textContent();
const result = {
  environment:
    'Local M4 Pro, Chrome, 1440x1000. Localhost production server; not throttled and not representative low-end hardware.',
  interactiveMs,
  totalRequestedJsGzipBytes: [...js.values()].reduce((a, b) => a + b, 0),
  frameIntervalMedianMs: sorted[Math.floor(sorted.length * 0.5)],
  frameIntervalP95Ms: sorted[Math.floor(sorted.length * 0.95)],
  high: full,
  low,
  gpuMemory: 'Not measured',
  ordinaryLaptopPerformance: 'Not measured',
};
writeFileSync('docs/performance-local.json', JSON.stringify(result, null, 2) + '\n');
console.log(result);
await browser.close();
