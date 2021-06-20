import { IconButton, TextField } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import React, { PropsWithChildren, ReactElement, useCallback, useEffect } from 'react'
import { TableInstance } from 'react-table'

type TableSearchProps<T extends Record<string, unknown>> = {
  instance: TableInstance<T>
}

export function TableSearch<T extends Record<string, unknown>>({
  instance,
}: PropsWithChildren<TableSearchProps<T>>): ReactElement | null {
  const {
    gotoPage,
    setGlobalFilter,
    disableGlobalFilter,
    state: { globalFilter = '' },
  } = instance

  const [value, setValue] = React.useState(globalFilter)

  const setVars = useCallback(
    (value: string | undefined) => {
      if (!disableGlobalFilter) {
        setGlobalFilter(value)
        setValue(value ?? '')
        if (value !== globalFilter) gotoPage(0)
      }
    },
    [disableGlobalFilter, globalFilter, gotoPage, setGlobalFilter]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setVars(e.target.value || undefined),
    [setVars]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => setVars(e.target.value || undefined),
    [setVars]
  )

  // ensure that reset loads the new value
  useEffect(() => {
    setValue(globalFilter || '')
  }, [globalFilter])

  if (disableGlobalFilter) return null

  return (
    <TextField
      name='search'
      label='Search'
      fullWidth
      value={value}
      InputProps={{
        endAdornment: (
          <IconButton onClick={() => setVars('')}>
            <ClearIcon />
          </IconButton>
        ),
      }}
      variant='standard'
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
