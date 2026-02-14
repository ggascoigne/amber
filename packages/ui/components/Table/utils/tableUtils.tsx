import type { AccessorKeyColumnDef, Column, ColumnDefBase } from '@tanstack/react-table'

import { camelToWords } from '../../../utils'
import { EXPAND_COLUMN_ID, SELECTION_COLUMN_ID } from '../constants'

export const columnName = <T,>(column: Column<T>) =>
  typeof column.columnDef.header === 'function'
    ? (column?.columnDef?.meta?.name ?? camelToWords(column.id))
    : (column.columnDef.header as string)

export const isUserColumnId = (columnId?: string) => columnId !== SELECTION_COLUMN_ID && columnId !== EXPAND_COLUMN_ID

export const isUserColumn = (column: { id?: string }) => isUserColumnId(column.id)

export type RowStyleType = 'flex' | 'fixed'

export const getDefaultSort = <T, P>(cols: ColumnDefBase<T, P>[]) => {
  const relevantColumn =
    // eslint-disable-next-line no-prototype-builtins
    cols?.[0]?.hasOwnProperty('columns') && (cols as any)[0].columns ? (cols as any)[0].columns[0] : cols[0]
  return [
    {
      desc: false,
      id: (relevantColumn as AccessorKeyColumnDef<T, T>).accessorKey,
    },
  ]
}
