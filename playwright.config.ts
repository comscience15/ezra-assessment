import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 1,
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      args: ['--window-size=1440,900']
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  reporter: [['html', { open: 'never' }]]
});
