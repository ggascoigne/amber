import type React from 'react'

import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox'
import MuiCheckbox from '@mui/material/Checkbox'
import { useField, useFormikContext } from 'formik'

export interface CheckboxProps
  extends Omit<MuiCheckboxProps, 'form' | 'checked' | 'defaultChecked' | 'onChange' | 'value'> {
  name: string
}

export const Checkbox: React.ComponentType<CheckboxProps> = (props: CheckboxProps) => {
  const [field, meta] = useField(props.name)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta
  const showError = touched && !!error

  const fullProps = {
    ...props,
    ...field,
    error: showError,
    disabled: props.disabled ?? isSubmitting,
    checked: field.value,
    value: field.value ? 'checked' : '',
  }

  return <MuiCheckbox {...fullProps} />
}

Checkbox.displayName = 'FormikMaterialUICheckbox'
