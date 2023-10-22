import React from 'react'

import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import { useField, useFormikContext } from 'formik'

export type SelectProps = MuiSelectProps & {
  name: string
}

export const Select: React.ComponentType<SelectProps> = (props: SelectProps) => {
  const [field, meta] = useField(props.name)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta

  const showError = touched && !!error

  const fullProps = {
    disabled: props.disabled ?? isSubmitting,
    ...props,
    ...field,
    error: showError,
  }
  return <MuiSelect {...fullProps} />
}

Select.displayName = 'FormikMaterialUISelect'
