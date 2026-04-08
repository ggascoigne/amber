type DefaultRoomAssignmentTx = {
  roomSlotAvailability: {
    findUnique: (args: {
      where: {
        roomId_slotId_year: {
          roomId: number
          slotId: number
          year: number
        }
      }
      select: {
        isAvailable: true
      }
    }) => Promise<{ isAvailable: boolean } | null>
  }
  gameRoomAssignment: {
    findFirst: (args: {
      where: {
        roomId: number
        slotId: number
        year: number
        isOverride: boolean
        gameId?: {
          not: number
        }
      }
      select: {
        id: true
      }
    }) => Promise<{ id: bigint } | null>
    findMany: (args: {
      where: {
        roomId: number
        slotId: number
        year: number
        isOverride: boolean
        gameId: {
          not: number
        }
      }
      select: {
        gameId: true
      }
    }) => Promise<Array<{ gameId: number }>>
    deleteMany: (args: { where: DefaultAssignmentDeleteWhere }) => Promise<unknown>
  }
}

type DefaultAssignmentDeleteWhere = {
  slotId: number
  year: number
  isOverride: boolean
  gameId?: number | { not: number }
  roomId?: number | { not: number }
}

const getIsRoomAvailable = async ({
  tx,
  roomId,
  slotId,
  year,
  excludeGameId,
}: {
  tx: DefaultRoomAssignmentTx
  roomId: number
  slotId: number
  year: number
  excludeGameId?: number
}) => {
  const availability = await tx.roomSlotAvailability.findUnique({
    where: {
      roomId_slotId_year: {
        roomId,
        slotId,
        year,
      },
    },
    select: {
      isAvailable: true,
    },
  })

  if (availability && !availability.isAvailable) {
    return false
  }

  const occupiedRoom = await tx.gameRoomAssignment.findFirst({
    where: {
      roomId,
      slotId,
      year,
      isOverride: false,
      gameId: excludeGameId
        ? {
            not: excludeGameId,
          }
        : undefined,
    },
    select: {
      id: true,
    },
  })

  return !occupiedRoom
}

export const prepareDefaultRoomAssignment = async ({
  tx,
  gameId,
  roomId,
  slotId,
  year,
}: {
  tx: DefaultRoomAssignmentTx
  gameId: number
  roomId: number
  slotId: number
  year: number
}) => {
  const roomIsAvailable = await getIsRoomAvailable({
    tx,
    roomId,
    slotId,
    year,
    excludeGameId: gameId,
  })

  let displacedGameIds: Array<number> = []
  if (!roomIsAvailable) {
    const displacedAssignments = await tx.gameRoomAssignment.findMany({
      where: {
        roomId,
        slotId,
        year,
        isOverride: false,
        gameId: {
          not: gameId,
        },
      },
      select: {
        gameId: true,
      },
    })
    displacedGameIds = displacedAssignments.map((assignment) => assignment.gameId)

    await tx.gameRoomAssignment.deleteMany({
      where: {
        roomId,
        slotId,
        year,
        isOverride: false,
        gameId: {
          not: gameId,
        },
      },
    })
  }

  await tx.gameRoomAssignment.deleteMany({
    where: {
      gameId,
      slotId,
      year,
      isOverride: false,
      roomId: {
        not: roomId,
      },
    },
  })

  return {
    displacedGameIds,
  }
}
