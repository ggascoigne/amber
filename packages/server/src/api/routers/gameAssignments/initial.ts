type InitialAssignmentGame = {
  category: string
  id: number
  slotId: number | null
}

type InitialAssignment = {
  gameId: number
  gm: number
  memberId: number
}

type InitialAssignmentChoice = {
  gameId: number | null
  memberId: number
  slotId: number
}

type InitialAssignmentCreateInput = {
  gameId: number
  gm: number
  memberId: number
  year: number
}

const buildAssignmentKey = (memberId: number, gameId: number) => `${memberId}-${gameId}`

const buildGameById = (games: Array<InitialAssignmentGame>) => new Map(games.map((game) => [game.id, game]))

const buildScheduledUserGameIds = (games: Array<InitialAssignmentGame>) =>
  new Set(games.filter((game) => game.category === 'user' && (game.slotId ?? 0) > 0).map((game) => game.id))

const buildNoGameIdBySlotId = (games: Array<InitialAssignmentGame>) =>
  new Map(
    games
      .filter((game) => game.category === 'no_game' && (game.slotId ?? 0) > 0)
      .map((game) => [game.slotId as number, game.id]),
  )

const buildScheduledAssignmentKeys = (assignments: Array<InitialAssignment>) =>
  new Set(
    assignments
      .filter((assignment) => assignment.gm >= 0)
      .map((assignment) => buildAssignmentKey(assignment.memberId, assignment.gameId)),
  )

const buildGmOfferKeys = (assignments: Array<InitialAssignment>) =>
  new Set(
    assignments
      .filter((assignment) => assignment.gm < 0)
      .map((assignment) => buildAssignmentKey(assignment.memberId, assignment.gameId)),
  )

const resolveChoiceGameId = ({
  choice,
  gameById,
  noGameIdBySlotId,
  scheduledUserGameIds,
}: {
  choice: InitialAssignmentChoice
  gameById: Map<number, InitialAssignmentGame>
  noGameIdBySlotId: Map<number, number>
  scheduledUserGameIds: Set<number>
}) => {
  if (choice.gameId === null) {
    return null
  }

  const selectedGame = gameById.get(choice.gameId)
  if (!selectedGame) {
    return null
  }

  if (selectedGame.category === 'any_game') {
    return null
  }

  if (selectedGame.category === 'no_game') {
    return noGameIdBySlotId.get(choice.slotId) ?? null
  }

  return scheduledUserGameIds.has(selectedGame.id) ? selectedGame.id : null
}

export const buildInitialGameAssignments = ({
  assignments,
  choices,
  games,
  year,
}: {
  assignments: Array<InitialAssignment>
  choices: Array<InitialAssignmentChoice>
  games: Array<InitialAssignmentGame>
  year: number
}): Array<InitialAssignmentCreateInput> => {
  const gameById = buildGameById(games)
  const scheduledUserGameIds = buildScheduledUserGameIds(games)
  const noGameIdBySlotId = buildNoGameIdBySlotId(games)
  const scheduledAssignmentKeys = buildScheduledAssignmentKeys(assignments)
  const gmOfferKeys = buildGmOfferKeys(assignments)

  const gmAdds = assignments
    .filter((assignment) => {
      if (assignment.gm >= 0) {
        return false
      }

      const assignmentGame = gameById.get(assignment.gameId)
      if (!assignmentGame) {
        return false
      }

      return assignmentGame.category === 'user' && scheduledUserGameIds.has(assignment.gameId)
    })
    .filter((assignment) => !scheduledAssignmentKeys.has(buildAssignmentKey(assignment.memberId, assignment.gameId)))
    .map((assignment) => ({
      memberId: assignment.memberId,
      gameId: assignment.gameId,
      gm: Math.abs(assignment.gm),
      year,
    }))

  const firstChoiceAdds = choices
    .map((choice) => {
      const resolvedGameId = resolveChoiceGameId({
        choice,
        gameById,
        noGameIdBySlotId,
        scheduledUserGameIds,
      })

      return resolvedGameId === null
        ? null
        : {
            memberId: choice.memberId,
            gameId: resolvedGameId,
          }
    })
    .filter(
      (choice): choice is { memberId: number; gameId: number } =>
        !!choice && !scheduledAssignmentKeys.has(buildAssignmentKey(choice.memberId, choice.gameId)),
    )
    .filter((choice) => !gmOfferKeys.has(buildAssignmentKey(choice.memberId, choice.gameId)))
    .map((choice) => ({
      memberId: choice.memberId,
      gameId: choice.gameId,
      gm: 0,
      year,
    }))

  return [...gmAdds, ...firstChoiceAdds]
}
