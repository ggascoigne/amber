import { PDFDocument } from 'pdf-lib'
import { describe, expect, test } from 'vitest'

import { groupGameRoomUseRows, renderGameRoomUsePdf } from './gameRoomUsePdfReport'

describe('groupGameRoomUseRows', () => {
  test('groups each room and excludes empty game assignments', () => {
    expect(
      groupGameRoomUseRows([
        {
          gameName: 'Game One',
          gmNames: 'Ada Lovelace',
          roomDescription: 'Main 4',
          roomMembers: 'Grace Hopper',
          slot: 1,
        },
        { gameName: null, gmNames: null, roomDescription: 'Main 5', roomMembers: 'Katherine Johnson', slot: null },
      ]),
    ).toEqual([
      {
        games: [{ gameName: 'Game One', gmNames: 'Ada Lovelace', slot: 1 }],
        roomDescription: 'Main 4',
        roomMembers: 'Grace Hopper',
      },
      { games: [], roomDescription: 'Main 5', roomMembers: 'Katherine Johnson' },
    ])
  })
})

describe('renderGameRoomUsePdf', () => {
  test('renders a compact one-page room list', async () => {
    const rooms = Array.from({ length: 14 }, (_room, roomIndex) => ({
      games: Array.from({ length: 7 }, (_game, gameIndex) => ({
        gameName: `Game ${gameIndex + 1}`,
        gmNames: 'Ada Lovelace',
        slot: gameIndex + 1,
      })),
      roomDescription: `Main ${roomIndex + 1}`,
      roomMembers: 'Grace Hopper',
    }))
    const pdf = await PDFDocument.load(await renderGameRoomUsePdf(rooms))

    expect(pdf.getPageCount()).toBe(1)
  })
})
