import { test, expect } from '@playwright/test';
async function enter(page: import('@playwright/test').Page) {
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await expect(page.locator('.reclamation-map-marker')).toHaveCount(0);
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await page
    .locator('.catalog-list>button')
    .filter({ hasText: 'Reclamation & the polder' })
    .click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute(
    'data-model-loaded',
    'reclamation',
  );
}
test('Tekong component tour, flow, playback, construction and return', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await enter(page);
  const tour = page.getByRole('region', { name: 'Pulau Tekong guided engineering tour' }),
    canvas = page.locator('.world-canvas canvas');
  for (let i = 0; i < 9; i++) {
    await tour.locator('.barrage-stops button').nth(i).click();
    await expect(canvas).toHaveAttribute('data-reclamation-focus', String(i));
  }
  await tour.locator('.barrage-stops button').nth(6).click();
  await expect(canvas).toHaveAttribute('data-reclamation-flow', 'circulation');
  await tour.getByRole('button', { name: 'Pond at operating level', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-reclamation-flow', 'discharge');
  await page.getByRole('button', { name: /Inspect Tekong structure 11:/ }).focus();
  await page.keyboard.press('Enter');
  await expect(tour.locator('.tuas-drawing-key article')).toContainText('Moves excess water');
  await tour.getByRole('button', { name: 'Play mechanism' }).click();
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-reclamation-progress')))
    .toBeGreaterThan(0);
  await tour.getByRole('button', { name: 'Pause mechanism' }).click();
  await tour.getByRole('button', { name: 'Reset mechanism' }).click();
  await expect(canvas).toHaveAttribute('data-reclamation-progress', '0');
  for (let i = 0; i < 9; i++) {
    await page.getByRole('button', { name: `Construction stage ${i + 1}:`, exact: false }).click();
    await expect(canvas).toHaveAttribute('data-stage', String(i));
  }
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-reclamation-focus', '0');
  await tour.getByRole('button', { name: /Back to Tekong map/ }).click();
  await expect(page.locator('.reclamation-map-marker')).toHaveCount(2);
  await page.getByRole('button', { name: /Enter the engineering story/ }).click();
  await expect(canvas).toHaveAttribute('data-model-loaded', 'reclamation');
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  await expect(page.locator('.reclamation-map-marker')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('Tekong mobile reduced motion, key and era visibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enter(page);
  const tour = page.getByRole('region', { name: 'Pulau Tekong guided engineering tour' });
  await tour.locator('.barrage-stops button').nth(4).click();
  await tour.getByRole('slider').fill('90');
  await expect(tour.getByRole('button', { name: 'Play mechanism' })).toBeDisabled();
  await tour
    .locator('.tuas-drawing-buttons button')
    .filter({ hasText: 'Inner barrier wall' })
    .click();
  await expect(tour.locator('.tuas-drawing-key article')).toContainText('Cement-bentonite');
  await page.getByRole('button', { name: '1965 HISTORY' }).click();
  await expect(page.locator('.reclamation-hotspot')).toHaveCount(0);
  await expect(tour.getByText(/Pre-polder context/)).toBeVisible();
  await page.getByRole('button', { name: '2026 PRESENT' }).click();
  await tour.locator('.barrage-stops button').nth(8).click();
  await tour.getByRole('checkbox', { name: /Show envisioned/ }).check();
  await tour.getByRole('button', { name: /Back to Tekong map/ }).click();
  await expect(page.locator('.reclamation-map-marker')).toHaveCount(2);
  await page
    .getByRole('button', { name: /Back to Singapore/ })
    .first()
    .click();
});
for (const failure of ['asset', 'webgl'])
  test(`Tekong ${failure} failure retains readable evidence`, async ({ page }) => {
    if (failure === 'asset') await page.route('**/models/world-reclamation.glb{,.pack.gz}', (r) => r.abort());
    else
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
    await page
      .locator('.catalog-list>button')
      .filter({ hasText: 'Reclamation & the polder' })
      .click();
    await expect(page.getByText('The story is still here.')).toBeVisible();
    const tour = page.getByRole('region', { name: 'Pulau Tekong guided engineering tour' });
    await tour.locator('.barrage-stops button').nth(6).click();
    await tour.getByText('Evidence for this view', { exact: true }).click();
    await expect(tour.getByRole('link', { name: /PUB/ }).first()).toBeVisible();
  });


test('model transport uses gzip once and retains native-browser fallback', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/models/world-reclamation.glb')) requests.push(request.url());
  });
  await enter(page);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatch(/\.glb\.pack\.gz$/);
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'DecompressionStream', { value: undefined }); });
  requests.length = 0;
  await enter(page);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatch(/\.glb$/);
});
