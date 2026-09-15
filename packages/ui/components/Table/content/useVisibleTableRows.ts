import { useMemo } from 'react'

import type { Row, RowData, TableApi as TableInstance } from '../tableTypes'

export const getVisibleTableRows = <TData extends RowData>(rows: Array<Row<TData>>, showExpandedOnly = false) =>
  showExpandedOnly ? rows.filter((row) => row.getIsExpanded()) : rows

type UseVisibleTableRowsProps<TData extends RowData> = {
  table: TableInstance<TData>
  showExpandedOnly?: boolean
}

export const useVisibleTableRows = <TData extends RowData>({
  table,
  showExpandedOnly = false,
}: UseVisibleTableRowsProps<TData>) => {
  // The table feature set always supplies a paginated row model. When pagination
  // is disabled, use the model immediately before that step so callers do not
  // silently receive only the default 100 rows.
  const allRows = table.options.meta?.enablePagination ? table.getRowModel().rows : table.getPrePaginatedRowModel().rows

  return useMemo(() => getVisibleTableRows(allRows, showExpandedOnly), [allRows, showExpandedOnly])
}
