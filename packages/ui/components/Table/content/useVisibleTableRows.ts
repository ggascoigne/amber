import { useMemo } from 'react'

import type { Row, RowData, Table as TableInstance } from '@tanstack/react-table'

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
  const allRows = table.getRowModel().rows

  return useMemo(() => getVisibleTableRows(allRows, showExpandedOnly), [allRows, showExpandedOnly])
}
