import { useCallback, useMemo } from 'react'

import type { CellData, ColumnMeta, RowData } from '@tanstack/react-table'
import { useTable as useTanStackTable } from '@tanstack/react-table'

import { CheckboxCellRenderer, HeaderCheckbox } from './components/SimpleSelectionColumn'
import { TooltipCellRenderer } from './components/TooltipCell'
import { SELECTION_COLUMN_ID } from './constants'
import { TextColumnFilter } from './filter'
import { amberTableFeatures } from './tableFeatures'
import type {
  AmberCellContext,
  AmberColumnDef,
  AmberHeaderContext,
  AmberRow,
  AmberTableOptions,
  AmberTableState,
} from './tableTypes'
import { applyDefaultMetaToColumns } from './utils/deepMergeMeta'
import { columnName } from './utils/tableUtils'

const DefaultHeader = <T extends RowData>({ column }: AmberHeaderContext<T>) => (
  <>{column.id.startsWith('_') ? null : columnName(column)}</>
)

// note that we are defining this here since the default handling of the default column does
// a shallow merge which means that any definition of meta would completely override
// the default meta
const defaultColumnMeta: ColumnMeta<typeof amberTableFeatures, RowData> = {
  filterFlags: {
    filterRender: TextColumnFilter,
  },
}

export type UseTableProps<T extends RowData> = Omit<Partial<AmberTableOptions<T>>, 'columns' | 'data' | 'features'> &
  Pick<AmberTableOptions<T>, 'columns' | 'data'> & {
    name?: string
    keyField: keyof T
    initialState?: Partial<AmberTableState>
    enablePagination?: boolean
    enableRowSelection?: boolean | ((row: AmberRow<T>) => boolean)
    enableSelectAll?: boolean
    defaultColumnDisableGlobalFilter?: boolean
    displayGutter?: boolean
    enableTreeBehavior?: boolean
  }

export const useTable = <T extends RowData>(props: UseTableProps<T>) => {
  const {
    columns: userColumns,
    name,
    keyField,
    enableRowSelection = true,
    autoResetExpanded = false,
    enableColumnResizing = true,
    enableSortingRemoval = false,
    columnResizeMode = 'onChange',
    sortDescFirst = false,
    enableExpanding = true,
    enableTreeBehavior = false,
    defaultColumnDisableGlobalFilter = false,
    enableGrouping = true,
    enableColumnFilters,
    enableGlobalFilter,
    enableFilters,
    enableSorting,
    enablePagination,
    displayGutter = true,
    manualExpanding,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    meta: userMeta,
    ...rest
  } = props

  const getRowId = useCallback((originalRow: T): string => String(originalRow[keyField]), [keyField])

  const selectionColumnSize = displayGutter ? 74 : 64
  const selectionColumn = useMemo<AmberColumnDef<T>>(
    () => ({
      id: SELECTION_COLUMN_ID,
      enableResizing: false,
      enableGrouping: false,
      minSize: selectionColumnSize,
      size: selectionColumnSize,
      maxSize: selectionColumnSize,
      aggregatedCell: undefined,
      header: ({ table }: AmberHeaderContext<T>) => <HeaderCheckbox table={table} />,
      cell: CheckboxCellRenderer,
    }),
    [selectionColumnSize],
  )

  const useInlineTreeSelection = !!(enableRowSelection && enableExpanding && enableTreeBehavior)
  const columns = useMemo(() => {
    const tmpColumns: Array<AmberColumnDef<T>> =
      enableRowSelection && !useInlineTreeSelection ? [selectionColumn, ...userColumns] : [...userColumns]
    return applyDefaultMetaToColumns({
      defaultMeta: defaultColumnMeta,
      columns: tmpColumns,
    })
  }, [enableRowSelection, selectionColumn, useInlineTreeSelection, userColumns])

  const defaultColumn = useMemo<Partial<AmberColumnDef<T>>>(
    () => ({
      enableResizing: true,
      enableGrouping,
      cell: TooltipCellRenderer,
      header: DefaultHeader,
      aggregationFn: 'uniqueCount',
      aggregatedCell: ({ getValue }: AmberCellContext<T, CellData>) => <>{getValue()} Unique Values</>,
      minSize: 50,
      size: 150,
      maxSize: 200,
      enableGlobalFilter: !defaultColumnDisableGlobalFilter, // support global filtering, but make clients specify which columns to add
    }),
    [defaultColumnDisableGlobalFilter, enableGrouping],
  )

  return useTanStackTable({
    features: amberTableFeatures,
    columns,
    defaultColumn,
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
    manualExpanding: manualExpanding ?? !(enableExpanding || enableGrouping),
    manualFiltering: manualFiltering ?? !(enableFilters !== false && (enableColumnFilters || enableGlobalFilter)),
    manualGrouping: manualGrouping ?? !enableGrouping,
    manualPagination: manualPagination ?? !enablePagination,
    manualSorting: manualSorting ?? !enableSorting,
    meta: {
      ...userMeta,
      name,
      enablePagination,
      enableTreeBehavior,
    },
    ...rest,
  })
}
