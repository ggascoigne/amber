import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

let workerDatabaseWarmedUp = false

// The PostgresLite database used in UI tests takes some time to initialize
// in the browser. To avoid timeouts during the first test navigation, we
// warm up the database once per worker before running tests.
const warmupDatabase = async (page: Page) => {
  if (workerDatabaseWarmedUp) return

  console.log('Warming up browser pgLite database for worker...')
  try {
    // Wait for database initialization to complete (indicated by data-db-ready attribute)
    await page.waitForSelector('body[data-db-ready="true"]', { timeout: 20_000 })
    workerDatabaseWarmedUp = true
    console.log('Database warmed up for worker')
  } catch (error) {
    console.warn('Database warmup warning:', error)
    // Don't fail the test if warmup has issues
  }
}

/**
 * Extended test fixture that includes database warmup for the first navigation
 * in each worker. This prevents timeouts due to slow PGlite initialization.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Warmup database on first navigation in this worker
    const originalGoto = page.goto.bind(page)
    // eslint-disable-next-line no-param-reassign
    page.goto = async (...args) => {
      const result = await originalGoto(...args)
      if (!workerDatabaseWarmedUp) {
        await warmupDatabase(page)
      }
      return result
    }

    // this isn't the react hook 'use'
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
  },
})

export { expect }
