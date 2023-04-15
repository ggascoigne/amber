import * as React from 'react'

import { Checkbox, ListItemText, MenuItem, Theme } from '@mui/material'
import { useField } from 'formik'
import { makeStyles } from 'tss-react/mui'

import { TextField, TextFieldProps } from './TextField'

const useStyles = makeStyles()((theme: Theme) => ({
  multiSelectCheckBox: {
    paddingLeft: theme.spacing(1),
  },
}))

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
  const { classes } = useStyles()
  const [field] = useField(props.name)
  const { select, selectValues, children, ...rest } = props
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
          <MenuItem key={getSelectValue(s)} value={getSelectValue(s)} className={classes.multiSelectCheckBox}>
            <Checkbox checked={!!field.value.find((i: any) => i === getSelectValue(s))} />
            <ListItemText primary={getSelectLabel(s)} />
          </MenuItem>
        ))}

      {children && children}
    </TextField>
  )
}

SelectField.displayName = 'SelectField'
