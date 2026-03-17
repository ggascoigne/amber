import { loginAsUser } from '@amber/playwright/auth'
import { expect, test } from '@amber/playwright/test'
import { seededTestUsers } from '@amber/playwright/users'
import type { Page } from '@playwright/test'

const openRoomAssignments = async (page: Page) => {
  await loginAsUser(page, seededTestUsers.admin, { returnTo: '/room-assignments' })
  await expect(page.getByRole('heading', { name: 'Room Assignments', level: 1 })).toBeVisible()
}

test.describe.serial('Room assignments manual workspace', () => {
  test('admin can manage manual assignments, overrides, member rooms, and availability conflicts', async ({ page }) => {
    await openRoomAssignments(page)

    const assignmentTab = page.getByRole('tab', { name: 'Assignment' })
    await expect(assignmentTab).toHaveAttribute('aria-selected', 'true')

    const manualPane = page.getByRole('region', { name: 'Room Assignment' })
    const debriefRow = manualPane.getByRole('row', { name: /Patternfall Debrief/ })
    await page.getByRole('combobox', { name: 'Slot 1' }).click()
    await page.getByRole('option', { name: 'Slot 4' }).click()
    await expect(debriefRow).toBeVisible()

    await page.getByRole('combobox', { name: 'Manual room assignment for game 11' }).click()
    await page.getByRole('option', { name: /Summit Guest Suite/ }).click()
    await expect(debriefRow).toContainText('Summit Guest Suite')

    await page.getByRole('combobox', { name: 'Add override room for game 11' }).click()
    await page.getByRole('option', { name: /Studio A/ }).click()
    await expect(debriefRow.getByRole('button', { name: 'Remove override room Studio A for game 11' })).toBeVisible()

    await debriefRow.getByRole('button', { name: 'Remove override room Studio A for game 11' }).click()
    await expect(debriefRow.getByRole('button', { name: 'Remove override room Studio A for game 11' })).toHaveCount(0)

    const setupTab = page.getByRole('tab', { name: 'Setup' })
    await setupTab.click()

    const roomMembersPane = page.getByRole('region', { name: 'Assign Members to Rooms' })
    const studioRow = roomMembersPane.getByRole('row', { name: /Studio A/ })
    await expect(studioRow).toBeVisible()
    const studioMemberInput = page.getByRole('combobox', { name: 'Assign members to room 3' })
    await studioMemberInput.click()
    await page.getByRole('option', { name: 'Kiran Kestrel' }).click()
    await page.keyboard.press('Escape')

    const memberRoomPane = page.getByRole('region', { name: 'Member Room Assignments' })
    const kiranRow = memberRoomPane.getByRole('row', { name: /Kiran Kestrel/ })
    await expect(kiranRow).toContainText('Studio A')

    await page.getByRole('combobox', { name: 'Assign room for member 10' }).click()
    await page.getByRole('option', { name: /Summit Guest Suite/ }).click()
    await expect(kiranRow).toContainText('Summit Guest Suite')

    const summitRoomRow = roomMembersPane.getByRole('row', { name: /Summit Guest Suite/ })
    await expect(summitRoomRow).toContainText('Kiran Kestrel')

    await page.getByRole('combobox', { name: 'Assign room for member 10' }).click()
    await page.getByRole('option', { name: 'Unassigned' }).click()
    await expect(kiranRow).toContainText('Unassigned')

    const roomSlotPane = page.getByRole('region', { name: 'Room Slot Availability' })
    const summitSlotOneCheckbox = roomSlotPane.getByRole('checkbox', {
      name: 'Room Summit Guest Suite slot 4 availability',
    })
    await summitSlotOneCheckbox.evaluate((element) => {
      element.scrollIntoView({ block: 'center' })
    })
    await summitSlotOneCheckbox.evaluate((element) => {
      ;(element as HTMLInputElement).click()
    })
    await expect(summitSlotOneCheckbox).not.toBeChecked()

    await assignmentTab.click()
    const constraintSummaryPane = page.getByRole('region', { name: 'Constraint Summary' })
    await expect(constraintSummaryPane).toContainText(/Unavailable room|Empty result set/)
  })
})
