import React from 'react'

import type { DatePickerProps } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import type { FieldProps } from 'formik'
import { DateTime } from 'luxon'

type DatePickerFieldProps = FieldProps &
  Omit<DatePickerProps, 'onChange' | 'value' | 'error' | 'renderInput'> & {
    required?: boolean
  }

export const DatePickerField = (props: DatePickerFieldProps) => {
  const { field, form, maxDate, minDate, required: _required, timezone, ...other } = props
  const isDate = typeof field.value === 'object' && field.value instanceof Date
  const dateValue = isDate ? DateTime.fromJSDate(field.value) : DateTime.fromISO(field.value)

  return (
    <DatePicker
      minDate={minDate}
      maxDate={maxDate}
      timezone={timezone}
      value={timezone ? dateValue.setZone(timezone) : dateValue}
      // Make sure that your 3d param is set to `true` in order to run validation
      onChange={(newValue: DateTime | null) => {
        const updatedValue =
          timezone && newValue ? newValue.setZone(timezone, { keepLocalTime: true }).startOf('day') : newValue
        const newDate = isDate ? updatedValue?.toJSDate() : updatedValue?.toISO()
        return form.setFieldValue(field.name, newDate, true)
      }}
      {...other}
    />
  )
}
