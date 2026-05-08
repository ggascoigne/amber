import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import {
  groupMemberLabelRows,
  renderMemberLabelsPdf,
  type MemberLabel,
  type MemberLabelRow,
} from './memberLabelsPdfReport'

const memberLabel = (memberName: string): MemberLabel => ({
  assignments: [
    {
      gameName: 'A Fine Game',
      isGm: false,
      room: 'Main 1',
      slot: 1,
    },
  ],
  memberName,
})

describe('groupMemberLabelRows', () => {
  test('groups ordered rows by member and preserves slot assignments', () => {
    const rows: Array<MemberLabelRow> = [
      {
        gameName: 'First Game',
        isGm: true,
        memberId: 1,
        memberName: 'Harper Haven',
        room: 'Main 4',
        slot: 1,
      },
      {
        gameName: 'Second Game',
        isGm: false,
        memberId: 1,
        memberName: 'Harper Haven',
        room: null,
        slot: 2,
      },
      {
        gameName: 'Third Game',
        isGm: false,
        memberId: 2,
        memberName: 'Ada Lovelace',
        room: 'Winery 36',
        slot: 1,
      },
    ]

    expect(groupMemberLabelRows(rows)).toEqual([
      {
        assignments: [
          {
            gameName: 'First Game',
            isGm: true,
            room: 'Main 4',
            slot: 1,
          },
          {
            gameName: 'Second Game',
            isGm: false,
            room: '',
            slot: 2,
          },
        ],
        memberName: 'Harper Haven',
      },
      {
        assignments: [
          {
            gameName: 'Third Game',
            isGm: false,
            room: 'Winery 36',
            slot: 1,
          },
        ],
        memberName: 'Ada Lovelace',
      },
    ])
  })

  test('fills missing slots with blank assignment rows', () => {
    const labels = groupMemberLabelRows(
      [
        {
          gameName: 'Second Game',
          isGm: false,
          memberId: 1,
          memberName: 'Harper Haven',
          room: 'Main 4',
          slot: 2,
        },
      ],
      3,
    )

    expect(labels).toEqual([
      {
        assignments: [
          {
            gameName: '',
            isGm: false,
            room: '',
            slot: 1,
          },
          {
            gameName: 'Second Game',
            isGm: false,
            room: 'Main 4',
            slot: 2,
          },
          {
            gameName: '',
            isGm: false,
            room: '',
            slot: 3,
          },
        ],
        memberName: 'Harper Haven',
      },
    ])
  })
})

describe('renderMemberLabelsPdf', () => {
  test('renders one page for one label', async () => {
    const pdfBytes = await renderMemberLabelsPdf([memberLabel('One Member')], { numberOfSlots: 7 })
    const pdf = await PDFDocument.load(pdfBytes)

    expect(pdfBytes.length).toBeGreaterThan(0)
    expect(pdf.getPageCount()).toBe(1)
  })

  test('renders one page for ten labels', async () => {
    const labels = Array.from({ length: 10 }, (_, index) => memberLabel(`Member ${index}`))
    const pdf = await PDFDocument.load(await renderMemberLabelsPdf(labels))

    expect(pdf.getPageCount()).toBe(1)
  })

  test('renders two pages for eleven labels', async () => {
    const labels = Array.from({ length: 11 }, (_, index) => memberLabel(`Member ${index}`))
    const pdf = await PDFDocument.load(await renderMemberLabelsPdf(labels))

    expect(pdf.getPageCount()).toBe(2)
  })
})
