import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true, // run each test in parallel, instead of each file
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
      dependencies: ['setup'],
      // retries: 5,
    },
  ],
  use: {
    launchOptions: {
      args: ['--disable-gpu', '--disable-font-subpixel-positioning'],
    },
    baseURL: 'http://localhost:30003',
    viewport: { width: 1920, height: 1080 },
    headless: true,
  },
  expect: {
    toHaveScreenshot: {
      stylePath: './playwright/snapshots-spec.css',
      maxDiffPixels: 100,
    },
  },

  // Opt out of parallel tests on CI, otherwise limit workers to 4 for stability
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['dot'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // Customize the HTML report output
  ],
  webServer: {
    command: 'PLAYWRIGHT=1 pnpm -F ui-test dev',
    url: 'http://localhost:30003',
    reuseExistingServer: true,
    cwd: process.cwd(),
    timeout: 120_000,
  },
})
