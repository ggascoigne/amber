import type { DashboardAssignment } from './types'

export const buildChoiceKey = (choice: { memberId: number; slotId: number; rank: number; year: number }) =>
  `${choice.memberId}-${choice.slotId}-${choice.rank}-${choice.year}`

const buildAssignmentKey = (assignment: { memberId: number; gameId: number; gm: number; year: number }) =>
  `${assignment.memberId}-${assignment.gameId}-${assignment.gm}-${assignment.year}`

export const buildAssignmentKeyFromInput = (assignment: {
  memberId: number
  gameId: number
  gm: number
  year: number
}) => buildAssignmentKey(assignment)

export const buildAssignmentKeyFromRecord = (assignment: DashboardAssignment) =>
  buildAssignmentKey({
    memberId: assignment.memberId,
    gameId: assignment.gameId,
    gm: assignment.gm,
    year: assignment.year,
  })
