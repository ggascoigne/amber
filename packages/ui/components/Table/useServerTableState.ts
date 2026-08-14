import { useMemo, useRef } from 'react'

import type { Atom } from '@tanstack/react-store'
import { useCreateAtom, useSelector } from '@tanstack/react-store'

import { DEFAULT_TABLE_PAGE_SIZE } from './constants'
import type { TableQueryState } from './tableTypes'

export type ServerTableStateAtoms = {
  [TableStateKey in keyof TableQueryState]: Atom<TableQueryState[TableStateKey]>
}

export type UseServerTableStateOptions = {
  initialState?: Partial<TableQueryState>
}

export type ServerTableState = {
  atoms: ServerTableStateAtoms
  initialState: TableQueryState
  state: TableQueryState
}

/**
 * Owns the state slices normally shared by a server query and a table.
 * Pass `atoms` and `initialState` to `Table`, and use `state` in the query key.
 */
export const useServerTableState = ({ initialState }: UseServerTableStateOptions = {}): ServerTableState => {
  const initialStateRef = useRef<TableQueryState>({
    pagination: initialState?.pagination ?? { pageIndex: 0, pageSize: DEFAULT_TABLE_PAGE_SIZE },
    sorting: initialState?.sorting ?? [],
    columnFilters: initialState?.columnFilters ?? [],
    globalFilter: initialState?.globalFilter,
  })
  const paginationAtom = useCreateAtom(initialStateRef.current.pagination)
  const sortingAtom = useCreateAtom(initialStateRef.current.sorting)
  const columnFiltersAtom = useCreateAtom(initialStateRef.current.columnFilters)
  const globalFilterAtom = useCreateAtom(initialStateRef.current.globalFilter)

  const pagination = useSelector(paginationAtom)
  const sorting = useSelector(sortingAtom)
  const columnFilters = useSelector(columnFiltersAtom)
  const globalFilter = useSelector(globalFilterAtom)

  const atoms = useMemo<ServerTableStateAtoms>(
    () => ({
      pagination: paginationAtom,
      sorting: sortingAtom,
      columnFilters: columnFiltersAtom,
      globalFilter: globalFilterAtom,
    }),
    [columnFiltersAtom, globalFilterAtom, paginationAtom, sortingAtom],
  )
  const state = useMemo<TableQueryState>(
    () => ({ pagination, sorting, columnFilters, globalFilter }),
    [columnFilters, globalFilter, pagination, sorting],
  )

  return { atoms, initialState: initialStateRef.current, state }
}
