import { Checkbox, ListItemText, MenuItem, Theme, createStyles, makeStyles } from '@material-ui/core'
import { useField } from 'formik'
import * as React from 'react'

import { TextField, TextFieldProps } from './TextField'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    multiSelectCheckBox: {
      paddingLeft: theme.spacing(1),
    },
  })
)

export type SelectFieldValueObject = { value: any; text: string }
export type SelectFieldValue = string | SelectFieldValueObject

export interface SelectFieldProps extends TextFieldProps {
  // pass in an array of values and get a default behavior that automatically
  // knows how to present both an array of simple string, or an array of objects
  // with a text and a value property, where we display the text, but record the
  // value.  Provide default behavior for both single and multi select.
  // If the selectValues is omitted then return to default behavior
  selectValues?: Array<SelectFieldValue>
}

const getValue = (value: SelectFieldValue): any => (typeof value === 'string' ? value : value.value)

const getLabel = (value: SelectFieldValue): string => (typeof value === 'string' ? value : value.text)

export const SelectField: React.ComponentType<SelectFieldProps> = (props) => {
  const classes = useStyles({})
  // @ts-ignore
  const [field] = useField(props)
  const { select, selectValues, children, ...rest } = props
  return (
    <TextField select {...rest}>
      {selectValues &&
        !props?.SelectProps?.multiple &&
        selectValues.map((s) => (
          <MenuItem key={getValue(s)} value={getValue(s)}>
            {getLabel(s)}
          </MenuItem>
        ))}
      {selectValues &&
        props?.SelectProps?.multiple &&
        selectValues.map((s) => (
          <MenuItem key={getValue(s)} value={getValue(s)} className={classes.multiSelectCheckBox}>
            <Checkbox checked={!!field.value.find((i: any) => i === getValue(s))} />
            <ListItemText primary={getLabel(s)} />
          </MenuItem>
        ))}

      {children && children}
    </TextField>
  )
}

SelectField.displayName = 'SelectField'
