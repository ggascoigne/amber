import type { KeyboardEvent, ReactElement } from 'react'

import { Box, MenuItem, TextField } from '@mui/material'
import type { Cell, RowData } from '@tanstack/react-table'

import type { TableEditColumnConfig } from './types'

import { columnName } from '../utils/tableUtils'

export type TableCellEditorProps<TData extends RowData> = {
  cell: Cell<TData, unknown>
  value: unknown
  onChange: (value: unknown) => void
  onCommit: () => void
  onCancel: () => void
  hasError: boolean
}

const getInputValue = <TData extends RowData>(
  editConfig: TableEditColumnConfig<TData>,
  row: Cell<TData, unknown>['row'],
  value: unknown,
) => {
  if (editConfig.type === 'select') {
    return value ?? ''
  }

  if (editConfig.formatValue) {
    return editConfig.formatValue(value, row)
  }

  return value ?? ''
}

export const TableCellEditor = <TData extends RowData>({
  cell,
  value,
  onChange,
  onCommit,
  onCancel,
  hasError,
}: TableCellEditorProps<TData>): ReactElement | null => {
  const editConfig = cell.column.columnDef.meta?.edit as TableEditColumnConfig<TData> | undefined
  if (!editConfig) return null

  const align = cell.column.columnDef.meta?.align === 'right' ? 'right' : 'left'
  const options = editConfig.getOptions ? editConfig.getOptions(cell.row) : (editConfig.options ?? [])
  const inputValue = getInputValue(editConfig, cell.row, value)
  const inputLabel = `Edit ${columnName(cell.column)}`

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onCommit()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
      <TextField
        fullWidth
        autoFocus
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onCommit}
        onKeyDown={handleKeyDown}
        variant='standard'
        size='small'
        type={editConfig.type === 'select' ? undefined : editConfig.type === 'number' ? 'number' : 'text'}
        select={editConfig.type === 'select'}
        placeholder={editConfig.placeholder}
        error={hasError}
        inputProps={{
          'aria-label': inputLabel,
          inputMode: editConfig.type === 'number' ? 'numeric' : undefined,
        }}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            padding: 0,
            minHeight: 0,
            height: '100%',
            alignItems: 'center',
          },
          '& .MuiInputBase-input': {
            textAlign: align,
            padding: 0,
            lineHeight: 'inherit',
            boxSizing: 'border-box',
          },
          '& .MuiSelect-select': {
            padding: 0,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            paddingRight: '24px',
          },
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {editConfig.type === 'select'
          ? options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          : null}
      </TextField>
    </Box>
  )
}
