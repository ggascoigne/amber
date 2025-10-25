import type * as React from 'react'

import { Checkbox, ListItemText, MenuItem } from '@mui/material'
import { useField } from 'formik'

import type { TextFieldProps } from './TextField'
import { TextField } from './TextField'

export interface SelectFieldValueObject {
  value: any
  text: string
}
export type SelectFieldValue = string | SelectFieldValueObject

export interface SelectValues {
  // pass in an array of values and get a default behavior that automatically
  // knows how to present both an array of simple string, or an array of objects
  // with a text and a value property, where we display the text, but record the
  // value.  Provide default behavior for both single and multi select.
  // If the selectValues is omitted then return to default behavior
  selectValues?: Array<SelectFieldValue>
}

export interface SelectFieldProps extends TextFieldProps, SelectValues {}

export const getSelectValue = (value: SelectFieldValue): any => (typeof value === 'string' ? value : value.value)

export const getSelectLabel = (value: SelectFieldValue): string => (typeof value === 'string' ? value : value.text)

export const SelectField: React.ComponentType<SelectFieldProps> = (props) => {
  const [field] = useField(props.name)
  const { select: _select, selectValues, children, ...rest } = props
  const multiSelect = !!props.SelectProps?.multiple
  return (
    <TextField select {...rest}>
      {selectValues &&
        !multiSelect &&
        selectValues.map((s) => (
          <MenuItem key={getSelectValue(s)} value={getSelectValue(s)}>
            {getSelectLabel(s)}
          </MenuItem>
        ))}
      {selectValues &&
        multiSelect &&
        selectValues.map((s) => (
          <MenuItem key={getSelectValue(s)} value={getSelectValue(s)} sx={{ pl: 1 }}>
            <Checkbox checked={!!field.value.find((i: any) => i === getSelectValue(s))} />
            <ListItemText primary={getSelectLabel(s)} />
          </MenuItem>
        ))}

      {children}
    </TextField>
  )
}

SelectField.displayName = 'SelectField'
