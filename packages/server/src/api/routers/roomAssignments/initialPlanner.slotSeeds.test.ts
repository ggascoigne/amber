import { describe, expect, test } from 'vitest'

import type { InitialPlannerExistingAssignment, InitialPlannerGame } from './initialPlanner'
import type { PlannedGameContext, PlannerSeedData } from './initialPlanner.seed'
import { buildSlotPlanningSeeds } from './initialPlanner.slotSeeds'

const year = 2026

const buildGame = (overrides: Partial<InitialPlannerGame> & Pick<InitialPlannerGame, 'id' | 'name' | 'slotId'>) => ({
  id: overrides.id,
  name: overrides.name,
  slotId: overrides.slotId,
  year: overrides.year ?? year,
  category: overrides.category ?? 'user',
})

const buildPlannedGameContext = ({
  game,
  participantCount,
}: {
  game: InitialPlannerGame
  participantCount: number
}): PlannedGameContext => ({
  game,
  participantCount,
  requiredAccessibility: 'many_stairs',
  gmMemberIds: [],
  playerMemberIds: [],
})

const buildExistingAssignment = (
  overrides: Pick<InitialPlannerExistingAssignment, 'gameId' | 'roomId' | 'slotId'>,
): InitialPlannerExistingAssignment => ({
  gameId: overrides.gameId,
  roomId: overrides.roomId,
  slotId: overrides.slotId,
  year,
  isOverride: true,
  source: 'manual',
})

const buildPlannerSeedData = (overrides: Partial<PlannerSeedData> = {}): PlannerSeedData => ({
  roomsById: new Map(),
  roomAvailabilityByKey: new Map(),
  memberRoomIdByMemberId: new Map(),
  roomMemberCountByRoomId: new Map(),
  memberRoomIds: new Set(),
  existingFixedAssignmentsBySlotId: new Map(),
  lockedGameIds: new Set(),
  plannedGamesBySlotId: new Map(),
  ...overrides,
})

describe('buildSlotPlanningSeeds', () => {
  test('sorts slots ascending and sorts unlocked games by participant count, name, and id', () => {
    const slotOneAssignment = buildExistingAssignment({ gameId: 10, roomId: 101, slotId: 1 })
    const slotTwoAssignment = buildExistingAssignment({ gameId: 20, roomId: 202, slotId: 2 })

    const result = buildSlotPlanningSeeds(
      buildPlannerSeedData({
        existingFixedAssignmentsBySlotId: new Map([
          [1, [slotOneAssignment]],
          [2, [slotTwoAssignment]],
        ]),
        lockedGameIds: new Set([13]),
        plannedGamesBySlotId: new Map([
          [
            2,
            [
              buildPlannedGameContext({
                game: buildGame({ id: 13, name: 'Locked Game', slotId: 2 }),
                participantCount: 9,
              }),
              buildPlannedGameContext({
                game: buildGame({ id: 12, name: 'Alpha Game', slotId: 2 }),
                participantCount: 4,
              }),
              buildPlannedGameContext({
                game: buildGame({ id: 11, name: 'Alpha Game', slotId: 2 }),
                participantCount: 4,
              }),
              buildPlannedGameContext({
                game: buildGame({ id: 14, name: 'Bravo Game', slotId: 2 }),
                participantCount: 2,
              }),
            ],
          ],
          [
            1,
            [
              buildPlannedGameContext({
                game: buildGame({ id: 10, name: 'First Slot Game', slotId: 1 }),
                participantCount: 1,
              }),
            ],
          ],
        ]),
      }),
    )

    expect(result).toEqual([
      {
        slotId: 1,
        existingFixedAssignments: [slotOneAssignment],
        gamesForSlot: [
          buildPlannedGameContext({
            game: buildGame({ id: 10, name: 'First Slot Game', slotId: 1 }),
            participantCount: 1,
          }),
        ],
      },
      {
        slotId: 2,
        existingFixedAssignments: [slotTwoAssignment],
        gamesForSlot: [
          buildPlannedGameContext({ game: buildGame({ id: 11, name: 'Alpha Game', slotId: 2 }), participantCount: 4 }),
          buildPlannedGameContext({ game: buildGame({ id: 12, name: 'Alpha Game', slotId: 2 }), participantCount: 4 }),
          buildPlannedGameContext({ game: buildGame({ id: 14, name: 'Bravo Game', slotId: 2 }), participantCount: 2 }),
        ],
      },
    ])
  })

  test('keeps slot seeds for fully locked slots so fixed assignments still flow into later planning', () => {
    const lockedAssignment = buildExistingAssignment({ gameId: 30, roomId: 303, slotId: 3 })

    const result = buildSlotPlanningSeeds(
      buildPlannerSeedData({
        existingFixedAssignmentsBySlotId: new Map([[3, [lockedAssignment]]]),
        lockedGameIds: new Set([30]),
        plannedGamesBySlotId: new Map([
          [
            3,
            [
              buildPlannedGameContext({
                game: buildGame({ id: 30, name: 'Locked Slot Game', slotId: 3 }),
                participantCount: 6,
              }),
            ],
          ],
        ]),
      }),
    )

    expect(result).toEqual([
      {
        slotId: 3,
        existingFixedAssignments: [lockedAssignment],
        gamesForSlot: [],
      },
    ])
  })
})
