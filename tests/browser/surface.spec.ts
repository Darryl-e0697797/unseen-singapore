import { test, expect } from '@playwright/test';

// A synthetic tile keeps interaction tests independent of OneMap availability.
// Live provider appearance is checked separately in the browser.
test.beforeEach(async ({ page }) => {
  await page.route('https://www.onemap.gov.sg/maps/tiles/**', (route) =>
    route.fulfill({
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAACwElEQVR4nO3TMQ0AMAzAsPInuWfPWAxGj1gygDyZ+w5kzXoBLDIAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANI+kpMoFRI8SIQAAAAASUVORK5CYII=',
        'base64',
      ),
    }),
  );
});

test('geographic surface renders buildings, changes projection, and clears Tuas context on return', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/explore');
  const map = page.locator('.geographic-map canvas');
  await expect(map).toHaveAttribute('data-buildings-loaded', 'true', { timeout: 15000 });
  await expect
    .poll(async () => Number(await map.getAttribute('data-visible-buildings')))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: '2D plan', exact: true }).click();
  await expect(map).toHaveAttribute('data-map-pitch', '0.0');
  await page.getByRole('textbox', { name: 'Find an engineering project' }).fill('Tuas');
  await expect(page.locator('.surface-projects > button')).toHaveCount(1);
  await page.locator('.surface-projects > button').click();
  await expect(page.locator('.tuas-map-marker')).toHaveCount(4);
  await page.getByRole('button', { name: 'Enter the engineering story' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-model-loaded', 'tuas');
  await page.getByRole('button', { name: 'Back to Singapore' }).click();
  await expect(map).toBeVisible();
  await expect(page.locator('.tuas-map-marker')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  await page.getByRole('button', { name: '2050 SCENARIOS' }).click();
  await expect(map).toHaveAttribute('data-building-visibility', 'none');
  await page.getByRole('button', { name: 'Map & model provenance' }).click();
  await expect(page.getByRole('link', { name: /OpenStreetMap/ }).last()).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile map remains usable when building data fails', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/geography/cbd-buildings.{geojson,json}', (route) => route.abort());
  await page.goto('/explore');
  await expect(page.locator('.geographic-map canvas')).toHaveAttribute(
    'data-surface-loaded',
    'true',
  );
  await expect(page.locator('.building-toggle')).toBeDisabled();
  await page.getByRole('button', { name: 'Discover Marina Barrage' }).click();
  await page.getByRole('button', { name: 'Enter the engineering story' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute(
    'data-model-loaded',
    'barrage',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('DTSS corridors and landmarks live on the map and phase toggles work', async ({ page }) => {
  await page.goto('/explore');
  await page.locator('.surface-projects > button').first().click();
  const map = page.locator('.geographic-map canvas');
  await expect(map).toHaveAttribute('data-dtss-overlay', 'true');
  await expect
    .poll(async () => Number(await map.getAttribute('data-dtss-routes')))
    .toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'About Changi WRP', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'About Mandai Wildlife Reserve', exact: true }).click();
  await expect(page.locator('.dtss-landmark-note')).toContainText(
    'does not imply a sewer connection',
  );
  await page.getByRole('button', { name: 'Phase 1', exact: true }).click();
  await page.getByRole('button', { name: 'Phase 2', exact: true }).click();
  await expect.poll(async () => Number(await map.getAttribute('data-dtss-routes'))).toBe(0);
  await page.getByRole('button', { name: 'Phase 2', exact: true }).click();
  await expect
    .poll(async () => Number(await map.getAttribute('data-dtss-routes')))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Landmarks', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'About Mandai Wildlife Reserve', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Enter the engineering story' }).click();
  await page.getByRole('button', { name: 'Back to Singapore' }).click();
  await expect(map).toHaveAttribute('data-dtss-overlay', 'true');
  await page.getByRole('button', { name: 'Back to Singapore' }).click();
  await expect(page.locator('.surface-lead h1')).toBeVisible();
  await expect(page.locator('.surface-projects > button')).toHaveCount(9);
  await expect(map).toHaveAttribute('data-dtss-overlay', 'false');
  await expect(page.getByRole('button', { name: 'About Changi WRP', exact: true })).toHaveCount(0);
});

test('zooming out flattens the regional imagery and 3D returns to district framing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1208, height: 1126 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/explore');
  const canvas = page.locator('.geographic-map canvas');
  await expect(canvas).toHaveAttribute('data-surface-loaded', 'true');
  await page.getByRole('button', { name: 'Whole island', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-map-pitch', '0.0');
  await page.getByRole('button', { name: '3D context', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-map-pitch', '52.0');
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-map-zoom')))
    .toBeGreaterThan(13.4);
  for (let i = 0; i < 5; i++) {
    if (!(await page.getByRole('button', { name: 'Zoom out', exact: true }).isEnabled())) break;
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
    await page.waitForTimeout(350);
  }
  await expect(canvas).toHaveAttribute('data-map-pitch', '0.0');
  await page.getByRole('button', { name: 'Marina Bay', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-map-pitch', '52.0');
});
