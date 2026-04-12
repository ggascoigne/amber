import type { Row, RowData } from '@tanstack/react-table'

import type { TableEditColumnConfig, TableValidationResult } from './types'

export const normalizeValidationResult = (result: TableValidationResult): Array<string> => {
  if (!result) return []
  return Array.isArray(result) ? result : [result]
}

export const coerceInputValue = <TData extends RowData>(
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

export const normalizeValueForInput = (value: unknown) => value ?? ''
