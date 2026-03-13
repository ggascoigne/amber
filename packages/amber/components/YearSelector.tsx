import type React from 'react'
import { useMemo } from 'react'

import { getSelectLabel, getSelectValue, range } from '@amber/ui'
import { FormControl, MenuItem, TextField } from '@mui/material'
import type { SelectProps as MuiSelectProps } from '@mui/material/Select'

import { useConfiguration, useYearFilter } from '../utils'

export type SelectProps = MuiSelectProps & {
  name: string
}

export const YearSelector = () => {
  const [year, setYear] = useYearFilter()
  const configuration = useConfiguration()

  const possibleYears: string[] = useMemo(
    () =>
      range(configuration.firstDataYear, configuration.year, -1)
        .map((v: number) => `${v}`)
        .concat(['0']),
    [configuration.firstDataYear, configuration.year],
  )

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const y = event.target.value as string
    await setYear(parseInt(y, 10))
  }

  return (
    <FormControl sx={{ color: 'common.white', m: 1, minWidth: 100 }}>
      <TextField
        select
        id='year-selector-label'
        value={year}
        onChange={handleChange}
        sx={(theme) => ({
          '& .MuiInput-root': {
            color: theme.palette.common.white,
          },
          '& .MuiSelect-icon': {
            color: theme.palette.common.white,
          },
          '& .MuiInput-underline:after, & .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before':
            { borderBottomColor: 'inherit' },
        })}
        variant='standard'
      >
        {possibleYears.map((s) => (
          <MenuItem key={getSelectValue(s)} value={getSelectValue(s)}>
            {getSelectLabel(s)}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  )
}
