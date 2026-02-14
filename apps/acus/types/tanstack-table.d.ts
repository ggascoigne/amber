/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TableEditColumnConfig } from '@amber/ui/components/Table/editing/types'
import type {
  Column,
  OnChangeFn,
  RowData,
  RowSelectionOptions,
  RowSelectionState,
  RowSelectionTableState,
  Table,
  Updater,
} from '@tanstack/table-core'

export interface FilterFlags<T extends RowData> {
  filterRender?: (props: FilterRenderProps<T>) => ReactElement
  alwaysShow?: boolean
  options?: OptionsValue[]
  multiple?: boolean
  clear?: () => void
  canBeCleared?: () => boolean
}

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    // name for table persistence - no default
    name: string
    // display table with reduced spacing - default = false
    compact: boolean
    // display leading gutter, helping align with headers and search - default true
    displayGutter?: boolean
    // configure the rowStyle, `fixed`: width is an absolute value, `flex`: width is a proportion of the row width
    rowStyle?: 'flex' | 'fixed'
  }

  interface TableOptionsResolved<TData extends RowData> {
    keyField?: keyof TData
    enablePagination?: boolean
    defaultColumnDisableGlobalFilter?: boolean
  }

  interface FilterRenderProps<T extends RowData> {
    column: Column<T, unknown>
    table: Table<T>
    clear?: () => void
    meta?: FilterFlags<T>
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    /** set the name to provide a readable name for the column - should really just be the string
     * version of Header.  If it's missing then we'll default to converting the id into words. */
    name?: string
    align?: 'left' | 'right' | undefined
    alwaysShowTooltip?: boolean
    filterFlags?: FilterFlags<T>
    dateFormat?: string
    edit?: TableEditColumnConfig<TData>
  }

  interface FilterFns<TData extends RowData> {
    numericText: FilterFn<TData>
  }
}
