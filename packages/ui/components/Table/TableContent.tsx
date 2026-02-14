import type { ReactElement, RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import type { Theme, SxProps } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import type { Cell, CellContext, Row, RowData, Table as TableInstance } from '@tanstack/react-table'
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
import { TableCellEditor } from './editing/TableCellEditor'
import type { TableCellEditState, TableEditingState } from './editing/useTableEditing'
import type { RowStyleType } from './utils/tableUtils'

const log = debug('amber:ui:table:TableContent')

type TableCellContentProps<T extends RowData> = {
  cell: Cell<T, unknown>
  cellClickHandler: (cell: Cell<T, unknown>) => () => void
  rowStyle: RowStyleType
  row: Row<T>
  editing: TableEditingState<T>
  cellState: TableCellEditState
  isActiveCell: boolean
  isEditable: boolean
}

const TableCellContent = <T extends RowData>({
  cell,
  cellClickHandler,
  rowStyle,
  row,
  editing,
  cellState,
  isActiveCell,
  isEditable,
}: TableCellContentProps<T>) => {
  const align = cell.getIsGrouped() ? 'left' : cell.column.columnDef?.meta?.align === 'right' ? 'right' : 'left'
  const width = cell.column.getSize()
  const { errorMessages } = cellState
  const hasErrors = cellState.hasError
  const { isEdited } = cellState
  const sx = useMemo(
    () =>
      [
        {
          py: 'var(--table-compact-spacing)',
          width,
          textAlign: align,
          display: 'flex',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
          position: 'relative',
          cursor: isEditable ? 'text' : 'default',
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
        (hasErrors || isEdited) &&
          ((theme: Theme) => ({
            boxShadow: [
              isEdited ? `inset 3px 0 0 ${theme.palette.info.main}` : null,
              hasErrors ? `inset 0 0 0 2px ${theme.palette.error.main}` : null,
            ]
              .filter(Boolean)
              .join(', '),
            backgroundColor: hasErrors ? alpha(theme.palette.error.main, 0.08) : undefined,
          })),
      ] as const,
    [align, cell.column, hasErrors, isEditable, isEdited, rowStyle, width],
  )

  const shouldRenderEditor = editing.enabled && isActiveCell
  const displayValue = editing.getCellDisplayValue(cell)
  const cellContext = cell.getContext()
  const renderContext = editing.enabled
    ? ({
        ...cellContext,
        getValue: () => displayValue,
        cell: {
          ...cell,
          getValue: () => displayValue,
          renderValue: () => displayValue,
        },
      } as CellContext<T, unknown>)
    : cellContext

  const regularCellContent = cell.getIsGrouped() ? (
    <>
      <GroupExpansionButton row={row} />
      {flexRender(cell.column.columnDef.cell, renderContext)}
      <span>({row.subRows.length})</span>
    </>
  ) : cell.getIsAggregated() ? (
    flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, renderContext)
  ) : cell.getIsPlaceholder() ? null : (
    <>{flexRender(cell.column.columnDef.cell, renderContext)}</>
  )

  const editingCellContent = (
    <>
      <Box sx={{ visibility: 'hidden', width: '100%' }}>{regularCellContent}</Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'inherit',
          paddingLeft: 'inherit',
          paddingRight: 'inherit',
          width: '100%',
        }}
      >
        <TableCellEditor
          cell={cell}
          value={editing.activeValue}
          onChange={editing.updateActiveValue}
          onCommit={() => {
            editing.commitActiveCell()
            editing.cancelActiveCell()
          }}
          onCancel={() => {
            editing.cancelActiveCell()
          }}
          hasError={hasErrors}
        />
      </Box>
    </>
  )

  return (
    <TableCell
      key={cell.id}
      data-testid={`cell-${cell.id}`}
      data-cell-id={cell.id}
      data-edited={isEdited ? 'true' : 'false'}
      data-invalid={hasErrors ? 'true' : 'false'}
      title={hasErrors ? errorMessages.join(', ') : undefined}
      onClick={cellClickHandler(cell)}
      sx={sx}
    >
      {shouldRenderEditor ? editingCellContent : regularCellContent}
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
  editing,
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
  editing: TableEditingState<T>
}) => {
  const row = (useVirtualRows ? rows[rowOrVirtualRow.index] : rowOrVirtualRow) as Row<T>
  const cellClickHandler = useCallback(
    (cell: Cell<T, unknown>) => () => {
      const isEditable = editing.enabled && editing.isCellEditable(cell)
      if (
        editing.enabled &&
        isEditable &&
        !cell.column.getIsGrouped() &&
        !cell.row.getIsGrouped() &&
        cell.column.id !== SELECTION_COLUMN_ID
      ) {
        editing.startEditing(cell)
        return
      }

      if (
        onRowClick &&
        !editing.enabled &&
        !cell.column.getIsGrouped() &&
        !cell.row.getIsGrouped() &&
        cell.column.id !== SELECTION_COLUMN_ID
      )
        onRowClick(cell.row)
    },
    [editing, onRowClick],
  )
  const onKeyDownHandler = useCallback(
    (event: any) => {
      if (event.key === 'Enter' && onRowClick && !editing.enabled) {
        onRowClick(row)
      }
    },
    [editing, onRowClick, row],
  )
  const isSelected = row.getIsSelected()
  const isHighlighted = highlightRow(row)
  const rowState = editing.getRowState(row)
  const rowClasses = useMemo(
    () =>
      clsx({
        rowSelected: isSelected,
        rowHighlighted: isHighlighted,
        clickable: !!onRowClick && !editing.enabled,
      }),
    [editing.enabled, onRowClick, isHighlighted, isSelected],
  )

  const cells = row.getVisibleCells()
  const tableSx = useMemo(
    () =>
      ({
        tableRow: [
          displayGutter
            ? {
                "& > [role='cell']:first-of-type": {
                  pl: 3,
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
          rowState?.hasError
            ? (theme: Theme) => ({
                backgroundColor: alpha(theme.palette.error.main, 0.04),
              })
            : undefined,
        ] as const,
        svg: {
          '& svg': {
            width: '16px',
            height: '16px',
          },
        },
      }) as const,
    [displayGutter, emptyRows, rowState?.hasError, rowStyle, scrollBehavior],
  )

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
        <TableCellContent
          key={cell.id}
          cell={cell}
          row={row}
          cellClickHandler={cellClickHandler}
          rowStyle={rowStyle}
          editing={editing}
          cellState={editing.getCellState(cell)}
          isActiveCell={editing.activeCell?.rowId === row.id && editing.activeCell?.columnId === cell.column.id}
          isEditable={
            editing.enabled &&
            editing.isCellEditable(cell) &&
            !cell.column.getIsGrouped() &&
            !cell.row.getIsGrouped() &&
            cell.column.id !== SELECTION_COLUMN_ID
          }
        />
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
  editing,
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
  editing: TableEditingState<T>
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
                "& > [role='cell']:first-of-type": {
                  pl: 3,
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
            editing={editing}
          />
        )
      })}
    </TableBody>
  )
}
