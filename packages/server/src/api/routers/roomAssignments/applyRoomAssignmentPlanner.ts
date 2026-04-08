import { planInitialRoomAssignments } from './initialPlanner'
import { syncLegacyGameRoomIdsForYear } from './legacyRoomSync'
import { buildPlannerInputFromSnapshot } from './plannerInput'
import { getRoomAssignmentPlannerSnapshot } from './plannerSnapshot'
import type { ApplyRoomAssignmentPlannerInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const applyRoomAssignmentPlanner = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: ApplyRoomAssignmentPlannerInput
}) => {
  const deletedAssignments = await tx.gameRoomAssignment.deleteMany({
    where: input.deleteWhere,
  })

  const plannerData = await getRoomAssignmentPlannerSnapshot({
    tx,
    year: input.year,
  })

  const plannerResult = planInitialRoomAssignments(
    buildPlannerInputFromSnapshot({
      plannerData,
      year: input.year,
      slotId: input.slotId,
    }),
  )

  if (plannerResult.assignments.length > 0) {
    await tx.gameRoomAssignment.createMany({
      data: plannerResult.assignments.map((assignment) => ({
        gameId: assignment.gameId,
        roomId: assignment.roomId,
        slotId: assignment.slotId,
        year: assignment.year,
        isOverride: false,
        source: 'auto',
        assignmentReason: assignment.reason,
        assignedByUserId: input.assignedByUserId,
      })),
      skipDuplicates: true,
    })
  }

  await syncLegacyGameRoomIdsForYear({
    tx,
    year: input.year,
  })

  return {
    deletedAssignments: deletedAssignments.count,
    createdAssignments: plannerResult.assignments.length,
    assignments: plannerResult.assignments,
    skippedGames: plannerResult.skippedGames,
    unmetConstraints: plannerResult.unmetConstraints,
    scope: input.slotId ? 'slot' : 'year',
    slotId: input.slotId ?? null,
  }
}
