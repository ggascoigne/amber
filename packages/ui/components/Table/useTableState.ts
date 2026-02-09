import { useCallback, useMemo } from 'react'

import type { ColumnDef, TableState, RowData } from '@tanstack/react-table'

import { isUserColumnId } from './utils/tableUtils'

import { useLocalStorage } from '../../utils/useLocalStorage'

export type PersistedTableState = Pick<
  TableState,
  | 'sorting'
  | 'columnFilters'
  | 'pagination'
  | 'columnSizing'
  | 'columnVisibility'
  | 'columnOrder'
  | 'grouping'
  | 'globalFilter'
>

export const getColumnsNames = <T extends RowData>(columns: ColumnDef<T>[]) =>
  columns
    .filter((c) => isUserColumnId(c.id))
    .map((c) => c.id ?? (c as any).accessorKey ?? c.header)
    .join(',')

export type PersistedState = {
  createdFor: {
    tableVersion: number
    columns: string
  }
  value: Partial<PersistedTableState>
}

export const buildPersistableState = (
  createdFor: PersistedState['createdFor'],
  nextState: TableState,
): PersistedState => ({
  createdFor,
  value: {
    sorting: nextState.sorting?.map((item) => ({ ...item })),
    columnFilters: nextState.columnFilters?.map((item) => ({ ...item })),
    pagination: nextState.pagination ? { ...nextState.pagination } : undefined,
    columnSizing: nextState.columnSizing ? { ...nextState.columnSizing } : undefined,
    columnVisibility: nextState.columnVisibility ? { ...nextState.columnVisibility } : undefined,
    columnOrder: nextState.columnOrder ? [...nextState.columnOrder] : undefined,
    grouping: nextState.grouping ? [...nextState.grouping] : undefined,
    globalFilter: nextState.globalFilter,
  },
})

export const useTableState = <T extends RowData>(
  name: string,
  columns: ColumnDef<T>[],
  initialState?: Partial<TableState>,
  enabled = true,
) => {
  const createdFor = useMemo(
    () => ({
      tableVersion: 2,
      columns: getColumnsNames(columns),
    }),
    [columns],
  )
  const [persistedTableState, setPersistedTableState] = useLocalStorage<Partial<PersistedState>>(
    `tableState:${name}`,
    {
      createdFor,
      value: initialState,
    },
    enabled,
  )

  const updateState = useCallback(
    (s: TableState) => {
      setPersistedTableState(buildPersistableState(createdFor, s))
    },
    [createdFor, setPersistedTableState],
  )

  return [persistedTableState.value, updateState] as const
}
