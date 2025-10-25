import type { ReactElement, RefObject } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { Theme, SxProps } from '@mui/material/styles'
import type { Cell, Row, RowData, Table as TableInstance } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'
import { useVirtualizer } from '@tanstack/react-virtual'
import { clsx } from 'clsx'
import { oneLine } from 'common-tags'
import debug from 'debug'

import type { Action } from './actions'
import { GroupExpansionButton } from './components/GroupExpansionButton'
import { RowHoverButtons } from './components/RowHoverButtons'
import { TableBody, TableCell, TableRow } from './components/TableStyles'
import { SELECTION_COLUMN_ID } from './constants'
import type { RowStyleType } from './utils/tableUtils'

const log = debug('amber:ui:table:TableContent')

type TableCellContentProps<T extends RowData> = {
  cell: Cell<T, unknown>
  cellClickHandler: (cell: Cell<T, unknown>) => () => void
  rowStyle: RowStyleType
  row: Row<T>
}

const TableCellContent = <T extends RowData>({ cell, cellClickHandler, rowStyle, row }: TableCellContentProps<T>) => {
  const align = cell.getIsGrouped() ? 'left' : cell.column.columnDef?.meta?.align === 'right' ? 'right' : 'left'
  const width = cell.column.getSize()
  const sx = useMemo(
    () =>
      [
        {
          py: 'var(--table-compact-spacing)',
          width,
          textAlign: align,
          display: 'flex',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        },
        rowStyle === 'flex' &&
          cell.column.id !== SELECTION_COLUMN_ID && {
            flex: `${width} 0 auto`,
          },
        rowStyle === 'fixed' && {
          '&:last-of-type': {
            flex: '1 1 auto',
          },
        },
      ] as const,
    [align, cell.column, rowStyle, width],
  )

  return (
    <TableCell key={cell.id} data-testid={`cell-${cell.id}`} onClick={cellClickHandler(cell)} sx={sx}>
      {cell.getIsGrouped() ? (
        <>
          <GroupExpansionButton row={row} />
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
          <span>({row.subRows.length})</span>
        </>
      ) : cell.getIsAggregated() ? (
        flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
      ) : cell.getIsPlaceholder() ? null : (
        <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
      )}
    </TableCell>
  )
}

type RowHoverButtonWrapperProps<T extends RowData> = {
  table: TableInstance<T>
  rowActions?: ReadonlyArray<Action<T>>
  allSelected: boolean
  visible: boolean
  compact?: boolean
  id: string
  handleRowHover: (rowId: string) => void
  handleMenuClose: () => void
}

const RowHoverButtonWrapper = <T extends RowData>(props: RowHoverButtonWrapperProps<T>) => {
  const { id, handleRowHover } = props
  const handleMenuOpen = useCallback(() => handleRowHover(id), [id, handleRowHover])
  return (
    <RowHoverButtons
      visible={props.visible}
      table={props.table}
      rowActions={props.rowActions}
      selectedKeys={id}
      handleMenuClose={props.handleMenuClose}
      handleMenuOpen={handleMenuOpen}
      compact={props.compact}
    />
  )
}

