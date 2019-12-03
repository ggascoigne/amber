import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField'
import { useField, useFormikContext } from 'formik'
import * as React from 'react'

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'onChange' | 'value' | 'error'> {
  name: string
  overrideFormik?: boolean
}

export const TextField: React.ComponentType<TextFieldProps> = props => {
  // @ts-ignore
  const [field, meta] = useField(props)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta

  const showError = touched && !!error

  // I really don't want to do this by accident so the default always forces the formik overrides
  const newProps = props.overrideFormik
    ? {
        ...field,
        ...props
      }
    : {
        ...props,
        ...field
      }

  const fullProps = {
    ...newProps,
    error: showError,
    helperText: showError ? error : props.helperText,
    disabled: props.disabled !== undefined ? props.disabled : isSubmitting
  }
  return <MuiTextField {...fullProps} />
}

TextField.displayName = 'FormikMaterialUITextField'
