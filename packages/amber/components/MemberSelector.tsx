import React, { useCallback, useEffect, useState } from 'react'

import { Autocomplete, TextField } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { ContentsOf, notEmpty, useNotification } from 'ui'

import { GetAllMembersByQuery, useGetAllMembersByQuery } from '../client'

const useStyles = makeStyles()({
  divider: {
    borderRight: '1px solid rgba(255, 255, 255, 0.4)',
    fontSize: '35px',
    margin: '5px 0 5px 5px',
  },
  selector: {
    maxWidth: 400,
    width: 400,
    '& label, & div': {
      fontSize: '0.875rem', // 14px
      color: 'inherit',
    },
    '& input': {
      '&::placeholder, &::-webkit-input-placeholder': {
        opacity: 1,
      },
      '&::-moz-placeholder, &:-moz-placeholder': {
        opacity: 1,
      },
    },
  },
  paper: {
    marginTop: 4,
  },
  selectorMobile: {
    margin: '0 10px',
  },
  inheritColor: {
    color: 'inherit',
  },
  holder: {
    overflow: 'hidden',
  },
  text: {
    fontSize: '0.875rem', // 14px
    wordWrap: 'break-word',
  },
  notMember: {
    opacity: '.6',
  },
})

export type UserMemberType = ContentsOf<ContentsOf<GetAllMembersByQuery, 'users'>, 'nodes'>

const getOptionSelected = (option: UserMemberType, value: UserMemberType) => option.id === value.id

interface MemberSelectorProps {
  label: string
  year: number
  onChange: (newValue: UserMemberType | null) => void
  onlyDisplayMembersWithBalances: boolean
}

let keyVal = 0

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  year,
  label,
  onChange,
  onlyDisplayMembersWithBalances,
}) => {
  const { classes, cx } = useStyles()
  const notify = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState<UserMemberType[]>([])

  const { isLoading, error, data } = useGetAllMembersByQuery({
    year,
    query: searchTerm,
  })

  useEffect(() => {
    if (data) {
      const users = data.users?.nodes ?? []
      setDropdownOptions(
        users.filter(notEmpty).filter((u) => {
          const hasMembership = u.memberships.nodes.length > 0
          const hasBalance = u.amountOwed < 0
          return onlyDisplayMembersWithBalances ? hasMembership && hasBalance : hasMembership
        }),
      )
    }
  }, [data, onlyDisplayMembersWithBalances])

  const onInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value ?? '')
  }, [])

  const onValueChange = useCallback(
    (_: React.SyntheticEvent, value: UserMemberType | null) => {
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
    <Autocomplete<UserMemberType>
      key={`key_${keyVal}`}
      id='userFilter'
      loading={isLoading}
      options={dropdownOptions}
      getOptionLabel={(option: UserMemberType) => option.fullName ?? ''}
      className={classes.selector}
      value={null}
      classes={{
        paper: classes.paper,
        endAdornment: classes.inheritColor,
        popupIndicator: classes.inheritColor,
        clearIndicator: classes.inheritColor,
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
      renderOption={(props, params: UserMemberType) => (
        <li {...props} key={params.id} className={cx(props.className, classes.holder)}>
          <span className={classes.text}>{params.fullName}</span>
        </li>
      )}
      isOptionEqualToValue={getOptionSelected}
      onChange={onValueChange}
      onBlur={onBlur}
      data-test='customer-select-dropdown'
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: '4px',
      }}
    />
  )
}
