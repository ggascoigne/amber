import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/CreateOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { dequal as deepEqual } from 'dequal'

import type { Action, TableSelectionMouseEventHandler } from './actions'
import { Empty } from './components/Empty'
import { DEFAULT_TABLE_PAGE_SIZE } from './constants'
import type { DataTableProps } from './DataTable'
import { DataTable } from './DataTable'
import { usePendingNewRow } from './editing/usePendingNewRow'
import { buildExpansionColumn } from './expansion/buildExpansionColumn'
import type { AmberColumnDef, AmberRow, AmberTableState, RowData } from './tableTypes'
import type { UseTableProps } from './useTable'
import { useTable } from './useTable'
import { useTableState } from './useTableState'
import { oneSelected, someSelected, zeroSelected } from './utils/selectionUtils'
import { getDefaultSort } from './utils/tableUtils'

import { notEmpty } from '../../utils/ts-utils'

const EMPTY_TABLE_DATA: Array<never> = []
const rowCanAlwaysExpand = () => true

/**
Simple, Table wrapper, you just pass it the data and it'll do the rest

Note that it's setup for client side sorting, filtering etc, if you want to manage that
on the server then you need access to the table state for query params etc.  You can 
do that with something like this:

```ts
  const [state, setState] = useState<Partial<TableState> | undefined>(undefined)
  const handleStateChange = useCallback((newState: TableState) => {
    setState({
      pagination: newState?.pagination,
      sorting: newState?.sorting ?? [],
      globalFilter: newState?.globalFilter,
      columnFilters: newState?.columnFilters,
    })
  }, [])

  const { data, isLoading, isFetching, refetch } = useUsersQuery(
    {
      pageIndex: state?.pagination?.pageIndex ?? 0,
      pageSize: state?.pagination?.pageSize ?? 10,
      sorting: state?.sorting ?? [],
      globalFilter: state?.globalFilter ?? '',
      filters: state?.columnFilters,
    },
    { enabled: !!state },
  )
```
  */

type TablePropsBase<T extends RowData> = Omit<UseTableProps<T>, 'keyField' | 'name'> &
  Omit<DataTableProps<T>, 'tableInstance'> & {
    data: Array<T>
    keyField?: keyof T
    columns: Array<AmberColumnDef<T>>
    initialState?: Partial<AmberTableState>
    isLoading?: boolean
    isFetching?: boolean
    rowCount?: number
    onRowClick?: (row: AmberRow<T>) => void
    handleStateChange?: (newState: AmberTableState) => void
    onAdd?: TableSelectionMouseEventHandler<T>
    onDelete?: TableSelectionMouseEventHandler<T>
    onEdit?: TableSelectionMouseEventHandler<T>
    refetch?: () => void
    title?: string
    additionalToolbarActions?: Action<T>[]
    additionalRowActions?: Action<T>[]
    additionalSystemActions?: Action<T>[]
    defaultColumnDisableGlobalFilter?: boolean
    enableRowSelection?: boolean
    scrollBehavior?: 'none' | 'bounded'
    systemActions?: Action<T>[]
    toolbarActions?: Action<T>[]
    renderExpandedContent?: (row: AmberRow<T>) => ReactNode
    getRowCanExpand?: (row: AmberRow<T>) => boolean
    expandedContentSx?: DataTableProps<T>['expandedContentSx']
    showExpandedSwitch?: boolean
    showExpandedOnly?: boolean
    onShowExpandedOnlyChange?: (nextValue: boolean) => void
  }

type TableProps<T extends RowData> =
  | (TablePropsBase<T> & { disableStatePersistence: true; name?: string })
  | (TablePropsBase<T> & { disableStatePersistence?: false; name: string })

const shouldTriggerPageChange = (oldState: AmberTableState, newState: AmberTableState) => {
  if (!deepEqual(oldState.columnFilters, newState.columnFilters)) return true
  if (!deepEqual(oldState.globalFilter, newState.globalFilter)) return true
  // if (oldState.sorting !== newState.sorting) return true
  return false
}

