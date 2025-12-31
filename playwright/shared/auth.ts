import type { Page } from '@playwright/test'

export type LoginAsUserOptions = {
  returnTo?: string
}

export const loginAsUser = async (page: Page, email: string, options: LoginAsUserOptions = {}) => {
  const returnTo = options.returnTo ?? '/'
  const returnToParam = encodeURIComponent(returnTo)

  await page.goto(`/api/auth/login?returnTo=${returnToParam}`)
  await page.getByRole('combobox').selectOption(email)
  await Promise.all([
    page.waitForURL((url) => url.pathname === returnTo),
    page.getByRole('button', { name: 'Login' }).click(),
  ])
  await page.waitForLoadState('domcontentloaded')
}
