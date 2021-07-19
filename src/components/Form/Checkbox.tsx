import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@material-ui/core/Checkbox'
import { useField, useFormikContext } from 'formik'
import React from 'react'

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
    disabled: props.disabled !== undefined ? props.disabled : isSubmitting,
    checked: field.value,
    value: field.value ? 'checked' : '',
  }

  return <MuiCheckbox {...fullProps} />
}

Checkbox.displayName = 'FormikMaterialUICheckbox'
