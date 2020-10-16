import { GetScheduleQuery, useGetScheduleQuery } from 'client'
import { GameCard, GraphQLError, Loader, Page } from 'components/Acnw'
import React from 'react'
import { PropType, SettingValue, UnpackArray, useGetMemberShip, useGetSettingValue, useUser } from 'utils'

type G = NonNullable<UnpackArray<PropType<GetScheduleQuery, 'gameAssignments'>>>
type GameAssignmentNode = NonNullable<UnpackArray<PropType<G, 'nodes'>>>

type GameSummary = {
  gas: GameAssignmentNode
}
const GameSummary: React.FC<GameSummary> = ({ gas }) => {
  const game = gas.game
  if (!game) return null

  const details = game.gameAssignments?.nodes.map((g) => ({
    gm: g?.gm ?? 0,
    fullName: g?.member?.user?.fullName ?? '',
    email: g?.member?.user?.email ?? '',
  }))

  const gms = details.filter((d) => d.gm > 0).sort((a, b) => a.gm - b.gm)
  const players = details.filter((d) => d.gm === 0).sort((a, b) => -b.fullName.localeCompare(a.fullName))

  return (
    <GameCard
      key={`game_${game.id}`}
      year={gas.year}
      slot={game.slotId!}
      game={game}
      schedule
      gms={gms}
      players={players}
    />
  )
}

export const SchedulePage: React.FC = () => {
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const memberId = membership?.id ?? 0
  const displayScheduleValue = useGetSettingValue('display.schedule')
  const gmOnly = displayScheduleValue === SettingValue.GM

  const { loading, error, data } = useGetScheduleQuery({
    variables: { memberId },
    skip: !membership,
  })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading) {
    return <Loader />
  }

  const gamesAndAssignments: GameAssignmentNode[] = (data?.gameAssignments?.nodes
    ?.concat()
    // drop games with zero players/gms
    .filter((g) => (g?.game?.gameAssignments?.nodes?.length ?? 0) > 0)
    // is showing only GMs then drop all games where the user isn't the GM
    .filter((g) =>
      gmOnly ? g?.game?.gameAssignments?.nodes?.find((g1) => (g1?.gm ?? 0) > 0 && g1?.memberId === memberId) : true
    )
    .sort((a, b) => (a?.game?.slotId ?? 0) - (b?.game?.slotId ?? 0)) ?? []) as GameAssignmentNode[]

  return (
    <Page>
      {gmOnly ? <h3>GM Preview</h3> : null}
      {gamesAndAssignments.map((g) => (
        <GameSummary key={g?.gameId} gas={g} />
      ))}
    </Page>
  )
}
