import type { ReactElement, ReactNode, RefObject } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import type { Theme, SxProps } from '@mui/material/styles'
import type { Row, RowData, Table as TableInstance } from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import debug from 'debug'

import type { Action } from './actions'
import { TableBody } from './components/TableStyles'
import { TableBodyRow } from './content/TableBodyRow'
import { TableExpandedRow } from './content/TableExpandedRow'
import { useEditableCellNavigation } from './content/useEditableCellNavigation'
import { useTableRowVirtualization } from './content/useTableRowVirtualization'
import type { TableEditingState } from './editing/useTableEditing'
import type { RowStyleType } from './utils/tableUtils'

const log = debug('amber:ui:table:TableContent')

export const TableContent = <T extends RowData>({
  table,
  rows,
  onRowClick,
  sx,
  rowActions,
  tableContainerRef,
  highlightRow,
  displayGutter,
  rowStyle,
  compact,
  pageElevation,
  useVirtualRows,
  scrollBehavior,
  editing,
  renderExpandedContent,
  expandedContentSx,
}: {
  table: TableInstance<T>
  rows: Array<Row<T>>
  onRowClick?: (row: Row<T>) => void
  sx?: SxProps<Theme>
  rowActions?: ReadonlyArray<Action<T>>
  tableContainerRef: RefObject<HTMLDivElement | null>
  highlightRow: (row: Row<T>) => boolean
  compact: boolean
  displayGutter: boolean
  rowStyle: RowStyleType
  pageElevation?: number
  useVirtualRows?: boolean
  scrollBehavior?: 'none' | 'bounded'
  editing: TableEditingState<T>
  renderExpandedContent?: (row: Row<T>) => ReactNode
  expandedContentSx?: SxProps<Theme>
}): ReactElement => {
  const hasExpandedContent = !!renderExpandedContent
  const { enableVirtualRows, rowList, rowVirtualizer, tableHeight } = useTableRowVirtualization({
    compact,
    hasExpandedContent,
    rows,
    table,
    tableContainerRef,
    useVirtualRows,
  })
  const [showButtons, setShowButtons] = useState<string | undefined>(undefined)

  const handleRowHover = useCallback((rowId: string) => {
    setShowButtons(rowId)
  }, [])

  const handleMenuClose = useCallback(() => {
    setTimeout(() => {
      setShowButtons(undefined)
    }, 300)
  }, [])

  const navigateCell = useEditableCellNavigation({ editing, rows })
  const { pagination } = table.getState()
  const emptyRows = table.options.enablePagination ? Math.max(0, pagination.pageSize - rows.length) : 0
  const tableSx = useMemo(
    () =>
      ({
        tableBody: [
          enableVirtualRows && {
            height: `${tableHeight}px`, // tells scrollbar how big the table is
            position: 'relative', // needed for absolute positioning of rows
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ],
        tableRow: [
          displayGutter
            ? {
                "& > [role='cell']:first-of-type": {
                  pl: 3,
                  pr: 1,
                },
                "& > [role='cell']:last-of-type": {
                  pr: 3,
                },
              }
            : {},
          rowStyle === 'flex' && {
            display: 'flex',
          },
          (emptyRows === 0 || scrollBehavior !== 'bounded') && {
            '&:last-of-type': {
              borderBottom: 'none',
            },
          },
        ] as const,
        svg: {
          '& svg': {
            width: '16px',
            height: '16px',
          },
        },
      }) as const,
    [displayGutter, emptyRows, rowStyle, scrollBehavior, sx, tableHeight, enableVirtualRows],
  )
  useEffect(() => {
    if (!editing.enabled || !editing.activeCell) return
    const rowExists = rows.some((row) => row.id === editing.activeCell?.rowId)
    if (!rowExists) {
      editing.commitActiveCell()
      editing.cancelActiveCell()
    }
  }, [editing, rows])

  return (
    <TableBody sx={tableSx.tableBody}>
      {rowList.map((rowOrVirtualRow) => {
        const virtualRow = enableVirtualRows ? (rowOrVirtualRow as VirtualItem) : null
        const row = (virtualRow ? rows[virtualRow.index] : rowOrVirtualRow) as Row<T>
        const expandedContent = renderExpandedContent && row.getIsExpanded() ? renderExpandedContent(row) : null

        return (
          <Fragment key={row.id}>
            <TableBodyRow<T>
              table={table}
              row={row}
              virtualRow={virtualRow ?? undefined}
              onRowClick={onRowClick}
              rowActions={rowActions}
              highlightRow={highlightRow}
              displayGutter={displayGutter}
              rowStyle={rowStyle}
              compact={compact}
              pageElevation={pageElevation}
              scrollBehavior={scrollBehavior}
              rowVirtualizer={rowVirtualizer}
              emptyRows={emptyRows}
              handleRowHover={handleRowHover}
              handleMenuClose={handleMenuClose}
              navigateCell={navigateCell}
              showButtons={showButtons === row.id}
              editing={editing}
            />
            {expandedContent ? (
              <TableExpandedRow
                pageElevation={pageElevation}
                displayGutter={displayGutter}
                expandedContentSx={expandedContentSx}
              >
                {expandedContent}
              </TableExpandedRow>
            ) : null}
          </Fragment>
        )
      })}
    </TableBody>
  )
}
