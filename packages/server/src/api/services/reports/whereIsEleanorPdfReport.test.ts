import { DateTime } from 'luxon'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { groupWhereIsEleanorRows, renderWhereIsEleanorPdf } from './whereIsEleanorPdfReport'

describe('groupWhereIsEleanorRows', () => {
  test('includes each configured slot when Eleanor has no game assignment', () => {
    expect(
      groupWhereIsEleanorRows({
        numberOfSlots: 3,
        rows: [{ gameName: 'Game Two', room: 'Main 2', slot: 2 }],
      }),
    ).toEqual([
      { gameName: '', room: '', slot: 1 },
      { gameName: 'Game Two', room: 'Main 2', slot: 2 },
      { gameName: '', room: '', slot: 3 },
    ])
  })
})

describe('renderWhereIsEleanorPdf', () => {
  test('renders a landscape schedule', async () => {
    const pdf = await PDFDocument.load(
      await renderWhereIsEleanorPdf({
        entries: [{ gameName: 'Game One', room: 'Main 1', slot: 1 }],
        start: DateTime.fromISO('2026-11-05T19:00:00', { zone: 'America/Los_Angeles' }),
        virtual: false,
      }),
    )

    expect(pdf.getPageCount()).toBe(1)
    expect(pdf.getPage(0).getWidth()).toBe(792)
    expect(pdf.getPage(0).getHeight()).toBe(612)
  })
})
