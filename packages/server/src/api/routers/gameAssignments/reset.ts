import type { ResetGameAssignmentsInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const resetGameAssignments = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: ResetGameAssignmentsInput
}) => {
  const deleted = await tx.gameAssignment.deleteMany({
    where: {
      year: input.year,
      gm: { gte: 0 },
    },
  })

  return {
    deleted: deleted.count,
  }
}
