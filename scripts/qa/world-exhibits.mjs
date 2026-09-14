import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://127.0.0.1:3001/explore');
for (const [i, id] of [
  'dtss',
  'mrt',
  'tuas',
  'newater',
  'barrage',
  'reclamation',
  'coast',
  'caverns',
  'power',
].entries()) {
  await page.getByRole('button', { name: 'Explore 9 projects' }).click();
  await page.locator('.catalog-list>button').nth(i).click();
  await page.waitForFunction(
    (id) => document.querySelector('canvas')?.dataset.modelLoaded === id,
    id,
  );
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `docs/qa/world/exhibit-${id}.png` });
}
await browser.close();
