import type { GameAssignmentDashboardData } from '@amber/client'
import { describe, expect, test } from 'vitest'

import {
  applyAssignmentUpdatesToDashboardData,
  applyUpsertedChoiceToDashboardData,
  type DashboardAssignmentUpdatePayload,
} from './dashboardData'

const buildDashboardData = (): GameAssignmentDashboardData =>
  ({
    assignments: [
      {
        memberId: 1,
        gameId: 101,
        gm: 0,
        year: 2026,
        membership: {
          id: 1,
          user: { fullName: 'Ada Lovelace' },
        },
        game: {
          id: 101,
          name: 'Castle Siege',
          slotId: 1,
          category: 'user',
        },
      },
      {
        memberId: 2,
        gameId: 102,
        gm: 1,
        year: 2026,
        membership: {
          id: 2,
          user: { fullName: 'Grace Hopper' },
        },
        game: {
          id: 102,
          name: 'Moon Colony',
          slotId: 2,
          category: 'user',
        },
      },
    ],
    choices: [
      {
        id: 5001,
        memberId: 1,
        gameId: 101,
        rank: 1,
        returningPlayer: false,
        slotId: 1,
        year: 2026,
        membership: {
          id: 1,
          user: { fullName: 'Ada Lovelace' },
        },
        game: {
          id: 101,
          name: 'Castle Siege',
          slotId: 1,
          category: 'user',
        },
      },
    ],
    games: [
      {
        id: 101,
        message: '',
        name: 'Castle Siege',
        playerMax: 5,
        playerMin: 2,
        playerPreference: 'all',
        returningPlayers: '',
        slotId: 1,
        category: 'user',
        year: 2026,
      },
      {
        id: 102,
        message: '',
        name: 'Moon Colony',
        playerMax: 6,
        playerMin: 3,
        playerPreference: 'all',
        returningPlayers: '',
        slotId: 2,
        category: 'user',
        year: 2026,
      },
      {
        id: 103,
        message: '',
        name: 'No Game',
        playerMax: 999,
        playerMin: 0,
        playerPreference: 'all',
        returningPlayers: '',
        slotId: 1,
        category: 'no_game',
        year: 2026,
      },
    ],
    memberships: [
      {
        attending: true,
        id: 1,
        userId: 101,
        user: { fullName: 'Ada Lovelace' },
        year: 2026,
      },
      {
        attending: true,
        id: 2,
        userId: 102,
        user: { fullName: 'Grace Hopper' },
        year: 2026,
      },
      {
        attending: true,
        id: 3,
        userId: 103,
        user: { fullName: 'Linus Torvalds' },
        year: 2026,
      },
    ],
    submissions: [],
  }) as GameAssignmentDashboardData

describe('applyAssignmentUpdatesToDashboardData', () => {
  test('removes matching assignments and enriches added assignments from dashboard data', () => {
    const payload: DashboardAssignmentUpdatePayload = {
      adds: [{ memberId: 3, gameId: 103, gm: 0, year: 2026 }],
      removes: [{ memberId: 1, gameId: 101, gm: 0, year: 2026 }],
    }

    const nextData = applyAssignmentUpdatesToDashboardData({
      previous: buildDashboardData(),
      payload,
    })

    expect(nextData?.assignments).toEqual([
      expect.objectContaining({
        memberId: 2,
        gameId: 102,
        gm: 1,
      }),
      expect.objectContaining({
        memberId: 3,
        gameId: 103,
        gm: 0,
        membership: {
          id: 3,
          user: { fullName: 'Linus Torvalds' },
        },
        game: {
          id: 103,
          name: 'No Game',
          slotId: 1,
          category: 'no_game',
        },
      }),
    ])
  })

  test('skips added assignments when the related membership or game is missing', () => {
    const payload: DashboardAssignmentUpdatePayload = {
      adds: [
        { memberId: 999, gameId: 101, gm: 0, year: 2026 },
        { memberId: 1, gameId: 999, gm: 0, year: 2026 },
      ],
      removes: [],
    }
    const previous = buildDashboardData()

    const nextData = applyAssignmentUpdatesToDashboardData({
      previous,
      payload,
    })

    expect(nextData).toEqual(previous)
  })
})

describe('applyUpsertedChoiceToDashboardData', () => {
  test('replaces the matching choice and enriches it from dashboard data', () => {
    const nextData = applyUpsertedChoiceToDashboardData({
      previous: buildDashboardData(),
      gameChoice: {
        id: 6001,
        memberId: 1,
        gameId: 103,
        rank: 1,
        returningPlayer: true,
        slotId: 1,
        year: 2026,
      },
    })

    expect(nextData?.choices).toEqual([
      {
        id: 6001,
        memberId: 1,
        gameId: 103,
        rank: 1,
        returningPlayer: true,
        slotId: 1,
        year: 2026,
        membership: {
          id: 1,
          user: { fullName: 'Ada Lovelace' },
        },
        game: {
          id: 103,
          name: 'No Game',
          slotId: 1,
          category: 'no_game',
        },
      },
    ])
  })

  test('keeps the upserted choice when the game is unknown but ignores unknown members', () => {
    const previous = buildDashboardData()

    const nextWithUnknownGame = applyUpsertedChoiceToDashboardData({
      previous,
      gameChoice: {
        id: 6002,
        memberId: 1,
        gameId: 999,
        rank: 2,
        returningPlayer: false,
        slotId: 1,
        year: 2026,
      },
    })
    const nextWithUnknownMember = applyUpsertedChoiceToDashboardData({
      previous,
      gameChoice: {
        id: 6003,
        memberId: 999,
        gameId: 101,
        rank: 2,
        returningPlayer: false,
        slotId: 1,
        year: 2026,
      },
    })

    expect(nextWithUnknownGame?.choices.at(-1)).toEqual({
      id: 6002,
      memberId: 1,
      gameId: 999,
      rank: 2,
      returningPlayer: false,
      slotId: 1,
      year: 2026,
      membership: {
        id: 1,
        user: { fullName: 'Ada Lovelace' },
      },
      game: null,
    })
    expect(nextWithUnknownMember).toEqual(previous)
  })
})
