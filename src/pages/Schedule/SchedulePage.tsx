import Button from '@material-ui/core/Button'
import { GameAssignmentNode, useGetScheduleQuery } from 'client'
import { stripIndents } from 'common-tags'
import React, { createRef, useEffect, useMemo, useState } from 'react'
import {
  GqlType,
  ICalEvent,
  SettingValue,
  buildUrl,
  getGameAssignments,
  getSlotTimes,
  notEmpty,
  useForceLogin,
  useGetMemberShip,
  useGetSettingValue,
  useUser,
} from 'utils'

import { HasPermission, Perms, useAuth } from '../../components/Auth'
import { GameCard } from '../../components/GameCard'
import { GraphQLError } from '../../components/GraphQLError'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'

interface GameSummaryProps {
  gas: GameAssignmentNode
}

type GameAndAssignment = GqlType<GameAssignmentNode, ['game']>

const getGmsAndPlayers = (game: GameAndAssignment) => {
  const details = game.gameAssignments.nodes.map((g) => ({
    gm: g?.gm ?? 0,
    fullName: g?.member?.user?.fullName ?? '',
    email: g?.member?.user?.email ?? '',
  }))

  const gms = details.filter((d) => d.gm > 0).sort((a, b) => a.gm - b.gm)
  const players = details.filter((d) => d.gm === 0).sort((a, b) => -b.fullName.localeCompare(a.fullName))

  return {
    gms,
    players,
  }
}

const GameSummary: React.FC<GameSummaryProps> = ({ gas }) => {
  const game = gas.game
  if (!game) return null

  const { gms, players } = getGmsAndPlayers(game)

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

const getIcalUrl = (schedule: GameAssignmentNode[]) =>
  buildUrl(
    schedule
      .map((gas) => {
        const game = gas.game
        if (!game || game.id < 8) return null

        const slotId = game.slotId!
        const [start, end] = getSlotTimes(gas.year)[slotId - 1]
        const gameUrl = `${window.location.origin}/game-book/${gas.year}/${slotId}#${game.id}`
        const { gms, players } = getGmsAndPlayers(game)
        const gmNames = gms.map((p) => p.fullName)
        const playerNames = players.map((p) => p.fullName)

        const description = stripIndents`
          Game Master:
          ${gmNames.join(', ')}

          Players:
          ${playerNames.join(', ')}

          Description:
          ${game.description}...

          ${gameUrl}`

        const ice: ICalEvent = {
          title: `Slot ${game.slotId!} - ${game.name}`,
          description,
          startTime: start,
          endTime: end,
          url: gameUrl,
        }
        return ice
      })
      .filter(notEmpty)
  )

export const ICalDownloadButton: React.FC<{ url: string | null; filename: string }> = ({ url, filename, children }) => {
  const link = createRef<any>()
  const handleAction = async () => {
    link.current.download = filename
    link.current.href = url
    link.current.click()
  }

  return (
    <>
      <Button onClick={handleAction} color='primary' variant='outlined'>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
        <a role='button' ref={link} />
        {children}
      </Button>
    </>
  )
}

const SchedulePage: React.FC = () => {
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

  const { error, data } = useGetScheduleQuery(
    {
      memberId,
    },
    {
      enabled: !!membership,
    }
  )

  const gamesAndAssignments = useMemo(() => getGameAssignments(data, memberId, gmOnly), [data, gmOnly, memberId])

  const exportUrl = useMemo(() => getIcalUrl(gamesAndAssignments), [gamesAndAssignments])

  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  return (
    <Page title='Schedule'>
      <HasPermission permission={Perms.IsAdmin}>
        <Button variant='contained' onClick={() => setShowGmPreviewOverride((old) => !old)}>
          {showGmPreviewOverride ? 'Show Full Schedule' : 'Show GM Preview'}
        </Button>
        <br />
      </HasPermission>
      <ICalDownloadButton url={exportUrl} filename='acnw-schedule.ics'>
        Export Schedule
      </ICalDownloadButton>
      {gmOnly ? <h3>GM Preview</h3> : null}
      {gamesAndAssignments.map((g) => (
        <GameSummary key={g.gameId} gas={g} />
      ))}
    </Page>
  )
}

export default SchedulePage
