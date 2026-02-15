import { useCallback, useMemo } from 'react'

import type { GameAssignmentDashboardData, UpdateGameAssignmentsInput } from '@amber/client'
import type { TableEditRowUpdate } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { SlotFilterSelect } from './SlotFilterSelect'
import type { MemberAssignmentSummaryRow } from './utils'
import {
  buildAssignedSlotCountsByMemberId,
  buildAssignmentCountsByGameId,
  buildAssignmentsByMemberId,
  buildChoicesByMemberSlot,
  buildMoveOptions,
  buildSubmissionsByMemberId,
  formatGameName,
  filterGamesWithSlots,
  getChoiceForGame,
  getChoiceRankForGame,
  getPriorityLabel,
  getPrioritySortValue,
  isScheduledAssignment,
} from './utils'

import { useConfiguration } from '../../utils'

type AssignmentUpdate = UpdateGameAssignmentsInput['adds'][number]

type AssignmentUpdatePayload = {
  adds: Array<AssignmentUpdate>
  removes: Array<AssignmentUpdate>
}

type MemberSlotRow = {
  rowId: string
  memberId: number
  slotId: number
  slotLabel: string
  gameId: number | null
  gameName: string
  gm: number
  priorityLabel: string
  prioritySortValue: number
}

type GameAssignmentsByMemberPanelProps = {
  data: GameAssignmentDashboardData
  year: number
  slotFilterOptions: Array<number>
  slotFilterId: number | null
  onSlotFilterChange: (slotFilterId: number | null) => void
  onUpdateAssignments: (payload: AssignmentUpdatePayload) => Promise<void>
  isExpanded?: boolean
  onToggleExpand?: () => void
  scrollBehavior?: 'none' | 'bounded'
}

