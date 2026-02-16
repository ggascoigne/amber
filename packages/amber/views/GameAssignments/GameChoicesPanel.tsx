import { useCallback, useMemo, useState } from 'react'

import type { GameAssignmentDashboardData, UpsertGameChoiceBySlotInput } from '@amber/client'
import type { TableEditRowUpdate } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { ShowExpandedToggle } from './ShowExpandedToggle'
import { SlotFilterSelect } from './SlotFilterSelect'
import type { MemberChoiceRow } from './utils'
import {
  buildAssignedSlotCountsByMemberId,
  buildChoiceRowsForMember,
  buildChoicesByMemberId,
  buildGameChoiceOptionsForRow,
  buildSubmissionsByMemberId,
  filterGamesWithSlots,
  getGameLabel,
  getPriorityLabel,
  getPrioritySortValue,
  isScheduledAssignment,
} from './utils'

import {
  buildGameCategoryByGameId,
  isAnyGameCategory,
  isNoGameCategory,
  isUserGameCategory,
  useConfiguration,
} from '../../utils'

type GameChoicesPanelProps = {
  data: GameAssignmentDashboardData
  year: number
  onUpsertChoice: (input: UpsertGameChoiceBySlotInput) => Promise<void>
  slotFilterOptions: Array<number>
  slotFilterId: number | null
  onSlotFilterChange: (slotFilterId: number | null) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  scrollBehavior?: 'none' | 'bounded'
}

type MemberChoiceSummaryRow = {
  memberId: number
  memberName: string
  assignments: number
  requiresAttention: boolean
}

