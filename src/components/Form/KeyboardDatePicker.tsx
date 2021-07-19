import {
  KeyboardDatePicker as MuiKeyboardDatePicker,
  KeyboardDatePickerProps as MuiKeyboardDatePickerProps,
} from '@material-ui/pickers'
import React from 'react'

import { useDatePickerProps } from './datePickerUtils'

export interface KeyboardDatePickerProps extends Omit<MuiKeyboardDatePickerProps, 'onChange' | 'value' | 'error'> {
  name: string
}

export function KeyboardDatePicker({ children, ...props }: KeyboardDatePickerProps) {
  const newProps = useDatePickerProps(props)
  return <MuiKeyboardDatePicker {...newProps}>{children}</MuiKeyboardDatePicker>
}

KeyboardDatePicker.displayName = 'FormikMaterialUIKeyboardDatePicker'
