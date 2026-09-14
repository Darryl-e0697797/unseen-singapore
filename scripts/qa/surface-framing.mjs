import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1208, height: 1126 } });
mkdirSync('docs/qa/surface-framing', { recursive: true });
await page.goto('http://127.0.0.1:3001/explore');
await page.locator('.geographic-map canvas[data-surface-loaded=true]').waitFor();
await page.waitForTimeout(1500);
await page.getByRole('button', { name: 'Whole island', exact: true }).click();
await page.waitForTimeout(2200);
await page.screenshot({ path: 'docs/qa/surface-framing/island.png' });
await page.getByRole('button', { name: '3D context', exact: true }).click();
await page.waitForTimeout(1600);
await page.screenshot({ path: 'docs/qa/surface-framing/3d.png' });
for (let i = 0; i < 4; i++) {
  if (!(await page.getByRole('button', { name: 'Zoom out', exact: true }).isEnabled())) break;
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await page.waitForTimeout(400);
}
await page.waitForTimeout(1200);
await page.screenshot({ path: 'docs/qa/surface-framing/zoom-out.png' });
await page.getByRole('button', { name: 'Marina Bay', exact: true }).click();
await browser.close();
