import { test, expect } from '@playwright/test';
test('DTSS component tour changes camera, retains sources and supports staged construction', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Explore 9 projects' }).click();
  await page.locator('.catalog-list>button').first().click();
  const canvas = page.locator('.world-canvas canvas');
  await expect(canvas).toHaveAttribute('data-model-loaded', 'dtss');
  const stops = page.locator('.dtss-stop-list button');
  await expect(stops).toHaveCount(6);
  const positions = new Set<string>();
  for (let i = 0; i < 6; i++) {
    await stops.nth(i).click();
    await expect(canvas).toHaveAttribute('data-dtss-focus', String(i));
    await expect(stops.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(800);
    positions.add((await canvas.getAttribute('data-camera'))!);
    await expect(page.locator('.dtss-tour-footer a')).toHaveAttribute(
      'href',
      /^https:\/\/www\.(pub|nas)\.gov\.sg\//,
    );
  }
  expect(positions.size).toBe(6);
  await page.getByRole('button', { name: 'Construction stage 1:', exact: false }).click();
  await expect(canvas).toHaveAttribute('data-stage', '0');
  await stops.nth(2).click();
  await expect(canvas).toHaveAttribute('data-dtss-focus', '2');
  await expect(
    page.getByRole('heading', { name: 'Build the void, then support it' }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('DTSS gravity fall and gate diversion are labelled illustrative mechanisms', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Explore 9 projects' }).click();
  await page.locator('.catalog-list>button').first().click();
  await page.locator('.dtss-stop-list button').nth(4).click();
  await page.getByRole('button', { name: 'Illustrate isolation & diversion' }).click();
  await expect(page.getByRole('img', { name: /flow diverted around/ })).toBeVisible();
  await page.locator('.dtss-stop-list button').nth(5).click();
  const slider = page.getByRole('slider', { name: 'Illustrative fall exaggeration' });
  const profile = page.locator('.dtss-mechanism svg path').nth(1);
  const before = await profile.getAttribute('d');
  await slider.focus();
  await slider.press('End');
  await expect(profile).not.toHaveAttribute('d', before!);
  await expect(page.getByText('FALL EXAGGERATED · NOT TO SCALE')).toBeVisible();
});

test('DTSS drawing key gives plain-language explanations matching model numbers', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Explore 9 projects', exact: false }).click();
  await page.locator('.catalog-list>button').first().click();
  const key = page.getByRole('region', { name: 'DTSS drawing key' });
  await expect(key.getByRole('heading', { name: 'What am I looking at?' })).toBeVisible();
  await key.getByRole('button', { name: '03 Tunnel boring machine' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-dtss-focus', '2');
  await expect(key.getByText(/cuts through the ground/)).toBeVisible();
  await key.getByRole('button', { name: '01 The whole system' }).click();
  await expect(page.locator('.world-canvas canvas')).toHaveAttribute('data-dtss-focus', '0');
  await page.getByRole('button', { name: 'Inspect DTSS Rings & protection', exact: true }).click();
  await expect(
    key.getByRole('button', { name: '04 Concrete rings & protective lining' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(key.getByText(/support the tunnel against/)).toBeVisible();
});