export const GameChoicesPanel = ({
  data,
  year,
  onUpsertChoice,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameChoicesPanelProps) => {
  const [showExpandedOnly, setShowExpandedOnly] = useState(false)
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
  const assignedSlotCountsByMemberId = useMemo(
    () => buildAssignedSlotCountsByMemberId(scheduledAssignments),
    [scheduledAssignments],
  )
  const choicesByMemberId = useMemo(() => buildChoicesByMemberId(data.choices), [data.choices])
  const submissionsByMemberId = useMemo(() => buildSubmissionsByMemberId(data.submissions), [data.submissions])
  const gameById = useMemo(() => new Map(data.games.map((game) => [game.id, game])), [data.games])
  const gameCategoryByGameId = useMemo(() => buildGameCategoryByGameId(data.games), [data.games])

  const memberRows = useMemo<Array<MemberChoiceSummaryRow>>(
    () =>
      data.memberships
        .filter((membership) => membership.attending)
        .map((membership) => {
          const memberChoices = choicesByMemberId.get(membership.id) ?? []
          const slotIdsWithChoices = new Set(memberChoices.map((choice) => choice.slotId))
          const hasChoicesForAllSlots = slotIdsWithChoices.size >= configuration.numberOfSlots
          const submission = submissionsByMemberId.get(membership.id)
          const hasSubmissionEntry = Boolean(submission)
          const hasNotes = Boolean(submission?.message?.trim())
          return {
            memberId: membership.id,
            memberName: `${membership.user.fullName ?? 'Unknown member'}${hasNotes ? ' *' : ''}`,
            assignments: assignedSlotCountsByMemberId.get(membership.id) ?? 0,
            requiresAttention: !hasChoicesForAllSlots || !hasSubmissionEntry,
          }
        }),
    [
      assignedSlotCountsByMemberId,
      choicesByMemberId,
      configuration.numberOfSlots,
      data.memberships,
      submissionsByMemberId,
    ],
  )

  const memberColumns = useMemo<Array<ColumnDef<MemberChoiceSummaryRow>>>(
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
    ],
    [],
  )

  const handleSummaryRowClick = useCallback((row: Row<MemberChoiceSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<MemberChoiceSummaryRow>) => {
      const { memberId } = row.original
      const choices = choicesByMemberId.get(memberId) ?? []
      const gmGameIdBySlotId = new Map<number, number>()
      data.assignments.forEach((assignment) => {
        if (assignment.memberId !== memberId || assignment.gm === 0) return
        const assignmentGame = assignment.game
        const assignmentGameSlotId = assignmentGame?.slotId ?? 0
        if (!assignmentGame || assignmentGameSlotId <= 0 || !isUserGameCategory(assignmentGame.category)) return
        if (gmGameIdBySlotId.has(assignmentGameSlotId)) return
        gmGameIdBySlotId.set(assignmentGameSlotId, assignment.gameId)
      })
      const filteredChoices = choices.filter((choice) => {
        if (!choice.gameId) return true
        const category = gameCategoryByGameId.get(choice.gameId)
        if (isNoGameCategory(category) || isAnyGameCategory(category)) return true
        return slotGameIdSet.has(choice.gameId)
      })
      const submission = submissionsByMemberId.get(memberId)
      const choiceRows = buildChoiceRowsForMember({
        memberId,
        choices: filteredChoices,
        configuration,
        gmGameIdBySlotId,
        slotIds: slotFilterId ? [slotFilterId] : undefined,
      })
      const slotRowsBySlotId = choiceRows.reduce((rowsBySlotId: Map<number, Array<MemberChoiceRow>>, choiceRow) => {
        const slotRows = rowsBySlotId.get(choiceRow.slotId) ?? []
        slotRows.push(choiceRow)
        rowsBySlotId.set(choiceRow.slotId, slotRows)
        return rowsBySlotId
      }, new Map<number, Array<MemberChoiceRow>>())
      const previousRowIdByRowId = Array.from(slotRowsBySlotId.values()).reduce(
        (result: Map<string, string>, slotRows) => {
          slotRows.forEach((slotRow, rowIndex) => {
            if (rowIndex <= 0) return
            const previousRow = slotRows[rowIndex - 1]
            result.set(slotRow.rowId, previousRow.rowId)
          })
          return result
        },
        new Map<string, string>(),
      )
      const choiceColumns: Array<ColumnDef<MemberChoiceRow>> = [
        {
          accessorKey: 'slotLabel',
          header: 'Slot',
          size: 90,
        },
        {
          accessorKey: 'rankLabel',
          header: 'Priority',
          size: 110,
          sortingFn: (rowA, rowB) =>
            getPrioritySortValue(rowA.original.rank, rowA.original.returningPlayer) -
            getPrioritySortValue(rowB.original.rank, rowB.original.returningPlayer),
        },
        {
          accessorKey: 'gameId',
          header: 'Game',
          size: 260,
          cell: ({ getValue }) => getGameLabel(getValue<number | null>(), gameById),
          meta: {
            edit: {
              type: 'select',
              isEditable: (choiceRow, context) => {
                const previousRowId = previousRowIdByRowId.get(choiceRow.id)
                if (!previousRowId) return true
                const previousRow = context.table.getRowModel().rowsById[previousRowId]
                if (!previousRow) return false
                const previousGameId = context.getValue(previousRow, 'gameId')
                if (previousGameId === null) return false
                const previousGameCategory = gameCategoryByGameId.get(Number(previousGameId))
                if (isNoGameCategory(previousGameCategory) || isAnyGameCategory(previousGameCategory)) return false
                return true
              },
              getOptions: (choiceRow) => {
                const options = buildGameChoiceOptionsForRow({
                  games: data.games,
                  slotId: choiceRow.original.slotId,
                  rank: choiceRow.original.rank,
                  gmGameId: gmGameIdBySlotId.get(choiceRow.original.slotId),
                })
                return [...options, { value: '', label: 'No Selection' }]
              },
              parseValue: (value) => (value === '' ? null : Number(value)),
              setValue: (choiceRow, value) => {
                const gameId = value === null || value === undefined || value === '' ? null : Number(value)
                const isFirstChoice = choiceRow.rank === 0 || choiceRow.rank === 1
                if (!isFirstChoice) {
                  return {
                    ...choiceRow,
                    gameId,
                  }
                }
                const gmGameId = gmGameIdBySlotId.get(choiceRow.slotId) ?? null
                const nextRank = gameId !== null && gmGameId !== null && gameId === gmGameId ? 0 : 1
                return {
                  ...choiceRow,
                  gameId,
                  rank: nextRank,
                  rankLabel: getPriorityLabel(nextRank, choiceRow.returningPlayer),
                }
              },
            },
          },
        },
      ]

      const handleSave = async (updates: Array<TableEditRowUpdate<MemberChoiceRow>>) => {
        await Promise.all(
          updates.flatMap((update) => {
            const { memberId: updatedMemberId, slotId, rank, gameId, returningPlayer } = update.updated
            const upserts: Array<Promise<void>> = [
              onUpsertChoice({
                memberId: updatedMemberId,
                year,
                slotId,
                rank,
                gameId,
                returningPlayer,
              }),
            ]
            if (update.original.rank !== rank) {
              upserts.push(
                onUpsertChoice({
                  memberId: updatedMemberId,
                  year,
                  slotId,
                  rank: update.original.rank,
                  gameId: null,
                  returningPlayer: update.original.returningPlayer,
                }),
              )
            }
            return upserts
          }),
        )
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
            <Table<MemberChoiceRow>
              name={`member-choices-${memberId}`}
              data={choiceRows}
              columns={choiceColumns}
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
      choicesByMemberId,
      configuration,
      data.assignments,
      data.games,
      gameCategoryByGameId,
      gameById,
      onUpsertChoice,
      slotFilterId,
      slotGameIdSet,
      submissionsByMemberId,
      year,
    ],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-choices-panel-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography id='game-choices-panel-title' variant='h6' component='h2'>
          Member Choices
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
      <Table<MemberChoiceSummaryRow>
        name='game-choices-by-member'
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
