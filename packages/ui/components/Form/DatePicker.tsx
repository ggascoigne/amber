import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
  PickerValidDate,
} from '@mui/x-date-pickers'
// see https://github.com/mui/mui-x/issues/12640
import type {} from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'

import { useDatePickerProps } from './datePickerUtils'

export interface DatePickerProps<TDate extends PickerValidDate>
  extends Omit<MuiDatePickerProps<TDate>, 'onChange' | 'value' | 'error'> {
  name: string
}

export function DatePicker({ ...props }: DatePickerProps<DateTime>) {
  const newProps = useDatePickerProps(props)
  return <MuiDatePicker {...newProps} />
}

DatePicker.displayName = 'FormikMaterialUIDatePicker'
