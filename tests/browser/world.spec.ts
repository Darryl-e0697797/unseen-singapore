import { test, expect } from '@playwright/test';
test('world opens sourced exhibits and construction changes rendered geometry', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  await page.getByRole('button', { name: 'Begin at Tuas Port' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-project', 'tuas');
  await page.waitForTimeout(1300);
  const finished = Number(
    await page.locator('.world-canvas canvas').getAttribute('data-triangles'),
  );
  await page.getByRole('button', { name: 'Construction stage 1:', exact: false }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-stage', '0');
  await expect
    .poll(async () =>
      Number(await page.locator('.world-canvas canvas').getAttribute('data-triangles')),
    )
    .toBeLessThan(finished);
  await page.getByRole('tab', { name: 'Engineering', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The caisson dependency chain' })).toBeVisible();
  await page.getByRole('button', { name: '2050 SCENARIOS' }).click();
  await expect(page.getByText('2050 / official target')).toBeVisible();
  await page.getByRole('button', { name: 'Back to Singapore' }).click();
  await page.getByRole('button', { name: 'Explore 9 projects' }).click();
  await expect(page.locator('.catalog-list>button')).toHaveCount(9);
  await expect(page.locator('.timeline-matrix tbody tr')).toHaveCount(9);
  expect(errors).toEqual([]);
});
test('all nine models load, flight exits, sources remain available on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  const ids = [
    'dtss',
    'mrt',
    'tuas',
    'newater',
    'barrage',
    'reclamation',
    'coast',
    'caverns',
    'power',
  ];
  for (let i = 0; i < ids.length; i++) {
    await page.getByRole('button', { name: 'Explore 9 projects' }).click();
    await page.locator('.catalog-list>button').nth(i).click();
    await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-project', ids[i]);
    await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-model-loaded', ids[i]);
    await expect
      .poll(async () =>
        Number(await page.locator('.world-canvas canvas').getAttribute('data-triangles')),
      )
      .toBeGreaterThan(0);
    await page.getByRole('tab', { name: 'Evidence' }).click();
    await expect(page.locator('.source-record')).not.toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Enter flight' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Enter flight' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test('failed world asset preserves the complete research interface', async ({ page }) => {
  await page.route('**/models/world-tuas.glb{,.pack.gz}', (r) => r.abort());
  await page.goto('/explore');
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByText('Try the full experience on this device', { exact: true }).click();
    await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Begin at Tuas Port' }).click();
  await expect(page.getByText('The story is still here.')).toBeVisible();
  await page.getByRole('tab', { name: 'Engineering', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The caisson dependency chain' })).toBeVisible();
  await page.getByRole('tab', { name: 'Evidence' }).click();
  await expect(page.locator('.source-record a').first()).toHaveAttribute(
    'href',
    /^https:\/\/www.mpa.gov.sg/,
  );
});
