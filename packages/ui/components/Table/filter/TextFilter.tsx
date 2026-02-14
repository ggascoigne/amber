import type { ChangeEvent, KeyboardEvent } from 'react'
import { useCallback, useState, useMemo } from 'react'

import { Box, Button, TextField } from '@mui/material'
import type { RowData, FilterRenderProps } from '@tanstack/react-table'

import { useFilterContext } from './FilterContext'
import { FilterStatusButton } from './FilterStatusButton'

import { useFocusableInput } from '../../../utils'
import { columnName } from '../utils/tableUtils'

type TextFilterEditorProps = {
  id: string
  value: string
  applyChange: (value: string) => void
  closeEditor: (reason?: any) => void
}

export const TextFilterEditor = ({ id, value: originalValue, applyChange, closeEditor }: TextFilterEditorProps) => {
  const [value, setValue] = useState(originalValue)
  const { setInputRef } = useFocusableInput(true)

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  const onApply = useCallback(() => {
    applyChange(value)
    closeEditor()
  }, [applyChange, closeEditor, value])

  const onCancel = useCallback(() => {
    closeEditor()
  }, [closeEditor])

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onApply()
        event.preventDefault()
      }
    },
    [onApply],
  )
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        inputRef={setInputRef}
        name={id}
        size='small'
        InputLabelProps={{ htmlFor: id }}
        value={value}
        onChange={handleChange}
        autoFocus
        onKeyDown={handleKeyPress}
        variant='outlined'
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          pt: 2,
        }}
      >
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onApply}>Apply</Button>
      </Box>
    </Box>
  )
}

type TextFilterProps = {
  id: string
  filterName: string
  value: string
  setValue: (value: any) => void
  defaultValue?: string
  clear?: () => void
}

export const TextFilter = ({
  id,
  filterName,
  value: originalValue,
  setValue,
  defaultValue = '',
  ...rest
}: TextFilterProps) => {
  const { clear: contextClear, autoOpen, preClear } = useFilterContext()
  const onClear = useMemo(() => {
    const defaultClear = () => setValue(defaultValue)
    const { clear = contextClear ?? defaultClear } = rest
    return () => {
      preClear()
      clear()
    }
  }, [contextClear, defaultValue, preClear, rest, setValue])
  const applyChange = useCallback(
    (v: string) => {
      setValue(v)
    },
    [setValue],
  )

  return (
    <FilterStatusButton
      renderEditor={({ closeEditor }) => (
        <TextFilterEditor id={id} closeEditor={closeEditor} applyChange={applyChange} value={originalValue} />
      )}
      filterName={filterName}
      value={originalValue}
      onClear={onClear}
      onLoseFocus={() => setValue(originalValue)}
      autoOpen={autoOpen}
    />
  )
}

export const TextColumnFilter = <T extends RowData>({ column, clear }: FilterRenderProps<T>) => {
  const { id, getFilterValue, setFilterValue } = column
  const originalValue = (getFilterValue() as string) || ''

  return (
    <TextFilter id={id} filterName={columnName(column)} value={originalValue} setValue={setFilterValue} clear={clear} />
  )
}
