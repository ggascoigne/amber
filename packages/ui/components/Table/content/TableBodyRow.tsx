import type { KeyboardEvent, ReactElement } from 'react'
import { useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import type { Cell, CellContext, Row, RowData, Table as TableInstance } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'
import { clsx } from 'clsx'

import type { Action } from '../actions'
import { GroupExpansionButton } from '../components/GroupExpansionButton'
import { RowHoverButtons } from '../components/RowHoverButtons'
import { TableCell, TableRow } from '../components/TableStyles'
import { TableCellEditor } from '../editing/TableCellEditor'
import type { TableCellEditState, TableEditingState } from '../editing/useTableEditing'
import type { RowStyleType } from '../utils/tableUtils'
import { isUserColumnId } from '../utils/tableUtils'

type TableCellContentProps<TData extends RowData> = {
  cell: Cell<TData, unknown>
  cellClickHandler: (cell: Cell<TData, unknown>) => () => void
  cellState: TableCellEditState
  editing: TableEditingState<TData>
  isActiveCell: boolean
  isEditable: boolean
  navigateCell?: (cell: Cell<TData, unknown>, direction: 'next' | 'previous') => boolean
  row: Row<TData>
  rowStyle: RowStyleType
}

const TableCellContent = <TData extends RowData>({
  cell,
  cellClickHandler,
  cellState,
  editing,
  isActiveCell,
  isEditable,
  navigateCell,
  row,
  rowStyle,
}: TableCellContentProps<TData>) => {
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
          isUserColumnId(cell.column.id) && {
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
      } as CellContext<TData, unknown>)
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
          onNavigate={(direction) => (navigateCell ? navigateCell(cell, direction) : false)}
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

type RowHoverButtonWrapperProps<TData extends RowData> = {
  compact?: boolean
  handleMenuClose: () => void
  handleRowHover: (rowId: string) => void
  id: string
  rowActions?: ReadonlyArray<Action<TData>>
  table: TableInstance<TData>
  visible: boolean
}

const RowHoverButtonWrapper = <TData extends RowData>({
  compact,
  handleMenuClose,
  handleRowHover,
  id,
  rowActions,
  table,
  visible,
}: RowHoverButtonWrapperProps<TData>) => {
  const handleMenuOpen = useCallback(() => handleRowHover(id), [handleRowHover, id])

  return (
    <RowHoverButtons
      visible={visible}
      table={table}
      rowActions={rowActions}
      selectedKeys={id}
      handleMenuClose={handleMenuClose}
      handleMenuOpen={handleMenuOpen}
      compact={compact}
    />
  )
}

type TableBodyRowProps<TData extends RowData> = {
  compact: boolean
  displayGutter: boolean
  editing: TableEditingState<TData>
  emptyRows: number
  handleMenuClose: () => void
  handleRowHover: (rowId: string) => void
  highlightRow: (row: Row<TData>) => boolean
  navigateCell: (cell: Cell<TData, unknown>, direction: 'next' | 'previous') => boolean
  onRowClick?: (row: Row<TData>) => void
  pageElevation?: number
  row: Row<TData>
  rowActions?: ReadonlyArray<Action<TData>>
  rowStyle: RowStyleType
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  scrollBehavior?: 'none' | 'bounded'
  showButtons: boolean
  table: TableInstance<TData>
  virtualRow?: VirtualItem
}

export const TableBodyRow = <TData extends RowData>({
  compact,
  displayGutter,
  editing,
  emptyRows,
  handleMenuClose,
  handleRowHover,
  highlightRow,
  navigateCell,
  onRowClick,
  pageElevation,
  row,
  rowActions,
  rowStyle,
  rowVirtualizer,
  scrollBehavior,
  showButtons,
  table,
  virtualRow,
}: TableBodyRowProps<TData>): ReactElement => {
  const cellClickHandler = useCallback(
    (cell: Cell<TData, unknown>) => () => {
      const isEditable = editing.enabled && editing.isCellEditable(cell)
      if (
        editing.enabled &&
        isEditable &&
        !cell.column.getIsGrouped() &&
        !cell.row.getIsGrouped() &&
        isUserColumnId(cell.column.id)
      ) {
        editing.startEditing(cell)
        return
      }

      if (
        onRowClick &&
        !editing.enabled &&
        !cell.column.getIsGrouped() &&
        !cell.row.getIsGrouped() &&
        isUserColumnId(cell.column.id)
      ) {
        onRowClick(cell.row)
      }
    },
    [editing, onRowClick],
  )

  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' && onRowClick && !editing.enabled) {
        onRowClick(row)
      }
    },
    [editing.enabled, onRowClick, row],
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
    [editing.enabled, isHighlighted, isSelected, onRowClick],
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
          rowState?.hasError
            ? (theme: Theme) => ({
                backgroundColor: alpha(theme.palette.error.main, 0.04),
              })
            : undefined,
        ] as const,
      }) as const,
    [displayGutter, emptyRows, rowState?.hasError, rowStyle, scrollBehavior],
  )

  const isVirtualRow = !!virtualRow

  return (
    <TableRow
      data-index={virtualRow?.index ?? row.index}
      ref={isVirtualRow ? rowVirtualizer.measureElement : undefined}
      pageElevation={pageElevation}
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
      sx={tableSx.tableRow as any}
      style={
        virtualRow
          ? {
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
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
          navigateCell={navigateCell}
          cellState={editing.getCellState(cell)}
          isActiveCell={editing.activeCell?.rowId === row.id && editing.activeCell?.columnId === cell.column.id}
          isEditable={
            editing.enabled &&
            editing.isCellEditable(cell) &&
            !cell.column.getIsGrouped() &&
            !cell.row.getIsGrouped() &&
            isUserColumnId(cell.column.id)
          }
        />
      ))}

      {rowActions && !row.getIsGrouped() ? (
        <RowHoverButtonWrapper
          visible={showButtons}
          table={table}
          rowActions={rowActions}
          id={row.id}
          handleMenuClose={handleMenuClose}
          handleRowHover={handleRowHover}
          compact={compact}
        />
      ) : null}
    </TableRow>
  )
}
