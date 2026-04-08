import type {
  GetGameAssignmentsByGameIdInput,
  GetGameAssignmentsByMemberIdInput,
  GetGameAssignmentsByYearInput,
  IsGameMasterInput,
} from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const getGameAssignmentsByYear = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetGameAssignmentsByYearInput
}) =>
  tx.gameAssignment.findMany({
    where: { year: input.year },
  })

export const getGameAssignmentsByGameId = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetGameAssignmentsByGameIdInput
}) =>
  tx.gameAssignment.findMany({
    where: { gameId: input.gameId },
  })

export const getGameAssignmentsByMemberId = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetGameAssignmentsByMemberIdInput
}) =>
  tx.gameAssignment.findMany({
    where: { memberId: input.memberId },
  })

export const isGameMaster = async ({ tx, input }: { tx: TransactionClient; input: IsGameMasterInput }) => {
  const gameAssignments = await tx.gameAssignment.findMany({
    where: {
      gm: { not: 0 },
      membership: {
        userId: input.userId,
        year: input.year,
      },
    },
  })

  return gameAssignments.length > 0
}
