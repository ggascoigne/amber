import { loginAsUser } from '@amber/playwright/auth'
import { expect, test } from '@amber/playwright/test'
import type { Page } from '@playwright/test'

type MembershipDateInput = {
  label: string
  month: string
  day: string
  year: string
  display: string
}

const registrationUserEmail = 'frankie.fable@example.com'
const adminUserEmail = 'alex.admin@example.com'
const registrationUserName = 'Frankie Fable'
const registrationUserLastName = 'Fable'

const membershipDates: { checkIn: MembershipDateInput; departure: MembershipDateInput } = {
  checkIn: {
    label: 'Hotel Check-in',
    month: '11',
    day: '07',
    year: '2025',
    display: 'Fri, Nov 7, 2025',
  },
  departure: {
    label: 'Departure Date',
    month: '11',
    day: '10',
    year: '2025',
    display: 'Mon, Nov 10, 2025',
  },
}

const membershipDetails = {
  address: '123 Main St\nPortland, OR',
  phone: '555-123-4567',
  roomPreference: 'Near the elevator if possible.',
  roomingWith: 'Alex Admin',
  message: 'Looking forward to it.',
}

const setMembershipDate = async (page: Page, input: MembershipDateInput) => {
  const group = page.getByRole('group', { name: input.label })
  await group.getByRole('spinbutton', { name: 'Month' }).fill(input.month)
  await group.getByRole('spinbutton', { name: 'Day' }).fill(input.day)
  await group.getByRole('spinbutton', { name: 'Year' }).fill(input.year)
}

const chooseRoom = async (page: Page) => {
  const summitRoom = page.getByRole('radio', { name: 'Summit Queen' })
  if (await summitRoom.isEnabled()) {
    await summitRoom.click()
    return 'Summit Queen'
  }

  const cascadeRoom = page.getByRole('radio', { name: 'Cascade Double Queen' })
  await cascadeRoom.click()
  return 'Cascade Double Queen'
}

const completeMembershipWizard = async (page: Page) => {
  await loginAsUser(page, registrationUserEmail, { returnTo: '/membership/new' })

  await page.getByRole('checkbox', { name: 'Click here to indicate acceptance of these policies' }).check()
  await page.getByRole('button', { name: 'Next' }).click()

  await page.getByRole('textbox', { name: 'Address', exact: true }).fill(membershipDetails.address)
  await page.getByRole('textbox', { name: 'Phone number' }).fill(membershipDetails.phone)
  await page.getByRole('button', { name: 'Next' }).click()

  await page.getByRole('button', { name: 'Next' }).click()

  await setMembershipDate(page, membershipDates.checkIn)
  await setMembershipDate(page, membershipDates.departure)
  const selectedRoom = await chooseRoom(page)
  await page.getByRole('textbox', { name: 'Room Preference And Notes' }).fill(membershipDetails.roomPreference)
  await page.getByRole('radio', { name: 'I will be rooming with (list names)' }).click()
  await page.getByRole('textbox', { name: 'Rooming with' }).fill(membershipDetails.roomingWith)
  await page.getByRole('textbox', { name: 'Any other Message' }).fill(membershipDetails.message)
  await page.getByRole('button', { name: 'Next' }).click()

  await page.getByRole('button', { name: 'Confirm', exact: true }).click()
  await page.waitForURL('**/membership')
  return selectedRoom
}

test.describe.serial('Membership registration', () => {
  test('member can complete registration and dates persist', async ({ page }) => {
    const selectedRoom = await completeMembershipWizard(page)

    await expect(page.getByRole('heading', { name: 'Membership Summary', level: 1 })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: `2025 Membership for ${registrationUserName}`, level: 4 }),
    ).toBeVisible()
    await expect(page.getByText(membershipDates.checkIn.display)).toBeVisible()
    await expect(page.getByText(membershipDates.departure.display)).toBeVisible()
    await expect(page.getByText(selectedRoom)).toBeVisible()
    await expect(page.getByText(membershipDetails.roomPreference)).toBeVisible()
    await expect(page.getByText('I will be rooming with (list names)')).toBeVisible()
    await expect(page.getByText(membershipDetails.roomingWith)).toBeVisible()
    await expect(page.getByText(membershipDetails.message)).toBeVisible()
    await expect(page.getByText('123 Main St')).toBeVisible()
    await expect(page.getByText('Portland, OR')).toBeVisible()
    await expect(page.getByText(membershipDetails.phone)).toBeVisible()
  })

  test('member cannot register twice in the same year', async ({ page }) => {
    await loginAsUser(page, registrationUserEmail, { returnTo: '/membership' })

    await expect(page.getByRole('heading', { name: 'Membership Summary', level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Register' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible()
  })

  test('admin can delete membership transaction', async ({ page }) => {
    await loginAsUser(page, adminUserEmail, { returnTo: '/transactions' })

    await expect(page.getByRole('heading', { name: 'Transactions', level: 1 })).toBeVisible()

    const searchInput = page.getByPlaceholder('Search')
    await searchInput.fill(registrationUserName)

    const transactionRow = page.getByRole('row', { name: new RegExp(registrationUserName) })
    await expect(transactionRow).toBeVisible()
    await expect(transactionRow).toContainText('2025')

    await transactionRow.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(transactionRow).toHaveCount(0)
    await expect(page.getByText('No matching records')).toBeVisible()
  })

  test('admin can delete membership after transactions removed', async ({ page }) => {
    await loginAsUser(page, adminUserEmail, { returnTo: '/member-admin' })

    await expect(page.getByRole('heading', { name: 'Membership', level: 1 })).toBeVisible()

    const searchInput = page.getByPlaceholder('Search')
    await searchInput.fill(registrationUserLastName)

    const membershipRow = page.getByRole('row', { name: new RegExp(registrationUserLastName) })
    await expect(membershipRow).toBeVisible()

    await membershipRow.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(membershipRow).toHaveCount(0)
    await expect(page.getByText('No matching records')).toBeVisible()
  })
})
