import { MenuItem } from '@material-ui/core'
import * as React from 'react'

import { TextField, TextFieldProps } from './TextField'

export type SelectFieldValueObject = { value: any; label: string }
export type SelectFieldValue = string | SelectFieldValueObject

export interface SelectFieldProps extends TextFieldProps {
  selectValues: Array<SelectFieldValue>
}

const getValue = (value: SelectFieldValue): any => {
  return typeof value === 'string' ? value : value.value
}

const getLabel = (value: SelectFieldValue): string => {
  return typeof value === 'string' ? value : value.label
}

export const SelectField: React.ComponentType<SelectFieldProps> = props => {
  const { select, selectValues, ...rest } = props
  return (
    <TextField select {...rest}>
      {selectValues.map(s => (
        <MenuItem key={getValue(s)} value={getValue(s)}>
          {getLabel(s)}
        </MenuItem>
      ))}
    </TextField>
  )
}

SelectField.displayName = 'SelectField'
