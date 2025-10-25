import type React from 'react'

import MuiCheckbox from '@mui/material/Checkbox'
import type { FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useField, useFormikContext } from 'formik'

import type { CheckboxProps } from './Checkbox'

/**
 * Exclude props that are passed directly to the control
 * https://github.com/mui-org/material-ui/blob/v3.1.1/packages/material-ui/src/FormControlLabel/FormControlLabel.js#L71
 */
export interface CheckboxWithLabelProps extends CheckboxProps {
  Label?: Omit<MuiFormControlLabelProps, 'label' | 'control' | 'checked' | 'onChange' | 'value' | 'inputRef'>
  label: string
}

export const CheckboxWithLabel: React.ComponentType<CheckboxWithLabelProps> = ({ Label, label, ...props }) => {
  const [field] = useField(props.name)
  const { isSubmitting } = useFormikContext()

  const fullProps = {
    ...props,
    ...field,
    disabled: props.disabled ?? isSubmitting,
    checked: field.value,
    value: field.value ? 'checked' : '',
  }

  const labelProps = {
    disabled: props.disabled ?? isSubmitting,
    style: { marginLeft: 0 },
    labelPlacement: 'start',
    label,
    ...Label,
  } as const

  return <FormControlLabel control={<MuiCheckbox {...fullProps} />} {...labelProps} />
}

CheckboxWithLabel.displayName = 'FormikMaterialUICheckboxWithLabel'
