import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '../../tests/browser',
  testMatch: ['demo-readiness.spec.ts', 'reclamation.spec.ts', 'barrage.spec.ts', 'mrt.spec.ts', 'dtss.spec.ts', 'tuas.spec.ts', 'surface.spec.ts'],
  workers: 1,
  use: {
    baseURL: process.env.UNSEEN_PREVIEW_URL ?? 'http://127.0.0.1:3001',
    launchOptions: { channel: 'chrome' },
    screenshot: 'only-on-failure',
  },
});
