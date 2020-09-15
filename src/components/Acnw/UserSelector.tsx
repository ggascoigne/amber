import { TextField, makeStyles, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'

import { useGetAllUsersQuery } from '../../client'
import { useUserFilterState } from '../../utils/useUserFilterState'
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

const getOptionSelected = (option: AutocompleteObject, value: AutocompleteObject) => option.value === value.value

interface UserSelector {
  mobile?: boolean
}

export type AutocompleteObject = { value: any; text: string }

export const UserSelector: React.FC<UserSelector> = ({ mobile }) => {
  const classes = useStyles({})
  const [notify] = useNotification()
  const userId = useUserFilterState((state) => state.userId)
  const setUser = useUserFilterState((state) => state.setUser)

  const { loading, error, data } = useGetAllUsersQuery()

  const dropdownOptions: AutocompleteObject[] | null = useMemo(() => {
    const users = data?.users?.nodes || []

    return users?.map((u) => u && { value: u.id, text: u.fullName || '' }).filter(Boolean) as
      | AutocompleteObject[]
      | null
  }, [data])

  const onChange = useCallback(
    (_, value) => {
      console.log(`value = ${JSON.stringify(value, null, 2)}`)
      setUser(value?.value || 0)
    },
    [setUser]
  )

  if (error) {
    notify({
      text: error.message,
      variant: 'error',
    })
    return null
  }

  if (loading || !data) {
    return null
  }

  const selectedUser = dropdownOptions?.find((u) => u.value === userId) || null

  if (dropdownOptions && dropdownOptions.length > 0) {
    return (
      <>
        <Autocomplete<AutocompleteObject>
          id='customerFilter'
          options={dropdownOptions}
          getOptionLabel={(option: AutocompleteObject) => option.text}
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
          renderOption={(params: AutocompleteObject) => (
            <div className={classes.holder}>
              <span className={classes.text}>{params.text}</span>
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
