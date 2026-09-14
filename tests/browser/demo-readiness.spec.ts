import { test, expect } from '@playwright/test';
test('five accepted demos and four simplified demos are clearly distinguished', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.locator('.surface-projects button').filter({ hasText: 'Detailed' })).toHaveCount(5);
  await expect(page.locator('.surface-projects button').filter({ hasText: 'Simplified' })).toHaveCount(4);
  await page.getByRole('button', { name: 'Detailed', exact: true }).click();
  await expect(page.locator('.surface-projects>button')).toHaveCount(5);
  await page.getByRole('button', { name: 'Simplified', exact: true }).click();
  await expect(page.locator('.surface-projects>button')).toHaveCount(4);
  await page.getByRole('button', { name: 'All systems', exact: true }).click();
  await page.locator('.surface-projects button').filter({ hasText: 'NEWater' }).click();
  await expect(page.getByRole('button', { name: /Explore simplified demo/ })).toBeVisible();
  await page.getByRole('button', { name: /Explore 9 projects/ }).click();
  await expect(page.locator('.catalog-list>button').filter({ hasText: 'Detailed' })).toHaveCount(5);
  await expect(page.locator('.catalog-list>button').filter({ hasText: 'Simplified' })).toHaveCount(4);
});
