import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/CreateOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import type { AccessorKeyColumnDefBase, ColumnDef, Row, TableState, Updater } from '@tanstack/react-table'

import type { Action, TableSelectionMouseEventHandler } from './actions'
import { Empty } from './components/Empty'
import { DEFAULT_TABLE_PAGE_SIZE } from './constants'
import type { DataTableProps } from './DataTable'
import { DataTable } from './DataTable'
import type { UseTableProps } from './useTable'
import { useTable } from './useTable'
import { useTableState } from './useTableState'
import { oneSelected, someSelected, zeroSelected } from './utils/selectionUtils'

import { notEmpty } from '../../utils'

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

type TableProps<T> = Omit<UseTableProps<T>, 'keyField'> &
  Omit<DataTableProps<T>, 'tableInstance'> & {
    name: string
    data: T[]
    keyField?: keyof T
    columns: ColumnDef<T, any>[]
    initialState?: Partial<TableState>
    isLoading?: boolean
    isFetching?: boolean
    rowCount?: number
    onRowClick?: (row: Row<T>) => void
    handleStateChange?: (newState: TableState) => void
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
  }

const shouldTriggerPageChange = (oldState: TableState, newState: TableState) => {
  if (oldState.columnFilters !== newState.columnFilters) return true
  if (oldState.globalFilter !== newState.globalFilter) return true
  // if (oldState.sorting !== newState.sorting) return true
  return false
}

export const Table = <T,>({
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
  scrollBehavior = 'bounded',
  systemActions: userSystemActions,
  toolbarActions: userToolbarActions,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  displayGutter,
  // @ts-ignore
  keyField = 'id',
  ...rest
}: TableProps<T>) => {
  const [stateLoaded, setStateLoaded] = useState(false)

  const initial = { ...initialState }
  initial.sorting ??= [
    {
      id: columns[0].id ?? ((columns[0] as AccessorKeyColumnDefBase<T>).accessorKey as string),
      desc: false,
    },
  ]
  const [persistedTableState, setPersistedTableState] = useTableState(name, columns, initial)

  const stateRef = useRef<TableState>({
    sorting: [],
    columnFilters: [],
    globalFilter: '',
    columnOrder: [],
    columnPinning: {},
    rowPinning: {},
    columnVisibility: {},
    columnSizing: {},
    columnSizingInfo: {
      columnSizingStart: [],
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
    },
    grouping: [],
    pagination: { pageIndex: 0, pageSize: DEFAULT_TABLE_PAGE_SIZE },
    rowSelection: {},
    expanded: {},
  })

  useLayoutEffect(() => {
    if (!persistedTableState) return
    stateRef.current = {
      ...stateRef.current,
      ...persistedTableState,
    }
  }, [persistedTableState])

  const debounceRef = useRef<number | null>(null)

  const emit = useCallback(
    (s: TableState) => {
      // console.log('Persisting table state', s)
      setPersistedTableState(s)
      handleStateChange?.(s)
      setStateLoaded(true)
    },
    [setPersistedTableState, handleStateChange],
  )

  const queueStateChangeResponse = useCallback(
    (s: TableState) => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        emit(s)
      }, 250)
    },
    [emit],
  )

  const table = useTable<T>({
    name,
    columns,
    keyField,
    data: data ?? [],
    state: stateRef.current,
    onStateChange: (updater: Updater<TableState>) => {
      const next = typeof updater === 'function' ? updater(stateRef.current) : updater
      if (shouldTriggerPageChange(stateRef.current, next)) {
        next.pagination.pageIndex = 0
      }
      stateRef.current = next
      queueStateChangeResponse(next)
    },
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
    rowCount: rowCount ?? data.length,
    displayGutter,
    ...rest,
  })

  // kick initial fetch of table state to parent
  useLayoutEffect(() => {
    emit(stateRef.current)
  }, [emit])

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

  const empty = <Empty hasSearch={stateRef.current?.globalFilter} />

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
      rowCount={rowCount ?? data?.length ?? 0}
      compact
      displayGutter={displayGutter}
      {...rest}
    />
  )
}
