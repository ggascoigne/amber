import Button from '@material-ui/core/Button'
import { GameAssignmentNode, useGetScheduleQuery } from 'client'
import { GameCard, GraphQLError, Loader, Page } from 'components/Acnw'
import React, { useEffect, useState } from 'react'
import { SettingValue, useGetMemberShip, useGetSettingValue, useUser } from 'utils'

import { useAuth } from '../../components/Acnw/Auth/Auth0'
import { HasPermission } from '../../components/Acnw/Auth/HasPermission'
import { Perms } from '../../components/Acnw/Auth/PermissionRules'
import { getGameAssignments } from '../../utils/gameAssignment'
import { useForceLogin } from '../../utils/useForceLogin'

type GameSummaryProps = {
  gas: GameAssignmentNode
}
const GameSummary: React.FC<GameSummaryProps> = ({ gas }) => {
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
  const forceLogin = useForceLogin()
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const memberId = membership?.id ?? 0
  const displayScheduleValue = useGetSettingValue('display.schedule')
  const [showGmPreviewOverride, setShowGmPreviewOverride] = useState(false)
  const gmOnly = isAdmin ? showGmPreviewOverride : displayScheduleValue === SettingValue.GM

  useEffect(() => {
    const f = async () => await forceLogin({ appState: { targetUrl: '/schedule' } })
    f().then()
  }, [forceLogin])

  const { error, data } = useGetScheduleQuery({
    variables: { memberId },
    skip: !membership,
    fetchPolicy: 'cache-and-network',
  })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const gamesAndAssignments = getGameAssignments(data, memberId, gmOnly)

  return (
    <Page>
      <HasPermission permission={Perms.IsAdmin}>
        <Button variant='contained' onClick={() => setShowGmPreviewOverride((old) => !old)}>
          {showGmPreviewOverride ? 'Show Full Schedule' : 'Show GM Preview'}
        </Button>
      </HasPermission>
      {gmOnly ? <h3>GM Preview</h3> : null}
      {gamesAndAssignments.map((g) => (
        <GameSummary key={g?.gameId} gas={g} />
      ))}
    </Page>
  )
}
