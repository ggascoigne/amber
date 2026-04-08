import { buildInitialGameAssignments } from './initial'
import type { SetInitialGameAssignmentsInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const initialAssignmentGameSelect = {
  id: true,
  slotId: true,
  category: true,
}

const initialAssignmentSelect = {
  memberId: true,
  gameId: true,
  gm: true,
}

const initialChoiceSelect = {
  memberId: true,
  gameId: true,
  slotId: true,
}

export const setInitialGameAssignments = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: SetInitialGameAssignmentsInput
}) => {
  const [games, assignments, choices] = await Promise.all([
    tx.game.findMany({
      where: { year: input.year },
      select: initialAssignmentGameSelect,
    }),
    tx.gameAssignment.findMany({
      where: { year: input.year },
      select: initialAssignmentSelect,
    }),
    tx.gameChoice.findMany({
      where: { year: input.year, rank: 1, gameId: { not: null } },
      select: initialChoiceSelect,
    }),
  ])

  const adds = buildInitialGameAssignments({
    assignments,
    choices,
    games,
    year: input.year,
  })

  if (adds.length === 0) {
    return {
      created: 0,
    }
  }

  const created = await tx.gameAssignment.createMany({
    data: adds,
    skipDuplicates: true,
  })

  return {
    created: created.count,
  }
}
