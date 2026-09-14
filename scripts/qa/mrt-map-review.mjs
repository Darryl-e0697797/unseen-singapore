import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
mkdirSync('docs/qa/mrt', { recursive: true });
await page.goto('http://127.0.0.1:3001/explore');
await page.getByRole('button', { name: /Explore 9 projects/ }).click();
await page.locator('.catalog-list>button').filter({ hasText: 'MRT' }).click();
await page.locator('.world-canvas canvas').waitFor();
await page.getByRole('button', { name: 'View MRT network on map' }).click();
const key = page.getByRole('complementary', { name: 'MRT geographic network' });
await key.waitFor();
await page.getByRole('button', { name: '2D plan', exact: true }).click();
await page.waitForTimeout(1700);
for (const name of ['Toa Payoh', 'Bencoolen', 'Rochor', 'Marina Bay', 'Cantonment']) {
  await key.getByRole('button', { name, exact: true }).click();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `docs/qa/mrt/map-${name.replaceAll(' ', '-')}.png` });
}
await page.getByRole('button', { name: '3D context', exact: true }).click();
await page.waitForTimeout(1700);
await page.screenshot({ path: 'docs/qa/mrt/map-Cantonment-tilted.png' });
await page.getByRole('button', { name: '2D plan', exact: true }).click();
await page.waitForTimeout(1700);
await page.setViewportSize({ width: 390, height: 844 });
await key.getByRole('button', { name: 'Bencoolen', exact: true }).click();
await page.waitForTimeout(1400);
await page.screenshot({ path: 'docs/qa/mrt/map-mobile.png' });
await page.getByRole('button', { name: '3D context', exact: true }).click();
await page.waitForTimeout(1700);
await page.screenshot({ path: 'docs/qa/mrt/map-mobile-tilted.png' });
await page.getByRole('button', { name: /Enter the engineering story/ }).click();
await page.waitForTimeout(1600);
await page.screenshot({ path: 'docs/qa/mrt/mobile.png' });
const labels = await page.locator('.mrt-hotspot').evaluateAll((nodes) =>
  nodes.map((n) => ({
    name: n.getAttribute('aria-label'),
    rect: JSON.parse(JSON.stringify(n.getBoundingClientRect())),
  })),
);
writeFileSync('docs/qa/mrt/mobile-label-bounds.json', JSON.stringify(labels, null, 2));
await page.getByRole('button', { name: '06 Bore and line', exact: true }).click();
await page.getByRole('slider', { name: 'MRT mechanism progress' }).fill('65');
await page.waitForTimeout(1700);
await page.screenshot({ path: 'docs/qa/mrt/mobile-tbm.png' });
await browser.close();
