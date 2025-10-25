import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export function keys<O extends Record<string, unknown>>(obj: O): Array<keyof O> {
  return Object.keys(obj) as Array<keyof O>
}

const describeTest = (config: Record<string, boolean>) =>
  `flagTest: ${keys(config)
    .map((f) => `${f}-${config[f] ? 't' : 'f'}`)
    .join(', ')}`

const applyFlagSettings = async (config: Record<string, boolean>, page: Page) => {
  for (const flag of keys(config)) {
    // note that disabling the eslint rule here is quite intentional,
    // I want these async functions to run sequentially.
    if (config[flag]) {
      // eslint-disable-next-line no-await-in-loop
      await page.getByTestId(`toggle-${flag}`).check()
    } else {
      // eslint-disable-next-line no-await-in-loop
      await page.getByTestId(`toggle-${flag}`).uncheck()
    }
  }
}

;[
  { theme: 'light' },
  // { theme: 'dark' }
].forEach(({ theme }) => {
  test.describe(`${theme} theme`, () => {
    // set theme for all tests in this block
    test.use({ colorScheme: theme as any })

    test('Table: client-side', async ({ page }) => {
      await page.goto('/table-client')
      await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      await expect(page).toHaveScreenshot()
    })

    test('Table: server-side', async ({ page }) => {
      await page.goto('/table-server')
      await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      await expect(page).toHaveScreenshot()
    })

    test.describe('Table Playground', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/table-playground')
        await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      })

      test('main', async ({ page }) => {
        await expect(page).toHaveScreenshot()
      })
      ;(
        [
          { Compact: true },
          { 'Virtualize Rows': false },
          { Compact: true, 'Virtualize Rows': false },
          { 'Flex Rows': false },
          { 'Show Filters': false },
          { 'Show Search': false },
          { 'Show Filters': false, 'Show Search': false },
          { 'Group Columns': true },
        ] as const
      ).forEach((config) => {
        test(describeTest(config), async ({ page }) => {
          await applyFlagSettings(config, page)
          await expect(page).toHaveScreenshot()
        })
      })
    })

    test.describe('Layouts', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/table-layouts')
        await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      })

      test('main', async ({ page }) => {
        await expect(page).toHaveScreenshot()
      })
      ;(
        [
          { 'Show System Actions': false },
          { 'Show Toolbar Actions': false },
          { 'Show Pagination': false },
          { 'Show Gutter': false },
          { 'Enable Select': false },
          { Compact: true },
          { 'Compact Pagination': true },
          { 'Hide Header': true },
        ] as const
      ).forEach((config) => {
        test(describeTest(config), async ({ page }) => {
          await applyFlagSettings(config, page)
          await expect(page).toHaveScreenshot()
        })
      })
    })
  })
})
