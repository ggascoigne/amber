import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField'
import { useField, useFormikContext } from 'formik'
import React from 'react'

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'onChange' | 'value' | 'error'> {
  name: string
  overrideFormik?: boolean
}

export const TextField: React.ComponentType<TextFieldProps> = (props) => {
  const { overrideFormik, ...rest } = props
  const [field, meta] = useField(rest.name)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta

  const showError = touched && !!error

  // work around an issue where the select component used by the underlying material-ui
  // library barfs if you have an undefined value here instead of an empty array
  if (rest.SelectProps?.multiple && field.value === undefined) {
    field.value = []
  }
  // I really don't want to do this by accident so the default always forces the formik overrides
  // this is particularly useful when you want to override the built in onBlur
  const newProps = overrideFormik
    ? {
        ...field,
        ...rest,
      }
    : {
        ...rest,
        ...field,
      }

  const fullProps = {
    ...newProps,
    error: showError,
    helperText: showError ? error : rest.helperText,
    disabled: rest.disabled !== undefined ? rest.disabled : isSubmitting,
  }
  return <MuiTextField {...fullProps} />
}

TextField.displayName = 'FormikMaterialUITextField'
