import { beforeEach, describe, expect, test, vi } from 'vitest'

import { applyRoomAssignmentPlanner } from './applyRoomAssignmentPlanner'
import { planInitialRoomAssignments } from './initialPlanner'
import { syncLegacyGameRoomIdsForYear } from './legacyRoomSync'

import type { TransactionClient } from '../../inRlsTransaction'

vi.mock('./initialPlanner', () => ({
  planInitialRoomAssignments: vi.fn(),
}))

vi.mock('./legacyRoomSync', () => ({
  syncLegacyGameRoomIdsForYear: vi.fn().mockResolvedValue(undefined),
}))

const planInitialRoomAssignmentsMock = vi.mocked(planInitialRoomAssignments)
const syncLegacyGameRoomIdsForYearMock = vi.mocked(syncLegacyGameRoomIdsForYear)

const createApplyRoomAssignmentPlannerTx = () => {
  const gameRoomAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: 2 })
  const gameFindMany = vi.fn().mockResolvedValue([
    {
      id: 10,
      name: 'Alpha Game',
      slotId: 1,
      roomId: null,
      year: 2026,
      playerMin: 2,
      playerMax: 6,
      category: 'user',
    },
    {
      id: 11,
      name: 'Bravo Game',
      slotId: 2,
      roomId: null,
      year: 2026,
      playerMin: 2,
      playerMax: 6,
      category: 'user',
    },
    {
      id: 12,
      name: 'No Slot Game',
      slotId: null,
      roomId: null,
      year: 2026,
      playerMin: 2,
      playerMax: 6,
      category: 'user',
    },
  ])
  const roomFindMany = vi.fn().mockResolvedValue([
    {
      id: 5,
      description: 'Boardroom',
      size: 8,
      type: 'Shared Space',
      enabled: true,
      updated: new Date('2026-01-01T00:00:00.000Z'),
      accessibility: 'no_stairs',
    },
  ])
  const gameRoomAssignmentFindMany = vi.fn().mockResolvedValue([
    {
      id: BigInt(1),
      gameId: 10,
      roomId: 5,
      slotId: 1,
      year: 2026,
      isOverride: false,
      source: 'auto',
      assignmentReason: 'Previous auto assignment',
      assignedByUserId: 7,
      game: {
        id: 10,
        name: 'Alpha Game',
        slotId: 1,
        playerMin: 2,
        playerMax: 6,
        year: 2026,
        category: 'user',
      },
      room: {
        id: 5,
        description: 'Boardroom',
        size: 8,
        type: 'Shared Space',
        enabled: true,
        updated: new Date('2026-01-01T00:00:00.000Z'),
        accessibility: 'no_stairs',
      },
    },
    {
      id: BigInt(2),
      gameId: 11,
      roomId: 5,
      slotId: 2,
      year: 2026,
      isOverride: true,
      source: 'manual',
      assignmentReason: null,
      assignedByUserId: 8,
      game: {
        id: 11,
        name: 'Bravo Game',
        slotId: 2,
        playerMin: 2,
        playerMax: 6,
        year: 2026,
        category: 'user',
      },
      room: {
        id: 5,
        description: 'Boardroom',
        size: 8,
        type: 'Shared Space',
        enabled: true,
        updated: new Date('2026-01-01T00:00:00.000Z'),
        accessibility: 'no_stairs',
      },
    },
  ])
  const roomSlotAvailabilityFindMany = vi.fn().mockResolvedValue([
    {
      roomId: 5,
      slotId: 1,
      year: 2026,
      isAvailable: true,
    },
  ])
  const memberRoomAssignmentFindMany = vi.fn().mockResolvedValue([
    {
      memberId: 20,
      roomId: 5,
      year: 2026,
      membership: {
        id: 20,
        user: {
          fullName: null,
        },
      },
      room: {
        id: 5,
        description: 'Boardroom',
        size: 8,
        type: 'Shared Space',
        enabled: true,
        updated: new Date('2026-01-01T00:00:00.000Z'),
        accessibility: 'no_stairs',
      },
    },
  ])
  const membershipFindMany = vi.fn().mockResolvedValue([
    {
      id: 20,
      userId: 200,
      year: 2026,
      attending: true,
      user: {
        fullName: 'Member Name',
      },
    },
  ])
  const gameAssignmentFindMany = vi.fn().mockResolvedValue([
    {
      memberId: 20,
      gameId: 10,
      gm: 1,
      year: 2026,
      game: {
        id: 10,
        slotId: 1,
        year: 2026,
      },
      membership: {
        id: 20,
        userId: 200,
        user: {
          fullName: null,
          profile: [{ roomAccessibilityPreference: 'no_stairs' }],
        },
      },
    },
  ])
  const gameRoomAssignmentCreateMany = vi.fn().mockResolvedValue({ count: 1 })

  const tx = {
    game: {
      findMany: gameFindMany,
    },
    room: {
      findMany: roomFindMany,
    },
    gameRoomAssignment: {
      deleteMany: gameRoomAssignmentDeleteMany,
      findMany: gameRoomAssignmentFindMany,
      createMany: gameRoomAssignmentCreateMany,
    },
    roomSlotAvailability: {
      findMany: roomSlotAvailabilityFindMany,
    },
    memberRoomAssignment: {
      findMany: memberRoomAssignmentFindMany,
    },
    membership: {
      findMany: membershipFindMany,
    },
    gameAssignment: {
      findMany: gameAssignmentFindMany,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameRoomAssignmentDeleteMany,
    gameRoomAssignmentCreateMany,
    gameFindMany,
    roomFindMany,
    gameRoomAssignmentFindMany,
    roomSlotAvailabilityFindMany,
    memberRoomAssignmentFindMany,
    membershipFindMany,
    gameAssignmentFindMany,
  }
}

