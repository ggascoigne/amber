import { describe, expect, test, vi } from 'vitest'

import { prepareDefaultRoomAssignment } from './assignGameRoom.defaults'

const createPrepareDefaultRoomAssignmentTx = ({
  roomAvailability = null,
  occupiedRoom = null,
  displacedAssignments = [],
}: {
  roomAvailability?: { isAvailable: boolean } | null
  occupiedRoom?: { id: bigint } | null
  displacedAssignments?: Array<{ gameId: number }>
} = {}) => {
  const roomSlotAvailabilityFindUnique = vi.fn().mockResolvedValue(roomAvailability)
  const gameRoomAssignmentFindFirst = vi.fn().mockResolvedValue(occupiedRoom)
  const gameRoomAssignmentFindMany = vi.fn().mockResolvedValue(displacedAssignments)
  const gameRoomAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: displacedAssignments.length })

  return {
    tx: {
      roomSlotAvailability: {
        findUnique: roomSlotAvailabilityFindUnique,
      },
      gameRoomAssignment: {
        findFirst: gameRoomAssignmentFindFirst,
        findMany: gameRoomAssignmentFindMany,
        deleteMany: gameRoomAssignmentDeleteMany,
      },
    },
    roomSlotAvailabilityFindUnique,
    gameRoomAssignmentFindFirst,
    gameRoomAssignmentFindMany,
    gameRoomAssignmentDeleteMany,
  }
}

describe('prepareDefaultRoomAssignment', () => {
  test('only removes other default rooms for the same game when the target room is available', async () => {
    const fixture = createPrepareDefaultRoomAssignmentTx()

    const result = await prepareDefaultRoomAssignment({
      tx: fixture.tx,
      gameId: 10,
      roomId: 20,
      slotId: 3,
      year: 2026,
    })

    expect(fixture.roomSlotAvailabilityFindUnique).toHaveBeenCalledWith({
      where: {
        roomId_slotId_year: {
          roomId: 20,
          slotId: 3,
          year: 2026,
        },
      },
      select: {
        isAvailable: true,
      },
    })
    expect(fixture.gameRoomAssignmentFindFirst).toHaveBeenCalledWith({
      where: {
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: false,
        gameId: {
          not: 10,
        },
      },
      select: {
        id: true,
      },
    })
    expect(fixture.gameRoomAssignmentFindMany).not.toHaveBeenCalled()
    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenCalledTimes(1)
    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        gameId: 10,
        slotId: 3,
        year: 2026,
        isOverride: false,
        roomId: {
          not: 20,
        },
      },
    })
    expect(result).toEqual({
      displacedGameIds: [],
    })
  })

  test('displaces conflicting default assignments before removing other rooms for the same game', async () => {
    const fixture = createPrepareDefaultRoomAssignmentTx({
      roomAvailability: { isAvailable: false },
      displacedAssignments: [{ gameId: 77 }, { gameId: 88 }],
    })

    const result = await prepareDefaultRoomAssignment({
      tx: fixture.tx,
      gameId: 10,
      roomId: 20,
      slotId: 3,
      year: 2026,
    })

    expect(fixture.gameRoomAssignmentFindFirst).not.toHaveBeenCalled()
    expect(fixture.gameRoomAssignmentFindMany).toHaveBeenCalledWith({
      where: {
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: false,
        gameId: {
          not: 10,
        },
      },
      select: {
        gameId: true,
      },
    })
    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenNthCalledWith(1, {
      where: {
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: false,
        gameId: {
          not: 10,
        },
      },
    })
    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenNthCalledWith(2, {
      where: {
        gameId: 10,
        slotId: 3,
        year: 2026,
        isOverride: false,
        roomId: {
          not: 20,
        },
      },
    })
    expect(result).toEqual({
      displacedGameIds: [77, 88],
    })
  })
})