export const GameAssignmentsByMemberPanel = ({
  data,
  year,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  onUpdateAssignments,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameAssignmentsByMemberPanelProps) => {
  const configuration = useConfiguration()
  const slotGames = useMemo(() => filterGamesWithSlots(data.games), [data.games])
  const filteredSlotGames = useMemo(
    () => (slotFilterId === null ? slotGames : slotGames.filter((game) => game.slotId === slotFilterId)),
    [slotFilterId, slotGames],
  )
  const slotGameIdSet = useMemo(() => new Set(filteredSlotGames.map((game) => game.id)), [filteredSlotGames])
  const scheduledAssignments = useMemo(
    () =>
      data.assignments.filter(
        (assignment) => isScheduledAssignment(assignment) && slotGameIdSet.has(assignment.gameId),
      ),
    [data.assignments, slotGameIdSet],
  )
  const assignmentsByMemberId = useMemo(() => buildAssignmentsByMemberId(scheduledAssignments), [scheduledAssignments])
  const assignedSlotCountsByMemberId = useMemo(
    () => buildAssignedSlotCountsByMemberId(scheduledAssignments),
    [scheduledAssignments],
  )
  const assignmentCountsByGameId = useMemo(
    () => buildAssignmentCountsByGameId(filteredSlotGames, scheduledAssignments),
    [filteredSlotGames, scheduledAssignments],
  )
  const choicesByMemberSlot = useMemo(() => buildChoicesByMemberSlot(data.choices), [data.choices])
  const submissionsByMemberId = useMemo(() => buildSubmissionsByMemberId(data.submissions), [data.submissions])

  const gameById = useMemo(() => new Map(filteredSlotGames.map((game) => [game.id, game])), [filteredSlotGames])

  const memberRows = useMemo<Array<MemberAssignmentSummaryRow>>(
    () =>
      data.memberships
        .filter((membership) => membership.attending)
        .map((membership) => {
          const submission = submissionsByMemberId.get(membership.id)
          const hasSubmissionEntry = Boolean(submission)
          const slotIdsWithChoices = choicesByMemberSlot.get(membership.id)
          const hasChoicesForAllSlots = (slotIdsWithChoices?.size ?? 0) >= configuration.numberOfSlots
          const hasNotes = Boolean(submission?.message?.trim())
          const assignments = assignmentsByMemberId.get(membership.id) ?? []
          const counts = {
            gmOrFirst: 0,
            second: 0,
            third: 0,
            fourth: 0,
            other: 0,
          }

          assignments.forEach((assignment) => {
            const rank = getChoiceRankForGame(
              choicesByMemberSlot,
              membership.id,
              assignment.game?.slotId ?? 0,
              assignment.gameId,
            )
            if (rank === 0 || rank === 1) {
              counts.gmOrFirst += 1
            } else if (rank === 2) {
              counts.second += 1
            } else if (rank === 3) {
              counts.third += 1
            } else if (rank === 4) {
              counts.fourth += 1
            } else {
              counts.other += 1
            }
          })

          return {
            memberId: membership.id,
            memberName: `${membership.user.fullName ?? 'Unknown member'}${hasNotes ? ' *' : ''}`,
            assignments: assignedSlotCountsByMemberId.get(membership.id) ?? 0,
            requiresAttention: !hasChoicesForAllSlots || !hasSubmissionEntry,
            counts,
          }
        }),
    [
      assignedSlotCountsByMemberId,
      assignmentsByMemberId,
      choicesByMemberSlot,
      configuration.numberOfSlots,
      data.memberships,
      submissionsByMemberId,
    ],
  )

  const memberColumns = useMemo<Array<ColumnDef<MemberAssignmentSummaryRow>>>(
    () => [
      {
        accessorKey: 'memberName',
        header: 'Member',
        size: 220,
        cell: ({ row }) => (
          <Box
            component='span'
            sx={{
              color: row.original.requiresAttention ? 'error.main' : 'text.primary',
            }}
          >
            {row.original.memberName}
          </Box>
        ),
      },
      {
        accessorKey: 'assignments',
        header: 'Assignments',
        size: 110,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.gmOrFirst',
        header: '1st/GM',
        size: 90,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.second',
        header: '2nd',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.third',
        header: '3rd',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.fourth',
        header: '4th',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.other',
        header: 'Other',
        size: 80,
        meta: {
          align: 'right',
        },
      },
    ],
    [],
  )

  const slotColumns = useMemo<Array<ColumnDef<MemberSlotRow>>>(
    () => [
      {
        accessorKey: 'slotLabel',
        header: 'Slot',
        size: 90,
      },
      {
        accessorKey: 'gameId',
        header: 'Move To',
        size: 260,
        cell: ({ row }) => row.original.gameName,
        meta: {
          edit: {
            type: 'select',
            getOptions: (row) => {
              const options = buildMoveOptions({
                games: filteredSlotGames,
                assignmentCountsByGameId,
                choicesByMemberSlot,
                memberId: row.original.memberId,
                slotId: row.original.slotId,
              })

              const headerOption = {
                label: 'Headers',
                value: '__header__',
                isHeader: true,
                columns: [
                  { value: 'Game' },
                  { value: 'Priority', width: 90, align: 'right' as const },
                  { value: 'Overrun', width: 85, align: 'right' as const },
                  { value: 'Shortfall', width: 90, align: 'right' as const },
                  { value: 'Spaces', width: 90, align: 'right' as const },
                ],
              }

              return [
                headerOption,
                {
                  value: '',
                  label: 'No Game',
                  columns: [
                    { value: 'No Game' },
                    { value: '', width: 90 },
                    { value: '', width: 85 },
                    { value: '', width: 90 },
                    { value: '', width: 90 },
                  ],
                },
                ...options.map((option) => ({
                  value: option.gameId,
                  label: option.name,
                  columns: [
                    { value: option.name },
                    { value: option.priorityLabel, width: 90 },
                    { value: option.overrunLabel, width: 85, align: 'right' as const },
                    { value: option.shortfallLabel, width: 90, align: 'right' as const },
                    { value: option.spacesLabel, width: 90, align: 'right' as const },
                  ],
                })),
              ]
            },
            parseValue: (value) => (value === '' ? null : Number(value)),
            setValue: (row: MemberSlotRow, value: unknown) => {
              const gameId = value === null || value === undefined || value === '' ? null : Number(value)
              const game = gameId ? gameById.get(gameId) : null
              const choice = gameId ? getChoiceForGame(choicesByMemberSlot, row.memberId, row.slotId, gameId) : null
              return {
                ...row,
                gameId,
                gameName: game ? formatGameName(game) : 'No Game',
                priorityLabel: gameId ? getPriorityLabel(choice?.rank ?? null, choice?.returningPlayer ?? false) : '',
                prioritySortValue: gameId
                  ? getPrioritySortValue(choice?.rank ?? null, choice?.returningPlayer ?? false)
                  : Number.POSITIVE_INFINITY,
              }
            },
          },
        },
      },
      {
        accessorKey: 'priorityLabel',
        header: 'Priority',
        size: 120,
        sortingFn: (rowA, rowB) => rowA.original.prioritySortValue - rowB.original.prioritySortValue,
      },
    ],
    [assignmentCountsByGameId, choicesByMemberSlot, filteredSlotGames, gameById],
  )

  const handleSummaryRowClick = useCallback((row: Row<MemberAssignmentSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<MemberAssignmentSummaryRow>) => {
      const { memberId } = row.original
      const submission = submissionsByMemberId.get(memberId)
      const assignments = assignmentsByMemberId.get(memberId) ?? []
      const assignmentBySlot = new Map<number, (typeof assignments)[number]>()

      assignments.forEach((assignment) => {
        const slotId = assignment.game?.slotId
        if (!slotId) return
        assignmentBySlot.set(slotId, assignment)
      })

      const slotRows: Array<MemberSlotRow> = []
      const slotsToShow = slotFilterId
        ? [slotFilterId]
        : Array.from(
            { length: configuration.numberOfSlots },
            (_unusedValue: undefined, slotIndex: number) => slotIndex + 1,
          )

      slotsToShow.forEach((slotId) => {
        const assignment = assignmentBySlot.get(slotId)
        const gameId = assignment?.gameId ?? null
        const gameName = assignment?.gameId ? formatGameName(gameById.get(assignment.gameId)) : 'No Game'
        const gm = assignment?.gm ?? 0
        const choice = assignment ? getChoiceForGame(choicesByMemberSlot, memberId, slotId, assignment.gameId) : null

        slotRows.push({
          rowId: `member-${memberId}-slot-${slotId}`,
          memberId,
          slotId,
          slotLabel: `Slot ${slotId}`,
          gameId,
          gameName,
          gm,
          priorityLabel: assignment ? getPriorityLabel(choice?.rank ?? null, choice?.returningPlayer ?? false) : '',
          prioritySortValue: assignment
            ? getPrioritySortValue(choice?.rank ?? null, choice?.returningPlayer ?? false)
            : Number.POSITIVE_INFINITY,
        })
      })

      const handleSave = async (updates: Array<TableEditRowUpdate<MemberSlotRow>>) => {
        const adds: Array<AssignmentUpdate> = []
        const removes: Array<AssignmentUpdate> = []

        updates.forEach((update) => {
          const { original, updated } = update
          const { memberId: originalMemberId, gameId: originalGameId, gm: originalGm } = original
          const { memberId: updatedMemberId, gameId: updatedGameId, gm: updatedGm } = updated

          if (originalGameId === updatedGameId) return

          if (originalGameId) {
            removes.push({
              memberId: originalMemberId,
              gameId: originalGameId,
              gm: originalGm,
              year,
            })
          }

          if (updatedGameId) {
            adds.push({
              memberId: updatedMemberId,
              gameId: updatedGameId,
              gm: updatedGm ?? 0,
              year,
            })
          }
        })

        if (adds.length === 0 && removes.length === 0) return
        await onUpdateAssignments({ adds, removes })
      }

      const editingConfig = {
        enabled: true,
        onSave: handleSave,
      }

      const message = submission?.message

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Table<MemberSlotRow>
              name={`member-assignments-${memberId}`}
              data={slotRows}
              columns={slotColumns}
              keyField='rowId'
              disableStatePersistence
              enablePagination={false}
              enableRowSelection={false}
              enableGrouping={false}
              enableColumnFilters={false}
              enableGlobalFilter={false}
              enableFilters={false}
              displayPagination='never'
              cellEditing={editingConfig}
              systemActions={[]}
              toolbarActions={[]}
              displayGutter={false}
              compact
              variant='outlined'
              debug={false}
              scrollBehavior='none'
              useVirtualRows={false}
            />
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              flexShrink: 0,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography variant='subtitle2' component='h3'>
              Signup Notes
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {message ?? 'No submission message.'}
            </Typography>
          </Box>
        </Box>
      )
    },
    [
      assignmentsByMemberId,
      choicesByMemberSlot,
      configuration.numberOfSlots,
      gameById,
      onUpdateAssignments,
      slotFilterId,
      submissionsByMemberId,
      year,
      slotColumns,
    ],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-assignments-by-member-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography id='game-assignments-by-member-title' variant='h6' component='h2'>
          Assignments by Member
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SlotFilterSelect
            slotFilterOptions={slotFilterOptions}
            slotFilterId={slotFilterId}
            onSlotFilterChange={onSlotFilterChange}
          />
          {onToggleExpand ? (
            <IconButton
              aria-label={isExpanded ? 'Exit full view' : 'Expand panel'}
              onClick={onToggleExpand}
              size='small'
            >
              {isExpanded ? <CloseFullscreenIcon fontSize='small' /> : <OpenInFullIcon fontSize='small' />}
            </IconButton>
          ) : null}
        </Box>
      </Box>
      <Table<MemberAssignmentSummaryRow>
        name='game-assignments-by-member'
        data={memberRows}
        columns={memberColumns}
        keyField='memberId'
        onRowClick={handleSummaryRowClick}
        enablePagination={false}
        enableRowSelection={false}
        enableGrouping={false}
        enableColumnFilters={false}
        enableGlobalFilter={false}
        enableFilters={false}
        displayPagination='never'
        renderExpandedContent={renderExpandedContent}
        expandedContentSx={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          borderRight: 'none',
          px: 0,
          py: 0,
        }}
        getRowCanExpand={() => true}
        scrollBehavior={scrollBehavior}
        debug={false}
        systemActions={[]}
        toolbarActions={[]}
        sx={{ flex: 1 }}
        variant='outlined'
      />
    </Box>
  )
}
