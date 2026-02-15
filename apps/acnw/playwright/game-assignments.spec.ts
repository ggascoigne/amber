import type { Game } from '@amber/client'
import { loginAsUser } from '@amber/playwright/auth'
import { expect, test } from '@amber/playwright/test'
import type { Page } from '@playwright/test'

const adminUserEmail = 'alex.admin@example.com'

type DashboardAssignment = {
  gameId: number
  gm: number
  game?: {
    category: Game['category']
  }
}

type DashboardDataResponse = {
  assignments: Array<DashboardAssignment>
}

const openDashboard = async (page: Page) => {
  await loginAsUser(page, adminUserEmail, { returnTo: '/game-assignments' })
  await expect(page.getByRole('heading', { name: 'Game Assignments', level: 1 })).toBeVisible()
}

const extractDashboardDataFromTrpcPayload = (payload: unknown): DashboardDataResponse => {
  const firstResult = Array.isArray(payload) ? payload[0] : payload
  if (!firstResult || typeof firstResult !== 'object') {
    throw new Error('Dashboard payload was not an object')
  }

  const trpcResult = firstResult as {
    result?: {
      data?: {
        json?: DashboardDataResponse
      }
    }
  }
  const dashboardData = trpcResult.result?.data?.json
  if (!dashboardData || !Array.isArray(dashboardData.assignments)) {
    throw new Error('Dashboard payload did not include assignments')
  }

  return dashboardData
}

const waitForDashboardDataRefresh = async (page: Page) => {
  const response = await page.waitForResponse(
    (candidateResponse) =>
      candidateResponse.request().method() === 'GET' &&
      candidateResponse.url().includes('/api/trpc/gameAssignments.getAssignmentDashboardData'),
  )
  const payload = await response.json()
  return extractDashboardDataFromTrpcPayload(payload)
}

