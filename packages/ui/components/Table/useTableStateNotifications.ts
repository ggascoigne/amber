import { useEffect, useLayoutEffect, useRef } from 'react'

import { dequal as deepEqual } from 'dequal'

import { selectTableQueryState } from './tableStateSelectors'
import type { AmberTable, AmberTableState, RowData, TableQueryState } from './tableTypes'
import { selectPersistedTableState } from './useTableState'

const STATE_NOTIFICATION_DELAY_MS = 250

const shouldResetPageIndex = (previousState: AmberTableState, nextState: AmberTableState) =>
  !deepEqual(previousState.columnFilters, nextState.columnFilters) ||
  !deepEqual(previousState.globalFilter, nextState.globalFilter)

type UseTableStateNotificationsProps<TData extends RowData> = {
  table: AmberTable<TData>
  onPersistedStateChange: (state: AmberTableState) => void
  onQueryStateChange?: (state: TableQueryState) => void
  /** @deprecated Prefer `onQueryStateChange` when state drives a server query. */
  onStateChange?: (state: AmberTableState) => void
  onStateLoaded: () => void
}

export const useTableStateNotifications = <TData extends RowData>({
  table,
  onPersistedStateChange,
  onQueryStateChange,
  onStateChange,
  onStateLoaded,
}: UseTableStateNotificationsProps<TData>) => {
  const tableStore = table.store
  const tableRef = useRef(table)
  const previousStateRef = useRef(tableStore.state)
  const onPersistedStateChangeRef = useRef(onPersistedStateChange)
  const onQueryStateChangeRef = useRef(onQueryStateChange)
  const onStateChangeRef = useRef(onStateChange)
  const onStateLoadedRef = useRef(onStateLoaded)
  const persistenceTimerRef = useRef<number | null>(null)
  const queryTimerRef = useRef<number | null>(null)
  const legacyTimerRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    tableRef.current = table
    onPersistedStateChangeRef.current = onPersistedStateChange
    onQueryStateChangeRef.current = onQueryStateChange
    onStateChangeRef.current = onStateChange
    onStateLoadedRef.current = onStateLoaded
  }, [onPersistedStateChange, onQueryStateChange, onStateChange, onStateLoaded, table])

  useEffect(
    () => () => {
      if (persistenceTimerRef.current) window.clearTimeout(persistenceTimerRef.current)
      if (queryTimerRef.current) window.clearTimeout(queryTimerRef.current)
      if (legacyTimerRef.current) window.clearTimeout(legacyTimerRef.current)
    },
    [],
  )

  useLayoutEffect(() => {
    const initialState = tableStore.state
    previousStateRef.current = initialState
    onPersistedStateChangeRef.current(initialState)
    onQueryStateChangeRef.current?.(selectTableQueryState(initialState))
    onStateChangeRef.current?.(initialState)
    onStateLoadedRef.current()

    const subscription = tableStore.subscribe((nextState) => {
      const previousState = previousStateRef.current
      previousStateRef.current = nextState

      if (shouldResetPageIndex(previousState, nextState) && nextState.pagination.pageIndex !== 0) {
        tableRef.current.setPageIndex(0)
        return
      }

      if (!deepEqual(selectPersistedTableState(previousState), selectPersistedTableState(nextState))) {
        if (persistenceTimerRef.current) window.clearTimeout(persistenceTimerRef.current)
        persistenceTimerRef.current = window.setTimeout(() => {
          onPersistedStateChangeRef.current(nextState)
        }, STATE_NOTIFICATION_DELAY_MS)
      }

      if (!deepEqual(selectTableQueryState(previousState), selectTableQueryState(nextState))) {
        if (queryTimerRef.current) window.clearTimeout(queryTimerRef.current)
        queryTimerRef.current = window.setTimeout(() => {
          onQueryStateChangeRef.current?.(selectTableQueryState(nextState))
        }, STATE_NOTIFICATION_DELAY_MS)
      }

      if (onStateChangeRef.current) {
        if (legacyTimerRef.current) window.clearTimeout(legacyTimerRef.current)
        legacyTimerRef.current = window.setTimeout(() => {
          onStateChangeRef.current?.(nextState)
        }, STATE_NOTIFICATION_DELAY_MS)
      }
    })

    return () => subscription.unsubscribe()
  }, [tableStore])
}
