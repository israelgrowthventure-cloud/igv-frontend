import { defineConfig, devices } from '@playwright/test';

/**
 * IGV CRM - Playwright Configuration
 * Tests E2E pour l'interface CRM
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  
  use: {
    baseURL: 'https://israelgrowthventure.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});