test.describe.serial('Game assignments dashboard', () => {
  test('admin can move an assignment by game and counts update', async ({ page }) => {
    await openDashboard(page)

    const byGameSection = page.getByRole('region', { name: 'Assignments by Game' })
    const byGameTable = byGameSection.getByRole('table').first()
    const nightWatchRow = byGameTable.getByRole('row', { name: /Night Watch in Amber/ })

    await expect(nightWatchRow).toBeVisible()

    const overrunCell = nightWatchRow.locator('[data-cell-id$="_overrun"]')
    const spacesCell = nightWatchRow.locator('[data-cell-id$="_spaces"]')

    const parseCount = async (cellLocator: typeof overrunCell) => {
      const value = (await cellLocator.textContent())?.trim() ?? '0'
      return Number(value)
    }

    const initialOverrun = await parseCount(overrunCell)
    const initialSpaces = await parseCount(spacesCell)

    await nightWatchRow.getByRole('button', { name: 'Expand row' }).click()

    const expandedTable = byGameSection.getByRole('table').nth(1)
    await expect(expandedTable).toBeVisible()

    const jordanRow = expandedTable.getByRole('row', { name: /Jordan Jade/ })
    await expect(jordanRow).toBeVisible()

    await jordanRow.getByRole('cell').nth(2).click()

    const moveInput = jordanRow.getByRole('combobox', { name: 'Edit Move To' })
    await expect(moveInput).toBeVisible()
    await moveInput.click()
    await page.getByRole('option', { name: /Midnight Signals/ }).click()

    await byGameSection.getByRole('button', { name: 'Save' }).click()

    if (initialOverrun > 0) {
      await expect(overrunCell).toHaveText(String(initialOverrun - 1))
      await expect(spacesCell).toHaveText(String(initialSpaces))
    } else {
      await expect(overrunCell).toHaveText(String(initialOverrun))
      await expect(spacesCell).toHaveText(String(initialSpaces + 1))
    }
  })

  test('admin can update member assignments with keyboard navigation', async ({ page }) => {
    await openDashboard(page)

    const byMemberSection = page.getByRole('region', { name: 'Assignments by Member' })
    const memberTable = byMemberSection.getByRole('table').first()
    const memberRow = memberTable.getByRole('row', { name: /Indigo Ivy/ })

    await expect(memberRow).toBeVisible()
    await expect(memberRow.getByRole('cell', { name: 'Indigo Ivy *' })).toBeVisible()

    await memberRow.getByRole('button', { name: 'Expand row' }).click()

    const expandedTable = byMemberSection.getByRole('table').nth(1)
    await expect(expandedTable).toBeVisible()

    const slotSixRow = expandedTable.getByRole('row', { name: /Slot 6/ })
    const slotSevenRow = expandedTable.getByRole('row', { name: /Slot 7/ })

    await slotSixRow.getByRole('cell', { name: /Night Watch in Amber/ }).click()

    await page.keyboard.press('Tab')
    await expect(slotSevenRow.getByRole('combobox', { name: 'Edit Move To' })).toBeFocused()

    await page.keyboard.press('Shift+Tab')
    await expect(slotSixRow.getByRole('combobox', { name: 'Edit Move To' })).toBeFocused()

    await slotSixRow.getByRole('combobox', { name: 'Edit Move To' }).click()
    await page.getByRole('option', { name: /Midnight Signals/ }).click()

    await byMemberSection.getByRole('button', { name: 'Save' }).click()

    await expect(slotSixRow).toContainText('Midnight Signals')
  })

  test('expanded rows remain expanded when pane expands', async ({ page }) => {
    await openDashboard(page)

    const byGameSection = page.getByRole('region', { name: 'Assignments by Game' })
    const byGameTable = byGameSection.getByRole('table').first()
    const nightWatchRow = byGameTable.getByRole('row', { name: /Night Watch in Amber/ })

    await expect(nightWatchRow).toBeVisible()
    await nightWatchRow.getByRole('button', { name: 'Expand row' }).click()

    const expandedTable = byGameSection.getByRole('table').nth(1)
    await expect(expandedTable).toBeVisible()
    await expect(nightWatchRow.getByRole('button', { name: 'Collapse row' })).toBeVisible()

    await byGameSection.getByRole('button', { name: 'Expand panel' }).click()

    const expandedPaneSection = page.getByRole('region', { name: 'Assignments by Game' })
    const expandedPaneTable = expandedPaneSection.getByRole('table').first()
    const expandedRow = expandedPaneTable.getByRole('row', { name: /Night Watch in Amber/ })

    await expect(expandedRow.getByRole('button', { name: 'Collapse row' })).toBeVisible()
    await expect(expandedPaneSection.getByRole('table').nth(1)).toBeVisible()
  })

  test('legend compact mode keeps controls visible without overlap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await openDashboard(page)

    await page.getByRole('button', { name: 'Collapse legend' }).click()

    const expandLegendButton = page.getByRole('button', { name: 'Expand legend' })
    const resetAssignmentsButton = page.getByRole('button', { name: 'Reset Assignments' })

    await expect(expandLegendButton).toBeVisible()
    await expect(resetAssignmentsButton).toBeVisible()

    const [legendBox, resetBox] = await Promise.all([
      expandLegendButton.boundingBox(),
      resetAssignmentsButton.boundingBox(),
    ])

    expect(legendBox).not.toBeNull()
    expect(resetBox).not.toBeNull()

    if (!legendBox || !resetBox) return

    const viewport = page.viewportSize()
    expect(viewport).not.toBeNull()
    if (!viewport) return

    expect(legendBox.x + legendBox.width).toBeLessThanOrEqual(viewport.width)
    expect(legendBox.y + legendBox.height).toBeLessThanOrEqual(viewport.height)
    expect(resetBox.x + resetBox.width).toBeLessThanOrEqual(viewport.width)
    expect(resetBox.y + resetBox.height).toBeLessThanOrEqual(viewport.height)

    const boxesOverlap = !(
      legendBox.x + legendBox.width <= resetBox.x ||
      resetBox.x + resetBox.width <= legendBox.x ||
      legendBox.y + legendBox.height <= resetBox.y ||
      resetBox.y + resetBox.height <= legendBox.y
    )
    expect(boxesOverlap).toBe(false)
  })

  test('organizer message stays bounded when collapsed and wraps when expanded', async ({ page }) => {
    await openDashboard(page)

    const byGameSection = page.getByRole('region', { name: 'Assignments by Game' })
    const byGameTable = byGameSection.getByRole('table').first()
    const nightWatchRow = byGameTable.getByRole('row', { name: /Night Watch in Amber/ })

    await expect(nightWatchRow).toBeVisible()
    await nightWatchRow.getByRole('button', { name: 'Expand row' }).click()

    const expandOrganizerMessageButtons = byGameSection.getByRole('button', { name: 'Expand organizer message' })

    if ((await expandOrganizerMessageButtons.count()) === 0) {
      const collapsedMessage = byGameSection
        .locator('p:visible', { hasText: 'Small table, late finish likely.' })
        .first()
      await expect(collapsedMessage).toBeVisible()
      await expect(collapsedMessage).toHaveCSS('white-space', 'normal')
      await expect(collapsedMessage).toHaveCSS('overflow', 'hidden')

      const collapsedMetrics = await collapsedMessage.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }))
      expect(collapsedMetrics.scrollWidth).toBeLessThanOrEqual(collapsedMetrics.clientWidth + 1)
      return
    }

    const expandOrganizerMessageButton = expandOrganizerMessageButtons.first()
    await expect(expandOrganizerMessageButton).toBeVisible()

    const organizerCell = expandOrganizerMessageButton.locator('xpath=ancestor::*[@role="cell"][1]')
    const collapsedMetrics = await organizerCell.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(collapsedMetrics.scrollWidth).toBeLessThanOrEqual(collapsedMetrics.clientWidth + 1)

    const collapsedMessage = organizerCell.locator('p:visible').first()
    await expect(collapsedMessage).toHaveCSS('white-space', 'normal')
    await expect(collapsedMessage).toHaveCSS('overflow', 'hidden')

    await expandOrganizerMessageButton.click()

    const expandedMessage = byGameSection
      .getByRole('button', { name: 'Collapse organizer message' })
      .first()
      .locator('xpath=ancestor::*[@role="cell"][1]')
      .locator('p:visible')
      .first()
    await expect(expandedMessage).toHaveCSS('white-space', 'pre-wrap')
    await expect(expandedMessage).toHaveCSS('overflow-wrap', 'anywhere')
  })

  test('member choices shows signup note indicator', async ({ page }) => {
    await openDashboard(page)

    const memberChoicesSection = page.getByRole('region', { name: 'Member Choices' })
    const memberChoicesTable = memberChoicesSection.getByRole('table').first()

    await expect(memberChoicesTable).toBeVisible()
    await expect(memberChoicesTable.getByRole('cell', { name: 'Indigo Ivy *' })).toBeVisible()
  })

  test('set initial assignments does not create scheduled Any Game assignments', async ({ page }) => {
    await openDashboard(page)

    page.once('dialog', (dialog) => dialog.accept())
    const resetRefreshPromise = waitForDashboardDataRefresh(page)
    await page.getByRole('button', { name: 'Reset Assignments' }).click()
    await resetRefreshPromise

    page.once('dialog', (dialog) => dialog.accept())
    const setInitialRefreshPromise = waitForDashboardDataRefresh(page)
    await page.getByRole('button', { name: 'Set Initial Assignments' }).click()
    const dashboardData = await setInitialRefreshPromise

    const scheduledAnyGameAssignments = dashboardData.assignments.filter(
      (assignment) => assignment.gm >= 0 && assignment.game?.category === 'any_game',
    )
    expect(scheduledAnyGameAssignments).toHaveLength(0)
  })
})
