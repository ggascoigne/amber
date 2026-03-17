import { loginAsUser } from '@amber/playwright/auth'
import { expect, test } from '@amber/playwright/test'
import { seededTestUsers } from '@amber/playwright/users'
import type { Page } from '@playwright/test'

const openRoomAssignments = async (page: Page) => {
  await loginAsUser(page, seededTestUsers.admin, { returnTo: '/room-assignments' })
  await expect(page.getByRole('heading', { name: 'Room Assignments', level: 1 })).toBeVisible()
}

const acceptNextDialog = async (page: Page) => {
  page.once('dialog', async (dialog) => {
    await dialog.accept()
  })
}

test.describe.serial('Room assignments initial calculation', () => {
  test('admin can calculate assignments, preserve overrides, and download details', async ({ page }) => {
    await openRoomAssignments(page)

    const assignmentTab = page.getByRole('tab', { name: 'Assignment' })
    await expect(assignmentTab).toHaveAttribute('aria-selected', 'true')

    const manualPane = page.getByRole('region', { name: 'Room Assignment' })
    const siegeRow = manualPane.getByRole('row', { name: /Siege of the Argent Keep/ })

    const downloadButton = page.getByRole('button', { name: 'Download Details' })
    await expect(downloadButton).toBeDisabled()

    await acceptNextDialog(page)
    await page.getByRole('button', { name: 'Reset Room Assignments' }).click()

    await expect(siegeRow).toBeVisible()
    await expect(siegeRow).toContainText('Unassigned')

    await acceptNextDialog(page)
    await page.getByRole('button', { name: 'Calculate', exact: true }).click()

    await expect(siegeRow).toContainText('Black Rabbit Bar')
    await expect(siegeRow).toContainText('Shared room priority')
    await expect(downloadButton).toBeEnabled()

    await page.getByRole('combobox', { name: 'Add override room for game 8' }).click()
    await page.getByRole('option', { name: /Studio A/ }).click()
    await expect(siegeRow.getByRole('button', { name: 'Remove override room Studio A for game 8' })).toBeVisible()

    await acceptNextDialog(page)
    await page.getByRole('button', { name: 'Calculate for This Slot' }).click()

    await expect(siegeRow.getByRole('button', { name: 'Remove override room Studio A for game 8' })).toBeVisible()
    await expect(siegeRow).toContainText('Black Rabbit Bar')

    const downloadPromise = page.waitForEvent('download')
    await downloadButton.click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/^room-assignment-summary-2025.*\.xlsx$/)
  })
})
