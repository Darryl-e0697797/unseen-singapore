import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1040 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
await page.goto('http://127.0.0.1:3000');
await page.waitForFunction(() =>
  document.querySelector('[data-testid="metrics"]')?.textContent?.includes('triangles'),
);
await page.waitForTimeout(1500);
await page.screenshot({ path: 'docs/desktop-surface.png', fullPage: true });
await page.getByRole('button', { name: 'Reveal the unseen', exact: true }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: 'docs/desktop-reveal.png', fullPage: true });
console.log(
  JSON.stringify({ errors, metrics: await page.getByTestId('metrics').textContent() }, null, 2),
);
await browser.close();
