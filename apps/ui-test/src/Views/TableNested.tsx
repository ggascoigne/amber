import { useCallback, useRef, useState } from 'react'

import type { TableAutocompleteOption, TableEditOption, TableEditRowUpdate } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import { Typography } from '@mui/material'
import type { Row } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import { Page } from '@/Components'

type AssignmentRow = {
  id: string
  memberId: number | null
  role: 'GM' | 'Player'
}

type GameRow = {
  id: number
  slot: string
  title: string
  assignments: Array<AssignmentRow>
}

const memberOptions: Array<TableAutocompleteOption> = [
  { value: 1, label: 'Alex Admin' },
  { value: 2, label: 'Casey Coordinator' },
  { value: 3, label: 'Bailey Builder' },
  { value: 4, label: 'Drew Doe' },
]

const memberNameById = new Map(memberOptions.map((option) => [Number(option.value), option.label]))

const roleOptions: Array<TableEditOption> = [
  { value: 'GM', label: 'GM' },
  { value: 'Player', label: 'Player' },
]

const columnHelper = createColumnHelper<GameRow>()
const assignmentColumnHelper = createColumnHelper<AssignmentRow>()

const gameColumns = [
  columnHelper.accessor('slot', {
    header: 'Slot',
    size: 80,
  }),
  columnHelper.accessor('title', {
    header: 'Game',
    size: 220,
  }),
  columnHelper.accessor((row) => row.assignments.length, {
    id: 'assignedCount',
    header: 'Assigned',
    size: 100,
    meta: { align: 'right' as const },
  }),
]

const assignmentColumns = [
  assignmentColumnHelper.accessor('memberId', {
    header: 'Member',
    cell: ({ getValue }) => memberNameById.get(Number(getValue())) ?? 'Unassigned',
    meta: {
      edit: {
        type: 'autocomplete',
        placeholder: 'Member',
        autocomplete: {
          options: memberOptions,
        },
        setValue: (row, value) => ({
          ...row,
          memberId: value === null || value === undefined || value === '' ? null : Number(value),
        }),
      },
    },
  }),
  assignmentColumnHelper.accessor('role', {
    header: 'Role',
    meta: {
      edit: {
        type: 'select',
        options: roleOptions,
      },
    },
  }),
]

const initialGames: Array<GameRow> = [
  {
    id: 1,
    slot: 'Slot 1',
    title: 'Ashen Courts',
    assignments: [
      { id: 'a-1', memberId: 1, role: 'GM' },
      { id: 'a-2', memberId: 2, role: 'Player' },
    ],
  },
  {
    id: 2,
    slot: 'Slot 2',
    title: 'Signal Fire',
    assignments: [{ id: 'b-1', memberId: 3, role: 'GM' }],
  },
]

export const TableNested = () => {
  const [games, setGames] = useState<Array<GameRow>>(initialGames)
  const draftIdRef = useRef(0)
  const assignmentIdRef = useRef(100)

  const updateAssignments = useCallback(
    (gameId: number, updater: (rows: Array<AssignmentRow>) => Array<AssignmentRow>) => {
      setGames((prev) =>
        prev.map((game) => (game.id === gameId ? { ...game, assignments: updater(game.assignments) } : game)),
      )
    },
    [],
  )

  const buildAssignmentSave = useCallback(
    (gameId: number) => async (updates: Array<TableEditRowUpdate<AssignmentRow>>) => {
      const updateById = new Map(updates.map((update) => [update.updated.id, update.updated]))
      updateAssignments(gameId, (rows) => rows.map((row) => updateById.get(row.id) ?? row))
    },
    [updateAssignments],
  )

  const buildAssignmentAdd = useCallback(
    (gameId: number) => async (row: AssignmentRow) => {
      const nextId = `assign-${assignmentIdRef.current++}`
      updateAssignments(gameId, (rows) => [...rows, { ...row, id: nextId }])
    },
    [updateAssignments],
  )

  const renderExpandedContent = useCallback(
    (row: Row<GameRow>) => {
      const { id: gameId, assignments } = row.original
      const editingConfig = {
        enabled: true,
        onSave: buildAssignmentSave(gameId),
        addRow: {
          enabled: true,
          createRow: () => ({
            id: `new-${draftIdRef.current++}`,
            memberId: null,
            role: 'Player' as const,
          }),
          onAddRow: buildAssignmentAdd(gameId),
          isNewRow: (assignment: AssignmentRow) => assignment.id.startsWith('new-'),
        },
      }

      return (
        <Table<AssignmentRow>
          name={`nested-assignments-${gameId}`}
          data={assignments}
          columns={assignmentColumns}
          keyField='id'
          disableStatePersistence
          enableRowSelection={false}
          enableGrouping={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          enableFilters={false}
          displayPagination='never'
          cellEditing={editingConfig}
          systemActions={[]}
          displayGutter={false}
          compact
          elevation={0}
          debug={false}
          sx={{ border: '4px solid', borderColor: 'grey.300' }}
        />
      )
    },
    [buildAssignmentAdd, buildAssignmentSave],
  )

  return (
    <Page title='Table - Nested Rows'>
      <Typography variant='body2' color='text.secondary'>
        Expand a row to edit assignments, add a new assignment, or switch members with autocomplete.
      </Typography>
      <Table<GameRow>
        title='Games'
        name='table-nested-demo'
        data={games}
        columns={gameColumns}
        keyField='id'
        enableRowSelection={false}
        enableGrouping={false}
        renderExpandedContent={renderExpandedContent}
        expandedContentSx={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          borderRight: 'none',
          px: 0,
          py: 0,
        }}
        getRowCanExpand={() => true}
        displayPagination='never'
        debug={false}
      />
    </Page>
  )
}
