import { expect } from '@playwright/test'

import { loginAsUser } from '../auth'
import type { SeededTestUsers } from '../users'

export type SharedAppTestOptions = {
  appName: string
  test: typeof import('@playwright/test').test
  users: SeededTestUsers
}

export const registerSharedAppTests = ({ appName, test, users }: SharedAppTestOptions) => {
  test.describe(`${appName} shared smoke`, () => {
    test('visitor can view welcome content', async ({ page }) => {
      await page.goto('/')

      await expect(page.getByRole('heading', { name: 'Welcome!', level: 1 })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Deadline dates this year', level: 2 })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Login / Sign Up', exact: true })).toBeVisible()
    })

    test('member can view membership summary', async ({ page }) => {
      await loginAsUser(page, users.member, { returnTo: '/membership' })

      await expect(page.getByRole('heading', { name: 'Membership Summary', level: 1 })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible()
    })

    test('admin can open settings', async ({ page }) => {
      await loginAsUser(page, users.admin, { returnTo: '/settings-admin' })

      await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible()
      await expect(page.getByRole('tab', { name: 'Configuration' })).toBeVisible()
    })
  })
}
