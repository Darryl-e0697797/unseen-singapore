import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: process.env.CI ? 60000 : 30000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    launchOptions: process.env.CI ? {} : { channel: 'chrome' },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: process.env.CI ? 'npm run start --workspace @unseen/web -- --port 3000' : 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
