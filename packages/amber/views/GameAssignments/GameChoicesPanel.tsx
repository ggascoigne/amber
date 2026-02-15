import { useCallback, useMemo } from 'react'

import type { GameAssignmentDashboardData, UpsertGameChoiceBySlotInput } from '@amber/client'
import type { TableEditRowUpdate } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, FormControl, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import type { MemberChoiceRow } from './utils'
import {
  buildChoiceRowsForMember,
  buildChoicesByMemberId,
  buildGameChoiceOptions,
  buildSubmissionsByMemberId,
  filterGamesWithSlots,
  getGameLabel,
  getPrioritySortValue,
} from './utils'

import { useConfiguration } from '../../utils'
import { isAnyGame, isNoGame } from '../GameSignup/GameChoiceSelector'

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
  const configuration = useConfiguration()
  const slotGames = useMemo(() => filterGamesWithSlots(data.games), [data.games])
  const filteredSlotGames = useMemo(
    () => (slotFilterId === null ? slotGames : slotGames.filter((game) => game.slotId === slotFilterId)),
    [slotFilterId, slotGames],
  )
  const slotGameIdSet = useMemo(() => new Set(filteredSlotGames.map((game) => game.id)), [filteredSlotGames])
  const choicesByMemberId = useMemo(() => buildChoicesByMemberId(data.choices), [data.choices])
  const submissionsByMemberId = useMemo(() => buildSubmissionsByMemberId(data.submissions), [data.submissions])
  const gameById = useMemo(() => new Map(filteredSlotGames.map((game) => [game.id, game])), [filteredSlotGames])

  const memberRows = useMemo<Array<MemberChoiceSummaryRow>>(
    () =>
      data.memberships
        .filter((membership) => membership.attending)
        .map((membership) => {
          const submission = submissionsByMemberId.get(membership.id)
          const hasNotes = Boolean(submission?.message?.trim())
          return {
            memberId: membership.id,
            memberName: `${membership.user.fullName ?? 'Unknown member'}${hasNotes ? ' *' : ''}`,
          }
        }),
    [data.memberships, submissionsByMemberId],
  )

  const memberColumns = useMemo<Array<ColumnDef<MemberChoiceSummaryRow>>>(
    () => [
      {
        accessorKey: 'memberName',
        header: 'Member',
        size: 220,
      },
    ],
    [],
  )

  const choiceColumns = useMemo<Array<ColumnDef<MemberChoiceRow>>>(
    () => [
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
        cell: ({ row }) => getGameLabel(configuration, row.original.gameId, gameById),
        meta: {
          edit: {
            type: 'select',
            getOptions: (row) => {
              const options = buildGameChoiceOptions(configuration, slotGames, row.original.slotId)
              return [{ value: '', label: 'No Selection' }, ...options]
            },
            parseValue: (value) => (value === '' ? null : Number(value)),
          },
        },
      },
    ],
    [configuration, gameById, slotGames],
  )

  const handleSummaryRowClick = useCallback((row: Row<MemberChoiceSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<MemberChoiceSummaryRow>) => {
      const { memberId } = row.original
      const choices = choicesByMemberId.get(memberId) ?? []
      const filteredChoices = choices.filter((choice) => {
        if (!choice.gameId) return true
        if (isNoGame(configuration, choice.gameId) || isAnyGame(configuration, choice.gameId)) return true
        return slotGameIdSet.has(choice.gameId)
      })
      const submission = submissionsByMemberId.get(memberId)
      const choiceRows = buildChoiceRowsForMember({
        memberId,
        choices: filteredChoices,
        configuration,
        slotIds: slotFilterId ? [slotFilterId] : undefined,
      })

      const handleSave = async (updates: Array<TableEditRowUpdate<MemberChoiceRow>>) => {
        await Promise.all(
          updates.map((update) => {
            const { memberId: updatedMemberId, slotId, rank, gameId, returningPlayer } = update.updated
            return onUpsertChoice({
              memberId: updatedMemberId,
              year,
              slotId,
              rank,
              gameId,
              returningPlayer,
            })
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
      choiceColumns,
      configuration,
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
          <FormControl sx={{ minWidth: 110 }}>
            <TextField
              select
              size='small'
              variant='standard'
              value={slotFilterId === null ? 'all' : `${slotFilterId}`}
              onChange={(event) => {
                const nextValue = event.target.value
                onSlotFilterChange(nextValue === 'all' ? null : Number(nextValue))
              }}
              aria-label='Slot filter'
            >
              <MenuItem value='all'>All Slots</MenuItem>
              {slotFilterOptions.map((slotValue) => (
                <MenuItem key={slotValue} value={`${slotValue}`}>
                  {`Slot ${slotValue}`}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
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
