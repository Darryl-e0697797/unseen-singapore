import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: 1512, height: 982 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
await page.goto('http://127.0.0.1:3001/explore');
await page.locator('canvas').waitFor();
await page.waitForTimeout(3500);
fs.mkdirSync('docs/qa/world', { recursive: true });
await page.screenshot({ path: 'docs/qa/world/island.png' });
await page.getByRole('button', { name: 'Begin at Tuas Port' }).click();
await page.waitForTimeout(3000);
await page.screenshot({ path: 'docs/qa/world/tuas.png' });
await page.getByRole('button', { name: 'Construction stage 3:', exact: false }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: 'docs/qa/world/tuas-stage3.png' });
await page.getByRole('button', { name: 'Explode layers' }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: 'docs/qa/world/tuas-exploded.png' });
await page.getByRole('button', { name: '2050 SCENARIOS' }).click();
await page.screenshot({ path: 'docs/qa/world/future.png' });
await page.getByRole('button', { name: 'Back to Singapore' }).click();
await page.getByRole('button', { name: 'Explore 9 projects' }).click();
await page.screenshot({ path: 'docs/qa/world/catalogue.png' });
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto('http://127.0.0.1:3001/explore');
await mobile.waitForTimeout(2000);
await mobile.screenshot({ path: 'docs/qa/world/mobile-island.png', fullPage: true });
await mobile.getByRole('button', { name: 'Begin at Tuas Port' }).click();
await mobile.waitForTimeout(2500);
await mobile.screenshot({ path: 'docs/qa/world/mobile-tuas.png', fullPage: true });
console.log(
  JSON.stringify(
    {
      errors,
      desktopOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      mobileOverflow: await mobile.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    },
    null,
    2,
  ),
);
await browser.close();
