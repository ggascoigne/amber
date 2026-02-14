import type { KeyboardEvent, ReactElement } from 'react'

import { Autocomplete, Box, MenuItem, TextField } from '@mui/material'
import type { Cell, RowData } from '@tanstack/react-table'

import type {
  TableAutocompleteOption,
  TableEditAutocompleteConfig,
  TableEditColumnConfig,
  TableOptionColumn,
} from './types'

import { columnName } from '../utils/tableUtils'

export type TableCellEditorProps<TData extends RowData> = {
  cell: Cell<TData, unknown>
  value: unknown
  onChange: (value: unknown) => void
  onCommit: () => void
  onCancel: () => void
  onNavigate?: (direction: 'next' | 'previous') => boolean
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

const getAutocompleteOptions = <TData extends RowData>(
  config: TableEditAutocompleteConfig<TData> | undefined,
  row: Cell<TData, unknown>['row'],
) => {
  if (!config) return []
  if (config.getOptions) {
    return config.getOptions(row)
  }
  return config.options ?? []
}

const getColumnTemplate = (columns: Array<TableOptionColumn>) =>
  columns
    .map((column, index) => {
      if (column.width !== undefined) {
        return typeof column.width === 'number' ? `${column.width}px` : column.width
      }
      return index === 0 ? 'minmax(0, 1fr)' : 'minmax(0, 120px)'
    })
    .join(' ')

type TableOptionContent = {
  label: string
  columns?: Array<TableOptionColumn>
  isHeader?: boolean
}

const renderOptionContent = (option: TableOptionContent) => {
  if (!option.columns?.length) return option.label

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: getColumnTemplate(option.columns),
        gap: 1,
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
      }}
    >
      {option.columns.map((column, index) => (
        <Box
          key={`${index}-${column.value}`}
          sx={{
            fontWeight: option.isHeader ? 600 : undefined,
            color: option.isHeader ? 'text.secondary' : undefined,
            textAlign: column.align ?? (index === 0 ? 'left' : 'right'),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {column.value}
        </Box>
      ))}
    </Box>
  )
}

export const TableCellEditor = <TData extends RowData>({
  cell,
  value,
  onChange,
  onCommit,
  onCancel,
  onNavigate,
  hasError,
}: TableCellEditorProps<TData>): ReactElement | null => {
  const editConfig = cell.column.columnDef.meta?.edit as TableEditColumnConfig<TData> | undefined
  if (!editConfig) return null

  const align = cell.column.columnDef.meta?.align === 'right' ? 'right' : 'left'
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
    if (event.key === 'Tab' && onNavigate) {
      const handled = onNavigate(event.shiftKey ? 'previous' : 'next')
      if (handled) {
        event.preventDefault()
      }
    }
  }

  if (editConfig.type === 'autocomplete') {
    const autocompleteConfig = editConfig.autocomplete
    const options = getAutocompleteOptions(autocompleteConfig, cell.row)
    const optionLabel = autocompleteConfig?.getOptionLabel ?? ((option: TableAutocompleteOption) => option.label ?? '')
    const isOptionEqual = autocompleteConfig?.isOptionEqual ?? ((option, selected) => option.value === selected.value)
    const selectedOption = options.find((option) => option.value === value) ?? null

    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          fullWidth
          autoHighlight
          options={options}
          value={selectedOption}
          getOptionLabel={optionLabel}
          isOptionEqualToValue={isOptionEqual}
          onChange={(_event, option) => {
            onChange(option?.value ?? null)
          }}
          renderOption={(props, option) => (
            <Box
              component='li'
              {...props}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                minWidth: 0,
              }}
            >
              {renderOptionContent(option)}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              variant='standard'
              size='small'
              placeholder={editConfig.placeholder}
              error={hasError}
              inputProps={{
                ...params.inputProps,
                'aria-label': inputLabel,
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
              onKeyDown={handleKeyDown}
              onBlur={onCommit}
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
              }}
              onClick={(event) => event.stopPropagation()}
            />
          )}
        />
      </Box>
    )
  }

  const options = editConfig.getOptions ? editConfig.getOptions(cell.row) : (editConfig.options ?? [])
  const inputValue = getInputValue(editConfig, cell.row, value)
  const selectedOptionLabel =
    editConfig.type === 'select' ? (options.find((option) => option.value === inputValue)?.label ?? '') : undefined

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
        SelectProps={
          editConfig.type === 'select'
            ? {
                renderValue: () => selectedOptionLabel,
              }
            : undefined
        }
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
          ? options.map((option) => {
              const isHeader = option.isHeader ?? false
              return (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled ?? isHeader}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    minWidth: 0,
                    opacity: isHeader ? 1 : undefined,
                    cursor: isHeader ? 'default' : undefined,
                  }}
                >
                  {renderOptionContent(option)}
                </MenuItem>
              )
            })
          : null}
      </TextField>
    </Box>
  )
}
