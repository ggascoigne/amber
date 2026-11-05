import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { renderMemberSignupPdf } from './memberSignupPdfReport'

describe('renderMemberSignupPdf', () => {
  test('renders six spacious sign-in pages for a short list', async () => {
    const pdf = await PDFDocument.load(
      await renderMemberSignupPdf({ rows: [{ memberName: 'Ada Lovelace' }], year: 2026 }),
    )

    expect(pdf.getPageCount()).toBe(6)
  })

  test('adds a seventh page only when six pages cannot fit every member', async () => {
    const rows = Array.from({ length: 121 }, (_, index) => ({ memberName: `Member ${index + 1}` }))
    const pdf = await PDFDocument.load(await renderMemberSignupPdf({ rows, year: 2026 }))

    expect(pdf.getPageCount()).toBe(7)
  })
})
