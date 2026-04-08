import type { GameAssignmentDataInput, UpdateGameAssignmentsInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const buildGameAssignmentTarget = ({ assignment, year }: { assignment: GameAssignmentDataInput; year: number }) => ({
  memberId: assignment.memberId,
  gameId: assignment.gameId,
  gm: assignment.gm,
  year,
})

export const updateGameAssignments = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpdateGameAssignmentsInput
}) => {
  const deleteTargets = input.removes.map((assignment) =>
    buildGameAssignmentTarget({
      assignment,
      year: input.year,
    }),
  )

  const createTargets = input.adds.map((assignment) =>
    buildGameAssignmentTarget({
      assignment,
      year: input.year,
    }),
  )

  const deleted = deleteTargets.length
    ? await tx.gameAssignment.deleteMany({
        where: {
          OR: deleteTargets,
        },
      })
    : { count: 0 }

  const created = createTargets.length
    ? await tx.gameAssignment.createMany({
        data: createTargets,
        skipDuplicates: true,
      })
    : { count: 0 }

  return {
    deleted: deleted.count,
    created: created.count,
  }
}
