import { DateTime } from 'luxon'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { groupGamesBySlotRows, renderGamesBySlotPdf } from './gamesBySlotPdfReport'

describe('groupGamesBySlotRows', () => {
  test('groups each game with its room and members', () => {
    expect(
      groupGamesBySlotRows([
        {
          category: 'user',
          gameId: 1,
          gameName: 'An Amber Game',
          isGm: true,
          memberName: 'Game Master',
          room: 'Main 1',
          slot: 1,
        },
        {
          category: 'user',
          gameId: 1,
          gameName: 'An Amber Game',
          isGm: false,
          memberName: 'Player One',
          room: 'Main 1',
          slot: 1,
        },
        {
          category: 'no_game',
          gameId: 2,
          gameName: 'No Game',
          isGm: false,
          memberName: 'Taking This Slot Off',
          room: 'N/A',
          slot: 1,
        },
      ]),
    ).toEqual([
      {
        category: 'user',
        gameName: 'An Amber Game',
        members: [
          { isGm: true, name: 'Game Master' },
          { isGm: false, name: 'Player One' },
        ],
        room: 'Main 1',
        slot: 1,
      },
      {
        category: 'no_game',
        gameName: 'No Game',
        members: [{ isGm: false, name: 'Taking This Slot Off' }],
        room: 'N/A',
        slot: 1,
      },
    ])
  })
})

describe('renderGamesBySlotPdf', () => {
  test('starts directly with the first slot listing page', async () => {
    const pdf = await PDFDocument.load(
      await renderGamesBySlotPdf({
        games: [
          {
            category: 'user',
            gameName: 'An Amber Game',
            members: [{ isGm: true, name: 'Game Master' }],
            room: 'Main 1',
            slot: 1,
          },
        ],
        numberOfSlots: 7,
        start: DateTime.fromISO('2025-11-06T00:00:00.000-08:00'),
        virtual: false,
      }),
    )

    expect(pdf.getPageCount()).toBe(7)
  })
})
