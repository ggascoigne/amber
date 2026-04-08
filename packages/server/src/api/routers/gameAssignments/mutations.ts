import type { CreateGameAssignmentInput, DeleteGameAssignmentInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const createGameAssignmentRecord = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: CreateGameAssignmentInput
}) =>
  tx.gameAssignment
    .create({
      data: input,
    })
    .then((gameAssignment) => ({ gameAssignment }))

export const deleteGameAssignmentRecord = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: DeleteGameAssignmentInput
}) =>
  tx.gameAssignment
    .delete({
      where: {
        memberId_gameId_gm_year: {
          memberId: input.memberId,
          gameId: input.gameId,
          gm: input.gm,
          year: input.year,
        },
      },
    })
    .then(() => ({}))
