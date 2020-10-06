import { dequal as deepEqual } from 'dequal'
import { useCallback, useMemo } from 'react'
import { Column, TableState } from 'react-table'
import { useLocalStorage } from 'utils'

type PersistedState<T extends Record<string, unknown>> = {
  createdFor: {
    columns: string
    initialState: Partial<TableState<T>>
  }
  value: Partial<TableState<T>>
}

export const useInitialTableState = <T extends Record<string, unknown>>(
  name: string,
  columns: Column<T>[],
  userInitialState: Partial<TableState<T>>
) => {
  const createdFor = useMemo(
    () => ({
      columns: columns.map((c) => c.id ?? (c.accessor as string)).join(','),
      initialState: userInitialState,
    }),
    [columns, userInitialState]
  )

  const [initialState, setInitialState] = useLocalStorage<PersistedState<T>>(name, {
    createdFor,
    value: userInitialState,
  })

  const setNewState = useCallback(
    (input: Partial<TableState<T>>) => {
      const { sortBy, filters, pageSize, columnResizing, hiddenColumns, columnOrder, groupBy } = input
      setInitialState({
        createdFor,
        value: {
          columnOrder,
          columnResizing,
          filters,
          hiddenColumns,
          pageSize,
          sortBy,
          groupBy,
        },
      })
    },
    [createdFor, setInitialState]
  )
  const value = deepEqual(initialState.createdFor, createdFor) ? initialState.value : userInitialState

  return [value, setNewState] as const
}
