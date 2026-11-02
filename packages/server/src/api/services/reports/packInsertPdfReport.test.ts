import { DateTime } from 'luxon'
import { PDFDocument } from 'pdf-lib'
import { expect, test } from 'vitest'

import { renderPackInsertPdf } from './packInsertPdfReport'

test('renders the four-page pack insert', async () => {
  const start = DateTime.fromISO('2026-11-05T19:00:00', { zone: 'America/Los_Angeles' })
  const slotTimes = Array.from(
    { length: 7 },
    (_slot, index) => [start.plus({ hours: index * 5 }), start.plus({ hours: index * 5 + 4 })] as [DateTime, DateTime],
  )
  const pdf = await PDFDocument.load(await renderPackInsertPdf({ slotTimes, year: 2026 }))
  expect(pdf.getPageCount()).toBe(4)
})