export const Table = <T extends RowData>({
  name,
  data,
  columns,
  initialState = {},
  isLoading,
  isFetching,
  rowCount,
  onRowClick,
  onAdd,
  onDelete,
  onEdit,
  refetch,
  handleStateChange,
  title,
  additionalToolbarActions,
  additionalRowActions,
  additionalSystemActions,
  defaultColumnDisableGlobalFilter = false,
  enableRowSelection = true,
  enableGrouping = true,
  enableTreeBehavior = false,
  scrollBehavior = 'bounded',
  renderExpandedContent,
  getRowCanExpand,
  expandedContentSx,
  showExpandedSwitch = false,
  showExpandedOnly: controlledShowExpandedOnly,
  onShowExpandedOnlyChange,
  cellEditing,
  systemActions: userSystemActions,
  toolbarActions: userToolbarActions,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  displayGutter,
  disableStatePersistence = false,
  keyField: userKeyField,
  useVirtualRows,
  ...rest
}: TableProps<T>) => {
  const [stateLoaded, setStateLoaded] = useState(false)
  const [uncontrolledShowExpandedOnly, setUncontrolledShowExpandedOnly] = useState(false)
  const hasExpandedContent = !!renderExpandedContent
  const isShowExpandedOnlyControlled = typeof controlledShowExpandedOnly === 'boolean'
  const resolvedShowExpandedOnly = isShowExpandedOnlyControlled
    ? controlledShowExpandedOnly
    : uncontrolledShowExpandedOnly
  const resolvedShowExpandedOnlyChange = onShowExpandedOnlyChange ?? setUncontrolledShowExpandedOnly
  const resolvedUseVirtualRows = hasExpandedContent ? (useVirtualRows ?? false) : useVirtualRows
  const keyField = (userKeyField ?? 'id') as keyof T
  const { canAddRow, handleAddRow, resolvedData, resolvedEditingConfig } = usePendingNewRow({
    cellEditing,
    data,
  })

  const initial = { ...initialState }
  initial.sorting ??= getDefaultSort(columns)
  initial.pagination ??= { pageIndex: 0, pageSize: DEFAULT_TABLE_PAGE_SIZE }
  const resolvedTableName = name ?? 'table'
  const [persistedTableState, setPersistedTableState] = useTableState(
    resolvedTableName,
    columns,
    initial,
    !disableStatePersistence,
  )

  const debounceRef = useRef<number | null>(null)

  const emit = useCallback(
    (s: AmberTableState) => {
      // console.log('Persisting table state', s)
      setPersistedTableState(s)
      handleStateChange?.(s)
      setStateLoaded(true)
    },
    [setPersistedTableState, handleStateChange],
  )

  const queueStateChangeResponse = useCallback(
    (s: AmberTableState) => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        emit(s)
      }, 250)
    },
    [emit],
  )

  const expansionColumn = useMemo<AmberColumnDef<T> | null>(
    () => buildExpansionColumn<T>(hasExpandedContent),
    [hasExpandedContent],
  )
  const resolvedGetRowCanExpand = hasExpandedContent ? (getRowCanExpand ?? rowCanAlwaysExpand) : getRowCanExpand

  const resolvedColumns = useMemo(
    () => (expansionColumn ? [expansionColumn, ...columns] : columns),
    [columns, expansionColumn],
  )

  const table = useTable<T>({
    name,
    columns: resolvedColumns,
    keyField,
    data: resolvedData ?? EMPTY_TABLE_DATA,
    initialState: persistedTableState,
    autoResetExpanded: false,
    enableColumnResizing: true,
    enableSortingRemoval: false,
    columnResizeMode: 'onChange',
    manualSorting: false,
    enableSorting: true,
    enablePagination: true,
    manualPagination: typeof rowCount === 'number',
    enableRowSelection,
    enableGlobalFilter,
    enableColumnFilters,
    enableGrouping,
    sortDescFirst: false,
    autoResetPageIndex: false,
    defaultColumnDisableGlobalFilter,
    rowCount: rowCount ?? resolvedData.length,
    displayGutter,
    enableTreeBehavior,
    getRowCanExpand: resolvedGetRowCanExpand,
    ...rest,
  })

  const tableStore = table.store
  const previousStateRef = useRef(tableStore.state)
  const emitRef = useRef(emit)
  const queueStateChangeResponseRef = useRef(queueStateChangeResponse)
  const tableRef = useRef(table)

  useLayoutEffect(() => {
    emitRef.current = emit
    queueStateChangeResponseRef.current = queueStateChangeResponse
    tableRef.current = table
  }, [emit, queueStateChangeResponse, table])

  useEffect(
    () => () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
    },
    [],
  )

  // Persist and publish the complete v9 state without taking ownership of each slice.
  useLayoutEffect(() => {
    const currentState = tableStore.state
    previousStateRef.current = currentState
    emitRef.current(currentState)

    const subscription = tableStore.subscribe((nextState) => {
      const previousState = previousStateRef.current
      previousStateRef.current = nextState

      if (shouldTriggerPageChange(previousState, nextState) && nextState.pagination.pageIndex !== 0) {
        tableRef.current.setPageIndex(0)
        return
      }

      queueStateChangeResponseRef.current(nextState)
    })

    return () => subscription.unsubscribe()
  }, [tableStore])

  const [toolbarActions, rowActions] = useMemo(() => {
    const defined = <U,>(value: U | undefined): value is U => value !== undefined

    const addAction = onAdd
      ? {
          label: 'Add',
          type: 'icon' as const,
          icon: <AddIcon />,
          onClick: onAdd,
          enabled: zeroSelected,
        }
      : undefined

    const editAction = onEdit
      ? {
          label: 'Edit',
          type: 'icon' as const,
          icon: <CreateIcon />,
          onClick: onEdit,
          enabled: oneSelected,
        }
      : undefined

    const deleteAction = onDelete
      ? {
          label: 'Delete',
          type: 'icon' as const,
          icon: <DeleteIcon />,
          onClick: onDelete,
          enabled: someSelected,
        }
      : undefined

    const baseToolbarActions = [addAction, editAction, deleteAction].filter(defined)
    const baseRowActions = [editAction].filter(defined)

    const toolbarA: Action<T>[] = additionalToolbarActions?.length
      ? [...baseToolbarActions, ...additionalToolbarActions]
      : baseToolbarActions

    const rowsA: Action<T>[] = additionalRowActions?.length
      ? [...baseRowActions, ...additionalRowActions]
      : baseRowActions

    return [toolbarA, rowsA]
  }, [additionalRowActions, additionalToolbarActions, onAdd, onDelete, onEdit])

  const systemActions: Action<T>[] = useMemo(
    () =>
      (
        [
          refetch
            ? {
                action: 'refresh' as const,
                onClick: () => refetch?.(),
              }
            : null,
          {
            action: 'columnSelect',
          },
          {
            action: 'export',
          },
          ...(additionalSystemActions ?? []),
        ] as const
      ).filter(notEmpty),
    [additionalSystemActions, refetch],
  )

  if (!stateLoaded) {
    return null
  }

  const empty = <Empty hasSearch={table.state.globalFilter} />

  return (
    <DataTable
      isLoading={isLoading}
      isFetching={isFetching}
      tableInstance={table}
      scrollBehavior={scrollBehavior}
      toolbarActions={userToolbarActions ?? toolbarActions}
      rowActions={rowActions}
      systemActions={userSystemActions ?? systemActions}
      onRowClick={onRowClick}
      emptyDataComponent={empty}
      title={title}
      elevation={1}
      rowCount={rowCount ?? resolvedData?.length ?? 0}
      compact
      displayGutter={displayGutter}
      cellEditing={resolvedEditingConfig}
      useVirtualRows={resolvedUseVirtualRows}
      renderExpandedContent={renderExpandedContent}
      getRowCanExpand={getRowCanExpand}
      addRowAction={canAddRow ? { onAddRow: handleAddRow } : undefined}
      expandedContentSx={expandedContentSx}
      showExpandedSwitch={showExpandedSwitch && hasExpandedContent}
      showExpandedOnly={hasExpandedContent ? resolvedShowExpandedOnly : false}
      onToggleShowExpandedOnly={hasExpandedContent ? resolvedShowExpandedOnlyChange : undefined}
      {...rest}
    />
  )
}
