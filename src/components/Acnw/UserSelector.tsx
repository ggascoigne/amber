import { TextField, makeStyles, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import classNames from 'classnames'
import { UserFieldsFragment, useGetAllUsersQuery } from 'client'
import React, { useCallback, useMemo } from 'react'
import { notEmpty, useUserFilterState } from 'utils'

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

const getOptionSelected = (option: UserFieldsFragment, value: UserFieldsFragment) => option.id === value.id

interface UserSelector {
  mobile?: boolean
}

export const UserSelector: React.FC<UserSelector> = ({ mobile }) => {
  const classes = useStyles({})
  const [notify] = useNotification()
  const userInfo = useUserFilterState((state) => state.userInfo)
  const setUser = useUserFilterState((state) => state.setUser)

  const { loading, error, data } = useGetAllUsersQuery()

  const dropdownOptions = useMemo(() => {
    const users = data?.users?.nodes ?? []
    return users?.map((u) => u).filter(notEmpty)
  }, [data])

  const onChange = useCallback(
    (_, value) => {
      setUser(value ? { userId: value.id, email: value.email } : { userId: 0, email: '' })
    },
    [setUser]
  )

  if (error) {
    notify({
      text: error.message,
      variant: 'error',
    })
  }

  if (error || loading || !data) {
    return null
  }

  const selectedUser = dropdownOptions?.find((u) => u.id === userInfo.userId) ?? null

  if (dropdownOptions && dropdownOptions.length > 0) {
    return (
      <>
        <Autocomplete<UserFieldsFragment>
          id='customerFilter'
          options={dropdownOptions}
          getOptionLabel={(option: UserFieldsFragment) => option.fullName ?? ''}
          className={classNames(classes.selector, {
            [classes.selectorMobile]: mobile,
          })}
          value={selectedUser}
          classes={{
            endAdornment: classes.inheritColor,
            popupIndicator: classes.inheritColor,
            clearIndicator: classes.inheritColor,
          }}
          renderInput={(params) => <CleanTextField {...params} fullWidth placeholder='User Override' />}
          renderOption={(params: UserFieldsFragment) => (
            <div className={classes.holder}>
              <span className={classes.text}>{params.fullName}</span>
            </div>
          )}
          getOptionSelected={getOptionSelected}
          onChange={onChange}
          data-test='customer-select-dropdown'
        />
      </>
    )
  } else {
    return null
  }
}
