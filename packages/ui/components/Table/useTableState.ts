import { useCallback, useMemo } from 'react'

import type { ColumnDef, TableState, RowData } from '@tanstack/react-table'

import { getLeafColumnIds } from './utils/tableUtils'

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

export const getColumnsNames = <T extends RowData>(columns: ColumnDef<T>[]) => getLeafColumnIds(columns).join(',')

export type PersistedState = {
  createdFor: {
    tableVersion: number
    columns: string
  }
  value: Partial<PersistedTableState>
}

const filterRecordByColumnIds = <TValue>(
  record: Record<string, TValue> | undefined,
  validColumnIds: Set<string>,
): Record<string, TValue> | undefined => {
  if (!record) {
    return undefined
  }

  const filteredEntries = Object.entries(record).filter(([columnId]) => validColumnIds.has(columnId))
  return filteredEntries.length > 0 ? Object.fromEntries(filteredEntries) : undefined
}

const removeUndefinedValues = <TValue extends Record<string, unknown>>(value: TValue): Partial<TValue> =>
  Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)) as Partial<TValue>

export const sanitizePersistedTableState = (
  value: Partial<PersistedTableState> | undefined,
  validColumnIds: Array<string>,
): Partial<PersistedTableState> => {
  if (!value) {
    return {}
  }

  const validColumnIdsSet = new Set(validColumnIds)

  return removeUndefinedValues({
    ...value,
    sorting: value.sorting?.filter((item) => validColumnIdsSet.has(item.id)),
    columnFilters: value.columnFilters?.filter((item) => validColumnIdsSet.has(item.id)),
    columnSizing: filterRecordByColumnIds(value.columnSizing, validColumnIdsSet),
    columnVisibility: filterRecordByColumnIds(value.columnVisibility, validColumnIdsSet),
    columnOrder: value.columnOrder?.filter((columnId) => validColumnIdsSet.has(columnId)),
    grouping: value.grouping?.filter((columnId) => validColumnIdsSet.has(columnId)),
  })
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
  const leafColumnIds = useMemo(() => getLeafColumnIds(columns), [columns])
  const createdFor = useMemo(
    () => ({
      tableVersion: 3,
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
  const sanitizedPersistedState = useMemo(
    () => sanitizePersistedTableState(persistedTableState.value, leafColumnIds),
    [leafColumnIds, persistedTableState.value],
  )

  const updateState = useCallback(
    (s: TableState) => {
      setPersistedTableState(buildPersistableState(createdFor, s))
    },
    [createdFor, setPersistedTableState],
  )

  return [sanitizedPersistedState, updateState] as const
}
