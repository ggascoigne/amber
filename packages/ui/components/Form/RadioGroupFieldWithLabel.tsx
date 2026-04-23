import { Box, FormControl, FormControlLabel, FormLabel, Radio } from '@mui/material'
import type { RadioGroupProps as MuiRadioGroupProps } from '@mui/material/RadioGroup'
import MuiRadioGroup from '@mui/material/RadioGroup'
import debug from 'debug'
import { useField } from 'formik'

import type { SelectValues } from './SelectField'
import { getSelectLabel, getSelectValue } from './SelectField'

const log = debug('amber:ui:RadioGroupFieldWithLabel')
export interface RadioGroupProps extends Omit<MuiRadioGroupProps, 'onChange' | 'value' | 'error'>, SelectValues {
  name: string
  label: string
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined
}

export function RadioGroupFieldWithLabel(props: RadioGroupProps) {
  const [field, meta] = useField(props.name)
  const { touched, error } = meta
  const showError = touched && !!error
  const { selectValues, children, onChange, ...rest } = props

  const fullProps = {
    ...rest,
    ...field,
  }

  // log('values %s, %o', field?.name, { rest, field, fullProps, selectValues, showError })
  return (
    <FormControl component='fieldset' error={showError}>
      <FormLabel component='legend' sx={{ pb: 1 }}>
        {props.label}
      </FormLabel>
      <MuiRadioGroup {...fullProps}>
        {selectValues?.map((s) => (
          <Box
            component='div'
            key={getSelectValue(s)}
            sx={{
              whiteSpace: 'normal',
              minHeight: 35,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              value={getSelectValue(s)}
              control={<Radio onChange={onChange} />}
              label={getSelectLabel(s)}
            />
          </Box>
        ))}
        {children}
      </MuiRadioGroup>
    </FormControl>
  )
}

RadioGroupFieldWithLabel.displayName = 'FormikMaterialUIRadioGroupWithLabel'
