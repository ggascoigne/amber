import { DateTime } from 'luxon'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { buildBadgeBackSlots, renderBadgeBacksPdf } from './badgeBackPdfReport'

const slots = buildBadgeBackSlots({
  numberOfSlots: 7,
  start: DateTime.fromISO('2025-11-06T00:00:00.000-08:00'),
  virtual: false,
})

describe('buildBadgeBackSlots', () => {
  test('formats the configured slots as they appear on badge backs', () => {
    expect(slots).toEqual([
      { number: 1, text: 'Thursday, November 6, 2025 - 7pm to midnight' },
      { number: 2, text: 'Friday, November 7, 2025 - 9am to 1pm' },
      { number: 3, text: 'Friday, November 7, 2025 - 2pm to 6:30pm' },
      { number: 4, text: 'Friday, November 7, 2025 - 8pm to midnight' },
      { number: 5, text: 'Saturday, November 8, 2025 - 9am to 4:30pm' },
      { number: 6, text: 'Saturday, November 8, 2025 - 7pm to midnight' },
      { number: 7, text: 'Sunday, November 9, 2025 - 10am to 4:30pm' },
    ])
  })
})

describe('renderBadgeBacksPdf', () => {
  test('renders one badge back for every member across ten-up pages', async () => {
    const pdf = await PDFDocument.load(await renderBadgeBacksPdf({ count: 11, slots }))

    expect(pdf.getPageCount()).toBe(2)
  })
})
