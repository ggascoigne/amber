import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, Theme } from '@mui/material'
import MuiRadioGroup, { RadioGroupProps as MuiRadioGroupProps } from '@mui/material/RadioGroup'
import { useField } from 'formik'
import { makeStyles } from 'tss-react/mui'

import { SelectValues, getSelectLabel, getSelectValue } from './SelectField'

const useStyles = makeStyles()((theme: Theme) => ({
  menuItem: {
    whiteSpace: 'normal',
    height: 35,
    '&:first-of-type': {
      paddingTop: theme.spacing(2),
    },
  },
}))

export interface RadioGroupProps extends Omit<MuiRadioGroupProps, 'onChange' | 'value' | 'error'>, SelectValues {
  name: string
  label: string
}

export function RadioGroupFieldWithLabel(props: RadioGroupProps) {
  const [field, meta] = useField(props.name)
  const { touched, error } = meta
  const showError = touched && !!error
  const { selectValues, children, ...rest } = props
  const { classes } = useStyles()

  const fullProps = {
    ...rest,
    ...field,
  }
  return (
    <FormControl component='fieldset' error={showError}>
      <FormLabel component='legend'>{props.label}</FormLabel>
      <MuiRadioGroup {...fullProps}>
        {selectValues?.map((s) => (
          <MenuItem id={fullProps.name} key={getSelectValue(s)} value={getSelectValue(s)} className={classes.menuItem}>
            <FormControlLabel value={getSelectValue(s)} control={<Radio />} label={getSelectLabel(s)} />
          </MenuItem>
        ))}
        {children && children}
      </MuiRadioGroup>
    </FormControl>
  )
}

RadioGroupFieldWithLabel.displayName = 'FormikMaterialUIRadioGroupWithLabel'
