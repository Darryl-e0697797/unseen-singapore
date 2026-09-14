import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
test('Tuas tour, mechanisms, nine stages and clean return', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/explore');
  expect(await page.locator('.tuas-map-marker').count()).toBe(0);
  await page.getByRole('button', { name: 'Begin at Tuas Port' }).click();
  const canvas = page.locator('.world-canvas canvas');
  await expect(canvas).toHaveAttribute('data-model-loaded', 'tuas');
  await expect(page.getByRole('button', { name: /Construction stage/ })).toHaveCount(9);
  const tour = page.getByRole('region', { name: 'Tuas guided engineering tour' });
  await tour.getByRole('button', { name: '05 Float. Place. Retain.' }).click();
  await expect(canvas).toHaveAttribute('data-tuas-section', 'true');
  await page.getByRole('slider', { name: 'Caisson placement' }).focus();
  await page.keyboard.press('End');
  await expect(canvas).toHaveAttribute('data-tuas-progress', '100');
  await tour.getByRole('button', { name: 'Reset mechanism' }).click();
  await expect(canvas).toHaveAttribute('data-tuas-progress', '0');
  await tour.getByRole('button', { name: 'Play mechanism' }).click();
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-tuas-progress')))
    .toBeGreaterThan(3);
  await tour.getByRole('button', { name: 'Pause mechanism' }).click();
  for (let i = 0; i < 8; i++) {
    await tour.locator('.dtss-stop-list button').nth(i).click();
    await expect(canvas).toHaveAttribute('data-tuas-focus', String(i));
  }
  await page.getByRole('button', { name: 'Phase 2', exact: true }).click();
  await expect(page.getByText(/Geometry remains the Phase 1 teaching district/)).toBeVisible();
  for (let i = 0; i < 9; i++) {
    await page.getByRole('button', { name: `Construction stage ${i + 1}:`, exact: false }).click();
    await expect(canvas).toHaveAttribute('data-stage', String(i));
  }
  await page.getByRole('button', { name: 'Back to Singapore', exact: false }).first().click();
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  await expect(page.locator('.tuas-map-marker')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('Tuas native context and mobile cutaway remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/explore');
  await page.getByRole('textbox', { name: 'Find an engineering project' }).fill('Tuas');
  await page.locator('.surface-projects > button').click();
  await expect(page.locator('.tuas-map-marker')).toHaveCount(4);
  await page.getByRole('button', { name: /Enter.*story|Enter.*engineering/i }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-model-loaded', 'tuas');
  await page.locator('.tuas-journey .dtss-stop-list button').nth(5).click();
  await page.getByRole('button', { name: 'Remove surcharge' }).click();
  await expect(page.getByRole('button', { name: 'Apply surcharge' })).toBeVisible();
  await page.getByRole('button', { name: 'Low detail off' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  mkdirSync('docs/qa/tuas', { recursive: true });
  await page.screenshot({ path: 'docs/qa/tuas/mobile.png' });
  await page.getByRole('button', { name: 'Back to Singapore', exact: false }).first().click();
  await expect(page.locator('.tuas-map-marker')).toHaveCount(0);
});

test('numbered structures explain themselves and labels follow visible construction', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Begin at Tuas Port' }).click();
  const canvas = page.locator('.world-canvas canvas');
  await expect(canvas).toHaveAttribute('data-model-loaded', 'tuas');
  await expect(page.locator('.tuas-hotspot')).toHaveCount(4);
  await page
    .getByRole('button', { name: 'Inspect structure 4: Caisson · concrete wall', exact: true })
    .click();
  await expect(
    page
      .getByRole('region', { name: 'Tuas drawing key' })
      .getByText(/holds the reclaimed ground in place/),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Inspect structure 4: Caisson · concrete wall', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Construction stage 3:', exact: false }).click();
  await expect(page.locator('.tuas-hotspot')).toHaveCount(2);
  await expect(
    page.getByRole('button', { name: 'Inspect structure 12: Rising mould · slipform' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Inspect structure 1: Container ship', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Construction stage 4:', exact: false }).click();
  await expect(
    page.getByRole('button', { name: 'Inspect structure 8: Floating caisson' }),
  ).toBeVisible();
  await page.locator('.tuas-journey .dtss-stop-list button').nth(5).click();
  await expect(
    page.getByRole('button', { name: 'Inspect structure 10: Temporary load · surcharge' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Remove surcharge' }).click();
  await expect(
    page.getByRole('button', { name: 'Inspect structure 10: Temporary load · surcharge' }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole('button', { name: 'Inspect structure 9: Vertical drains', exact: true })
    .click();
  await expect(
    page.getByRole('region', { name: 'Tuas drawing key' }).getByText(/help water escape/),
  ).toBeVisible();
  const bounds = await canvas.boundingBox();
  for (const label of await page.locator('.tuas-hotspot').all()) {
    const box = await label.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(bounds!.x);
    expect(box!.x + box!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
  }
  await page.screenshot({ path: 'docs/qa/tuas/numbered-mobile.png' });
  await page.getByRole('button', { name: 'Back to Singapore', exact: false }).first().click();
  await expect(page.locator('.tuas-hotspot')).toHaveCount(0);
});
