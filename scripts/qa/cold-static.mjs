import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', {
  offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const start = performance.now();
await page.goto(process.env.UNSEEN_PREVIEW_URL ?? 'http://127.0.0.1:3002/explore/', { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Singapore. Look closer.' }).waitFor({ timeout: 60000 });
const usefulTextMs = Math.round(performance.now() - start);
await page.locator('main[data-interactive=true]').waitFor({ timeout: 60000 });
const controlsReadyMs = Math.round(performance.now() - start);
await page.getByRole('button', { name: /Explore 9 projects/ }).click();
const enter = performance.now();
await page.locator('.catalog-list>button').filter({ hasText: 'Reclamation & the polder' }).click();
await page.waitForFunction(() => document.querySelector('.world-canvas canvas')?.dataset.modelLoaded === 'reclamation', undefined, { timeout: 60000 });
const result = {
  environment: 'Local Chrome, static server, cold page cache, CDP 1.6 Mbps down / 750 Kbps up / 150 ms latency; worker throttling not independently verified. CPU/GPU is local hardware, not real-phone evidence.',
  usefulTextMs, controlsReadyMs, storyReadyAfterSelectionMs: Math.round(performance.now() - enter), errors,
  resources: await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => { const r = entry; return { path: new URL(r.name).pathname, startMs: Math.round(r.startTime), durationMs: Math.round(r.duration), transferredBytes: r.transferSize }; })),
};
writeFileSync('docs/qa/release/cold-static.json', JSON.stringify(result, null, 2) + '\n');
console.log(result);
await browser.close();
