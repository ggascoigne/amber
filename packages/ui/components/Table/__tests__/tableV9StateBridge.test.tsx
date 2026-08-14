/**
 * @vitest-environment jsdom
 */

/* eslint-disable import-x/no-extraneous-dependencies */

import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { installDomMeasurementMocks, renderWithProviders, TableHarness } from './testUtils'

import type { ColumnDef, TableQueryState, TableState } from '../tableTypes'
import type { PersonRow } from './testUtils'

describe('TanStack Table v9 state bridge', () => {
  beforeEach(() => {
    installDomMeasurementMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('publishes complete state and resets pagination when global filtering changes', async () => {
    const handleStateChange = vi.fn<(state: TableState) => void>()

    renderWithProviders(
      <TableHarness
        data={[
          { id: '1', name: 'Alpha', age: 10 },
          { id: '2', name: 'Beta', age: 20 },
          { id: '3', name: 'Gamma', age: 30 },
        ]}
        handleStateChange={handleStateChange}
        initialState={{
          pagination: {
            pageIndex: 1,
            pageSize: 1,
          },
        }}
      />,
    )

    await waitFor(() => {
      expect(handleStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: { pageIndex: 1, pageSize: 1 },
          globalFilter: undefined,
          sorting: expect.any(Array),
        }),
      )
    })

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Beta' } })

    await waitFor(() => {
      expect(handleStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          pagination: { pageIndex: 0, pageSize: 1 },
          globalFilter: 'Beta',
        }),
      )
    })
  })

  test('publishes query state only when a query-relevant slice changes', async () => {
    const onQueryStateChange = vi.fn<(state: TableQueryState) => void>()

    renderWithProviders(<TableHarness onQueryStateChange={onQueryStateChange} />)

    await waitFor(() => {
      expect(onQueryStateChange).toHaveBeenCalledTimes(1)
      expect(onQueryStateChange).toHaveBeenLastCalledWith({
        pagination: { pageIndex: 0, pageSize: 100 },
        sorting: [{ id: 'name', desc: false }],
        columnFilters: [],
        globalFilter: undefined,
      })
    })

    const queryNotificationCount = onQueryStateChange.mock.calls.length
    fireEvent.click(screen.getAllByRole('checkbox')[1])

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 300)
    })
    expect(onQueryStateChange).toHaveBeenCalledTimes(queryNotificationCount)

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Beta' } })

    await waitFor(() => {
      expect(onQueryStateChange).toHaveBeenCalledTimes(queryNotificationCount + 1)
      expect(onQueryStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          globalFilter: 'Beta',
        }),
      )
    })
  })

  test('rerenders only the selected row when row selection changes', async () => {
    const renderCountByRowId = new Map<string, number>()
    const columns: Array<ColumnDef<PersonRow>> = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row, getValue }) => {
          renderCountByRowId.set(row.id, (renderCountByRowId.get(row.id) ?? 0) + 1)
          return String(getValue())
        },
      },
    ]

    renderWithProviders(<TableHarness columns={columns} />)

    await screen.findByText('Alpha')
    const alphaRenderCount = renderCountByRowId.get('1') ?? 0
    const betaRenderCount = renderCountByRowId.get('2') ?? 0
    const alphaCheckbox = screen.getAllByRole('checkbox')[1]

    fireEvent.click(alphaCheckbox)

    await waitFor(() => {
      expect(alphaCheckbox).toBeChecked()
      expect(renderCountByRowId.get('1')).toBeGreaterThan(alphaRenderCount)
    })
    expect(renderCountByRowId.get('2')).toBe(betaRenderCount)
  })
})
