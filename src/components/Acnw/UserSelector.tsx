import { TextField, makeStyles, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import classNames from 'classnames'
import { GetAllUsersByQuery, useGetAllUsersByQuery } from 'client'
import React, { useCallback, useEffect, useState } from 'react'
import { ContentsOf, notEmpty, useUserFilterState, useYearFilterState } from 'utils'

import { useNotification } from './Notifications'

const useStyles = makeStyles({
  divider: {
    borderRight: '1px solid rgba(255, 255, 255, 0.4)',
    fontSize: '35px',
    margin: '5px 0 5px 5px',
  },
  selector: {
    margin: '0 10px 0 15px',
    maxWidth: 400,
    width: 400,
    '& label, & div': {
      fontSize: '0.875rem', // 14px
      color: 'inherit',
    },
    '& input': {
      '&::placeholder, &::-webkit-input-placeholder': {
        opacity: 0.81,
      },
      '&::-moz-placeholder, &:-moz-placeholder': {
        opacity: 0.81,
      },
    },
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

const CleanTextField = withStyles({
  root: {
    '& input': {
      paddingLeft: '5px !important',
    },
    '& label.Mui-focused': {
      color: 'inherit',
    },
    '& .MuiInput-underline:after, & .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: 'inherit',
    },
  },
})(TextField)

type UserType = ContentsOf<ContentsOf<GetAllUsersByQuery, 'users'>, 'nodes'>

const getOptionSelected = (option: UserType, value: UserType) => option.id === value.id

interface UserSelectorProps {
  mobile?: boolean
}

export const UserSelector: React.FC<UserSelectorProps> = ({ mobile }) => {
  const classes = useStyles({})
  const [notify] = useNotification()
  const userInfo = useUserFilterState((state) => state.userInfo)
  const setUser = useUserFilterState((state) => state.setUser)
  const year = useYearFilterState((state) => state.year)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState<UserType[]>([])

  const { loading, error, data } = useGetAllUsersByQuery({
    variables: {
      input: searchTerm,
      limit: 20,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data) {
      const users = data?.users?.nodes ?? []
      setDropdownOptions(users?.filter(notEmpty))
    }
  }, [data])

  const onInputChange = useCallback((ev) => {
    setSearchTerm(ev.target.value)
  }, [])

  const onChange = useCallback(
    (_, value) => {
      setUser(value ? { userId: value.id, email: value.email } : { userId: 0, email: '' })
      if (!value) setSearchTerm('')
    },
    [setUser]
  )

  if (error) {
    notify({
      text: error.message,
      variant: 'error',
    })
  }

  if (error) {
    return null
  }

  const selectedUser = dropdownOptions?.find((u) => u.id === userInfo.userId) ?? null

  return (
    <Autocomplete<UserType>
      id='userFilter'
      loading={loading}
      options={dropdownOptions}
      getOptionLabel={(option: UserType) => option.fullName ?? ''}
      className={classNames(classes.selector, {
        [classes.selectorMobile]: mobile,
      })}
      value={selectedUser}
      classes={{
        endAdornment: classes.inheritColor,
        popupIndicator: classes.inheritColor,
        clearIndicator: classes.inheritColor,
      }}
      renderInput={(params) => (
        <CleanTextField {...params} fullWidth placeholder='User Override' onChange={onInputChange} />
      )}
      renderOption={(params: UserType) => {
        const isMember = !!params?.memberships?.nodes?.find((m) => m?.year === year)
        return (
          <div className={classes.holder}>
            <span className={classNames(classes.text, { [classes.notMember]: !isMember })}>{params.fullName}</span>
          </div>
        )
      }}
      getOptionSelected={getOptionSelected}
      onChange={onChange}
      data-test='customer-select-dropdown'
    />
  )
}
