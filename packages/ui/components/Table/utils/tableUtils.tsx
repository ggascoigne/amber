import type { Column, ColumnDef, RowData } from '@tanstack/react-table'

import { camelToWords } from '../../../utils'
import { EXPAND_COLUMN_ID, SELECTION_COLUMN_ID } from '../constants'

export const columnName = <T,>(column: Column<T>) =>
  typeof column.columnDef.header === 'function'
    ? (column?.columnDef?.meta?.name ?? camelToWords(column.id))
    : (column.columnDef.header as string)

export const isUserColumnId = (columnId?: string) => columnId !== SELECTION_COLUMN_ID && columnId !== EXPAND_COLUMN_ID

export const isUserColumn = (column: { id?: string }) => isUserColumnId(column.id)

export type RowStyleType = 'flex' | 'fixed'

export const getColumnDefId = <T extends RowData>(columnDef: ColumnDef<T>): string | undefined => {
  if (typeof columnDef.id === 'string') {
    return columnDef.id
  }

  return 'accessorKey' in columnDef && typeof columnDef.accessorKey === 'string' ? columnDef.accessorKey : undefined
}

export const getLeafColumnIds = <T extends RowData>(columns: Array<ColumnDef<T>>): Array<string> =>
  columns.flatMap((column) => {
    if ('columns' in column && Array.isArray(column.columns)) {
      return getLeafColumnIds(column.columns as Array<ColumnDef<T>>)
    }

    const columnId = getColumnDefId(column)
    return columnId && isUserColumnId(columnId) ? [columnId] : []
  })

export const getDefaultSort = <T extends RowData>(columns: Array<ColumnDef<T>>) => {
  const [columnId] = getLeafColumnIds(columns)

  return columnId
    ? [
        {
          desc: false,
          id: columnId,
        },
      ]
    : []
}
