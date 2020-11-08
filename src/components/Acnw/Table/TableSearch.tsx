import { TextField } from '@material-ui/core'
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disableGlobalFilter) {
        const value = e.target.value || undefined
        setGlobalFilter(value)
        setValue(e.target.value)
        if (value !== globalFilter) gotoPage(0)
      }
    },
    [disableGlobalFilter, globalFilter, gotoPage, setGlobalFilter]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disableGlobalFilter) {
        const value = e.target.value || undefined
        setGlobalFilter(value)
        // setValue(e.target.value)
        if (value !== globalFilter) gotoPage(0)
      }
    },
    [disableGlobalFilter, globalFilter, gotoPage, setGlobalFilter]
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
      variant='standard'
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
