import { TRPCError } from '@trpc/server'

import { syncLegacyGameRoomId } from './legacyRoomSync'
import type { RemoveGameRoomAssignmentInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const removeGameRoomAssignment = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: RemoveGameRoomAssignmentInput
}) => {
  const assignment = await tx.gameRoomAssignment.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      gameId: true,
      year: true,
    },
  })

  if (!assignment) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Room assignment not found' })
  }

  await tx.gameRoomAssignment.delete({
    where: {
      id: input.id,
    },
  })

  await syncLegacyGameRoomId({
    tx,
    gameId: assignment.gameId,
    year: assignment.year,
  })

  return {
    deletedRoomAssignmentId: assignment.id,
  }
}
