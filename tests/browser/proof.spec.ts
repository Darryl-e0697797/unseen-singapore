import { test, expect } from '@playwright/test';
test('generated Blender asset loads and is selectable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/pipeline');
  await expect(page.getByRole('status')).toContainText('GLB loaded', { timeout: 30000 });
  // Raycast the actual mesh, not just the accessible HTML alternative.
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  await canvas.click({ position: { x: box!.width / 2, y: box!.height / 2 + 30 } });
  await expect(page.getByRole('status')).toContainText('Selected: dtss-section');
  await page.screenshot({ path: 'docs/pipeline-proof.png' });
  expect(errors).toEqual([]);
});
