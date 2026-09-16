import { test, expect } from '@playwright/test';

test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

test('touch layout, film playback, captions and rotation', async ({ page }, testInfo) => {
  const heavyRequests: string[] = [];
  page.on('request', (r) => { if (/\.glb|\.mp4|maplibre|\/geography\//.test(r.url())) heavyRequests.push(r.url()); });
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Singapore. Look beneath.' })).toBeVisible();
  await page.getByRole('link', { name: /Watch the 60-second film/ }).tap();
  await expect(page.locator('video')).toBeInViewport();
  expect(heavyRequests).toEqual([]);
  await page.locator('video').evaluate((video: HTMLVideoElement) => { video.muted = true; return video.play(); });
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.textTracks[0]?.cues?.length)).toBeGreaterThan(0);
  await page.locator('video').evaluate((v: HTMLVideoElement) => v.pause());
  await page.screenshot({ path: `docs/qa/mobile-gateway/${testInfo.project.name}.png`, fullPage: true });
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('denied clipboard preserves a usable desktop link', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Denied'); } } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Copy desktop link' }).tap();
  await expect(page.getByRole('status')).toContainText('Copy the website address');
  await expect(page.locator('.gateway-url')).toHaveAttribute('href', 'https://unseen-singapore.darrylkai.chatgpt.site');
  await page.getByText('Try the full experience on this device', { exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Launch full experience', exact: true })).toBeVisible();
});

test('no JavaScript still provides readable content and native video', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Singapore. Look beneath.' })).toBeVisible();
  await expect(page.locator('video')).toHaveAttribute('controls', '');
  await expect(page.locator('.gateway-url')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await context.close();
});
