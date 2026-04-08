import type { GameAssignmentDashboardData, UpdateGameAssignmentsInput } from '@amber/client'

import { buildAssignmentKeyFromInput, buildAssignmentKeyFromRecord, buildChoiceKey } from './utils'

export type DashboardAssignmentUpdate = UpdateGameAssignmentsInput['adds'][number]

export type DashboardAssignmentUpdatePayload = {
  adds: Array<DashboardAssignmentUpdate>
  removes: Array<DashboardAssignmentUpdate>
}

type DashboardChoiceMutationRecord = Omit<GameAssignmentDashboardData['choices'][number], 'membership' | 'game'>
type DashboardMembershipReference = GameAssignmentDashboardData['assignments'][number]['membership']
type DashboardGameReference = GameAssignmentDashboardData['assignments'][number]['game']

const buildDashboardMembershipReference = (
  membership: GameAssignmentDashboardData['memberships'][number],
): DashboardMembershipReference => ({
  id: membership.id,
  user: {
    fullName: membership.user.fullName,
  },
})

const buildDashboardGameReference = (game: GameAssignmentDashboardData['games'][number]): DashboardGameReference => ({
  category: game.category,
  id: game.id,
  name: game.name,
  slotId: game.slotId,
})

export const applyAssignmentUpdatesToDashboardData = ({
  previous,
  payload,
}: {
  previous: GameAssignmentDashboardData | null
  payload: DashboardAssignmentUpdatePayload
}) => {
  if (!previous) return previous

  const removeKeys = new Set(payload.removes.map((assignment) => buildAssignmentKeyFromInput(assignment)))
  const nextAssignments = previous.assignments.filter(
    (assignment) => !removeKeys.has(buildAssignmentKeyFromRecord(assignment)),
  )
  const membershipsById = new Map(previous.memberships.map((membership) => [membership.id, membership]))
  const gamesById = new Map(previous.games.map((game) => [game.id, game]))
  const assignmentMap = new Map(
    nextAssignments.map((assignment) => [buildAssignmentKeyFromRecord(assignment), assignment]),
  )

  payload.adds.forEach((assignment) => {
    const membership = membershipsById.get(assignment.memberId)
    const game = gamesById.get(assignment.gameId)
    if (!membership || !game) return

    assignmentMap.set(buildAssignmentKeyFromInput(assignment), {
      memberId: assignment.memberId,
      gameId: assignment.gameId,
      gm: assignment.gm,
      year: assignment.year,
      membership: buildDashboardMembershipReference(membership),
      game: buildDashboardGameReference(game),
    })
  })

  return {
    ...previous,
    assignments: Array.from(assignmentMap.values()),
  }
}

export const applyUpsertedChoiceToDashboardData = ({
  previous,
  gameChoice,
}: {
  previous: GameAssignmentDashboardData | null
  gameChoice: DashboardChoiceMutationRecord
}) => {
  if (!previous) return previous

  const membershipsById = new Map(previous.memberships.map((membership) => [membership.id, membership]))
  const gamesById = new Map(previous.games.map((game) => [game.id, game]))
  const membership = membershipsById.get(gameChoice.memberId)
  if (!membership) return previous

  const game = gameChoice.gameId ? (gamesById.get(gameChoice.gameId) ?? null) : null
  const nextChoice = {
    ...gameChoice,
    membership: buildDashboardMembershipReference(membership),
    game: game ? buildDashboardGameReference(game) : null,
  }
  const filteredChoices = previous.choices.filter((choice) => buildChoiceKey(choice) !== buildChoiceKey(gameChoice))

  return {
    ...previous,
    choices: [...filteredChoices, nextChoice],
  }
}
