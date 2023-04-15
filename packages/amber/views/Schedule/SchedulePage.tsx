import React, { createRef, PropsWithChildren, useMemo, useState } from 'react'

import { Box, useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { stripIndents } from 'common-tags'
import SHA from 'sha.js'
import { GqlType, GraphQLError, Loader, notEmpty, Page } from 'ui'

import { GameAssignmentNode, useGetScheduleQuery } from '../../client'
import { HasPermission, Perms, useAuth } from '../../components/Auth'
import { GameCard } from '../../components/GameCard'
import { GameDecorator } from '../../components/types'
import {
  buildUrl,
  Configuration,
  getGameAssignments,
  getSlotDescription,
  getSlotTimes,
  ICalEvent,
  isMorningSlot,
  SettingValue,
  SlotFormat,
  useConfiguration,
  useGetMemberShip,
  useGetSettingValue,
  useUser,
} from '../../utils'

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

const RoomDisplay = ({ game, year }: GameDecorator) => {
  const configuration = useConfiguration()
  const theme = useTheme()
  const small = !useMediaQuery(theme.breakpoints.up('sm'))

  const isVirtual = configuration.startDates[year].virtual
  const [s] = getSlotTimes(configuration, year)[game.slotId! - 1]

  const startString =
    isMorningSlot(game.slotId!) && game.lateStart && game.lateStart !== 'Starts on time' ? game.lateStart : ''
  const re = /Starts at (?<hour>\d\d)\.(?<minutes>\d\d) .?m/.exec(startString ?? '')
  const h = re?.groups?.hour ? parseInt(re?.groups?.hour, 10) : s.hour
  const m = re?.groups?.minutes ? parseInt(re?.groups?.minutes, 10) : s.minute
  const lateStart = s.set({ hour: h, minute: m })
  const slotDescription = getSlotDescription(configuration, {
    year,
    slot: game.slotId!,
    local: configuration.virtual,
    altFormat: isVirtual ? SlotFormat.ALT_SHORT : small ? SlotFormat.TINY : SlotFormat.SHORT_NO_TZ,
    lateStart,
  })

  const hasRoomDescription = !!(game?.room?.description ? game.room.description.trim().length > 0 : false)

  return (
    <Box
      sx={{
        display: 'flex',
        mt: small ? -2 : undefined,
      }}
    >
      <Box
        sx={{
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'row',
        }}
      />
      <h5>
        {hasRoomDescription ? (
          <>
            {slotDescription} - {game?.room?.description}
          </>
        ) : (
          <>{slotDescription}</>
        )}
      </h5>
    </Box>
  )
}

const GameSummary: React.FC<GameSummaryProps> = ({ gas }) => {
  const { game } = gas
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
      decorator={RoomDisplay}
    />
  )
}

const getIcalUrl = (configuration: Configuration, schedule: GameAssignmentNode[]) =>
  buildUrl(
    configuration.abbr,
    schedule
      .map((gas) => {
        const { game } = gas
        if (!game || game.id < 8) return null

        const slotId = game.slotId!
        const [start, end] = getSlotTimes(configuration, gas.year)[slotId - 1]
        const gameUrl = `${window.location.origin}/game-book/${gas.year}/${slotId}#${game.id}`
        const { gms, players } = getGmsAndPlayers(game)
        const gmNames = gms.map((p) => `${p.fullName} (${p.email})`)
        const playerNames = players.map((p) => `${p.fullName} (${p.email})`)
        const uid = SHA('sha256').update(gameUrl).digest('hex')

        const description = stripIndents`
          Game Master:
          ${gmNames.join('\n')}

          Players:
          ${playerNames.join('\n')}

          Description:
          ${game.description}...

          ${gameUrl}`

        const ice: ICalEvent = {
          title: `Slot ${game.slotId!} - ${game.name}`,
          description,
          startTime: start,
          endTime: end,
          url: gameUrl,
          uid,
        }
        return ice
      })
      .filter(notEmpty)
  )

export const ICalDownloadButton: React.FC<PropsWithChildren<{ url: string | null; filename: string }>> = ({
  url,
  filename,
  children,
}) => {
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
  const configuration = useConfiguration()
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const memberId = membership?.id ?? 0
  const displayScheduleValue = useGetSettingValue('display.schedule')
  const [showGmPreviewOverride, setShowGmPreviewOverride] = useState(false)
  const gmOnly = isAdmin ? showGmPreviewOverride : displayScheduleValue === SettingValue.GM

  const { error, data } = useGetScheduleQuery(
    {
      memberId,
    },
    {
      enabled: !!membership,
    }
  )

  const gamesAndAssignments = useMemo(() => getGameAssignments(data, memberId, gmOnly), [data, gmOnly, memberId])

  const exportUrl = useMemo(() => getIcalUrl(configuration, gamesAndAssignments), [configuration, gamesAndAssignments])

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
      <ICalDownloadButton url={exportUrl} filename={`${configuration.name.toLowerCase()}-schedule.ics`}>
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
