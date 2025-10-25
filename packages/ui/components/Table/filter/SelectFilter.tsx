import type { MouseEvent } from 'react'
import { useCallback, useMemo } from 'react'

import { Checkbox, ListItemText, MenuItem, MenuList } from '@mui/material'
import type { RowData, FilterRenderProps } from '@tanstack/react-table'

import { useFilterContext } from './FilterContext'
import { FilterStatusButton } from './FilterStatusButton'
import type { OptionsValue } from './types'

import { columnName } from '../utils/tableUtils'

export const getValue = (value: OptionsValue): any => (typeof value === 'string' ? value : value.value)

export const getLabel = (value: OptionsValue): string => (typeof value === 'string' ? value : value.label)

type SelectFilterEditorProps = {
  id: string
  value: string[] | string | number | number[]
  applyChange: (value: string[] | string | number | number[]) => void
  closeEditor: (reason?: any) => void
  options: OptionsValue[]
  multiple: boolean
}

export const SelectFilterEditor = ({
  id,
  value,
  applyChange,
  closeEditor,
  options,
  multiple = false,
}: SelectFilterEditorProps) => {
  const handleSingleMenuItemClick = (_event: MouseEvent<HTMLElement>, val: string | number) => {
    applyChange(val)
    closeEditor()
  }

  const handleMultipleMenuItemClick = (_event: MouseEvent<HTMLElement>, val: string | number) => {
    if (Array.isArray(value)) {
      const newValue = (value as string[]).includes(val as string) ? value.filter((v) => v !== val) : [...value, val]
      applyChange((newValue as string[]).concat().sort())
    } else {
      const newValue = value === val ? '' : [val]
      applyChange(newValue as string[])
    }
  }

  const isSelected = (s: OptionsValue) =>
    Array.isArray(value) ? value.find((i) => i === getValue(s)) !== undefined : value === getValue(s)

  return (
    <MenuList id={id} sx={{ minWidth: '240px' }}>
      {multiple
        ? options.map((s) => (
            <MenuItem
              key={getValue(s)}
              value={getValue(s)}
              onClick={(event) => handleMultipleMenuItemClick(event, getValue(s))}
              sx={{
                py: 0,
                pl: 1,
              }}
            >
              <Checkbox checked={isSelected(s)} color='primary' />
              <ListItemText
                primaryTypographyProps={{
                  sx: { fontSize: '0.875rem' },
                }}
                primary={getLabel(s)}
              />
            </MenuItem>
          ))
        : options.map((s) => (
            <MenuItem
              key={getValue(s)}
              value={getValue(s)}
              selected={isSelected(s)}
              onClick={(event) => handleSingleMenuItemClick(event, getValue(s))}
              sx={{ fontSize: '0.875rem' }}
            >
              {getLabel(s)}
            </MenuItem>
          ))}
    </MenuList>
  )
}

const getStringLabel = (value: string | string[] | number | number[], options: OptionsValue[] | undefined) => {
  const getSingleValue = (v: string | number) => {
    const opt = options?.find((o) => getValue(o) === v)
    return opt ? getLabel(opt) : ''
  }
  return Array.isArray(value) ? value?.map(getSingleValue).join(', ') || '' : getSingleValue(value)
}

type SelectFilterProps = {
  id: string
  filterName: string
  value: string | string[] | number | number[] | undefined
  setValue: (value: any) => void
  defaultValue?: string | number | null
  options: OptionsValue[] | undefined
  multiple?: boolean
  clear?: () => void
}

export const SelectFilter = ({
  id,
  filterName,
  value,
  setValue,
  options,
  multiple = false,
  defaultValue,
  ...rest
}: SelectFilterProps) => {
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
    (v: string[] | string | number | number[]) =>
      (Array.isArray(v) && v.length) || v !== undefined ? setValue(v) : setValue(undefined),
    [setValue],
  )

  const buttonValue = getStringLabel(value ?? '', options)
  return (
    <FilterStatusButton
      renderEditor={({ closeEditor }) => (
        <SelectFilterEditor
          id={id}
          closeEditor={closeEditor}
          applyChange={applyChange}
          value={value ?? ''}
          options={options!}
          multiple={multiple}
        />
      )}
      filterName={filterName}
      value={buttonValue}
      onClear={onClear}
      autoOpen={autoOpen}
    />
  )
}

export const SelectColumnFilter = <T extends RowData>({ column, clear }: FilterRenderProps<T>) => {
  const { id, getFilterValue, setFilterValue, columnDef } = column
  const originalValue = (getFilterValue() as string[] | string) || ''
  const { options, multiple = false } = columnDef.meta?.filterFlags ?? {}

  return (
    <SelectFilter
      id={id}
      filterName={columnName(column)}
      value={originalValue}
      setValue={setFilterValue}
      options={options}
      multiple={multiple}
      clear={clear}
    />
  )
}
