import { test, expect } from '@playwright/test';
async function enter(page: import('@playwright/test').Page) {
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'MRT' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-model-loaded', 'mrt');
}
test('MRT key, mechanisms, method comparison and reset', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await enter(page);
  const c = page.locator('.world-canvas canvas'),
    tour = page.getByRole('region', { name: 'MRT guided engineering tour' });
  await expect(tour.getByRole('heading', { name: 'What am I looking at?' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Inspect MRT structure 6:/ })).toHaveCount(0);
  await tour.getByRole('button', { name: '06 Bore and line' }).click();
  await expect(c).toHaveAttribute('data-mrt-focus', '5');
  await tour.getByRole('slider').fill('65');
  await expect(c).toHaveAttribute('data-mrt-progress', '65');
  await page.getByRole('button', { name: /Inspect MRT structure 8:/ }).focus();
  await page.keyboard.press('Enter');
  await expect(tour.getByText(/Precast concrete pieces/)).toBeVisible();
  await tour.getByRole('button', { name: '05 Build beneath the roof' }).click();
  await tour.getByRole('button', { name: 'Bottom-up', exact: true }).click();
  await expect(c).toHaveAttribute('data-mrt-method', 'bottom-up');
  await tour.getByRole('button', { name: '08 A temporary frozen barrier' }).click();
  await tour.getByRole('slider').fill('60');
  await expect(page.getByText('MARINA BAY · SEPARATE HISTORICAL CASE')).toBeVisible();
  await tour.getByRole('button', { name: '01 The journey today' }).click();
  await expect(page.getByRole('button', { name: /Inspect MRT structure 11:/ })).toHaveCount(0);
  for (let i = 0; i < 9; i++) {
    await page.getByRole('button', { name: `Construction stage ${i + 1}:`, exact: false }).click();
    await expect(c).toHaveAttribute('data-stage', String(i));
  }
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(c).toHaveAttribute('data-mrt-focus', '0');
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  expect(errors).toEqual([]);
});
test('MRT native map anchors and mobile return', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enter(page);
  await page.getByRole('button', { name: 'View MRT network on map' }).click();
  const key = page.getByRole('complementary', { name: 'MRT geographic network' });
  await expect(key).toBeVisible();
  await key.getByRole('button', { name: 'Bencoolen', exact: true }).click();
  await expect(page.locator('.maplibregl-canvas')).toHaveAttribute('data-map-zoom', '16.00');
  await page.getByRole('button', { name: /Enter the engineering story/ }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-model-loaded', 'mrt');
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(key).toHaveCount(0);
});
test('MRT asset failure preserves its numbered guide and historical state hides modern geometry', async ({
  page,
}) => {
  await page.route('**/models/world-mrt.glb{,.pack.gz}', (r) => r.abort());
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'MRT' }).click();
  await expect(page.getByText('The story is still here.')).toBeVisible();
  const tour = page.getByRole('region', { name: 'MRT guided engineering tour' });
  await tour.getByRole('button', { name: '06 Bore and line' }).click();
  await tour.getByRole('slider').fill('65');
  await tour.locator('.tuas-drawing-buttons button').filter({ hasText: 'Boring machine' }).click();
  await expect(tour.locator('.tuas-drawing-key article')).toContainText('pressure');
  await page.getByRole('button', { name: '1965 HISTORY' }).click();
  await expect(tour.getByText(/modern teaching section is hidden/)).toBeVisible();
  await expect(tour.getByRole('heading', { name: 'What am I looking at?' })).toHaveCount(0);
});
test('MRT remains readable when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return get.apply(this, [type, ...args] as Parameters<typeof get>);
    } as typeof get;
  });
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'MRT' }).click();
  await expect(page.getByText('The story is still here.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'MRT guided engineering tour' })).toBeVisible();
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /Explore 9 projects/ })).toBeVisible();
});
test('MRT network remains usable with unavailable basemap tiles', async ({ page }) => {
  await page.route('https://www.onemap.gov.sg/maps/tiles/**', (r) => r.abort());
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await page
    .locator('.surface-projects>button').filter({ hasText: 'MRT & underground construction' })
    .click();
  await expect(page.locator('.maplibregl-canvas')).toHaveAttribute('data-mrt-stations', '146');
  const key = page.getByRole('complementary', { name: 'MRT geographic network' });
  await key.getByRole('button', { name: 'Bencoolen', exact: true }).click();
  await expect(page.locator('.maplibregl-canvas')).toHaveAttribute('data-map-zoom', '16.00');
  await page.getByRole('button', { name: /Enter the engineering story/ }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-model-loaded', 'mrt');
});
