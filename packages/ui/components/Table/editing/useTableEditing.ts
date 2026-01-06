import { useCallback, useMemo, useRef, useState } from 'react'

import type { Cell, Row, RowData, Table } from '@tanstack/react-table'

import type { DataTableEditingConfig, TableEditColumnConfig, TableEditRowUpdate, TableValidationResult } from './types'

export type TableEditingCell = {
  rowId: string
  columnId: string
}

type TableEditingRowState<TData extends RowData> = {
  original: TData
  changes: Record<string, unknown>
  cellErrors: Record<string, Array<string>>
  rowErrors: Array<string>
}

export type TableCellEditState = {
  isEdited: boolean
  hasError: boolean
  errorMessages: Array<string>
}

export type TableRowEditState = {
  hasError: boolean
  errorMessages: Array<string>
}

export type TableEditingState<TData extends RowData> = {
  enabled: boolean
  activeCell: TableEditingCell | null
  activeValue: unknown
  isEditing: boolean
  isSaving: boolean
  hasChanges: boolean
  hasErrors: boolean
  editedRowCount: number
  isCellEditable: (cell: Cell<TData, unknown>) => boolean
  getCellDisplayValue: (cell: Cell<TData, unknown>) => unknown
  getCellState: (cell: Cell<TData, unknown>) => TableCellEditState
  getRowState: (row: Row<TData>) => TableRowEditState
  startEditing: (cell: Cell<TData, unknown>) => void
  updateActiveValue: (value: unknown) => void
  commitActiveCell: () => Record<string, TableEditingRowState<TData>>
  cancelActiveCell: () => void
  saveChanges: () => Promise<void>
  discardChanges: () => void
}

type UseTableEditingProps<TData extends RowData> = {
  table: Table<TData>
  config?: DataTableEditingConfig<TData>
}

const normalizeValidationResult = (result: TableValidationResult): Array<string> => {
  if (!result) return []
  return Array.isArray(result) ? result : [result]
}

