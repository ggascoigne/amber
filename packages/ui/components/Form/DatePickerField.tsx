import React from 'react'

import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import { FieldProps } from 'formik'
import { DateTime } from 'luxon'

interface DatePickerFieldProps
  extends FieldProps,
    Omit<DatePickerProps<DateTime>, 'onChange' | 'value' | 'error' | 'renderInput'> {
  required?: boolean
  getShouldDisableDateError: (date: Date) => string
  // Force the creation timeZone for dates, this allows values to be created that differ from local time
  timeZone?: string
}

export function DatePickerField(props: DatePickerFieldProps) {
  const { field, form, getShouldDisableDateError, maxDate, minDate, required, timeZone, ...other } = props
  return (
    <DatePicker
      minDate={minDate}
      maxDate={maxDate}
      value={timeZone ? DateTime.fromISO(field.value).setZone(timeZone) : DateTime.fromISO(field.value)}
      // Make sure that your 3d param is set to `true` in order to run validation
      onChange={(newValue: DateTime | null) => {
        const newDate = timeZone ? newValue?.setZone(timeZone)?.toISO() : newValue?.toISO()
        return form.setFieldValue(field.name, newDate, true)
      }}
      {...other}
    />
  )
}
