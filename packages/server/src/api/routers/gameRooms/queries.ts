import type { GetGameRoomAndGamesInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const gameRoomSummarySelect = {
  id: true,
  description: true,
  size: true,
  type: true,
  enabled: true,
  updated: true,
  accessibility: true,
}

const buildGameRoomAndGamesSelect = (input: GetGameRoomAndGamesInput) => ({
  id: true,
  description: true,
  game: {
    where: input.year ? { year: input.year } : {},
    orderBy: { slotId: 'asc' as const },
    select: {
      id: true,
      name: true,
      slotId: true,
      gmNames: true,
    },
  },
})

export const getGameRooms = ({ tx }: { tx: TransactionClient }) =>
  tx.room.findMany({
    select: gameRoomSummarySelect,
  })

export const getGameRoomAndGames = ({ tx, input }: { tx: TransactionClient; input: GetGameRoomAndGamesInput }) =>
  tx.room.findMany({
    select: buildGameRoomAndGamesSelect(input),
  })
