import MuiDatePicker, { DatePickerProps as MuiDatePickerProps } from '@mui/lab/DatePicker'

import { useDatePickerProps } from './datePickerUtils'

export interface DatePickerProps extends Omit<MuiDatePickerProps, 'onChange' | 'value' | 'error'> {
  name: string
}

export function DatePicker({ children, ...props }: DatePickerProps) {
  const newProps = useDatePickerProps(props)
  return <MuiDatePicker {...newProps}>{children}</MuiDatePicker>
}

DatePicker.displayName = 'FormikMaterialUIDatePicker'
