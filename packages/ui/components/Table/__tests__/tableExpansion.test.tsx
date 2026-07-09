/**
 * @vitest-environment jsdom
 */

/* eslint-disable import-x/no-extraneous-dependencies */

import type { ColumnDef } from '@tanstack/react-table'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { TableHarness, installDomMeasurementMocks, renderWithProviders, type PersonRow } from './testUtils'

import { treeLineTypes } from '../content/TreeLines'
import { Table } from '../Table'

type TreePersonRow = PersonRow & {
  children?: Array<TreePersonRow>
}

const treeColumns: Array<ColumnDef<TreePersonRow>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
]

const groupedTreeColumns: Array<ColumnDef<TreePersonRow>> = [
  {
    header: 'Person',
    columns: treeColumns,
  },
]

describe('table expansion', () => {
  beforeEach(() => {
    installDomMeasurementMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('renders expanded content and filters to expanded rows only', async () => {
    renderWithProviders(
      <TableHarness renderExpandedContent={(row) => <div>{row.original.note}</div>} showExpandedSwitch />,
    )

    expect(await screen.findByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()

    fireEvent.click(screen.getAllByTestId('row-expansion-toggle')[0])

    expect(await screen.findByText('alpha details')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: 'Show Expanded' }))

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument()
      expect(screen.queryByText('Beta')).not.toBeInTheDocument()
      expect(screen.getByText('alpha details')).toBeInTheDocument()
    })
  })

  test('keeps wrapper features working together for selection, expansion, and editing', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const rows: Array<PersonRow> = [
      { id: '1', name: 'Alpha', age: 10, note: 'alpha details' },
      { id: '2', name: 'Beta', age: 20, note: 'beta details' },
    ]

    renderWithProviders(
      <TableHarness
        data={rows}
        renderExpandedContent={(row) => <div>{row.original.note}</div>}
        cellEditing={{
          enabled: true,
          onSave,
        }}
      />,
    )

    expect((await screen.findAllByRole('checkbox')).length).toBeGreaterThan(0)

    fireEvent.click(screen.getAllByTestId('row-expansion-toggle')[0])
    expect(await screen.findByText('alpha details')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('cell-1_name'))
    const input = await screen.findByLabelText('Edit Name')
    fireEvent.change(input, { target: { value: 'Alpha Wrapper Edit' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(await screen.findByText('Alpha Wrapper Edit')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  test('renders tree lines for hierarchical rows when tree behavior is enabled', async () => {
    const rows: Array<TreePersonRow> = [
      {
        id: 'root',
        name: 'Root',
        age: 40,
        children: [
          {
            id: 'branch',
            name: 'Branch',
            age: 20,
            children: [{ id: 'leaf', name: 'Leaf', age: 10 }],
          },
          { id: 'last-child', name: 'Last Child', age: 12 },
        ],
      },
    ]

    renderWithProviders(
      <Table<TreePersonRow>
        disableStatePersistence
        data={rows}
        columns={treeColumns}
        keyField='id'
        enableRowSelection={false}
        enableGrouping={false}
        enableTreeBehavior
        getSubRows={(row) => row.children}
        getRowCanExpand={(row) => (row.original.children?.length ?? 0) > 0}
        initialState={{
          expanded: {
            branch: true,
            root: true,
          },
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
          sorting: [],
        }}
        displayPagination='never'
        debug={false}
      />,
    )

    expect(await screen.findByText('Leaf')).toBeInTheDocument()
    expect(screen.getByText('Branch')).toBeInTheDocument()
    expect(screen.getAllByTestId('TreeLineRail').map((rail) => rail.getAttribute('data-tree-line-segments'))).toEqual(
      expect.arrayContaining(['*', '|-', '-']),
    )
  })

  test('renders tree selection inline after tree lines', async () => {
    const rows: Array<TreePersonRow> = [
      {
        id: 'root',
        name: 'Root',
        age: 40,
        children: [
          {
            id: 'branch',
            name: 'Branch',
            age: 20,
            children: [{ id: 'leaf', name: 'Leaf', age: 10 }],
          },
          { id: 'last-child', name: 'Last Child', age: 12 },
        ],
      },
    ]

    renderWithProviders(
      <Table<TreePersonRow>
        disableStatePersistence
        data={rows}
        columns={treeColumns}
        keyField='id'
        enableRowSelection
        enableGrouping={false}
        enableTreeBehavior
        getSubRows={(row) => row.children}
        getRowCanExpand={(row) => (row.original.children?.length ?? 0) > 0}
        initialState={{
          expanded: {
            branch: true,
            root: true,
          },
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
          sorting: [],
        }}
        displayPagination='never'
        debug={false}
      />,
    )

    const branchCell = await screen.findByTestId('cell-branch_name')
    const rail = branchCell.querySelector('[data-testid="TreeLineRail"]')
    const checkbox = within(branchCell).getByRole('checkbox')
    const textContent = within(branchCell).getByText('Branch').closest('[data-testid="content"]')
    const orderedTreeCellElements = Array.from(
      branchCell.querySelectorAll('[data-testid="TreeLineRail"], input[type="checkbox"], [data-testid="content"]'),
    )

    expect(screen.queryByTestId('header-_selector')).not.toBeInTheDocument()
    expect(rail).not.toBeNull()
    expect(orderedTreeCellElements).toEqual([rail, checkbox, textContent])
  })

  test('renders one inline tree select-all checkbox for grouped headers', async () => {
    const rows: Array<TreePersonRow> = [
      {
        id: 'root',
        name: 'Root',
        age: 40,
        children: [{ id: 'branch', name: 'Branch', age: 20 }],
      },
    ]

    renderWithProviders(
      <Table<TreePersonRow>
        disableStatePersistence
        data={rows}
        columns={groupedTreeColumns}
        keyField='id'
        enableRowSelection
        enableGrouping={false}
        enableTreeBehavior
        getSubRows={(row) => row.children}
        getRowCanExpand={(row) => (row.original.children?.length ?? 0) > 0}
        initialState={{
          expanded: {
            root: true,
          },
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
          sorting: [],
        }}
        displayPagination='never'
        debug={false}
      />,
    )

    expect(await screen.findByText('Branch')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').filter((header) => within(header).queryByRole('checkbox')).length).toBe(
      1,
    )
  })

  test('recalculates tree lines when sorting changes sibling order', async () => {
    const rows: Array<TreePersonRow> = [
      {
        id: 'root',
        name: 'Root',
        age: 40,
        children: [
          { id: 'bravo', name: 'Bravo', age: 20 },
          { id: 'alpha', name: 'Alpha', age: 10 },
        ],
      },
    ]
    const getTreeLineSegments = (rowId: string) =>
      screen
        .getByTestId(`cell-${rowId}_name`)
        .querySelector('[data-testid="TreeLineRail"]')
        ?.getAttribute('data-tree-line-segments')

    renderWithProviders(
      <Table<TreePersonRow>
        disableStatePersistence
        data={rows}
        columns={treeColumns}
        keyField='id'
        enableRowSelection={false}
        enableGrouping={false}
        enableTreeBehavior
        getSubRows={(row) => row.children}
        getRowCanExpand={(row) => (row.original.children?.length ?? 0) > 0}
        initialState={{
          expanded: {
            root: true,
          },
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
          sorting: [],
        }}
        displayPagination='never'
        debug={false}
      />,
    )

    expect(await screen.findByText('Bravo')).toBeInTheDocument()
    expect(getTreeLineSegments('bravo')).toBe(treeLineTypes.middleCorner)

    fireEvent.click(within(screen.getByTestId('header-name')).getByTestId('toggle-sort-button'))

    await waitFor(() => {
      expect(getTreeLineSegments('bravo')).toBe(treeLineTypes.lastCorner)
    })
  })

  test('toggles tree expansion on the first click', async () => {
    const rows: Array<TreePersonRow> = [
      {
        id: 'root',
        name: 'Root',
        age: 40,
        children: [
          {
            id: 'branch',
            name: 'Branch',
            age: 20,
            children: [{ id: 'leaf', name: 'Leaf', age: 10 }],
          },
        ],
      },
    ]

    renderWithProviders(
      <Table<TreePersonRow>
        disableStatePersistence
        data={rows}
        columns={treeColumns}
        keyField='id'
        enableRowSelection={false}
        enableGrouping={false}
        enableTreeBehavior
        getSubRows={(row) => row.children}
        getRowCanExpand={(row) => (row.original.children?.length ?? 0) > 0}
        initialState={{
          expanded: {
            branch: true,
            root: true,
          },
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
          sorting: [],
        }}
        displayPagination='never'
        debug={false}
      />,
    )

    expect(await screen.findByText('Leaf')).toBeInTheDocument()

    fireEvent.click(within(screen.getByTestId('cell-branch_name')).getByRole('button', { name: 'Collapse row' }))

    expect(screen.queryByText('Leaf')).not.toBeInTheDocument()
    expect(within(screen.getByTestId('cell-branch_name')).getByRole('button', { name: 'Expand row' })).toBeVisible()
  })
})
