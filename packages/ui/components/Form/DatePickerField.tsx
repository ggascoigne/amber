import React from 'react'

import type { DatePickerProps } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import type { FieldProps } from 'formik'
import { DateTime } from 'luxon'

interface DatePickerFieldProps
  extends FieldProps, Omit<DatePickerProps, 'onChange' | 'value' | 'error' | 'renderInput'> {
  required?: boolean
  getShouldDisableDateError: (date: Date) => string
  // Force the creation timeZone for dates, this allows values to be created that differ from local time
  timeZone?: string
}

export function DatePickerField(props: DatePickerFieldProps) {
  const {
    field,
    form,
    getShouldDisableDateError: _getShouldDisableDateError,
    maxDate,
    minDate,
    required: _required,
    timeZone,
    ...other
  } = props
  const isDate = typeof field.value === 'object' && field.value instanceof Date
  const dateValue = isDate ? DateTime.fromJSDate(field.value) : DateTime.fromISO(field.value)

  return (
    <DatePicker
      minDate={minDate}
      maxDate={maxDate}
      value={timeZone ? dateValue.setZone(timeZone) : dateValue}
      // Make sure that your 3d param is set to `true` in order to run validation
      onChange={(newValue: DateTime | null) => {
        const updatedValue = timeZone ? newValue?.setZone(timeZone) : newValue
        const newDate = isDate ? updatedValue?.toJSDate() : updatedValue?.toISO()
        return form.setFieldValue(field.name, newDate, true)
      }}
      {...other}
    />
  )
}
