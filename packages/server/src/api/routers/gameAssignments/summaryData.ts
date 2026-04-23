import type { GetAssignmentSummaryInput } from './schemas'
import { buildGameAssignmentSummary } from './summary'

import type { TransactionClient } from '../../inRlsTransaction'

const assignmentSummaryGameSelect = {
  id: true,
  name: true,
  slotId: true,
  category: true,
  playerMin: true,
  playerMax: true,
}

const assignmentSummaryMembershipSelect = {
  id: true,
  user: {
    select: {
      fullName: true,
      firstName: true,
      lastName: true,
    },
  },
}

export const getGameAssignmentSummary = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetAssignmentSummaryInput
}) => {
  const slots = await tx.slot.findMany({
    select: { id: true },
    orderBy: [{ id: 'asc' }],
  })
  const memberships = await tx.membership.findMany({
    where: { year: input.year, attending: true },
    select: assignmentSummaryMembershipSelect,
    orderBy: [
      {
        user: {
          lastName: 'asc',
        },
      },
      {
        user: {
          firstName: 'asc',
        },
      },
    ],
  })
  const games = await tx.game.findMany({
    where: { year: input.year },
    select: assignmentSummaryGameSelect,
    orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
  })
  const assignments = await tx.gameAssignment.findMany({
    where: { year: input.year, gm: { gte: 0 } },
    select: {
      memberId: true,
      gameId: true,
      gm: true,
      membership: {
        select: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      },
      game: {
        select: assignmentSummaryGameSelect,
      },
    },
  })

  return buildGameAssignmentSummary({
    assignments,
    games,
    memberships,
    slots,
  })
}
