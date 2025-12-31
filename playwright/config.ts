import { defineConfig, devices } from '@playwright/test'

export type AppPlaywrightConfigOptions = {
  baseURL: string
  devServerCommand: string
  reuseExistingServer?: boolean
  testDir: string
  workspaceRoot: string
}

export const createAppConfig = (options: AppPlaywrightConfigOptions) =>
  defineConfig({
    testDir: options.testDir,
    fullyParallel: true,
    timeout: 30_000,
    expect: {
      timeout: 10_000,
    },
    retries: process.env.CI ? 2 : 0,
    outputDir: 'test-results',
    reporter: [
      ['dot'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    use: {
      baseURL: options.baseURL,
      screenshot: 'only-on-failure',
      trace: 'on-first-retry',
      video: 'retain-on-failure',
    },
    projects: [
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: 1440, height: 900 },
        },
      },
    ],
    webServer: {
      command: options.devServerCommand,
      url: options.baseURL,
      reuseExistingServer: options.reuseExistingServer ?? process.env.PLAYWRIGHT_REUSE_SERVER === '1',
      cwd: options.workspaceRoot,
      timeout: 120_000,
    },
  })
