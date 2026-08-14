import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/CreateOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

import type { Action, TableSelectionMouseEventHandler } from './actions'
import { Empty } from './components/Empty'
import { DEFAULT_TABLE_PAGE_SIZE } from './constants'
import type { DataTableProps } from './DataTable'
import { DataTable } from './DataTable'
import { usePendingNewRow } from './editing/usePendingNewRow'
import { buildExpansionColumn } from './expansion/buildExpansionColumn'
import type { AmberColumnDef, AmberRow, AmberTable, AmberTableState, RowData, TableQueryState } from './tableTypes'
import type { UseTableProps } from './useTable'
import { useTable } from './useTable'
import { useTableState } from './useTableState'
import { useTableStateNotifications } from './useTableStateNotifications'
import { oneSelected, someSelected, zeroSelected } from './utils/selectionUtils'
import { getDefaultSort } from './utils/tableUtils'

import { notEmpty } from '../../utils/ts-utils'

const EMPTY_TABLE_DATA: Array<never> = []
const rowCanAlwaysExpand = () => true

type TableEmptyProps<TData extends RowData> = {
  table: AmberTable<TData>
}

const TableEmpty = <TData extends RowData>({ table }: TableEmptyProps<TData>) => (
  <table.Subscribe source={table.atoms.globalFilter}>
    {(globalFilter) => <Empty hasSearch={globalFilter} />}
  </table.Subscribe>
)

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
    /** @deprecated Prefer `onQueryStateChange` when state drives a server query. */
    handleStateChange?: (newState: AmberTableState) => void
    onQueryStateChange?: (newState: TableQueryState) => void
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
  onQueryStateChange,
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

  useTableStateNotifications({
    table,
    onPersistedStateChange: setPersistedTableState,
    onQueryStateChange,
    onStateChange: handleStateChange,
    onStateLoaded: useCallback(() => setStateLoaded(true), []),
  })

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

  const empty = <TableEmpty table={table} />

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
