import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
test('DTSS visual comparison and navigation', async ({ page }) => {
  const phase = process.env.DTSS_VISUAL_PHASE ?? 'after';
  const out = `docs/qa/dtss-visual/${phase}`;
  mkdirSync(out, { recursive: true });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Explore 9 projects' }).click();
  const start = Date.now();
  await page.locator('.catalog-list>button').filter({ hasText: 'Deep Tunnel' }).click();
  const canvas = page.locator('.world-canvas canvas');
  await expect(canvas).toHaveAttribute('data-model-loaded', 'dtss');
  const loadedMs = Date.now() - start;
  const samples = [];
  for (let i = 0; i < 6; i++) {
    await page.locator('.dtss-stop-list button').nth(i).click();
    await expect(canvas).toHaveAttribute('data-dtss-focus', String(i));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/stop-${i}.png` });
    samples.push(await canvas.evaluate((e) => ({ ...(e as HTMLElement).dataset })));
  }
  if (phase !== 'before') {
    await page.getByRole('button', { name: 'Low detail', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-dtss-quality', 'low');
    await page.locator('.dtss-stop-list button').first().click();
    await page.screenshot({ path: `${out}/low.png` });
    samples.push(await canvas.evaluate((e) => ({ ...(e as HTMLElement).dataset })));
    await page.getByRole('button', { name: 'Full detail', exact: true }).click();
    await page.getByRole('button', { name: 'Reveal underground', exact: true }).click();
    await expect(canvas).toHaveAttribute('data-dtss-reveal', 'complete');
  }
  await page.getByRole('button', { name: /Back to Singapore/ }).click();
  await expect(page.getByRole('heading', { name: 'Singapore. Look closer.' })).toBeVisible();
  expect(errors).toEqual([]);
  writeFileSync(
    `${out}/metrics.json`,
    JSON.stringify(
      {
        environment:
          'Local production / Chrome / 1440x1000 / reduced motion / unthrottled; not ordinary-device evidence',
        loadedMs,
        samples,
        errors,
      },
      null,
      2,
    ),
  );
});

test('reveal is skippable, reduced motion is immediate, and flow is opt-in', async ({page}) => {
 await page.goto('/explore');
 await page.getByRole('button',{name:'Explore 9 projects'}).click();
 await page.locator('.catalog-list>button').first().click();
 const canvas=page.locator('.world-canvas canvas');
 await expect(canvas).toHaveAttribute('data-model-loaded','dtss');
 await page.getByRole('button',{name:'Reveal underground',exact:true}).focus();
 await page.keyboard.press('Enter');
 await expect(canvas).toHaveAttribute('data-dtss-reveal','playing');
 const from=await canvas.getAttribute('data-camera');
 await page.waitForTimeout(500);
 expect(await canvas.getAttribute('data-camera')).not.toBe(from);
 await page.getByRole('button',{name:'Skip reveal',exact:true}).click();
 await expect(canvas).toHaveAttribute('data-dtss-reveal','complete');
 await page.getByRole('button',{name:'Reveal underground',exact:true}).click();
 await expect(canvas).toHaveAttribute('data-dtss-reveal','playing');
 await expect(page.getByRole('button',{name:'Reveal underground',exact:true})).toBeVisible({timeout:5000});
 await page.locator('.dtss-stop-list button').nth(5).click();
 await expect(page.getByRole('button',{name:'Animate flow',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByRole('button',{name:'Animate flow',exact:true}).click();
 await expect(page.getByRole('button',{name:'Pause flow',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Pause flow',exact:true}).click();
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.getByRole('button',{name:'Animate flow',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Reveal underground',exact:true}).click();
 await expect(canvas).toHaveAttribute('data-dtss-reveal','complete');
 await page.getByRole('button',{name:/Back to Singapore/}).click();
 await expect(page.getByRole('heading',{name:'Singapore. Look closer.'})).toBeVisible();
});

test('phone gateway keeps DTSS light and controls labelled',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/explore');
 await page.getByText('Try the full experience on this device',{exact:true}).click();
 await page.getByRole('button',{name:'Launch full experience',exact:true}).click();
 await page.getByRole('button',{name:'Explore 9 projects'}).click();
 await page.locator('.catalog-list>button').first().click();
 const canvas=page.locator('.world-canvas canvas');
 await expect(canvas).toHaveAttribute('data-dtss-quality','low');
 await expect(page.getByRole('button',{name:'Full detail',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Reveal underground',exact:true}).click();
 await expect(canvas).toHaveAttribute('data-dtss-reveal','complete',{timeout:5000});
 await page.screenshot({path:'docs/qa/dtss-visual/after/mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 const key=page.getByRole('region',{name:'DTSS drawing key'});
 await key.getByRole('button',{name:'04 Concrete rings & protective lining'}).click();
 await expect(canvas).toHaveAttribute('data-dtss-focus','3');
 await page.getByRole('button',{name:/Back to Singapore/}).click();
 await expect(page.locator('main.engineering-world')).toHaveClass(/on-surface/);
 await expect(page.locator('.maplibregl-canvas')).toBeVisible();
 await expect(canvas).toHaveCount(0);
});
