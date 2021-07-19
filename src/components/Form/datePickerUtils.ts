import { useField, useFormikContext } from 'formik'
import { DateTime } from 'luxon'
import { ReactNode } from 'react'

import { DatePickerProps } from './DatePicker'
import { KeyboardDatePickerProps } from './KeyboardDatePicker'

const createErrorHandler =
  (fieldError: unknown, fieldName: string, setFieldError: (field: string, message: string | undefined) => void) =>
  (error: ReactNode) => {
    if (error !== fieldError && error !== '') {
      setFieldError(fieldName, error ? String(error) : undefined)
    }
  }

const getMinDateMessage = (message?: ReactNode, date?: DateTime | null) =>
  message ? message : date ? `Date should not be before ${date.toLocaleString(DateTime.DATE_MED)}` : undefined

const getMaxDateMessage = (message?: ReactNode, date?: DateTime | null) =>
  message ? message : date ? `Date should not be after ${date.toLocaleString(DateTime.DATE_MED)}` : undefined

export const useDatePickerProps = <T extends DatePickerProps | KeyboardDatePickerProps>(props: T) => {
  const { disabled, onError, minDateMessage, maxDateMessage, ...rest } = props
  const [field, meta] = useField(rest.name)
  const { isSubmitting, setFieldValue, setFieldError } = useFormikContext()
  const { touched, error } = meta
  const showError = touched && !!error

  const value = field.value !== '' ? field.value : null

  return {
    error: showError,
    helperText: showError ? error : rest.helperText,
    disabled: disabled ?? isSubmitting,
    onError: onError ?? createErrorHandler(error, field.name, setFieldError),
    ...field,
    value,
    onChange: (date: any) => {
      setFieldValue(field.name, date)
    },
    minDateMessage: getMinDateMessage(minDateMessage, props.minDate as DateTime),
    maxDateMessage: getMaxDateMessage(maxDateMessage, props.maxDate as DateTime),
    ...rest,
  }
}
