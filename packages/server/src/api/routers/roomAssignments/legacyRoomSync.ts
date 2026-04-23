type LegacyRoomSyncTx = {
  game: {
    findMany: (args: { where: { year: number }; select: { id: true } }) => Promise<Array<{ id: number }>>
    updateMany: (args: { where: { id: number; year: number }; data: { roomId: number | null } }) => Promise<unknown>
  }
  gameRoomAssignment: {
    findFirst: (args: {
      where: { gameId: number; year: number; isOverride: boolean }
      select: { roomId: true }
      orderBy: { id: 'asc' }
    }) => Promise<{ roomId: number | null } | null>
    findMany: (args: {
      where: { gameId: number; year: number; isOverride: boolean }
      select: { roomId: true }
      orderBy: { id: 'asc' }
      take: 2
    }) => Promise<Array<{ roomId: number | null }>>
  }
}

const getLegacyRoomIdForGame = async ({
  tx,
  gameId,
  year,
}: {
  tx: LegacyRoomSyncTx
  gameId: number
  year: number
}): Promise<number | null> => {
  const overrideAssignment = await tx.gameRoomAssignment.findFirst({
    where: {
      gameId,
      year,
      isOverride: true,
    },
    select: {
      roomId: true,
    },
    orderBy: {
      id: 'asc',
    },
  })

  if (overrideAssignment?.roomId) {
    return overrideAssignment.roomId
  }

  const defaultAssignments = await tx.gameRoomAssignment.findMany({
    where: {
      gameId,
      year,
      isOverride: false,
    },
    select: {
      roomId: true,
    },
    orderBy: {
      id: 'asc',
    },
    take: 2,
  })

  return defaultAssignments.length === 1 ? (defaultAssignments[0]?.roomId ?? null) : null
}

export const syncLegacyGameRoomId = async ({
  tx,
  gameId,
  year,
}: {
  tx: LegacyRoomSyncTx
  gameId: number
  year: number
}) => {
  const roomId = await getLegacyRoomIdForGame({
    tx,
    gameId,
    year,
  })

  await tx.game.updateMany({
    where: {
      id: gameId,
      year,
    },
    data: {
      roomId,
    },
  })
}

export const syncLegacyGameRoomIdsForYear = async ({ tx, year }: { tx: LegacyRoomSyncTx; year: number }) => {
  const games = await tx.game.findMany({
    where: {
      year,
    },
    select: {
      id: true,
    },
  })

  await games.reduce(async (previousSync, game) => {
    await previousSync
    await syncLegacyGameRoomId({
      tx,
      gameId: game.id,
      year,
    })
  }, Promise.resolve())
}
