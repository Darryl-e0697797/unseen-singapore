import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
mkdirSync('docs/qa/barrage', { recursive: true });
const measurements = [];
for (const mobile of [false, true]) {
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:3001/explore');
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'Marina Barrage' }).click();
  await page.waitForFunction(
    () => document.querySelector('.world-canvas canvas')?.dataset.modelLoaded === 'barrage',
  );
  for (const i of [0, 2, 4, 5, 8]) {
    await page.locator('.barrage-stops button').nth(i).click();
    if (i === 8) await page.getByRole('checkbox', { name: /Show possible/ }).check();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `docs/qa/barrage/${mobile ? 'mobile' : 'desktop'}-${i + 1}.png`,
    });
    measurements.push({
      mobile,
      stop: i + 1,
      labels: await page.locator('.barrage-hotspot').evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            name: el.getAttribute('aria-label'),
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
          };
        }),
      ),
    });
  }
  await page.getByRole('button', { name: /Back to Barrage map/ }).click();
  await page.locator('.barrage-map-marker').first().waitFor();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `docs/qa/barrage/map-${mobile ? 'mobile' : 'desktop'}.png` });
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
}
writeFileSync('docs/qa/barrage/label-bounds.json', JSON.stringify(measurements, null, 2) + '\n');
await browser.close();
