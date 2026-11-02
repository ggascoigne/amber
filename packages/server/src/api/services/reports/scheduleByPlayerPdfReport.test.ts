import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { groupScheduleByPlayerRows, renderScheduleByPlayerPdf } from './scheduleByPlayerPdfReport'

describe('groupScheduleByPlayerRows', () => {
  test('fills each attending member schedule with configured slots', () => {
    expect(
      groupScheduleByPlayerRows({
        numberOfSlots: 3,
        rows: [
          { gameName: 'A Fine Game', memberId: 1, memberName: 'Ada Lovelace', room: 'Main 1', slot: 2 },
          { gameName: null, memberId: 2, memberName: 'Grace Hopper', room: null, slot: null },
        ],
      }),
    ).toEqual([
      {
        assignments: [
          { gameName: '', room: '', slot: 1 },
          { gameName: 'A Fine Game', room: 'Main 1', slot: 2 },
          { gameName: '', room: '', slot: 3 },
        ],
        memberName: 'Ada Lovelace',
      },
      {
        assignments: [
          { gameName: '', room: '', slot: 1 },
          { gameName: '', room: '', slot: 2 },
          { gameName: '', room: '', slot: 3 },
        ],
        memberName: 'Grace Hopper',
      },
    ])
  })
})

describe('renderScheduleByPlayerPdf', () => {
  test('renders ten player schedules per page', async () => {
    const schedules = Array.from({ length: 11 }, (_, index) => ({
      assignments: [{ gameName: 'A Fine Game', room: 'Main 1', slot: 1 }],
      memberName: `Member ${index + 1}`,
    }))
    const pdf = await PDFDocument.load(await renderScheduleByPlayerPdf({ numberOfSlots: 1, schedules }))

    expect(pdf.getPageCount()).toBe(2)
  })
})
