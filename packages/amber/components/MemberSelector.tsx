import React, { useCallback, useEffect, useState } from 'react'

import { UserMembership, useTRPC } from '@amber/client'
import { notEmpty, useNotification } from '@amber/ui'
import { Autocomplete, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

const getOptionSelected = (option: UserMembership, value: UserMembership) => option.id === value.id

interface MemberSelectorProps {
  label: string
  year: number
  onChange: (newValue: UserMembership | null) => void
  onlyDisplayMembersWithBalances: boolean
}

let keyVal = 0

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  year,
  label,
  onChange,
  onlyDisplayMembersWithBalances,
}) => {
  const trpc = useTRPC()
  const notify = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState<UserMembership[]>([])

  const { isLoading, error, data } = useQuery(
    trpc.memberships.getAllMembersBy.queryOptions({
      year,
      query: searchTerm,
    }),
  )

  useEffect(() => {
    if (data) {
      const users = data ?? []
      setDropdownOptions(
        users.filter(notEmpty).filter((u) => {
          const hasMembership = u.membership.length > 0
          const hasBalance = u.balance < 0
          return onlyDisplayMembersWithBalances ? hasMembership && hasBalance : hasMembership
        }),
      )
    }
  }, [data, onlyDisplayMembersWithBalances])

  const onInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value ?? '')
  }, [])

  const onValueChange = useCallback(
    (_: React.SyntheticEvent, value: UserMembership | null) => {
      setSearchTerm('')
      onChange(value ?? null)

      keyVal++
    },
    [onChange],
  )

  const onBlur = useCallback(() => {
    setSearchTerm('')
  }, [])

  if (error) {
    notify({
      text: error.message,
      variant: 'error',
    })
  }

  if (error) {
    return null
  }

  return (
    <Autocomplete<UserMembership>
      key={`key_${keyVal}`}
      id='userFilter'
      loading={isLoading}
      options={dropdownOptions}
      getOptionLabel={(option: UserMembership) => option.fullName ?? ''}
      sx={{
        maxWidth: 400,
        width: 400,
        '& label, & div': {
          fontSize: '0.875rem',
          color: 'inherit',
        },
        '& input::placeholder, & input::-webkit-input-placeholder': { opacity: 1 },
        '& input::-moz-placeholder, & input:-moz-placeholder': { opacity: 1 },
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: '4px',
      }}
      value={null}
      slotProps={{
        paper: { sx: { mt: 0.5 } },
        // endAdornment: { sx: { color: 'inherit' } },
        popupIndicator: { sx: { color: 'inherit' } },
        clearIndicator: { sx: { color: 'inherit' } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder={label}
          onChange={onInputChange}
          variant='outlined'
          sx={{
            fontWeight: 500,
          }}
        />
      )}
      renderOption={(props, params: UserMembership) => (
        <li {...props} key={params.id} style={{ overflow: 'hidden' }}>
          <span style={{ fontSize: '0.875rem', wordWrap: 'break-word' }}>{params.fullName}</span>
        </li>
      )}
      isOptionEqualToValue={getOptionSelected}
      onChange={onValueChange}
      onBlur={onBlur}
      data-test='customer-select-dropdown'
    />
  )
}
