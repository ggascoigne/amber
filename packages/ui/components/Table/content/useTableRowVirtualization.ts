import type { RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'

import useResizeObserver from '@react-hook/resize-observer'
import type { Row, RowData, Table as TableInstance } from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import { useVirtualizer } from '@tanstack/react-virtual'
import { oneLine } from 'common-tags'

const measureElement = (element: Element) => element?.getBoundingClientRect().height

export type TableRowListItem<TData extends RowData> = Row<TData> | VirtualItem

type UseTableRowVirtualizationProps<TData extends RowData> = {
  compact: boolean
  hasExpandedContent: boolean
  rows: Array<Row<TData>>
  table: TableInstance<TData>
  tableContainerRef: RefObject<HTMLDivElement | null>
  useVirtualRows?: boolean
}

export const useTableRowVirtualization = <TData extends RowData>({
  compact,
  hasExpandedContent,
  rows,
  table,
  tableContainerRef,
  useVirtualRows,
}: UseTableRowVirtualizationProps<TData>) => {
  const [warnOnRows, setWarnOnRows] = useState(true)
  const enableVirtualRows = rows.length > 20 && useVirtualRows && !hasExpandedContent
  const estimateRowHeight = compact ? 34.2 : 50.2
  const getVirtualRowKey = useCallback((virtualIndex: number) => rows[virtualIndex]?.id ?? virtualIndex, [rows])

  if (rows.length > 500 && table.options.manualPagination && warnOnRows) {
    console.warn(
      oneLine`
        DataTable has ${rows.length} rows with manualPagination enabled.
        This seems likely to be a configuration bug, either paginate the data
        down to a more reasonable size, or disable manualPagination.`,
    )
    setWarnOnRows(false)
  }

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => estimateRowHeight,
    getScrollElement: () => tableContainerRef.current,
    getItemKey: getVirtualRowKey,
    measureElement,
    overscan: 5,
  })

  const recalculateVirtualRows = useCallback(() => {
    if (!enableVirtualRows) return
    requestAnimationFrame(() => {
      rowVirtualizer.measure()
    })
  }, [enableVirtualRows, rowVirtualizer])

  useResizeObserver(tableContainerRef, recalculateVirtualRows)

  useEffect(() => {
    recalculateVirtualRows()
  }, [recalculateVirtualRows, rows.length])

  return {
    enableVirtualRows,
    rowList: enableVirtualRows ? (rowVirtualizer.getVirtualItems() as Array<TableRowListItem<TData>>) : rows,
    rowVirtualizer,
    tableHeight: rowVirtualizer.getTotalSize(),
  }
}
