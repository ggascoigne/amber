import { syncLegacyGameRoomIdsForYear } from './legacyRoomSync'
import type { ResetRoomAssignmentsInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const resetRoomAssignments = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: ResetRoomAssignmentsInput
}) => {
  const deletedRoomAssignments = await tx.gameRoomAssignment.deleteMany({
    where: {
      year: input.year,
      source: input.mode === 'auto_only' ? 'auto' : undefined,
    },
  })

  await syncLegacyGameRoomIdsForYear({
    tx,
    year: input.year,
  })

  return {
    deleted: deletedRoomAssignments.count,
  }
}
