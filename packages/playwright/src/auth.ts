import type { Page } from '@playwright/test'

export type LoginAsUserOptions = {
  returnTo?: string
}

export const loginAsUser = async (page: Page, email: string, options: LoginAsUserOptions = {}) => {
  const returnTo = options.returnTo ?? '/'
  const returnToParam = encodeURIComponent(returnTo)
  await page.goto(`/api/auth/login?returnTo=${returnToParam}`)
  await page.getByRole('combobox').selectOption(email)

  try {
    await Promise.all([
      page.waitForURL((url) => url.pathname === returnTo),
      page.getByRole('button', { name: 'Login' }).click(),
    ])
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('net::ERR_ABORTED')) {
      throw error
    }
  }

  await page.waitForLoadState('domcontentloaded')
}
