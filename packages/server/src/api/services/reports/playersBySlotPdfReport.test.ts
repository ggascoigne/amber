import { DateTime } from 'luxon'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { renderPlayersBySlotPdf } from './playersBySlotPdfReport'

describe('renderPlayersBySlotPdf', () => {
  test('renders the first slot directly on a listing page', async () => {
    const pdf = await PDFDocument.load(
      await renderPlayersBySlotPdf({
        numberOfSlots: 7,
        rows: [{ gameName: 'An Amber Game', memberName: 'Attending Player', room: 'Main 1', slot: 1 }],
        start: DateTime.fromISO('2025-11-06T00:00:00.000-08:00'),
        virtual: false,
      }),
    )

    expect(pdf.getPageCount()).toBe(7)
  })
})
