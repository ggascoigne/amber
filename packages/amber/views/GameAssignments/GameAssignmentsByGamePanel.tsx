import { useCallback, useMemo, useRef, useState } from 'react'

import type { GameAssignmentDashboardData, UpdateGameAssignmentsInput } from '@amber/client'
import type { TableAutocompleteOption, TableEditRowUpdate, TableRowValidationParams } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { CollapsibleInfoPanel } from './CollapsibleInfoPanel'
import { ShowExpandedToggle } from './ShowExpandedToggle'
import { SlotFilterSelect } from './SlotFilterSelect'
import type { GameAssignmentSummaryRow } from './utils'
import {
  buildAssignmentCountsByGameId,
  buildAssignmentsByGameId,
  buildChoicesByMemberSlot,
  buildMoveOptions,
  filterGamesWithSlotsOrAny,
  formatGameName,
  getChoiceForGame,
  getChoiceRankForGame,
  getPriorityLabel,
  getPrioritySortValue,
  isScheduledAssignment,
} from './utils'

import { PlayerPreference } from '../../utils/selectValues'

type AssignmentUpdate = UpdateGameAssignmentsInput['adds'][number]

type AssignmentUpdatePayload = {
  adds: Array<AssignmentUpdate>
  removes: Array<AssignmentUpdate>
}

type MemberAssignmentCounts = {
  gmOrFirst: number
  second: number
  third: number
  fourth: number
  other: number
}

const buildEmptyMemberAssignmentCounts = (): MemberAssignmentCounts => ({
  gmOrFirst: 0,
  second: 0,
  third: 0,
  fourth: 0,
  other: 0,
})

type GameAssignmentRow = {
  rowId: string
  memberId: number | null
  gameId: number
  slotId: number
  gm: number
  moveToGameId: number
  priorityLabel: string
  prioritySortValue: number
  counts: MemberAssignmentCounts
}

