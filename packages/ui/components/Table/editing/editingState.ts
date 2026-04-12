import type { Cell, Row, RowData, Table } from '@tanstack/react-table'

import { coerceInputValue, normalizeValidationResult } from './editingValidation'
import type { TableEditingRowState } from './internalTypes'
import type { DataTableEditingConfig, TableEditColumnConfig } from './types'

type ApplyRowChangesParams<TData extends RowData> = {
  changes: Record<string, unknown>
  row: TData
  table: Table<TData>
}

export const applyRowChanges = <TData extends RowData>({ changes, row, table }: ApplyRowChangesParams<TData>) => {
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
}

type BuildNextEditsParams<TData extends RowData> = {
  config?: DataTableEditingConfig<TData>
  currentEdits: Record<string, TableEditingRowState<TData>>
  rawValue: unknown
  row: Row<TData>
  column: Cell<TData, unknown>['column']
  table: Table<TData>
}

export const buildNextEdits = <TData extends RowData>({
  config,
  currentEdits,
  rawValue,
  row,
  column,
  table,
}: BuildNextEditsParams<TData>) => {
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

  const updatedRow = applyRowChanges({
    row: existingRowState.original,
    changes: nextChanges,
    table,
  })

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
}

type ValidateAllEditsParams<TData extends RowData> = {
  applyChanges: (row: TData, changes: Record<string, unknown>) => TData
  config?: DataTableEditingConfig<TData>
  currentEdits: Record<string, TableEditingRowState<TData>>
  getCoreRowById: (rowId: string) => Row<TData> | null
  table: Table<TData>
}

export const validateAllEdits = <TData extends RowData>({
  applyChanges,
  config,
  currentEdits,
  getCoreRowById,
  table,
}: ValidateAllEditsParams<TData>) => {
  let hasErrors = false
  const nextEdits: Record<string, TableEditingRowState<TData>> = {}

  for (const [rowId, rowState] of Object.entries(currentEdits)) {
    if (Object.keys(rowState.changes).length > 0) {
      const row = getCoreRowById(rowId)
      const updatedRow = applyChanges(rowState.original, rowState.changes)
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
}
