import MuiCheckbox from '@material-ui/core/Checkbox'
import FormControlLabel, { FormControlLabelProps as MuiFormControlLabelProps } from '@material-ui/core/FormControlLabel'
import { useField, useFormikContext } from 'formik'
import * as React from 'react'

import { CheckboxProps } from './Checkbox'

/**
 * Exclude props that are passed directly to the control
 * https://github.com/mui-org/material-ui/blob/v3.1.1/packages/material-ui/src/FormControlLabel/FormControlLabel.js#L71
 */
export interface CheckboxWithLabelProps extends CheckboxProps {
  Label: Omit<MuiFormControlLabelProps, 'control' | 'checked' | 'name' | 'onChange' | 'value' | 'inputRef'>
}

export const CheckboxWithLabel: React.ComponentType<CheckboxWithLabelProps> = ({ Label, ...props }) => {
  // @ts-ignore
  const [field] = useField(props)
  const { isSubmitting } = useFormikContext()

  const fullProps = {
    ...props,
    ...field,
    disabled: props.disabled !== undefined ? props.disabled : isSubmitting,
    checked: field.value,
    value: field.value ? 'checked' : '',
  }

  const labelProps = {
    disabled: props.disabled !== undefined ? props.disabled : isSubmitting,
    ...Label,
  }

  return <FormControlLabel control={<MuiCheckbox {...fullProps} />} {...labelProps} />
}

CheckboxWithLabel.displayName = 'FormikMaterialUICheckboxWithLabel'
