import { useCallback, useMemo } from 'react'

import type {
  CellContext,
  ColumnDef,
  HeaderContext,
  Row,
  RowData,
  TableState,
  TableOptions,
  ColumnMeta,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

import { CheckboxCellRenderer, HeaderCheckbox } from './components/SimpleSelectionColumn'
import { TooltipCellRenderer } from './components/TooltipCell'
import { SELECTION_COLUMN_ID } from './constants'
import { TextColumnFilter } from './filter'
import { numericTextFilter } from './filter/filterFns/numericTextFilter'
import { applyDefaultMetaToColumns } from './utils/deepMergeMeta'
import { columnName } from './utils/tableUtils'

const DefaultHeader = <T extends RowData>({ column }: HeaderContext<T, any>) => (
  <>{column.id.startsWith('_') ? null : columnName(column)}</>
)

// note that we are defining this here since the default handling of the default column does
// a shallow merge which means that any definition of meta would completely override
// the default meta
const defaultColumnMeta: ColumnMeta<any, any> = {
  filterFlags: {
    filterRender: TextColumnFilter,
  },
}

export type UseTableProps<T extends RowData> = Partial<TableOptions<T>> &
  Pick<TableOptions<T>, 'columns' | 'data'> & {
    name: string
    keyField: keyof T
    initialState?: Partial<TableState>
    enablePagination?: boolean
    enableRowSelection?: boolean | ((row: Row<T>) => boolean) | undefined
    enableSelectAll?: boolean
    defaultColumnDisableGlobalFilter?: boolean
    displayGutter?: boolean
  }

export const useTable = <T extends RowData>(props: UseTableProps<T>) => {
  const {
    columns: userColumns,
    keyField,
    enableRowSelection = true,
    autoResetExpanded = false,
    enableColumnResizing = true,
    enableSortingRemoval = false,
    columnResizeMode = 'onChange',
    sortDescFirst = false,
    enableExpanding = true,
    defaultColumnDisableGlobalFilter = false,
    enableGrouping = true,
    enableColumnFilters,
    enableGlobalFilter,
    enableFilters,
    enableSorting,
    enablePagination,
    displayGutter = true,
    filterFns: userFilterFns,
    ...rest
  } = props

  const getRowId = useCallback((originalRow: T): string => (originalRow[keyField] as any).toString(), [keyField])

  const selectionColumnSize = displayGutter ? 74 : 64
  const selectionColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: SELECTION_COLUMN_ID,
      enableResizing: false,
      enableGrouping: false,
      minSize: selectionColumnSize,
      size: selectionColumnSize,
      maxSize: selectionColumnSize,
      aggregatedCell: undefined,
      header: ({ table }: HeaderContext<T, any>) => <HeaderCheckbox table={table} />,
      cell: CheckboxCellRenderer,
    }),
    [selectionColumnSize],
  )

  const columns = useMemo(() => {
    const tmpColumns: ColumnDef<T>[] = enableRowSelection ? [selectionColumn, ...userColumns] : userColumns
    return applyDefaultMetaToColumns({
      defaultMeta: defaultColumnMeta as any,
      columns: tmpColumns,
    })
  }, [enableRowSelection, selectionColumn, userColumns])

  const defaultColumn = useMemo<Partial<ColumnDef<T>>>(
    () => ({
      enableResizing: true,
      enableGrouping,
      cell: TooltipCellRenderer,
      header: DefaultHeader,
      aggregationFn: 'uniqueCount',
      aggregatedCell: ({ getValue }: CellContext<T, any>) => <>{getValue()} Unique Values</>,
      minSize: 50,
      size: 150,
      maxSize: 200,
      enableGlobalFilter: !defaultColumnDisableGlobalFilter, // support global filtering, but make clients specify which columns to add
    }),
    [defaultColumnDisableGlobalFilter, enableGrouping],
  )

  const filterFns = useMemo(
    () => ({
      numericText: numericTextFilter,
      ...(userFilterFns ?? {}),
    }),
    [userFilterFns],
  )

  return useReactTable<T>({
    columns,
    defaultColumn,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: enableExpanding || enableGrouping ? getExpandedRowModel() : undefined,
    getFilteredRowModel: enableColumnFilters || enableGlobalFilter || enableFilters ? getFilteredRowModel() : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    autoResetExpanded,
    enableColumnResizing,
    enableSortingRemoval,
    enableRowSelection,
    columnResizeMode,
    sortDescFirst,
    getRowId,
    enableExpanding,
    enableGrouping,
    enableColumnFilters,
    enableGlobalFilter,
    enableFilters,
    enableSorting,
    enablePagination,
    ...rest,
  })
}
