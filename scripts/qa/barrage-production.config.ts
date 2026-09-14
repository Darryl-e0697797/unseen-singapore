import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '../../tests/browser',
  testMatch: 'barrage.spec.ts',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3001',
    launchOptions: { channel: 'chrome' },
    screenshot: 'only-on-failure',
  },
});
