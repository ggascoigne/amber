import { loginAsUser } from '@amber/playwright/auth'
import { expect, test } from '@amber/playwright/test'
import { seededTestUsers } from '@amber/playwright/users'
import type { Page } from '@playwright/test'

const roomLabelForGame = (gameId: number) => `Assign room for game ${gameId}`
const patternfallDebriefName = 'Patternfall Debrief'
const getRoomCombobox = (page: Page, gameId: number) => page.getByRole('combobox', { name: roomLabelForGame(gameId) })

const openRoomMenu = async (page: Page, gameId: number) => {
  const roomSelect = getRoomCombobox(page, gameId)
  await expect(roomSelect).toBeVisible()
  await roomSelect.click()
}

const getGameRow = (page: Page, gameName: string) => page.getByRole('row').filter({ hasText: gameName })

const assertScheduleRoomAssignmentPageVisible = async (page: Page) => {
  await expect(page.getByRole('heading', { name: 'Assign Game Room' }).first()).toBeVisible()
}

const switchToRegularUserView = async (page: Page) => {
  await page.getByRole('button', { name: /notifications/i }).click()
  await page.getByRole('menuitem', { name: 'View as Regular User' }).click()
}

test.describe('Assign Game Room', () => {
  test('admin can assign any room from Assign Game Room page', async ({ page }) => {
    await loginAsUser(page, seededTestUsers.admin, { returnTo: '/schedule-room-assignments' })

    await assertScheduleRoomAssignmentPageVisible(page)

    await openRoomMenu(page, 11)
    await page.getByRole('option', { name: /^Cascade Ballroom$/ }).click()

    await expect(getRoomCombobox(page, 11)).toContainText('Cascade Ballroom')
    await expect(getGameRow(page, patternfallDebriefName)).toContainText('Cascade Ballroom')
  })

  test('scheduled participant can assign an available Guest Room', async ({ page }) => {
    await loginAsUser(page, seededTestUsers.admin, { returnTo: '/schedule-room-assignments' })

    await assertScheduleRoomAssignmentPageVisible(page)

    await openRoomMenu(page, 11)
    await page.getByRole('option', { name: /^Cascade Ballroom$/ }).click()
    await expect(getRoomCombobox(page, 11)).toContainText('Cascade Ballroom')

    await switchToRegularUserView(page)

    await openRoomMenu(page, 11)
    await page.getByRole('option', { name: /^Summit Guest Suite$/ }).click()

    await expect(getRoomCombobox(page, 11)).toContainText('Summit Guest Suite')
    await expect(getGameRow(page, patternfallDebriefName)).toContainText('Summit Guest Suite')
  })

  test('scheduled participant only sees Guest Rooms in the selector', async ({ page }) => {
    await loginAsUser(page, seededTestUsers.admin, { returnTo: '/schedule-room-assignments' })

    await assertScheduleRoomAssignmentPageVisible(page)
    await switchToRegularUserView(page)

    await openRoomMenu(page, 11)

    await expect(page.getByRole('option', { name: 'Cascade Ballroom' })).toHaveCount(0)
    await expect(page.getByRole('option', { name: 'Studio A' })).toHaveCount(0)
    await expect(page.getByRole('option', { name: 'Black Rabbit Bar' })).toHaveCount(0)
    await expect(page.getByRole('option', { name: 'Summit Guest Suite' })).toBeVisible()
  })
})
