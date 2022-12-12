import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'

import { useDatePickerProps } from './datePickerUtils'

export interface DatePickerProps<TInputDate, TDate = TInputDate>
  extends Omit<MuiDatePickerProps<TInputDate, TDate>, 'onChange' | 'value' | 'error'> {
  name: string
}

export function DatePicker({ children, ...props }: DatePickerProps<DateTime>) {
  const newProps = useDatePickerProps(props)
  return <MuiDatePicker {...newProps}>{children}</MuiDatePicker>
}

DatePicker.displayName = 'FormikMaterialUIDatePicker'
