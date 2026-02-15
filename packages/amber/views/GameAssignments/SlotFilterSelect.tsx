import { FormControl, MenuItem, TextField } from '@mui/material'

type SlotFilterSelectProps = {
  slotFilterOptions: Array<number>
  slotFilterId: number | null | 'mixed'
  onSlotFilterChange: (slotFilterId: number | null) => void
  allowMixedState?: boolean
  minWidth?: number
}

export const SlotFilterSelect = ({
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  allowMixedState = false,
  minWidth = 110,
}: SlotFilterSelectProps) => {
  const isMixed = slotFilterId === 'mixed'
  const selectedValue = isMixed ? '' : slotFilterId === null ? 'all' : `${slotFilterId}`

  return (
    <FormControl sx={{ minWidth }}>
      <TextField
        select
        size='small'
        variant='standard'
        value={selectedValue}
        onChange={(event) => {
          const nextValue = event.target.value
          if (nextValue === '') return
          onSlotFilterChange(nextValue === 'all' ? null : Number(nextValue))
        }}
        aria-label='Slot filter'
      >
        {allowMixedState || isMixed ? (
          <MenuItem value='' disabled>
            &nbsp;
          </MenuItem>
        ) : null}
        <MenuItem value='all'>All Slots</MenuItem>
        {slotFilterOptions.map((slotValue) => (
          <MenuItem key={slotValue} value={`${slotValue}`}>
            {`Slot ${slotValue}`}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  )
}
