import type { ChangeEvent } from 'react'
import type React from 'react'

import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import MuiTextField from '@mui/material/TextField'
import { useField, useFormikContext } from 'formik'

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'onChange' | 'value' | 'error'> {
  name: string
  overrideFormik?: boolean
  parse?: (value: string) => any
}

export const TextField: React.ComponentType<TextFieldProps> = (props) => {
  const { overrideFormik, parse, ...rest } = props
  const [field, meta, helpers] = useField(rest.name)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta
  const multiSelect = !!rest.SelectProps?.multiple

  const showError = touched && !!error

  // work around an issue where the select component used by the underlying material-ui
  // library barfs if you have an undefined value here instead of an empty array
  if (multiSelect && field.value === undefined) {
    field.value = []
  }
  const normalizedField = {
    ...field,
    value: multiSelect ? field.value : (field.value ?? ''),
  }

  const parseValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (parse) {
      const parsedValue = parse(event.target.value)
      helpers.setValue(parsedValue)
    }
  }

  // I really don't want to do this by accident so the default always forces the formik overrides
  // this is particularly useful when you want to override the built in onBlur
  const newProps = overrideFormik
    ? {
        ...normalizedField,
        ...rest,
      }
    : {
        ...rest,
        ...normalizedField,
      }

  const fullProps = {
    ...newProps,
    error: showError,
    helperText: showError ? error : rest.helperText,
    disabled: rest.disabled ?? isSubmitting,
  }

  const originalOnChange = fullProps.onChange

  const onChangeField = (event: ChangeEvent<HTMLInputElement>, ...rest1: any[]) => {
    // @ts-ignore
    originalOnChange?.(event, ...rest1!)
    parseValue(event)
  }

  return <MuiTextField {...fullProps} onChange={onChangeField} />
}

TextField.displayName = 'FormikMaterialUITextField'
