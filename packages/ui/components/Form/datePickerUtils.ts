import { ReactNode } from 'react'

import { useField, useFormikContext } from 'formik'

import { DatePickerProps } from './DatePicker'

const createErrorHandler =
  (fieldError: unknown, fieldName: string, setFieldError: (field: string, message: string | undefined) => void) =>
  (error: ReactNode) => {
    if (error !== fieldError && error !== '') {
      setFieldError(fieldName, error ? String(error) : undefined)
    }
  }

export const useDatePickerProps = <T extends DatePickerProps>(props: T) => {
  const { disabled, onError, ...rest } = props
  const [field, meta] = useField(rest.name)
  const { isSubmitting, setFieldValue, setFieldError } = useFormikContext()
  const { touched, error } = meta
  const showError = touched && !!error

  const value = field.value !== '' ? field.value : null

  return {
    error: showError,
    helperText: showError ? error : 'tt',
    disabled: disabled ?? isSubmitting,
    onError: onError ?? createErrorHandler(error, field.name, setFieldError),
    ...field,
    value,
    onChange: (date: any) => {
      setFieldValue(field.name, date)
    },
    ...rest,
  }
}
