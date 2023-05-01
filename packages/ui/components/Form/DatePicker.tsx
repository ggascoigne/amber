import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'

import { useDatePickerProps } from './datePickerUtils'

export interface DatePickerProps<TDate> extends Omit<MuiDatePickerProps<TDate>, 'onChange' | 'value' | 'error'> {
  name: string
}

export function DatePicker({ ...props }: DatePickerProps<DateTime>) {
  const newProps = useDatePickerProps(props)
  return <MuiDatePicker {...newProps} />
}

DatePicker.displayName = 'FormikMaterialUIDatePicker'
