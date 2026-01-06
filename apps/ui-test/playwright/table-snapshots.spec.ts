import type { Page } from '@playwright/test'

import { test, expect } from './fixtures'

export function keys<O extends Record<string, unknown>>(obj: O): Array<keyof O> {
  return Object.keys(obj) as Array<keyof O>
}

const describeTest = (config: Record<string, boolean>) =>
  `flagTest: ${keys(config)
    .map((f) => `${f}-${config[f] ? 't' : 'f'}`)
    .join(', ')}`

const getMain = (page: Page) => page.locator('main')

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
      await expect(getMain(page)).toHaveScreenshot()
    })

    test('Table: server-side', async ({ page }) => {
      await page.goto('/table-server')
      await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      await expect(getMain(page)).toHaveScreenshot()
    })

    test.describe('Table Playground', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/table-playground')
        await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      })

      test('main', async ({ page }) => {
        await expect(getMain(page)).toHaveScreenshot()
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
          await expect(getMain(page)).toHaveScreenshot()
        })
      })
    })

    test('Table: editable cells', async ({ page }) => {
      await page.goto('/table-editing')
      await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })

      const nameCell = page.getByTestId('cell-1_name')
      await expect(nameCell).toHaveText('Leticia Botsford-Waters')
      await nameCell.click()

      const nameInput = page.getByLabel('Edit Name')
      await nameInput.fill('Leticia Prime')
      await nameInput.press('Enter')

      const footer = page.getByTestId('TableFooter')
      await expect(footer.getByText('You have unsaved changes')).toBeVisible()
      await expect(page.getByText('Rows per page:')).not.toBeVisible()
      await expect(nameCell).toHaveText('Leticia Prime')

      await footer.locator('button', { hasText: 'Save' }).click()
      await expect(footer.getByText('You have unsaved changes')).not.toBeVisible()
      await expect(page.getByText('Rows per page:')).toBeVisible()

      await nameCell.click()
      await nameInput.fill('')
      await nameInput.press('Enter')

      await expect(footer.getByText('Fix validation errors before saving.')).toBeVisible()
      await expect(footer.locator('button', { hasText: 'Save' })).toBeDisabled()

      await footer.locator('button', { hasText: 'Discard' }).click()
      await expect(footer.getByText('You have unsaved changes')).not.toBeVisible()
      await expect(page.getByText('Rows per page:')).toBeVisible()
      await expect(nameCell).toHaveText('Leticia Prime')
    })

    test.describe('Layouts', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/table-layouts')
        await page.waitForSelector('data-testid=TableBody', { timeout: 5000 })
      })

      test('main', async ({ page }) => {
        await expect(getMain(page)).toHaveScreenshot()
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
          await expect(getMain(page)).toHaveScreenshot()
        })
      })
    })
  })
})
