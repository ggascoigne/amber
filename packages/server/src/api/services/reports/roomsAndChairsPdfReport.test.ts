import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { renderRoomsAndChairsPdf } from './roomsAndChairsPdfReport'

describe('renderRoomsAndChairsPdf', () => {
  test('renders allocated rooms in a single portrait report page', async () => {
    const pdf = await PDFDocument.load(
      await renderRoomsAndChairsPdf([
        { description: 'Main 22', members: 'DQ (Erik Florentz)', size: 8 },
        { description: 'Winery 41', members: 'DQS (Kris Santoro)', size: 10 },
      ]),
    )

    expect(pdf.getPageCount()).toBe(1)
  })
})
