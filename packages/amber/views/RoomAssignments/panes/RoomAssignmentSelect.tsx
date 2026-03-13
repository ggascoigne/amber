import { useMemo } from 'react'

import { Box, MenuItem, TextField, Typography } from '@mui/material'

import RoomNameWithMembersCell from './RoomNameWithMembersCell'

import type { ManualRoomSelectOption, RoomSelectOption } from '../types'

type RoomAssignmentSelectProps = {
  value: number | null
  disabled: boolean
  ariaLabel: string
  options: Array<RoomSelectOption | ManualRoomSelectOption>
  onChange: (roomId: number | null) => Promise<void>
  selectedValueMode?: 'description' | 'roomWithMembers'
  showSizeColumn?: boolean
  greyAssignedOptions?: boolean
  minWidth?: number
}

const RoomAssignmentSelect = ({
  value,
  disabled,
  ariaLabel,
  options,
  onChange,
  selectedValueMode = 'description',
  showSizeColumn = false,
  greyAssignedOptions = false,
  minWidth = 300,
}: RoomAssignmentSelectProps) => {
  const roomOptionById = useMemo(
    () => new Map(options.map((roomOption) => [String(roomOption.id), roomOption])),
    [options],
  )

  const renderSelectedValue = (selectedValue: unknown) => {
    if (typeof selectedValue !== 'string' || !selectedValue) {
      return 'Unassigned'
    }

    const selectedRoom = roomOptionById.get(selectedValue)
    if (!selectedRoom) {
      return 'Unassigned'
    }

    if (selectedValueMode === 'roomWithMembers') {
      return (
        <RoomNameWithMembersCell
          roomDescription={selectedRoom.description}
          assignedMemberNames={selectedRoom.assignedMemberNames}
        />
      )
    }

    return selectedRoom.description
  }

  return (
    <Box sx={{ minWidth }}>
      <TextField
        fullWidth
        select
        variant='standard'
        size='small'
        value={value ? String(value) : ''}
        disabled={disabled}
        onChange={(event) => {
          const nextValue = event.target.value
          const nextRoomId = typeof nextValue === 'string' && nextValue ? parseInt(nextValue, 10) : null
          onChange(Number.isInteger(nextRoomId) ? nextRoomId : null).catch(() => undefined)
        }}
        inputProps={{
          'aria-label': ariaLabel,
        }}
        InputProps={{
          disableUnderline: true,
        }}
        SelectProps={{
          displayEmpty: true,
          renderValue: renderSelectedValue,
        }}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            padding: 0,
            minHeight: 0,
            height: '100%',
            alignItems: 'center',
          },
          '& .MuiInputBase-input': {
            padding: 0,
            lineHeight: 'inherit',
            boxSizing: 'border-box',
          },
          '& .MuiSelect-select': {
            padding: 0,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            paddingRight: '24px',
          },
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <MenuItem value=''>Unassigned</MenuItem>
        {showSizeColumn ? (
          <MenuItem disabled sx={{ opacity: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
              <Typography variant='caption' sx={{ flex: '1 1 auto', fontWeight: 600, color: 'text.primary' }}>
                Room
              </Typography>
              <Typography
                variant='caption'
                sx={{ width: 48, textAlign: 'right', fontWeight: 600, color: 'text.primary' }}
              >
                Size
              </Typography>
            </Box>
          </MenuItem>
        ) : null}
        {options.map((roomOption) => {
          const slotAssignmentCount = 'slotAssignmentCount' in roomOption ? roomOption.slotAssignmentCount : 0
          const isMuted = greyAssignedOptions && slotAssignmentCount > 0
          const size = 'size' in roomOption ? roomOption.size : null

          return (
            <MenuItem
              key={roomOption.id}
              value={String(roomOption.id)}
              sx={isMuted ? { color: 'text.disabled' } : undefined}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: '1 1 auto', minWidth: 0 }}>
                  <Typography variant='body2' color={isMuted ? 'text.disabled' : 'text.primary'}>
                    {roomOption.description}
                  </Typography>
                  {roomOption.assignedMemberNames.length > 0 ? (
                    <Box component='ul' sx={{ m: 0, pl: 2 }}>
                      {roomOption.assignedMemberNames.map((memberName) => (
                        <Box
                          component='li'
                          key={`${roomOption.id}-${memberName}`}
                          sx={{
                            typography: 'caption',
                            color: isMuted ? 'text.disabled' : 'text.secondary',
                            lineHeight: 1.2,
                          }}
                        >
                          {memberName}
                        </Box>
                      ))}
                    </Box>
                  ) : null}
                </Box>
                {showSizeColumn && size !== null ? (
                  <Typography
                    variant='body2'
                    sx={{
                      width: 48,
                      textAlign: 'right',
                      color: isMuted ? 'text.disabled' : 'text.secondary',
                      flex: '0 0 auto',
                      pt: 0.125,
                    }}
                  >
                    {size}
                  </Typography>
                ) : null}
              </Box>
            </MenuItem>
          )
        })}
      </TextField>
    </Box>
  )
}

export default RoomAssignmentSelect
