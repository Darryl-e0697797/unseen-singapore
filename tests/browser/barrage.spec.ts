import { test, expect } from '@playwright/test';
async function enter(page: import('@playwright/test').Page) {
  await page.goto('/explore');
  await expect(page.locator('.barrage-map-marker')).toHaveCount(0);
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'Marina Barrage' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute(
    'data-model-loaded',
    'barrage',
  );
}
test('Barrage conditions, drawing key, playback and complete return', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await enter(page);
  const tour = page.getByRole('region', { name: 'Marina Barrage guided engineering tour' }),
    canvas = page.locator('.world-canvas canvas');
  await expect(tour.getByRole('heading', { name: 'What am I looking at?' })).toBeVisible();
  await tour.getByRole('button', { name: '05 Rain at low tide' }).click();
  await expect(canvas).toHaveAttribute('data-barrage-gate', 'open');
  await expect(canvas).toHaveAttribute('data-barrage-pumps', 'idle');
  await tour.getByRole('button', { name: '06 Rain at high tide' }).click();
  await expect(canvas).toHaveAttribute('data-barrage-gate', 'closed');
  await expect(canvas).toHaveAttribute('data-barrage-pumps', 'running');
  await tour.getByRole('button', { name: 'No excess rain', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-barrage-pumps', 'idle');
  await page.getByRole('button', { name: /Inspect Barrage structure 8:/ }).focus();
  await page.keyboard.press('Enter');
  await expect(tour.locator('.tuas-drawing-key article')).toContainText('1600 kW');
  await tour.getByRole('button', { name: 'Rain + high tide', exact: true }).click();
  await tour.getByRole('button', { name: 'Play mechanism' }).click();
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-barrage-progress')))
    .toBeGreaterThan(0);
  await tour.getByRole('button', { name: 'Pause mechanism' }).click();
  await tour.getByRole('button', { name: 'Reset mechanism' }).click();
  await expect(canvas).toHaveAttribute('data-barrage-progress', '0');
  for (let i = 0; i < 9; i++) {
    await page.getByRole('button', { name: `Construction stage ${i + 1}:`, exact: false }).click();
    await expect(canvas).toHaveAttribute('data-stage', String(i));
  }
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-barrage-focus', '0');
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  expect(errors).toEqual([]);
});
test('Barrage mobile map selection, future and historical state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enter(page);
  const tour = page.getByRole('region', { name: 'Marina Barrage guided engineering tour' });
  await tour.getByRole('button', { name: '03 Building in water' }).click();
  await expect(tour.getByRole('button', { name: 'Play mechanism' })).toBeDisabled();
  await tour.getByRole('slider').fill('80');
  await tour.getByRole('button', { name: '09 Facing future seas' }).click();
  await expect(page.getByRole('button', { name: /Inspect Barrage structure 12:/ })).toHaveCount(0);
  await tour.getByRole('checkbox', { name: /Show possible/ }).check();
  await expect(page.getByRole('button', { name: /Inspect Barrage structure 12:/ })).toBeVisible();
  await page.getByRole('button', { name: '1965 HISTORY' }).click();
  await expect(page.locator('.barrage-hotspot')).toHaveCount(0);
  await expect(tour.getByText(/Pre-project/)).toBeVisible();
  await tour.getByRole('button', { name: /Back to Barrage map/ }).click();
  await expect(page.locator('.barrage-map-marker')).toHaveCount(7);
  await page.getByRole('button', { name: /Enter the engineering story/ }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute(
    'data-model-loaded',
    'barrage',
  );
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(page.locator('.barrage-map-marker')).toHaveCount(0);
});
test('Barrage asset failure retains readable engineering and evidence', async ({ page }) => {
  await page.route('**/models/world-barrage.glb{,.pack.gz}', (r) => r.abort());
  await page.goto('/explore');
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'Marina Barrage' }).click();
  await expect(page.getByText('The story is still here.')).toBeVisible();
  const tour = page.getByRole('region', { name: 'Marina Barrage guided engineering tour' });
  await tour.getByRole('button', { name: '06 Rain at high tide' }).click();
  await tour.locator('.tuas-drawing-buttons button').filter({ hasText: 'Electric motor' }).click();
  await expect(tour.locator('.tuas-drawing-key article')).toContainText('1600 kW');
  await tour.getByText('Engineering evidence & limits', { exact: true }).click();
  await expect(tour.getByRole('link', { name: 'PUB ↗' }).first()).toBeVisible();
});
test('Barrage WebGL failure preserves its reading journey', async ({ page }) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return get.apply(this, [type, ...args] as Parameters<typeof get>);
    } as typeof get;
  });
  await page.goto('/explore');
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page.locator('.catalog-list>button').filter({ hasText: 'Marina Barrage' }).click();
  await expect(page.getByRole('heading', { name: 'What am I looking at?' })).toBeVisible();
  await page.getByRole('button', { name: '06 Rain at high tide' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Gate closed' })).toBeVisible();
});
test('Barrage map survives tile failure and can return directly to overview', async ({ page }) => {
  await page.route(/onemap.*\/maps\/tiles/, (r) => r.abort());
  await enter(page);
  await page.getByRole('button', { name: /Back to Barrage map/ }).click();
  await expect(page.locator('.barrage-map-marker')).toHaveCount(7);
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(page.locator('.barrage-map-marker')).toHaveCount(0);
});
