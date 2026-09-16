import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '../../tests/browser',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:3004', launchOptions: { channel: 'chrome' }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 -m http.server 3004 --bind 127.0.0.1 --directory out',
    cwd: '../..',
    url: 'http://127.0.0.1:3004',
    reuseExistingServer: false,
  },
});
