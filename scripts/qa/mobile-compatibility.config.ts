import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: '../../tests/browser',
  testMatch: 'mobile-compatibility.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:3004', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
    { name: 'chrome-touch', use: { ...devices['Pixel 7'], browserName: 'chromium', channel: 'chrome' } },
  ],
  webServer: {
    command: 'python3 -m http.server 3004 --bind 127.0.0.1 --directory out',
    cwd: '../..', url: 'http://127.0.0.1:3004', reuseExistingServer: false,
  },
});
