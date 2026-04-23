/* eslint-disable import/no-extraneous-dependencies */

import type { ColumnDef } from '@tanstack/react-table'
import { describe, expect, test } from 'vitest'

import { sanitizePersistedTableState } from '../useTableState'
import { getDefaultSort, getLeafColumnIds } from '../utils/tableUtils'

type HotelRoomRow = {
  id: number
  description: string
  quantity: number
}

describe('table state helpers', () => {
  const columns: Array<ColumnDef<HotelRoomRow>> = [
    {
      header: 'General',
      columns: [
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'description',
          header: 'Description',
        },
      ],
    },
    {
      header: 'Inventory',
      columns: [
        {
          accessorKey: 'quantity',
          header: 'Quantity',
        },
      ],
    },
  ]

  test('uses the first leaf column for the default sort', () => {
    expect(getLeafColumnIds(columns)).toEqual(['id', 'description', 'quantity'])
    expect(getDefaultSort(columns)).toEqual([{ desc: false, id: 'id' }])
  })

  test('drops persisted state entries for columns that no longer exist', () => {
    expect(
      sanitizePersistedTableState(
        {
          sorting: [
            { id: undefined as never, desc: false },
            { id: 'id', desc: false },
          ],
          columnFilters: [
            { id: 'description', value: 'suite' },
            { id: 'missing', value: 'stale' },
          ],
          columnOrder: ['id', 'missing', 'quantity'],
          grouping: ['missing', 'description'],
          columnVisibility: {
            id: true,
            missing: false,
          },
          columnSizing: {
            description: 240,
            missing: 120,
          },
        },
        getLeafColumnIds(columns),
      ),
    ).toEqual({
      sorting: [{ id: 'id', desc: false }],
      columnFilters: [{ id: 'description', value: 'suite' }],
      columnOrder: ['id', 'quantity'],
      grouping: ['description'],
      columnVisibility: {
        id: true,
      },
      columnSizing: {
        description: 240,
      },
    })
  })

  test('does not emit undefined keys that would overwrite table defaults during merge', () => {
    expect(
      sanitizePersistedTableState(
        {
          pagination: {
            pageIndex: 0,
            pageSize: 100,
          },
        },
        getLeafColumnIds(columns),
      ),
    ).toEqual({
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    })
  })
})
