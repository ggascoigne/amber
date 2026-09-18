import { describe, expect, test } from 'vitest'

import {
  buildFocusedInterestCountsByGameId,
  buildFocusedInterestChoicesByGameId,
  buildGmMemberIdsBySlotId,
  buildInterestChoicesByGameId,
  buildInterestCountsByGameId,
  buildInterestRowsForGame,
  buildMemberIdsBySlotIdForGameCategory,
} from './interest'
import { buildAssignment, buildChoice } from './testHelpers'

import type { GameCategoryByGameId } from '../../../utils/gameCategory'

describe('buildInterestChoicesByGameId', () => {
  test('expands any-game choices onto in-scope games while filtering out unattending, no-game, and out-of-scope entries', () => {
    const choicesByGameId = buildInterestChoicesByGameId({
      choices: [
        buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2 }),
        buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 1 }),
        buildChoice({ memberId: 3, slotId: 1, gameId: 101, rank: 1 }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 901, rank: 4 }),
        buildChoice({ memberId: 1, slotId: 2, gameId: 102, rank: 3 }),
      ],
      attendingMemberIdSet: new Set([1, 2]),
      gameCategoryByGameId: new Map([
        [101, 'user'],
        [102, 'user'],
        [900, 'any_game'],
        [901, 'no_game'],
      ]),
      slotGameIdSet: new Set([101]),
      slotGameIdsBySlotId: new Map([[1, [101, 103]]]),
    })

    expect(Array.from(choicesByGameId.entries())).toEqual([
      [
        101,
        [
          buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2 }),
          buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 1 }),
        ],
      ],
      [103, [buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2 })]],
    ])
  })
})

describe('buildInterestCountsByGameId', () => {
  test('counts unique interested members per game and ignores gm-first rank rows', () => {
    const countsByGameId = buildInterestCountsByGameId(
      new Map([
        [
          101,
          [
            buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 2 }),
            buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 3 }),
            buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 0 }),
            buildChoice({ memberId: 3, slotId: 1, gameId: 101, rank: 4 }),
          ],
        ],
      ]),
    )

    expect(countsByGameId).toEqual(new Map([[101, 2]]))
  })
})

describe('buildFocusedInterestCountsByGameId', () => {
  test('counts direct first and second choices, with an option to include third and fourth choices, from non-GMs who did not choose any game', () => {
    const choices = [
      buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 1 }),
      buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 2 }),
      buildChoice({ memberId: 2, slotId: 1, gameId: 900, rank: 3 }),
      buildChoice({ memberId: 3, slotId: 1, gameId: 101, rank: 1 }),
      buildChoice({ memberId: 4, slotId: 1, gameId: 101, rank: 3 }),
      buildChoice({ memberId: 5, slotId: 1, gameId: 900, rank: 1 }),
    ]
    const gameCategoryByGameId: GameCategoryByGameId = new Map([
      [101, 'user'],
      [900, 'any_game'],
    ])
    const attendingMemberIdSet = new Set([1, 2, 3, 4, 5])

    const anyGameMemberIdsBySlotId = buildMemberIdsBySlotIdForGameCategory({
      choices,
      attendingMemberIdSet,
      gameCategoryByGameId,
      category: 'any_game',
    })
    const gmMemberIdsBySlotId = buildGmMemberIdsBySlotId([
      buildAssignment({ memberId: 3, gameId: 201, gm: 1, slotId: 1 }),
      buildAssignment({ memberId: 4, gameId: 202, gm: 0, slotId: 1 }),
    ])

    const focusedChoicesByGameId = buildFocusedInterestChoicesByGameId({
      choicesByGameId: new Map([[101, choices]]),
      anyGameMemberIdsBySlotId,
      gmMemberIdsBySlotId,
      gameCategoryByGameId,
    })

    expect(focusedChoicesByGameId).toEqual(new Map([[101, [choices[0]]]]))
    expect(
      buildFocusedInterestChoicesByGameId({
        choicesByGameId: new Map([[101, choices]]),
        anyGameMemberIdsBySlotId,
        gmMemberIdsBySlotId,
        gameCategoryByGameId,
        includeRanksThreeAndFour: true,
      }),
    ).toEqual(new Map([[101, [choices[0], choices[4]]]]))
    expect(
      buildFocusedInterestCountsByGameId({
        choicesByGameId: new Map([[101, choices]]),
        anyGameMemberIdsBySlotId,
        gmMemberIdsBySlotId,
        gameCategoryByGameId,
      }),
    ).toEqual(new Map([[101, 1]]))
  })
})

describe('buildInterestRowsForGame', () => {
  test('keeps the best priority per member, annotates any-game choices, and preserves fallback member names', () => {
    const interestRows = buildInterestRowsForGame({
      gameId: 101,
      choices: [
        buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2, fullName: 'Ada' }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 4, fullName: 'Ada' }),
        buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 1, returningPlayer: true, fullName: null }),
        buildChoice({ memberId: 2, slotId: 1, gameId: 900, rank: 3, fullName: null }),
      ],
      gameCategoryByGameId: new Map([
        [101, 'user'],
        [900, 'any_game'],
      ]),
    })

    expect(interestRows).toEqual([
      {
        rowId: 'choice-101-2',
        memberName: 'Unknown member',
        priorityLabel: '1st *',
        prioritySortValue: 0.5,
        rank: 1,
      },
      {
        rowId: 'choice-101-1',
        memberName: 'Ada',
        priorityLabel: '2nd (Any Game)',
        prioritySortValue: 2,
        rank: 2,
      },
    ])
  })
})
