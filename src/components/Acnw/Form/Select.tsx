import MuiSelect, { SelectProps as MuiSelectProps } from '@material-ui/core/Select'
import { useField, useFormikContext } from 'formik'
import * as React from 'react'

export type SelectProps = MuiSelectProps & {
  name: string
}

export const Select: React.ComponentType<SelectProps> = (props: SelectProps) => {
  // @ts-ignore
  const [field, meta] = useField(props)
  const { isSubmitting } = useFormikContext()
  const { touched, error } = meta

  const showError = touched && !!error

  const fullProps = {
    disabled: props.disabled !== undefined ? props.disabled : isSubmitting,
    ...props,
    ...field,
    error: showError,
  }
  return <MuiSelect {...fullProps} />
}

Select.displayName = 'FormikMaterialUISelect'
