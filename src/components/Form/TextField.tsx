import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import { useField, useFormikContext } from 'formik'
import React, { ChangeEvent, useState } from 'react'

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'onChange' | 'value' | 'error'> {
  name: string
  overrideFormik?: boolean
}

export const TextField: React.ComponentType<TextFieldProps> = (props) => {
  const { overrideFormik, ...rest } = props
  const [field, meta] = useField(rest.name)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta
  const [oldValue, setOldValue] = useState(field.value)

  const showError = touched && !!error

  // work around an issue where the select component used by the underlying material-ui
  // library barfs if you have an undefined value here instead of an empty array
  if (rest.SelectProps?.multiple && field.value === undefined) {
    field.value = []
  }

  if (oldValue === undefined) {
    console.log(`field${field.name} is uncontrolled`)
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

  const originalOnChange = fullProps.onChange

  const onChangeField = (event: ChangeEvent<HTMLInputElement>, ...rest: any[]) => {
    console.log('here')
    const value = event.target.value
    setOldValue((prevState: unknown) => {
      if (prevState !== value)
        if (value === undefined) {
          console.log(`field${field.name} is switching to uncontrolled`)
        }
      return value
    })
    // @ts-ignore
    originalOnChange?.(event, ...rest!)
  }

  return <MuiTextField {...fullProps} onChange={onChangeField} />
}

TextField.displayName = 'FormikMaterialUITextField'