const coerceInputValue = <TData extends RowData>(
  value: unknown,
  columnConfig: TableEditColumnConfig<TData> | undefined,
  row: Row<TData>,
) => {
  if (columnConfig?.parseValue) {
    return columnConfig.parseValue(String(value ?? ''), row)
  }

  if (columnConfig?.type === 'number') {
    if (value === '' || value === null || value === undefined) return null
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  return value
}

const normalizeValueForInput = (value: unknown) => value ?? ''

export const useTableEditing = <TData extends RowData>({
  table,
  config,
}: UseTableEditingProps<TData>): TableEditingState<TData> => {
  const enabled = config?.enabled ?? false
  const [activeCell, setActiveCell] = useState<TableEditingCell | null>(null)
  const [activeValue, setActiveValue] = useState<unknown>('')
  const [edits, setEdits] = useState<Record<string, TableEditingRowState<TData>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const activeCellRef = useRef<{ row: Row<TData>; column: Cell<TData, unknown>['column'] } | null>(null)
  const editsRef = useRef(edits)

  editsRef.current = edits

  const isCellEditable = useCallback(
    (cell: Cell<TData, unknown>) => {
      if (!enabled) return false
      const configValue = cell.column.columnDef.meta?.edit as TableEditColumnConfig<TData> | undefined
      if (!configValue) return false
      return configValue.isEditable ? configValue.isEditable(cell.row) : true
    },
    [enabled],
  )

  const applyRowChanges = useCallback(
    (row: TData, changes: Record<string, unknown>) => {
      let updatedRow = row
      let cloned = false

      for (const [columnId, value] of Object.entries(changes)) {
        const column = table.getColumn(columnId)
        if (column) {
          const editConfig = column.columnDef.meta?.edit as TableEditColumnConfig<TData> | undefined
          if (editConfig?.setValue) {
            updatedRow = editConfig.setValue(updatedRow, value)
            cloned = true
          } else {
            const accessorKey = 'accessorKey' in column.columnDef ? column.columnDef.accessorKey : undefined
            if (accessorKey !== undefined && accessorKey !== null) {
              if (!cloned) {
                updatedRow = { ...(updatedRow as Record<string, unknown>) } as TData
                cloned = true
              }
              ;(updatedRow as Record<string, unknown>)[accessorKey as string] = value
            }
          }
        }
      }

      return updatedRow
    },
    [table],
  )

  const getCoreRowById = useCallback(
    (rowId: string) => table.getCoreRowModel().flatRows.find((row) => row.id === rowId) ?? null,
    [table],
  )

  const buildNextEdits = useCallback(
    (
      currentEdits: Record<string, TableEditingRowState<TData>>,
      row: Row<TData>,
      column: Cell<TData, unknown>['column'],
      rawValue: unknown,
    ) => {
      const rowId = row.id
      const columnId = column.id
      const editConfig = column.columnDef.meta?.edit as TableEditColumnConfig<TData> | undefined
      const originalValue = row.getValue(columnId)
      const nextValue = coerceInputValue(rawValue, editConfig, row)
      const isChanged = !Object.is(nextValue, originalValue)

      const existingRowState = currentEdits[rowId] ?? {
        original: row.original,
        changes: {},
        cellErrors: {},
        rowErrors: [],
      }

      const nextChanges = { ...existingRowState.changes }
      if (isChanged) {
        nextChanges[columnId] = nextValue
      } else {
        delete nextChanges[columnId]
      }

      if (Object.keys(nextChanges).length === 0) {
        const nextEdits = { ...currentEdits }
        delete nextEdits[rowId]
        return nextEdits
      }

      const updatedRow = applyRowChanges(existingRowState.original, nextChanges)

      const nextCellErrors = { ...existingRowState.cellErrors }
      if (isChanged && config?.validateCell) {
        const cellErrors = normalizeValidationResult(
          config.validateCell({
            table,
            row,
            column,
            value: nextValue,
            originalValue,
            updatedRow,
          }),
        )
        if (cellErrors.length > 0) {
          nextCellErrors[columnId] = cellErrors
        } else {
          delete nextCellErrors[columnId]
        }
      } else {
        delete nextCellErrors[columnId]
      }

      const rowErrors = config?.validateRow
        ? normalizeValidationResult(
            config.validateRow({
              table,
              row,
              changes: nextChanges,
              updatedRow,
            }),
          )
        : []

      return {
        ...currentEdits,
        [rowId]: {
          original: existingRowState.original,
          changes: nextChanges,
          cellErrors: nextCellErrors,
          rowErrors,
        },
      }
    },
    [applyRowChanges, config, table],
  )

  const validateAllEdits = useCallback(
    (currentEdits: Record<string, TableEditingRowState<TData>>) => {
      let hasErrors = false
      const nextEdits: Record<string, TableEditingRowState<TData>> = {}

      for (const [rowId, rowState] of Object.entries(currentEdits)) {
        if (Object.keys(rowState.changes).length > 0) {
          const row = getCoreRowById(rowId)
          const updatedRow = applyRowChanges(rowState.original, rowState.changes)
          const nextCellErrors: Record<string, Array<string>> = {}

          if (row && config?.validateCell) {
            for (const [columnId, value] of Object.entries(rowState.changes)) {
              const column = table.getColumn(columnId)
              if (column) {
                const originalValue = row.getValue(columnId)
                const cellErrors = normalizeValidationResult(
                  config.validateCell({
                    table,
                    row,
                    column,
                    value,
                    originalValue,
                    updatedRow,
                  }),
                )
                if (cellErrors.length > 0) {
                  nextCellErrors[columnId] = cellErrors
                  hasErrors = true
                }
              }
            }
          }

          const rowErrors =
            row && config?.validateRow
              ? normalizeValidationResult(
                  config.validateRow({
                    table,
                    row,
                    changes: rowState.changes,
                    updatedRow,
                  }),
                )
              : []

          if (rowErrors.length > 0) {
            hasErrors = true
          }

          nextEdits[rowId] = {
            ...rowState,
            cellErrors: nextCellErrors,
            rowErrors,
          }
        }
      }

      return { nextEdits, hasErrors }
    },
    [applyRowChanges, config, getCoreRowById, table],
  )

  const startEditing = useCallback(
    (cell: Cell<TData, unknown>) => {
      if (!enabled || !isCellEditable(cell)) return
      if (activeCell?.rowId === cell.row.id && activeCell.columnId === cell.column.id) return

      if (activeCellRef.current) {
        const nextEdits = buildNextEdits(
          editsRef.current,
          activeCellRef.current.row,
          activeCellRef.current.column,
          activeValue,
        )
        editsRef.current = nextEdits
        setEdits(nextEdits)
      }

      activeCellRef.current = { row: cell.row, column: cell.column }
      setActiveCell({ rowId: cell.row.id, columnId: cell.column.id })

      const existingValue = Object.prototype.hasOwnProperty.call(
        editsRef.current[cell.row.id]?.changes ?? {},
        cell.column.id,
      )
        ? editsRef.current[cell.row.id]?.changes[cell.column.id]
        : cell.getValue()

      setActiveValue(normalizeValueForInput(existingValue))
    },
    [activeCell, activeValue, buildNextEdits, enabled, isCellEditable],
  )

  const commitActiveCell = useCallback(() => {
    if (!enabled || !activeCellRef.current) return editsRef.current
    const nextEdits = buildNextEdits(
      editsRef.current,
      activeCellRef.current.row,
      activeCellRef.current.column,
      activeValue,
    )
    editsRef.current = nextEdits
    setEdits(nextEdits)
    return nextEdits
  }, [activeValue, buildNextEdits, enabled])

  const cancelActiveCell = useCallback(() => {
    activeCellRef.current = null
    setActiveCell(null)
    setActiveValue('')
  }, [])

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

  const hasChanges = useMemo(() => Object.keys(edits).length > 0, [edits])

  const hasErrors = useMemo(
    () =>
      Object.values(edits).some((rowState) => {
        if (rowState.rowErrors.length > 0) return true
        return Object.values(rowState.cellErrors).some((errors) => errors.length > 0)
      }),
    [edits],
  )

  const editedRowCount = useMemo(() => Object.keys(edits).length, [edits])

  const saveChanges = useCallback(async () => {
    if (!enabled || !config?.onSave) return

    const pendingEdits = commitActiveCell()
    cancelActiveCell()

    const { nextEdits, hasErrors: validationErrors } = validateAllEdits(pendingEdits)
    editsRef.current = nextEdits
    setEdits(nextEdits)

    if (validationErrors) return

    const updates: Array<TableEditRowUpdate<TData>> = Object.entries(nextEdits).map(([rowId, rowState]) => ({
      rowId,
      original: rowState.original,
      updated: applyRowChanges(rowState.original, rowState.changes),
      changes: rowState.changes,
    }))

    try {
      setIsSaving(true)
      await config.onSave(updates)
      editsRef.current = {}
      setEdits({})
    } finally {
      setIsSaving(false)
    }
  }, [applyRowChanges, cancelActiveCell, commitActiveCell, config, enabled, validateAllEdits])

  const discardChanges = useCallback(() => {
    cancelActiveCell()
    editsRef.current = {}
    setEdits({})
    config?.onDiscard?.()
  }, [cancelActiveCell, config])

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
    updateActiveValue: setActiveValue,
    commitActiveCell,
    cancelActiveCell,
    saveChanges,
    discardChanges,
  }
}
