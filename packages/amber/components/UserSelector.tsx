import React, { useCallback, useEffect, useState } from 'react'

import { UserAndShortMembership, useTRPC } from '@amber/client'
import { notEmpty, useNotification } from '@amber/ui'
import { Autocomplete, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

import { useUserFilter, useYearFilter } from '../utils'

// styles inlined via sx

type UserType = UserAndShortMembership

const getOptionSelected = (option: UserType, value: UserType) => option.id === value.id

interface UserSelectorProps {
  mobile?: boolean
}

export const UserSelector: React.FC<UserSelectorProps> = ({ mobile }) => {
  const trpc = useTRPC()
  const notify = useNotification()
  const [userInfo, setUserInfo] = useUserFilter()
  const [year] = useYearFilter()
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState<UserType[]>([])

  const { isLoading, error, data } = useQuery(
    trpc.users.getAllUsersBy.queryOptions({
      query: searchTerm,
    }),
  )

  useEffect(() => {
    if (data) {
      const users = data ?? []
      setDropdownOptions(users.filter(notEmpty))
    }
  }, [data])

  const onInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value ?? '')
  }, [])

  const onChange = useCallback(
    (_: React.SyntheticEvent, value: UserType | null) => {
      setUserInfo(value ? { userId: value.id, email: value.email } : { userId: 0, email: '' })
      setSearchTerm(value?.fullName ?? '')
    },
    [setUserInfo],
  )

  const onBlur = useCallback(() => {
    if (userInfo.userId === 0) {
      setSearchTerm('')
    }
  }, [userInfo.userId])

  if (error) {
    notify({
      text: error.message,
      variant: 'error',
    })
  }

  if (error) {
    return null
  }

  const selectedUser = dropdownOptions.find((u) => u.id === userInfo.userId) ?? null

  return (
    <Autocomplete<UserType>
      id='userFilter'
      loading={isLoading}
      options={dropdownOptions}
      getOptionLabel={(option: UserType) => option.fullName ?? ''}
      sx={{
        m: mobile ? '0 10px' : '0 10px 0 15px',
        maxWidth: 400,
        width: 400,
        '& label, & div': { fontSize: '0.875rem', color: 'inherit' },
        '& input::placeholder, & input::-webkit-input-placeholder': { opacity: 0.81 },
        '& input::-moz-placeholder, & input:-moz-placeholder': { opacity: 0.81 },
      }}
      value={selectedUser}
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
          placeholder='User Override'
          onChange={onInputChange}
          variant='standard'
          sx={{
            '& input': { paddingLeft: '5px !important' },
            '& label.Mui-focused': { color: 'inherit' },
            '& .MuiInput-underline:after, & .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before':
              { borderBottomColor: 'inherit' },
          }}
        />
      )}
      renderOption={(props, params: UserType) => {
        const isMember = !!params.membership.find((m) => m?.year === year)
        return (
          <li {...props} key={params.id} style={{ overflow: 'hidden' }}>
            <span style={{ fontSize: '0.875rem', wordWrap: 'break-word', opacity: isMember ? 1 : 0.6 }}>
              {params.fullName}
            </span>
          </li>
        )
      }}
      isOptionEqualToValue={getOptionSelected}
      onChange={onChange}
      onBlur={onBlur}
      data-test='customer-select-dropdown'
    />
  )
}
