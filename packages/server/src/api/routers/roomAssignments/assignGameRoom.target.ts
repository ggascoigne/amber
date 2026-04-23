import { TRPCError } from '@trpc/server'

import type { AssignGameRoomInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

type AssignGameRoomTargetTx = Pick<TransactionClient, 'game' | 'room'>

type AssignGameRoomTarget = {
  game: {
    id: number
    slotId: number
    year: number
  }
  room: {
    id: number
  }
}

export const getAssignGameRoomTarget = async ({
  tx,
  input,
}: {
  tx: AssignGameRoomTargetTx
  input: AssignGameRoomInput
}): Promise<AssignGameRoomTarget> => {
  const game = await tx.game.findUnique({
    where: {
      id: input.gameId,
    },
    select: {
      id: true,
      year: true,
      slotId: true,
    },
  })
  const room = await tx.room.findUnique({
    where: {
      id: input.roomId,
    },
    select: {
      id: true,
    },
  })

  if (!game || !game.slotId || game.year !== input.year || game.slotId !== input.slotId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Room assignment input did not match game year/slot' })
  }

  if (!room) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' })
  }

  return {
    game: {
      id: game.id,
      slotId: game.slotId,
      year: game.year,
    },
    room,
  }
}
