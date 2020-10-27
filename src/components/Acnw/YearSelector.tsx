import { FormControl, MenuItem, TextField, Theme, createStyles } from '@material-ui/core'
import { SelectProps as MuiSelectProps } from '@material-ui/core/Select'
import { fade, makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { configuration, range, useYearFilterState } from 'utils'

import { getSelectLabel, getSelectValue } from './Form'

export type SelectProps = MuiSelectProps & {
  name: string
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
          borderBottomColor: fade(theme.palette.common.white, 0.15),
        },
        '&:after': {
          borderBottomColor: theme.palette.common.white,
        },
        '&:hover:before': {
          borderBottomColor: fade(theme.palette.common.white, 0.25),
        },
      },
    },
    formControl: {
      color: theme.palette.common.white,
      margin: theme.spacing(1),
      minWidth: 100,
    },
  })
)

const possibleYears: string[] = range(2011, configuration.year, -1)
  .map((v: number) => `${v}`)
  .concat(['0'])

export const YearSelector = () => {
  const classes = useStyles()
  const year = useYearFilterState((state) => state.year)
  const setYear = useYearFilterState((state) => state.setYear)

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const year = event.target.value as string
    await setYear(parseInt(year))
  }

  return (
    <FormControl className={classes.formControl}>
      <TextField select id='year-selector-label' value={year} onChange={handleChange} classes={{ root: classes.root }}>
        {possibleYears &&
          possibleYears.map((s) => (
            <MenuItem key={getSelectValue(s)} value={getSelectValue(s)}>
              {getSelectLabel(s)}
            </MenuItem>
          ))}
      </TextField>
    </FormControl>
  )
}
