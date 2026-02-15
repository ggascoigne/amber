import type { Column, Row, RowData, Table } from '@tanstack/react-table'

export type TableEditColumnType = 'text' | 'number' | 'select' | 'autocomplete'

export type TableOptionColumn = {
  value: string
  align?: 'left' | 'center' | 'right'
  width?: number | string
}

export type TableEditOption = {
  label: string
  value: string | number
  columns?: Array<TableOptionColumn>
  disabled?: boolean
  isHeader?: boolean
  fontWeight?: number
}

export type TableAutocompleteOption = {
  label: string
  value: string | number
  columns?: Array<TableOptionColumn>
  disabled?: boolean
  isHeader?: boolean
  fontWeight?: number
}

export type TableEditAutocompleteConfig<TData extends RowData> = {
  options?: Array<TableAutocompleteOption>
  getOptions?: (row: Row<TData>) => Array<TableAutocompleteOption>
  getOptionLabel?: (option: TableAutocompleteOption) => string
  isOptionEqual?: (option: TableAutocompleteOption, value: TableAutocompleteOption) => boolean
}

export type TableEditCellContext<TData extends RowData> = {
  table: Table<TData>
  getValue: (row: Row<TData>, columnId: string) => unknown
}

export type TableEditColumnConfig<TData extends RowData> = {
  type: TableEditColumnType
  options?: Array<TableEditOption>
  getOptions?: (row: Row<TData>) => Array<TableEditOption>
  autocomplete?: TableEditAutocompleteConfig<TData>
  isEditable?: (row: Row<TData>, context: TableEditCellContext<TData>) => boolean
  parseValue?: (value: string, row: Row<TData>) => unknown
  formatValue?: (value: unknown, row: Row<TData>) => string
  placeholder?: string
  setValue?: (row: TData, value: unknown) => TData
}

export type TableValidationResult = Array<string> | string | null | undefined

export type TableCellValidationParams<TData extends RowData> = {
  table: Table<TData>
  row: Row<TData>
  column: Column<TData, unknown>
  value: unknown
  originalValue: unknown
  updatedRow: TData
}

export type TableRowValidationParams<TData extends RowData> = {
  table: Table<TData>
  row: Row<TData>
  changes: Record<string, unknown>
  updatedRow: TData
}

export type TableCellValidationFn<TData extends RowData> = (
  params: TableCellValidationParams<TData>,
) => TableValidationResult

export type TableRowValidationFn<TData extends RowData> = (
  params: TableRowValidationParams<TData>,
) => TableValidationResult

export type TableEditRowUpdate<TData extends RowData> = {
  rowId: string
  original: TData
  updated: TData
  changes: Record<string, unknown>
}

export type DataTableAddRowConfig<TData extends RowData> = {
  enabled: boolean
  createRow: () => TData
  onAddRow: (row: TData) => Promise<void> | void
  isNewRow: (row: TData) => boolean
}

export type DataTableEditingConfig<TData extends RowData> = {
  enabled: boolean
  onSave: (updates: Array<TableEditRowUpdate<TData>>) => Promise<void> | void
  onDiscard?: () => void
  validateCell?: TableCellValidationFn<TData>
  validateRow?: TableRowValidationFn<TData>
  addRow?: DataTableAddRowConfig<TData>
}
