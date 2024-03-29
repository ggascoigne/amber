import React, { useMemo } from 'react'

import { FormControl, MenuItem, TextField, Theme } from '@mui/material'
import { SelectProps as MuiSelectProps } from '@mui/material/Select'
import { alpha } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { getSelectLabel, getSelectValue, range } from 'ui'

import { useConfiguration, useYearFilter } from '../utils'

export type SelectProps = MuiSelectProps & {
  name: string
}
const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    '& .MuiInput-root': {
      color: theme.palette.common.white,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.common.white,
    },
    '& .MuiInput-underline': {
      borderBottomColor: theme.palette.common.white,
      '&:before': {
        borderBottomColor: alpha(theme.palette.common.white, 0.15),
      },
      '&:after': {
        borderBottomColor: theme.palette.common.white,
      },
      '&:hover:before': {
        borderBottomColor: alpha(theme.palette.common.white, 0.25),
      },
    },
  },
  formControl: {
    color: theme.palette.common.white,
    margin: theme.spacing(1),
    minWidth: 100,
  },
}))

export const YearSelector = () => {
  const { classes } = useStyles()
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
    <FormControl className={classes.formControl}>
      <TextField
        select
        id='year-selector-label'
        value={year}
        onChange={handleChange}
        classes={{ root: classes.root }}
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
