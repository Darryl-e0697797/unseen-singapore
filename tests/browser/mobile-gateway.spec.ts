import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

for (const width of [320, 390, 768]) {
  test(`gateway at ${width}px stays light and readable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Singapore. Look beneath.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Best experienced on desktop.' })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('video')).toHaveAttribute('preload', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(requests.filter((url) => /\.glb|\.mp4|maplibre|\/geography\/|basemaps|arcgisonline/i.test(url))).toEqual([]);
    const measurement = await page.evaluate(() => ({
      resources: performance.getEntriesByType('resource').map((entry) => { const resource = entry as PerformanceResourceTiming; return { url: resource.name, transferBytes: resource.transferSize }; }),
      firstContentfulPaintMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
      userAgent: navigator.userAgent,
    }));
    mkdirSync('docs/qa/mobile-gateway', { recursive: true });
    writeFileSync(`docs/qa/mobile-gateway/${width}-performance.json`, JSON.stringify({ environment: 'Local browser emulation; not physical-device or public-network evidence', width, ...measurement }, null, 2));
    await page.screenshot({ path: `docs/qa/mobile-gateway/${width}.png`, fullPage: true });
  });
}

test('phone film plays inline with captions; clipboard and return work', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/explore');
  const video = page.locator('video');
  await expect(video).toHaveAttribute('playsinline', '');
  await video.evaluate((element: HTMLVideoElement) => { element.muted = true; return element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.textTracks[0]?.cues?.length)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Copy desktop link' }).click();
  await expect(page.getByRole('status')).toContainText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('https://unseen-singapore.darrylkai.chatgpt.site');
  await page.getByText('Try the full experience on this device', { exact: true }).click();
  await page.getByRole('button', { name: 'Launch full experience', exact: true }).click();
  await expect(page.getByRole('button', { name: /Explore 9 projects/ })).toBeVisible();
  await page.getByRole('link', { name: 'Back to preview' }).click();
  await expect(page.locator('video')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('failed video has a readable fallback and reduced motion stays static', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/showcase/*.mp4', (route) => route.abort());
  await page.goto('/');
  await page.locator('video').evaluate((element: HTMLVideoElement) => element.load());
  await expect(page.getByText('Video unavailable in this browser.', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'See how the pieces work together.' })).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('wide touch devices and rotation stay on preview without WebGL', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('/explore');
  await expect(page.locator('.mobile-gateway')).toBeVisible();
  await page.setViewportSize({ width: 820, height: 1180 });
  await expect(page.locator('.mobile-gateway')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await context.close();
});
