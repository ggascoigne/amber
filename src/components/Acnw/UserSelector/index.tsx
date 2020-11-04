import { makeStyles } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams, createFilterOptions } from '@material-ui/lab'
import classNames from 'classnames'
import { GetAllUsersByQuery, useGetAllUsersByQuery } from 'client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ContentsOf, notEmpty, useUserFilterState, useYearFilterState } from 'utils'

import { useNotification } from '../Notifications'
import { CleanTextField } from './CleanTextField'
import { LazyLoadingListbox, LazyLoadingListboxContext } from './LazyLoadingListbox'

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

type UserType = ContentsOf<ContentsOf<GetAllUsersByQuery, 'users'>, 'nodes'>

const getOptionSelected = (option: UserType, value: UserType) => option.id === value.id

interface UserSelectorProps {
  mobile?: boolean
}

export const UserSelector: React.FC<UserSelectorProps> = React.memo(({ mobile }) => {
  const classes = useStyles({})
  const [notify] = useNotification()
  const userInfo = useUserFilterState((state) => state.userInfo)
  const setUser = useUserFilterState((state) => state.setUser)
  const year = useYearFilterState((state) => state.year)
  const [searchTerm, setSearchTerm] = useState('')
  const [offset, setOffset] = useState(0)
  const [dropdownOptions, setDropdownOptions] = useState<UserType[]>([])

  const { loading, error, data, fetchMore } = useGetAllUsersByQuery({
    variables: {
      query: searchTerm,
      offset,
      limit: 20,
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })

  const nodeLength = data?.users?.nodes?.length ?? 0

  useEffect(() => setOffset(nodeLength), [nodeLength])

  const userCount = data?.users?.totalCount ?? 0

  const loadNextPage = useCallback(
    () => fetchMore({
        variables: {
          offset
        }
      }),
    [fetchMore, offset]
  )

  const loaderValues = useMemo(
    () => ({
      isNextPageLoading: loading,
      loadNextPage,
      hasNextPage: nodeLength < userCount,
    }),
    [nodeLength, userCount, loadNextPage, loading]
  )

  // console.log(`loaderValues = ${JSON.stringify(loaderValues, null, 2)}`)

  useEffect(() => {
    if (data) {
      const users = data?.users?.nodes ?? []
      setDropdownOptions(users?.filter(notEmpty))
    }
  }, [data])

  const onInputChange = useCallback((ev) => {
    setOffset(0)
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

  const filterOptions = createFilterOptions({
    trim: true,
    stringify: (option: UserType) => option.fullName ?? '',
  })

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <CleanTextField {...params} fullWidth placeholder='User Override' onChange={onInputChange} />
  )

  const renderOption = (params: UserType) => {
    const isMember = !!params?.memberships?.nodes?.find((m) => m?.year === year)
    return (
      <div className={classes.holder}>
        <span className={classNames(classes.text, { [classes.notMember]: !isMember })}>{params.fullName}</span>
      </div>
    )
  }

  return (
    <LazyLoadingListboxContext.Provider value={loaderValues}>
      <Autocomplete<UserType>
        id='userFilter'
        loading={loading}
        options={dropdownOptions}
        getOptionLabel={(option: UserType) => option.fullName ?? ''}
        className={classNames(classes.selector, {
          [classes.selectorMobile]: mobile,
        })}
        filterOptions={filterOptions}
        value={selectedUser}
        inputValue={searchTerm}
        classes={{
          endAdornment: classes.inheritColor,
          popupIndicator: classes.inheritColor,
          clearIndicator: classes.inheritColor,
        }}
        renderInput={renderInput}
        renderOption={renderOption}
        noOptionsText={searchTerm?.length > 0 ? 'No matching users' : 'Enter user name'}
        getOptionSelected={getOptionSelected}
        onChange={onChange}
        // @ts-ignore
        ListboxComponent={LazyLoadingListbox as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
      />
      {!mobile && <span className={classes.divider}>&nbsp;</span>}
    </LazyLoadingListboxContext.Provider>
  )
})

// @ts-ignore
UserSelector.whyDidYouRender = true
