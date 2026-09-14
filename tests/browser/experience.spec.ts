import { test, expect } from '@playwright/test';
test('reveal, questions, camera, tracing, layers, sources and reset', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  const scene = page.getByTestId('scene'),
    canvas = page.locator('canvas');
  await expect(canvas).toHaveAttribute('data-camera-position', /.+/);
  await page.waitForTimeout(1600);
  const overview = await canvas.getAttribute('data-camera-position');
  await page.getByRole('button', { name: 'Reveal the unseen', exact: true }).click();
  await expect(scene).toHaveAttribute('data-reveal', 'true');
  await expect(page.getByRole('heading', { name: 'A city above. A system below.' })).toBeVisible();
  await page.waitForTimeout(1600);
  expect(await canvas.getAttribute('data-camera-position')).not.toEqual(overview);
  await page.getByRole('button', { name: 'Follow one drop', exact: true }).click();
  await expect(scene).toHaveAttribute('data-tracing', 'true');
  await expect(canvas).toHaveAttribute('data-trace-x', /.+/);
  const x = await canvas.getAttribute('data-trace-x');
  await page.waitForTimeout(150);
  expect(await canvas.getAttribute('data-trace-x')).not.toEqual(x);
  await page.getByRole('button', { name: 'DTSS', exact: true }).click();
  await expect(scene).toHaveAttribute('data-tracing', 'false');
  await page.getByLabel('Ask Singapore', { exact: true }).fill('Why are the tunnels so deep?');
  await page.getByRole('button', { name: 'Ask question' }).click();
  await expect(scene).toHaveAttribute('data-camera', 'tunnel');
  await page.getByRole('button', { name: 'Engineer', exact: true }).click();
  await expect(page.locator('.chapter-deck')).toContainText('invert levels');
  await page.getByRole('button', { name: 'What else is underground?' }).click();
  await expect(scene).toHaveAttribute('data-selected', 'mrt-context');
  await page.getByRole('button', { name: 'View sources & model assumptions' }).click();
  await expect(page.locator('#sources')).toHaveAttribute('open', '');
  await expect(page.locator('#sources a')).toHaveCount(2);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(scene).toHaveAttribute('data-reveal', 'false');
  await expect(scene).toHaveAttribute('data-camera', 'overview');
  await page.getByLabel('Ask Singapore', { exact: true }).fill('Show exact DTSS coordinates');
  await page.getByRole('button', { name: 'Ask question' }).click();
  await expect(page.locator('.chapter-deck')).toContainText('no authoritative alignment');
  await page.getByRole('button', { name: '2050' }).click();
  await expect(page.getByRole('status')).toContainText('ENVISIONED');
  expect(errors).toEqual([]);
});
test('mobile, reduced motion and reading mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Low graphics quality' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Follow one drop', exact: true }).click();
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveAttribute('data-trace-x', /.+/);
  const x = await canvas.getAttribute('data-trace-x');
  await page.waitForTimeout(200);
  expect(await canvas.getAttribute('data-trace-x')).toEqual(x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'docs/mobile-reveal.png', fullPage: true });
  await page.getByRole('button', { name: 'Reading mode', exact: true }).click();
  await expect(canvas).toHaveCount(0);
  await expect(page.getByText('03   Reclamation / treatment')).toBeVisible();
  await page.getByRole('button', { name: 'Open 3D', exact: true }).click();
  await expect(canvas).toHaveCount(1);
});
test('failed GLB leaves the sourced chapter available', async ({ page }) => {
  await page.route('**/models/*.glb', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The story is still here.' })).toBeVisible({
    timeout: 30000,
  });
  await page.getByRole('button', { name: 'Why was this built?', exact: true }).click();
  await expect(page.locator('.chapter-deck')).toContainText('centralised');
  await page.getByRole('button', { name: 'View sources & model assumptions' }).click();
  await expect(page.locator('#sources a')).toHaveCount(2);
});
test('keyboard controls do not require the canvas', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reveal the unseen', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('scene')).toHaveAttribute('data-reveal', 'true');
  await page.getByRole('button', { name: 'Reset view', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByTestId('scene')).toHaveAttribute('data-reveal', 'false');
});
