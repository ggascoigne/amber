import { Field } from 'formik'
import { DateTime } from 'luxon'
import { match } from 'ts-pattern'
import { GqlType, ToFormValues, DatePickerField, SelectField, TextField } from 'ui'

import { GetSettingsQuery } from '../../client'
import { permissionGateValues, useConfiguration } from '../../utils'

export type Setting = ToFormValues<GqlType<GetSettingsQuery, ['settings', 'nodes', number]>>
export const typeValues = ['perm-gate', 'string', 'date', 'number', 'boolean']

export const SettingValue: React.FC<{ value: Setting; label?: string; name: string }> = ({
  value,
  name,
  label = 'Value',
}) => {
  const configuration = useConfiguration()
  return match(value)
    .with({ type: 'perm-gate' }, () => (
      <SelectField name={name} label={label} margin='normal' fullWidth selectValues={permissionGateValues} />
    ))
    .with({ type: 'date' }, () => (
      <Field
        sx={{ mt: 2, mb: 1, width: '100%' }}
        component={DatePickerField}
        required
        label={label}
        name={name}
        defaultCalendarMonth={DateTime.now()}
        timeZone={configuration.baseTimeZone}
      />
    ))
    .otherwise(() => <TextField name={name} label={label} margin='normal' fullWidth required />)
}
