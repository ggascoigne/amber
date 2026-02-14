import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers'

import { useDatePickerProps } from './datePickerUtils'

export interface DatePickerProps extends Omit<MuiDatePickerProps<true>, 'onChange' | 'value' | 'error'> {
  name: string
}

export function DatePicker({ ...props }: DatePickerProps) {
  const newProps = useDatePickerProps(props)
  return <MuiDatePicker {...newProps} />
}

DatePicker.displayName = 'FormikMaterialUIDatePicker'