type GameAssignmentsByGamePanelProps = {
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

export const GameAssignmentsByGamePanel = ({
  data,
  year,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  onUpdateAssignments,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameAssignmentsByGamePanelProps) => {
  const [showExpandedOnly, setShowExpandedOnly] = useState(false)
  const draftIdRef = useRef(0)
  const slotGames = useMemo(() => filterGamesWithSlotsOrAny(data.games), [data.games])
  const filteredSlotGames = useMemo(
    () =>
      slotFilterId === null
        ? slotGames
        : slotGames.filter((game) => game.slotId === slotFilterId || game.category === 'any_game'),
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
  const assignmentsByGameId = useMemo(() => buildAssignmentsByGameId(scheduledAssignments), [scheduledAssignments])
  const assignmentCountsByGameId = useMemo(
    () => buildAssignmentCountsByGameId(filteredSlotGames, scheduledAssignments),
    [filteredSlotGames, scheduledAssignments],
  )
  const choicesByMemberSlot = useMemo(() => buildChoicesByMemberSlot(data.choices), [data.choices])
  const memberAssignmentCountsByMemberId = useMemo(() => {
    const countsByMemberId = new Map<number, MemberAssignmentCounts>()
    scheduledAssignments.forEach((assignment) => {
      const counts = countsByMemberId.get(assignment.memberId) ?? buildEmptyMemberAssignmentCounts()
      const rank = getChoiceRankForGame(
        choicesByMemberSlot,
        assignment.memberId,
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
      countsByMemberId.set(assignment.memberId, counts)
    })
    return countsByMemberId
  }, [choicesByMemberSlot, scheduledAssignments])

  const memberOptions = useMemo<Array<TableAutocompleteOption>>(
    () =>
      data.memberships
        .filter((membership) => membership.attending)
        .map((membership) => ({
          value: membership.id,
          label: membership.user.fullName ?? 'Unknown member',
        })),
    [data.memberships],
  )

  const memberNameById = useMemo(
    () => new Map(data.memberships.map((membership) => [membership.id, membership.user.fullName ?? 'Unknown member'])),
    [data.memberships],
  )

  const gameById = useMemo(() => new Map(data.games.map((game) => [game.id, game])), [data.games])

  const gameNameById = useMemo(
    () => new Map(filteredSlotGames.map((game) => [game.id, formatGameName(game)])),
    [filteredSlotGames],
  )

  const gameRows = useMemo<Array<GameAssignmentSummaryRow>>(
    () =>
      filteredSlotGames.map((game) => {
        const counts = assignmentCountsByGameId.get(game.id)
        return {
          gameId: game.id,
          slotId: game.slotId ?? 0,
          name: formatGameName(game),
          playerMin: game.playerMin,
          playerMax: game.playerMax,
          assignedCount: counts?.assignedCount ?? 0,
          overrun: counts?.overrun ?? 0,
          shortfall: counts?.shortfall ?? game.playerMin,
          spaces: counts?.spaces ?? Math.max(0, game.playerMax),
        }
      }),
    [assignmentCountsByGameId, filteredSlotGames],
  )

  const gameColumns = useMemo<Array<ColumnDef<GameAssignmentSummaryRow>>>(
    () => [
      {
        accessorKey: 'slotId',
        header: 'Slot',
        size: 70,
      },
      {
        accessorKey: 'name',
        header: 'Game',
        size: 260,
      },
      {
        accessorKey: 'overrun',
        header: 'Overrun',
        size: 100,
        cell: ({ getValue }) => {
          const value = Number(getValue())
          return (
            <Box
              component='span'
              sx={{
                color: value > 0 ? 'error.main' : 'text.primary',
                fontWeight: value > 0 ? 'fontWeightBold' : 'inherit',
              }}
            >
              {value}
            </Box>
          )
        },
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'shortfall',
        header: 'Shortfall',
        size: 100,
        cell: ({ getValue }) => {
          const value = Number(getValue())
          return (
            <Box
              component='span'
              sx={{
                color: value > 0 ? 'error.main' : 'text.primary',
                fontWeight: value > 0 ? 'fontWeightBold' : 'inherit',
              }}
            >
              {value}
            </Box>
          )
        },
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'spaces',
        header: 'Spaces',
        size: 90,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'playerMin',
        header: 'Min',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'playerMax',
        header: 'Max',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'assignedCount',
        header: 'Current',
        size: 85,
        meta: {
          align: 'right',
        },
      },
      {
        id: 'returning',
        header: 'Returning',
        size: 100,
        accessorFn: (row) => {
          const game = filteredSlotGames.find((gameEntry) => gameEntry.id === row.gameId)
          if (game?.playerPreference === PlayerPreference.RetOnly) return 'Only'
          if (game?.playerPreference === PlayerPreference.RetPref) return 'Preferred'
          return ''
        },
      },
    ],
    [filteredSlotGames],
  )

  const assignmentColumns = useMemo<Array<ColumnDef<GameAssignmentRow>>>(
    () => [
      {
        accessorKey: 'memberId',
        header: 'Member',
        size: 220,
        cell: ({ getValue }) => {
          const memberId = Number(getValue())
          return memberNameById.get(memberId) ?? 'Unassigned'
        },
        meta: {
          edit: {
            type: 'autocomplete',
            placeholder: 'Member',
            isEditable: (row) => row.original.rowId.startsWith('new-'),
            autocomplete: {
              options: memberOptions,
            },
            setValue: (row: GameAssignmentRow, value: unknown) => {
              const nextMemberId = value === null || value === undefined || value === '' ? null : Number(value)
              const choice = nextMemberId
                ? getChoiceForGame(choicesByMemberSlot, nextMemberId, row.slotId, row.gameId)
                : null
              const rank = choice?.rank ?? null
              const returningPlayer = choice?.returningPlayer ?? false
              return {
                ...row,
                memberId: nextMemberId,
                priorityLabel: getPriorityLabel(rank, returningPlayer),
                prioritySortValue: getPrioritySortValue(rank, returningPlayer),
                counts: nextMemberId
                  ? (memberAssignmentCountsByMemberId.get(nextMemberId) ?? buildEmptyMemberAssignmentCounts())
                  : buildEmptyMemberAssignmentCounts(),
              }
            },
          },
        },
      },
      {
        accessorKey: 'priorityLabel',
        header: 'Priority',
        size: 110,
        sortingFn: (rowA, rowB) => rowA.original.prioritySortValue - rowB.original.prioritySortValue,
      },
      {
        accessorKey: 'moveToGameId',
        header: 'Move To',
        size: 260,
        cell: ({ getValue, row }) => {
          const gameId = Number(getValue())
          if (row.original.gameId === gameId) return ''
          return gameNameById.get(gameId) ?? 'Unknown game'
        },
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
              const selectOptions = options.map((option) => ({
                value: option.gameId,
                label: option.name,
                columns: [
                  { value: option.name },
                  { value: option.priorityLabel, width: 90 },
                  { value: option.overrunLabel, width: 85, align: 'right' as const },
                  { value: option.shortfallLabel, width: 90, align: 'right' as const },
                  { value: option.spacesLabel, width: 90, align: 'right' as const },
                ],
              }))
              return [headerOption, ...selectOptions]
            },
            parseValue: (value) => (value === '' ? null : Number(value)),
          },
        },
      },
      {
        accessorKey: 'counts.gmOrFirst',
        header: '1st/GM',
        size: 80,
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
    [
      assignmentCountsByGameId,
      choicesByMemberSlot,
      gameNameById,
      memberAssignmentCountsByMemberId,
      memberNameById,
      memberOptions,
      filteredSlotGames,
    ],
  )

  const validateAssignmentRow = useCallback(({ updatedRow }: TableRowValidationParams<GameAssignmentRow>) => {
    if (!updatedRow.memberId) return 'Member is required.'
    return null
  }, [])

  const handleSummaryRowClick = useCallback((row: Row<GameAssignmentSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<GameAssignmentSummaryRow>) => {
      const { gameId, slotId } = row.original
      const assignments = assignmentsByGameId.get(gameId) ?? []
      const expandedGame = gameById.get(gameId)
      const organizerMessage = expandedGame?.message?.trim()
      const assignmentRows = assignments.map((assignment) => {
        const { memberId, gameId: assignedGameId, gm, game } = assignment
        const choice = getChoiceForGame(choicesByMemberSlot, memberId, game?.slotId ?? slotId, assignedGameId)
        const rank = choice?.rank ?? null
        const returningPlayer = choice?.returningPlayer ?? false

        return {
          rowId: `${memberId}-${assignedGameId}-${gm}`,
          memberId,
          gameId: assignedGameId,
          slotId: game?.slotId ?? slotId,
          gm,
          moveToGameId: assignedGameId,
          priorityLabel: getPriorityLabel(rank, returningPlayer),
          prioritySortValue: getPrioritySortValue(rank, returningPlayer),
          counts: memberAssignmentCountsByMemberId.get(memberId) ?? buildEmptyMemberAssignmentCounts(),
        }
      })

      const handleSave = async (updates: Array<TableEditRowUpdate<GameAssignmentRow>>) => {
        const adds: Array<AssignmentUpdate> = []
        const removes: Array<AssignmentUpdate> = []

        updates.forEach((update) => {
          const { original, updated } = update
          const { memberId: originalMemberId, gameId: originalGameId, gm: originalGm } = original
          const { memberId: nextMemberId, moveToGameId: nextGameId } = updated

          if (!nextMemberId || !nextGameId) return

          if (originalMemberId !== nextMemberId || originalGameId !== nextGameId) {
            if (originalMemberId) {
              removes.push({
                memberId: originalMemberId,
                gameId: originalGameId,
                gm: originalGm,
                year,
              })
            }
            adds.push({
              memberId: nextMemberId,
              gameId: nextGameId,
              gm: originalGm,
              year,
            })
          }
        })

        if (adds.length === 0 && removes.length === 0) return
        await onUpdateAssignments({ adds, removes })
      }

      const handleAddRow = async (assignment: GameAssignmentRow) => {
        const { memberId, moveToGameId, gm } = assignment
        if (!memberId) return
        await onUpdateAssignments({
          adds: [
            {
              memberId,
              gameId: moveToGameId,
              gm,
              year,
            },
          ],
          removes: [],
        })
      }

      const editingConfig = {
        enabled: true,
        onSave: handleSave,
        validateRow: validateAssignmentRow,
        addRow: {
          enabled: true,
          createRow: () => ({
            rowId: `new-${draftIdRef.current++}`,
            memberId: null,
            gameId,
            slotId: row.original.slotId,
            gm: 0,
            moveToGameId: gameId,
            priorityLabel: 'Other',
            prioritySortValue: Number.POSITIVE_INFINITY,
            counts: buildEmptyMemberAssignmentCounts(),
          }),
          onAddRow: handleAddRow,
          isNewRow: (assignment: GameAssignmentRow) => assignment.rowId.startsWith('new-'),
        },
      }

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {organizerMessage ? (
            <CollapsibleInfoPanel
              defaultCollapsed
              expandAriaLabel='Expand organizer message'
              collapseAriaLabel='Collapse organizer message'
              toggleVisibility='auto'
              fillContainer
              rootSx={{ px: 2 }}
              collapsedContent={
                <Typography
                  variant='body2'
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                  }}
                >
                  {organizerMessage}
                </Typography>
              }
              expandedContent={
                <Typography
                  variant='body2'
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                >
                  {organizerMessage}
                </Typography>
              }
            />
          ) : null}
          <Table<GameAssignmentRow>
            name={`game-assignments-${gameId}`}
            data={assignmentRows}
            columns={assignmentColumns}
            keyField='rowId'
            disableStatePersistence
            initialState={{ sorting: [{ id: 'priorityLabel', desc: false }] }}
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
            elevation={0}
            debug={false}
            scrollBehavior='none'
            variant='outlined'
            useVirtualRows={false}
          />
        </Box>
      )
    },
    [
      assignmentColumns,
      assignmentsByGameId,
      choicesByMemberSlot,
      gameById,
      memberAssignmentCountsByMemberId,
      onUpdateAssignments,
      validateAssignmentRow,
      year,
    ],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-assignments-by-game-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography id='game-assignments-by-game-title' variant='h6' component='h2'>
          Assignments by Game
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SlotFilterSelect
            slotFilterOptions={slotFilterOptions}
            slotFilterId={slotFilterId}
            onSlotFilterChange={onSlotFilterChange}
          />
          <ShowExpandedToggle checked={showExpandedOnly} onChange={setShowExpandedOnly} />
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
      <Table<GameAssignmentSummaryRow>
        name='game-assignments-by-game'
        data={gameRows}
        columns={gameColumns}
        keyField='gameId'
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
        showExpandedOnly={showExpandedOnly}
        onShowExpandedOnlyChange={setShowExpandedOnly}
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
