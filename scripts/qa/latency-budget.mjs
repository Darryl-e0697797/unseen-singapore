import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
const origin = process.env.UNSEEN_PREVIEW_URL ?? 'http://127.0.0.1:3003';
const exhibits = [
  ['dtss', 'Deep Tunnel Sewerage'], ['tuas', 'Tuas Port'], ['mrt', 'MRT & underground construction'],
  ['barrage', 'Marina Barrage'], ['reclamation', 'Reclamation & the polder'],
];
const results = [];
for (let trial = 1; trial <= 3; trial++) {
for (const [id, title] of exhibits) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const start = performance.now();
  await page.goto(origin + '/explore/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Singapore. Look closer.' }).waitFor();
  const usefulTextMs = Math.round(performance.now() - start);
  await page.locator('main[data-interactive=true]').waitFor();
  const controlsReadyMs = Math.round(performance.now() - start);
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  const selected = performance.now();
  await page.locator('.catalog-list>button').filter({ hasText: title }).click();
  await page.waitForFunction((id) => document.querySelector('.world-canvas canvas')?.dataset.modelLoaded === id, id, { timeout: 60000 });
  const modelReadyMs = Math.round(performance.now() - selected);
  results.push({ trial, id, usefulTextMs, controlsReadyMs, modelReadyMs, pass: usefulTextMs <= 2500 && modelReadyMs <= 5000 && errors.length === 0, errors });
  console.log(results.at(-1));
  await context.close();
}
}
await browser.close();
mkdirSync('docs/qa/release', { recursive: true });
writeFileSync('docs/qa/release/latency-budget.json', JSON.stringify({
  origin, date: new Date().toISOString(),
  conditions: 'Fresh browser contexts, disabled page cache, 1.6 Mbps download / 750 Kbps upload / 150 ms latency via CDP. Local CPU/GPU; worker network throttling not independently verified.',
  limits: { usefulTextMs: 2500, modelReadyAfterSelectionMs: 5000 },
  results,
}, null, 2) + '\n');
if (results.some((r) => !r.pass)) process.exitCode = 1;
