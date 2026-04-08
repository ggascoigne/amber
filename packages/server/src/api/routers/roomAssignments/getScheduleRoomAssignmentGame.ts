import { TRPCError } from '@trpc/server'

import type { GetScheduleRoomAssignmentDataInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const scheduleGameSelect = {
  id: true,
  name: true,
  slotId: true,
  year: true,
  roomId: true,
  category: true,
}

export type ScheduleRoomAssignmentGame = {
  id: number
  name: string
  slotId: number
  year: number
  roomId: number | null
  category: string
}

export const getScheduleRoomAssignmentGame = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetScheduleRoomAssignmentDataInput
}): Promise<ScheduleRoomAssignmentGame> => {
  const game = await tx.game.findFirst({
    where: {
      id: input.gameId,
      year: input.year,
    },
    select: scheduleGameSelect,
  })

  if (!game || game.slotId === null) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Game not found for year' })
  }

  return {
    ...game,
    slotId: game.slotId,
  }
}
