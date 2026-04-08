import { getMostRestrictiveAccessibility, type RoomAccessibility } from './domain'
import type { InitialPlannerGame, InitialPlannerParticipant } from './initialPlanner'

export type PlannedGameContext = {
  game: InitialPlannerGame
  participantCount: number
  requiredAccessibility: RoomAccessibility
  gmMemberIds: Array<number>
  playerMemberIds: Array<number>
}

const buildParticipantsByGameId = (participants: Array<InitialPlannerParticipant>) =>
  participants.reduce((accumulator, participant) => {
    const gameParticipants = accumulator.get(participant.gameId) ?? []
    gameParticipants.push(participant)
    accumulator.set(participant.gameId, gameParticipants)
    return accumulator
  }, new Map<number, Array<InitialPlannerParticipant>>())

const buildParticipantAccessibilityPreferences = (participants: Array<InitialPlannerParticipant>) =>
  participants.flatMap((participant) =>
    participant.roomAccessibilityPreference ? [participant.roomAccessibilityPreference] : [],
  )

const buildParticipantMemberIds = ({
  participants,
  isGm,
}: {
  participants: Array<InitialPlannerParticipant>
  isGm: boolean
}) => participants.filter((participant) => participant.isGm === isGm).map((participant) => participant.memberId)

const buildPlannedGameContext = ({
  game,
  participants,
}: {
  game: InitialPlannerGame
  participants: Array<InitialPlannerParticipant>
}): PlannedGameContext => ({
  game,
  participantCount: participants.length,
  requiredAccessibility: getMostRestrictiveAccessibility(buildParticipantAccessibilityPreferences(participants)),
  gmMemberIds: buildParticipantMemberIds({
    participants,
    isGm: true,
  }),
  playerMemberIds: buildParticipantMemberIds({
    participants,
    isGm: false,
  }),
})

const buildPlannableGamesForYear = ({ games, year }: { games: Array<InitialPlannerGame>; year: number }) =>
  games.filter((game) => game.year === year && game.category === 'user')

const groupPlannedGamesBySlotId = (plannedGames: Array<PlannedGameContext>) =>
  plannedGames.reduce((accumulator, plannedGame) => {
    const { slotId } = plannedGame.game
    const slotGames = accumulator.get(slotId) ?? []
    slotGames.push(plannedGame)
    accumulator.set(slotId, slotGames)
    return accumulator
  }, new Map<number, Array<PlannedGameContext>>())

export const buildPlannedGamesBySlotId = ({
  games,
  year,
  participants,
}: {
  games: Array<InitialPlannerGame>
  year: number
  participants: Array<InitialPlannerParticipant>
}) => {
  const participantsByGameId = buildParticipantsByGameId(participants)

  return groupPlannedGamesBySlotId(
    buildPlannableGamesForYear({
      games,
      year,
    }).map((game) =>
      buildPlannedGameContext({
        game,
        participants: participantsByGameId.get(game.id) ?? [],
      }),
    ),
  )
}
