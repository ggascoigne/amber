import { useCallback, useMemo, useRef, useState } from 'react'

import type { Cell, Row, RowData, Table } from '@tanstack/react-table'

import { applyRowChanges, buildNextEdits, validateAllEdits } from './editingState'
import type { TableCellEditState, TableEditingRowState, TableEditingState, TableRowEditState } from './internalTypes'
import type { DataTableEditingConfig, TableEditColumnConfig, TableEditRowUpdate } from './types'
import { useActiveTableCell } from './useActiveTableCell'

export type {
  TableCellEditState,
  TableEditingCell,
  TableEditingRowState,
  TableEditingState,
  TableRowEditState,
} from './internalTypes'
type UseTableEditingProps<TData extends RowData> = {
  table: Table<TData>
  config?: DataTableEditingConfig<TData>
}

export const useTableEditing = <TData extends RowData>({
  table,
  config,
}: UseTableEditingProps<TData>): TableEditingState<TData> => {
  const enabled = config?.enabled ?? false
  const [edits, setEdits] = useState<Record<string, TableEditingRowState<TData>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const editsRef = useRef(edits)

  editsRef.current = edits

  const getPendingCellValue = useCallback((row: Row<TData>, columnId: string) => {
    const rowState = editsRef.current[row.id]
    if (!rowState) return row.getValue(columnId)
    if (Object.prototype.hasOwnProperty.call(rowState.changes, columnId)) {
      return rowState.changes[columnId]
    }
    return row.getValue(columnId)
  }, [])

  const isCellEditable = useCallback(
    (cell: Cell<TData, unknown>) => {
      if (!enabled) return false
      const configValue = cell.column.columnDef.meta?.edit as TableEditColumnConfig<TData> | undefined
      if (!configValue) return false
      return configValue.isEditable
        ? configValue.isEditable(cell.row, {
            table,
            getValue: getPendingCellValue,
          })
        : true
    },
    [enabled, getPendingCellValue, table],
  )

  const applyChangesToRow = useCallback(
    (row: TData, changes: Record<string, unknown>) => applyRowChanges({ row, changes, table }),
    [table],
  )

  const getCoreRowById = useCallback(
    (rowId: string) => table.getCoreRowModel().flatRows.find((row) => row.id === rowId) ?? null,
    [table],
  )

  const setCommittedEdits = useCallback((nextEdits: Record<string, TableEditingRowState<TData>>) => {
    editsRef.current = nextEdits
    setEdits(nextEdits)
  }, [])

  const commitPendingValue = useCallback(
    ({ column, row, value }: { column: Cell<TData, unknown>['column']; row: Row<TData>; value: unknown }) => {
      const nextEdits = buildNextEdits({
        config,
        currentEdits: editsRef.current,
        rawValue: value,
        row,
        column,
        table,
      })
      setCommittedEdits(nextEdits)
    },
    [config, setCommittedEdits, table],
  )

  const {
    activeCell,
    activeValue,
    activeCellTouched,
    cancelActiveCell,
    commitActiveCellChanges,
    startEditing,
    updateActiveValue,
  } = useActiveTableCell({
    commitPendingValue,
    enabled,
    getPendingValue: (cell) => getPendingCellValue(cell.row, cell.column.id),
    isCellEditable,
  })

  const commitActiveCell = useCallback(() => {
    commitActiveCellChanges()
    return editsRef.current
  }, [commitActiveCellChanges])

  const getCellDisplayValue = useCallback(
    (cell: Cell<TData, unknown>) => {
      const rowState = edits[cell.row.id]
      if (!rowState) return cell.getValue()
      if (Object.prototype.hasOwnProperty.call(rowState.changes, cell.column.id)) {
        return rowState.changes[cell.column.id]
      }
      return cell.getValue()
    },
    [edits],
  )

  const getCellState = useCallback(
    (cell: Cell<TData, unknown>): TableCellEditState => {
      const rowState = edits[cell.row.id]
      if (!rowState) return { isEdited: false, hasError: false, errorMessages: [] }
      const isEdited = Object.prototype.hasOwnProperty.call(rowState.changes, cell.column.id)
      const errorMessages = rowState.cellErrors[cell.column.id] ?? []
      return {
        isEdited,
        hasError: errorMessages.length > 0,
        errorMessages,
      }
    },
    [edits],
  )

  const getRowState = useCallback(
    (row: Row<TData>): TableRowEditState => {
      const rowState = edits[row.id]
      if (!rowState) return { hasError: false, errorMessages: [] }
      return {
        hasError: rowState.rowErrors.length > 0,
        errorMessages: rowState.rowErrors,
      }
    },
    [edits],
  )

  const hasChanges = useMemo(() => Object.keys(edits).length > 0 || activeCellTouched, [activeCellTouched, edits])

  const hasErrors = useMemo(
    () =>
      Object.values(edits).some((rowState) => {
        if (rowState.rowErrors.length > 0) return true
        return Object.values(rowState.cellErrors).some((errors) => errors.length > 0)
      }),
    [edits],
  )

  const editedRowCount = useMemo(() => {
    const rowIds = new Set(Object.keys(edits))
    if (activeCellTouched && activeCell?.rowId) {
      rowIds.add(activeCell.rowId)
    }
    return rowIds.size
  }, [activeCell?.rowId, activeCellTouched, edits])

  const saveChanges = useCallback(async () => {
    if (!enabled || !config?.onSave) return

    const pendingEdits = commitActiveCell()
    cancelActiveCell()

    const { nextEdits, hasErrors: validationErrors } = validateAllEdits({
      applyChanges: applyChangesToRow,
      config,
      currentEdits: pendingEdits,
      getCoreRowById,
      table,
    })
    setCommittedEdits(nextEdits)

    if (validationErrors) return

    const updates: Array<TableEditRowUpdate<TData>> = Object.entries(nextEdits).map(([rowId, rowState]) => ({
      rowId,
      original: rowState.original,
      updated: applyChangesToRow(rowState.original, rowState.changes),
      changes: rowState.changes,
    }))

    try {
      setIsSaving(true)
      if (config.addRow?.enabled) {
        const newRowUpdates = updates.filter((update) => config.addRow?.isNewRow(update.updated))
        const existingUpdates = updates.filter((update) => !config.addRow?.isNewRow(update.updated))

        if (existingUpdates.length > 0 || newRowUpdates.length === 0) {
          await config.onSave(existingUpdates)
        }

        if (newRowUpdates.length > 0 && config.addRow?.onAddRow) {
          await Promise.all(newRowUpdates.map((update) => config.addRow?.onAddRow(update.updated)))
        }
      } else {
        await config.onSave(updates)
      }
      setCommittedEdits({})
    } finally {
      setIsSaving(false)
    }
  }, [applyChangesToRow, cancelActiveCell, commitActiveCell, config, enabled, getCoreRowById, setCommittedEdits, table])

  const discardChanges = useCallback(() => {
    cancelActiveCell()
    setCommittedEdits({})
    config?.onDiscard?.()
  }, [cancelActiveCell, config, setCommittedEdits])

  return {
    enabled,
    activeCell,
    activeValue,
    isEditing: activeCell !== null,
    isSaving,
    hasChanges,
    hasErrors,
    editedRowCount,
    isCellEditable,
    getCellDisplayValue,
    getCellState,
    getRowState,
    startEditing,
    updateActiveValue,
    commitActiveCell,
    cancelActiveCell,
    saveChanges,
    discardChanges,
  }
}
