import { useCallback, useMemo } from 'react'

import { useInvalidateGameAssignmentQueries, useInvalidateRoomAssignmentQueries, useTRPC } from '@amber/client'
import { Loader } from '@amber/ui'
import { Table } from '@amber/ui/components/Table'
import { Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/router'

import { Page } from '../../components'
import { Perms, useAuth } from '../../components/Auth'
import { Redirect } from '../../components/Navigation'
import { TransportError } from '../../components/TransportError'
import { getGameAssignments, isUserGameCategory, useConfiguration, useGetMemberShip, useUser } from '../../utils'

type ScheduleRoomAssignmentRow = {
  id: number
  gameId: number
  slotId: number
  year: number
  gameName: string
  gmNames: string
}

type ScheduleRoomAssignmentCellProps = {
  gameId: number
  slotId: number
  year: number
  isAdmin: boolean
  invalidateScheduleQuery: () => Promise<unknown>
}

const ScheduleRoomAssignmentCell = ({
  gameId,
  slotId,
  year,
  isAdmin,
  invalidateScheduleQuery,
}: ScheduleRoomAssignmentCellProps) => {
  const trpc = useTRPC()
  const invalidateGameAssignmentQueries = useInvalidateGameAssignmentQueries()
  const invalidateRoomAssignmentQueries = useInvalidateRoomAssignmentQueries()
  const assignGameRoom = useMutation(trpc.roomAssignments.assignGameRoom.mutationOptions())

  const { data: roomAssignmentData, isLoading } = useQuery(
    trpc.roomAssignments.getScheduleRoomAssignmentData.queryOptions({
      gameId,
      year,
    }),
  )

  if (!roomAssignmentData || isLoading) {
    return <Loader tiny />
  }

  const roomOptions = isAdmin
    ? roomAssignmentData.rooms
    : roomAssignmentData.rooms.filter((room) => room.type === 'Guest Room')

  const selectedRoomId = roomAssignmentData.currentAssignment?.roomId ?? null

  return (
    <FormControl size='small' sx={{ minWidth: 280 }}>
      <Select
        value={selectedRoomId ? String(selectedRoomId) : ''}
        displayEmpty
        disabled={assignGameRoom.isPending}
        onChange={(event) => {
          const { value } = event.target
          const nextRoomId = typeof value === 'string' && value ? parseInt(value, 10) : null
          if (!Number.isInteger(nextRoomId) || !nextRoomId || nextRoomId === selectedRoomId) {
            return
          }

          assignGameRoom.mutate(
            {
              gameId,
              roomId: nextRoomId,
              slotId,
              year,
              isOverride: false,
              source: 'manual',
            },
            {
              onSuccess: () =>
                Promise.all([
                  invalidateGameAssignmentQueries(),
                  invalidateRoomAssignmentQueries(),
                  invalidateScheduleQuery(),
                ]).then(() => undefined),
            },
          )
        }}
        inputProps={{
          'aria-label': `Assign room for game ${gameId}`,
        }}
      >
        <MenuItem value='' disabled>
          Select room
        </MenuItem>
        {roomOptions.map((room) => {
          const occupiedByOtherGame = room.occupiedByGameId !== null && room.occupiedByGameId !== gameId
          const roomUnavailable = !room.isAvailable || occupiedByOtherGame
          const disabled = !isAdmin && roomUnavailable

          return (
            <MenuItem key={room.id} value={String(room.id)} disabled={disabled}>
              {room.description}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

type ScheduleGameRoomAssignmentCellProps = {
  row: ScheduleRoomAssignmentRow
  isAdmin: boolean
  invalidateScheduleQuery: () => Promise<unknown>
}

type GameNameWithGmsCellProps = {
  gameName: string
  gmNames: string
}

const GameNameWithGmsCell = ({ gameName, gmNames }: GameNameWithGmsCellProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5 }}>
    <Box component='span'>{gameName}</Box>
    {gmNames ? (
      <Typography component='span' variant='caption' color='text.secondary'>
        ({gmNames})
      </Typography>
    ) : null}
  </Box>
)

const ScheduleGameRoomAssignmentCell = ({
  row,
  isAdmin,
  invalidateScheduleQuery,
}: ScheduleGameRoomAssignmentCellProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      gap: 1.5,
      width: '100%',
    }}
  >
    <Box
      sx={{
        minWidth: 0,
        flex: '1 1 auto',
      }}
    >
      <GameNameWithGmsCell gameName={row.gameName} gmNames={row.gmNames} />
    </Box>
    <Box
      sx={{
        width: { xs: '100%', sm: 'auto' },
        flex: '0 0 auto',
      }}
    >
      <ScheduleRoomAssignmentCell
        gameId={row.gameId}
        slotId={row.slotId}
        year={row.year}
        isAdmin={isAdmin}
        invalidateScheduleQuery={invalidateScheduleQuery}
      />
    </Box>
  </Box>
)

const ScheduleRoomAssignmentsPage = () => {
  const configuration = useConfiguration()
  const { hasPermissions } = useAuth()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const memberId = membership?.id ?? 0
  const isAdmin = hasPermissions(Perms.IsAdmin)

  const { error, data, isLoading, isFetching } = useQuery(
    trpc.gameAssignments.getSchedule.queryOptions(
      {
        memberId,
      },
      {
        enabled: !!membership,
      },
    ),
  )

  const invalidateScheduleQuery = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: trpc.gameAssignments.getSchedule.queryKey({
          memberId,
        }),
        refetchType: 'all',
      }),
    [memberId, queryClient, trpc],
  )

  const rows = useMemo<Array<ScheduleRoomAssignmentRow>>(() => {
    const scheduleGames = getGameAssignments(data, memberId, false)
      .filter((entry) => !!entry.game)
      .filter((entry) => isUserGameCategory(entry.game!.category))

    return scheduleGames
      .map((entry) => {
        const { game } = entry
        if (!game || !game.slotId) {
          return null
        }

        return {
          id: game.id,
          gameId: game.id,
          slotId: game.slotId,
          year: game.year,
          gameName: game.name,
          gmNames: game.gmNames,
        }
      })
      .filter((entry): entry is ScheduleRoomAssignmentRow => !!entry)
  }, [data, memberId])

  const columns = useMemo<Array<ColumnDef<ScheduleRoomAssignmentRow>>>(
    () => [
      {
        accessorKey: 'slotId',
        header: 'Slot',
        meta: {
          align: 'right',
        },
        size: 20,
        minSize: 20,
      },
      {
        id: 'gameRoomAssignment',
        header: 'Game / Room Assignment',
        cell: ({ row }) => (
          <ScheduleGameRoomAssignmentCell
            row={row.original}
            isAdmin={isAdmin}
            invalidateScheduleQuery={invalidateScheduleQuery}
          />
        ),
      },
    ],
    [invalidateScheduleQuery, isAdmin],
  )

  if (!configuration.isAcus) {
    return <Redirect to='/schedule' />
  }

  if (!userId) {
    return <Loader />
  }

  if (membership === undefined) {
    return <Loader />
  }

  if (membership == null || !membership.attending) {
    return <Redirect to='/membership' />
  }

  if (error) {
    return <TransportError error={error} />
  }

  if (!data) {
    return <Loader />
  }

  return (
    <Page title='Assign Room' variant='fill' hideTitle>
      <Table<ScheduleRoomAssignmentRow>
        title='Assign Game Room'
        data={rows}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        enableRowSelection={false}
        enableGrouping={false}
        enableSorting={false}
        disableStatePersistence
        systemActions={[]}
        compact
        displayPagination='never'
        debug={false}
        enableGlobalFilter={false}
        enableColumnFilters={false}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
        <Button
          variant='contained'
          onClick={() => {
            if (window.history.length > 1) {
              router.back()
              return
            }
            router.push('/schedule').catch(() => undefined)
          }}
        >
          OK
        </Button>
      </Box>
    </Page>
  )
}

export default ScheduleRoomAssignmentsPage
