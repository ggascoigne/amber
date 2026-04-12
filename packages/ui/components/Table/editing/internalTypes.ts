import type { Cell, Row, RowData } from '@tanstack/react-table'

export type TableEditingCell = {
  rowId: string
  columnId: string
}

export type TableEditingRowState<TData extends RowData> = {
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