const RenderRow = <T extends RowData>({
  table,
  rows,
  rowOrVirtualRow,
  rowVirtualizer,
  emptyRows,
  onRowClick,
  showButtons,
  rowActions,
  handleRowHover,
  handleMenuClose,
  highlightRow,
  displayGutter,
  rowStyle,
  compact,
  pageElevation,
  useVirtualRows,
  scrollBehavior,
}: {
  table: TableInstance<T>
  rows: Row<T>[]
  rowOrVirtualRow: Row<T> | VirtualItem
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  emptyRows: number
  handleRowHover: (rowId: string) => void
  handleMenuClose: () => void
  onRowClick?: (row: Row<T>) => void
  showButtons: boolean
  rowActions?: ReadonlyArray<Action<T>>
  tableContainerRef: RefObject<HTMLDivElement | null>
  highlightRow: (row: Row<T>) => boolean
  compact: boolean
  displayGutter: boolean
  rowStyle: RowStyleType
  pageElevation?: number
  useVirtualRows?: boolean
  scrollBehavior?: 'none' | 'bounded'
}) => {
  const tableSx = useMemo(
    () =>
      ({
        tableRow: [
          displayGutter
            ? {
                '& >div:first-of-type': {
                  pl: 3,
                },
                '& >div:last-of-type': {
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
    [displayGutter, emptyRows, rowStyle, scrollBehavior],
  )
  const row = (useVirtualRows ? rows[rowOrVirtualRow.index] : rowOrVirtualRow) as Row<T>
  const cellClickHandler = useCallback(
    (cell: Cell<T, unknown>) => () => {
      if (
        onRowClick &&
        !cell.column.getIsGrouped() &&
        !cell.row.getIsGrouped() &&
        cell.column.id !== SELECTION_COLUMN_ID
      )
        onRowClick(cell.row)
    },
    [onRowClick],
  )
  const onKeyDownHandler = useCallback(
    (event: any) => {
      if (event.key === 'Enter' && onRowClick) {
        onRowClick(row)
      }
    },
    [onRowClick, row],
  )
  const isSelected = row.getIsSelected()
  const isHighlighted = highlightRow(row)
  const rowClasses = useMemo(
    () =>
      clsx({
        rowSelected: isSelected,
        rowHighlighted: isHighlighted,
        clickable: !!onRowClick,
      }),
    [onRowClick, isHighlighted, isSelected],
  )

  const cells = row.getVisibleCells()

  return (
    <TableRow
      key={row.id}
      data-index={rowOrVirtualRow.index} // needed for dynamic row height measurement
      ref={useVirtualRows ? rowVirtualizer.measureElement : undefined} // measure dynamic row height
      pageElevation={pageElevation}
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
      sx={tableSx.tableRow as any}
      style={
        useVirtualRows
          ? {
              position: 'absolute',
              transform: `translateY(${(rowOrVirtualRow as VirtualItem).start}px)`, // this should always be a `style` as it changes on scroll
            }
          : {}
      }
      className={rowClasses}
    >
      {cells.map((cell) => (
        <TableCellContent key={cell.id} cell={cell} row={row} cellClickHandler={cellClickHandler} rowStyle={rowStyle} />
      ))}

      {rowActions && !row.getIsGrouped() && (
        // change visible handling to be an override, that only kicks in if the menu is open.
        // other than that, just use the css based hover to display the buttons
        <RowHoverButtonWrapper
          visible={showButtons}
          table={table}
          rowActions={rowActions}
          id={row.id}
          allSelected={false}
          handleMenuClose={handleMenuClose}
          handleRowHover={handleRowHover}
          compact={compact}
        />
      )}
    </TableRow>
  )
}

const measureElement = (element: Element) => element?.getBoundingClientRect().height

export const TableContent = <T extends RowData>({
  table,
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
}: {
  table: TableInstance<T>
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
}): ReactElement => {
  const { rows } = table.getRowModel()
  const [warnOnRows, setWarnOnRows] = useState(true)

  const enableVirtualRows = rows.length > 20 && useVirtualRows

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
    estimateSize: () => estimateRowHeight, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    getItemKey: getVirtualRowKey,
    measureElement,
    overscan: 5,
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

  const { pagination } = table.getState()
  const emptyRows = table.options.enablePagination ? Math.max(0, pagination.pageSize - rows.length) : 0
  const rowList = enableVirtualRows ? rowVirtualizer.getVirtualItems() : rows

  const tableHeight = rowVirtualizer.getTotalSize()
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
                '& >div:first-of-type': {
                  pl: 3,
                },
                '& >div:last-of-type': {
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
  return (
    <TableBody sx={tableSx.tableBody}>
      {rowList.map((rowOrVirtualRow) => {
        const row = (enableVirtualRows ? rows[rowOrVirtualRow.index] : rowOrVirtualRow) as Row<T>
        return (
          <RenderRow<T>
            key={row.id}
            table={table}
            rowOrVirtualRow={rowOrVirtualRow}
            rows={rows}
            onRowClick={onRowClick}
            rowActions={rowActions}
            tableContainerRef={tableContainerRef}
            highlightRow={highlightRow}
            displayGutter={displayGutter}
            rowStyle={rowStyle}
            compact={compact}
            pageElevation={pageElevation}
            useVirtualRows={enableVirtualRows}
            scrollBehavior={scrollBehavior}
            rowVirtualizer={rowVirtualizer}
            emptyRows={emptyRows}
            handleRowHover={handleRowHover}
            handleMenuClose={handleMenuClose}
            showButtons={showButtons === row.id}
          />
        )
      })}
    </TableBody>
  )
}