describe('applyRoomAssignmentPlanner', () => {
  beforeEach(() => {
    planInitialRoomAssignmentsMock.mockReset()
    syncLegacyGameRoomIdsForYearMock.mockClear()
  })

  test('maps dashboard data into planner input and persists new assignments', async () => {
    const fixture = createApplyRoomAssignmentPlannerTx()

    planInitialRoomAssignmentsMock.mockReturnValue({
      assignments: [
        {
          gameId: 10,
          gameName: 'Alpha Game',
          roomId: 5,
          roomDescription: 'Boardroom',
          slotId: 1,
          year: 2026,
          source: 'auto',
          reason: 'Shared room priority',
        },
      ],
      skippedGames: [{ gameId: 11, gameName: 'Bravo Game', slotId: 2, participantCount: 3, reason: 'Skipped' }],
      unmetConstraints: [{ id: 'constraint-1', slotId: 1, type: 'unused_non_member_room', detail: 'Unused room.' }],
    })

    const result = await applyRoomAssignmentPlanner({
      tx: fixture.tx,
      input: {
        year: 2026,
        slotId: 1,
        assignedByUserId: 44,
        deleteWhere: {
          year: 2026,
          slotId: 1,
          isOverride: false,
        },
      },
    })

    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        slotId: 1,
        isOverride: false,
      },
    })
    expect(planInitialRoomAssignmentsMock).toHaveBeenCalledWith({
      year: 2026,
      games: [
        {
          id: 10,
          name: 'Alpha Game',
          slotId: 1,
          year: 2026,
          category: 'user',
        },
      ],
      rooms: [
        {
          id: 5,
          description: 'Boardroom',
          size: 8,
          type: 'Shared Space',
          enabled: true,
          accessibility: 'no_stairs',
        },
      ],
      participants: [
        {
          memberId: 20,
          gameId: 10,
          isGm: true,
          fullName: 'Unknown member',
          roomAccessibilityPreference: 'no_stairs',
        },
      ],
      roomSlotAvailability: [
        {
          roomId: 5,
          slotId: 1,
          year: 2026,
          isAvailable: true,
        },
      ],
      memberRoomAssignments: [
        {
          memberId: 20,
          roomId: 5,
          memberName: 'Unknown member',
        },
      ],
      existingAssignments: [
        {
          gameId: 10,
          roomId: 5,
          slotId: 1,
          year: 2026,
          isOverride: false,
          source: 'auto',
        },
        {
          gameId: 11,
          roomId: 5,
          slotId: 2,
          year: 2026,
          isOverride: true,
          source: 'manual',
        },
      ],
    })
    expect(fixture.membershipFindMany).not.toHaveBeenCalled()
    expect(fixture.gameRoomAssignmentCreateMany).toHaveBeenCalledWith({
      data: [
        {
          gameId: 10,
          roomId: 5,
          slotId: 1,
          year: 2026,
          isOverride: false,
          source: 'auto',
          assignmentReason: 'Shared room priority',
          assignedByUserId: 44,
        },
      ],
      skipDuplicates: true,
    })
    expect(syncLegacyGameRoomIdsForYearMock).toHaveBeenCalledWith({
      tx: fixture.tx,
      year: 2026,
    })
    expect(result).toEqual({
      deletedAssignments: 2,
      createdAssignments: 1,
      assignments: [
        {
          gameId: 10,
          gameName: 'Alpha Game',
          roomId: 5,
          roomDescription: 'Boardroom',
          slotId: 1,
          year: 2026,
          source: 'auto',
          reason: 'Shared room priority',
        },
      ],
      skippedGames: [{ gameId: 11, gameName: 'Bravo Game', slotId: 2, participantCount: 3, reason: 'Skipped' }],
      unmetConstraints: [{ id: 'constraint-1', slotId: 1, type: 'unused_non_member_room', detail: 'Unused room.' }],
      scope: 'slot',
      slotId: 1,
    })
  })

  test('skips createMany when the planner returns no assignments', async () => {
    const fixture = createApplyRoomAssignmentPlannerTx()

    planInitialRoomAssignmentsMock.mockReturnValue({
      assignments: [],
      skippedGames: [],
      unmetConstraints: [],
    })

    const result = await applyRoomAssignmentPlanner({
      tx: fixture.tx,
      input: {
        year: 2026,
        assignedByUserId: null,
        deleteWhere: {
          year: 2026,
          source: 'auto',
        },
      },
    })

    expect(fixture.gameRoomAssignmentCreateMany).not.toHaveBeenCalled()
    expect(syncLegacyGameRoomIdsForYearMock).toHaveBeenCalledWith({
      tx: fixture.tx,
      year: 2026,
    })
    expect(result).toEqual({
      deletedAssignments: 2,
      createdAssignments: 0,
      assignments: [],
      skippedGames: [],
      unmetConstraints: [],
      scope: 'year',
      slotId: null,
    })
  })
})
