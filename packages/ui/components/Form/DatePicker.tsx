import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers'

import { useDatePickerProps } from './datePickerUtils'

export type DatePickerProps = Omit<MuiDatePickerProps, 'onChange' | 'value' | 'error'> & {
  name: string
}

export const DatePicker = ({ ...props }: DatePickerProps) => {
  const newProps = useDatePickerProps(props)
  return <MuiDatePicker {...newProps} />
}

DatePicker.displayName = 'FormikMaterialUIDatePicker'
