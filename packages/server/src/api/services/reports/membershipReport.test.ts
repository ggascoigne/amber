import { describe, expect, it } from 'vitest'

import { membershipReport } from './membershipReport'

import type { ReportRow } from '../../contracts/reports'

describe('membershipReport', () => {
  it('exports arrival and departure as timezone-neutral Excel calendar dates', () => {
    const workbook = membershipReport.transform?.(
      [
        {
          'Member Id': 42,
          Arriving: new Date('2024-11-06T05:00:00.000Z'),
          Departing: new Date('2024-11-10T05:00:00.000Z'),
        },
      ],
      {
        fourDayMembership: 0,
        numberOfSlots: 0,
        start: null,
        virtual: false,
      },
    )

    expect(workbook).toEqual({
      columns: ['Member Id', 'Arriving', 'Departing'],
      columnFormats: [
        { column: 'Arriving', format: 'yyyy-mm-dd' },
        { column: 'Departing', format: 'yyyy-mm-dd' },
      ],
      rows: [
        {
          'Member Id': 42,
          Arriving: 45602,
          Departing: 45606,
        },
      ],
      sheetName: 'Sheet1',
    })
  })

  it('exports the number of conventions each user has attended', () => {
    const queryRows = [
      {
        'Member Id': 42,
        'Times Attending': 3n,
      },
    ] as unknown as Array<ReportRow>

    const workbook = membershipReport.transform?.(queryRows, {
      fourDayMembership: 0,
      numberOfSlots: 0,
      start: null,
      virtual: false,
    })

    expect(workbook?.rows).toEqual([
      {
        'Member Id': 42,
        'Times Attending': 3,
      },
    ])
  })
})
