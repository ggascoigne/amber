import React from 'react'

import TextField from '@mui/material/TextField'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import { FieldProps } from 'formik'
import { DateTime } from 'luxon'

import { deepValue } from '../../utils/deepValue'

interface DatePickerFieldProps
  extends FieldProps,
    Omit<DatePickerProps<DateTime, DateTime>, 'onChange' | 'value' | 'error' | 'renderInput'> {
  required?: boolean
  getShouldDisableDateError: (date: Date) => string
}

export function DatePickerField(props: DatePickerFieldProps) {
  const { field, form, getShouldDisableDateError, maxDate, minDate, required, ...other } = props
  const currentError = deepValue(form.errors, field.name)
  const currentTouched = deepValue(form.touched, field.name)
  const showError = !!currentError && !!currentTouched
  return (
    <DatePicker
      minDate={minDate}
      maxDate={maxDate}
      value={field.value}
      // Make sure that your 3d param is set to `true` in order to run validation
      onChange={(newValue) => form.setFieldValue(field.name, newValue, true)}
      renderInput={(inputProps) => (
        <TextField
          required={required}
          name={field.name}
          {...inputProps}
          inputProps={{ ...inputProps.inputProps, placeholder: 'mm/dd/yyyy' }}
          error={showError}
          helperText={showError ? <>{currentError}</> : inputProps.helperText ?? inputProps?.placeholder}
          // Make sure that your 3d param is set to `true` in order to run validation
          onBlur={() => form.setFieldTouched(field.name, true, true)}
          variant='filled'
        />
      )}
      {...other}
    />
  )
}
