import { FormControlLabel, Switch } from '@mui/material'

type ShowExpandedToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export const ShowExpandedToggle = ({ checked, onChange, label = 'showExpanded' }: ShowExpandedToggleProps) => (
  <FormControlLabel
    control={<Switch size='small' checked={checked} onChange={(_event, nextChecked) => onChange(nextChecked)} />}
    label={label}
    sx={{ m: 0 }}
  />
)
