import type { SetStateAction } from 'react'

import { FormControlLabel, Switch } from '@mui/material'

type ToggleProps = {
  value: boolean
  disabled?: boolean
  setter: (value: SetStateAction<boolean>) => void
  label: string
}

export const Toggle = ({ label, setter, value, disabled }: ToggleProps) => (
  <FormControlLabel
    control={
      <Switch
        checked={value}
        disabled={disabled}
        value={value}
        onChange={() => setter((old) => !old)}
        data-testid={`toggle-${label}`}
      />
    }
    label={label}
  />
)
