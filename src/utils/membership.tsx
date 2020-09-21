import React, { useState } from 'react'

import { useGetMembershipByYearAndIdLazyQuery } from '../client'
import { useAuth } from '../components/Acnw/Auth/Auth0'
import { useLocalStorage } from './useLocalStorage'
import { useUser } from './useUserFilterState'
import { useYearFilterState } from './useYearFilterState'

type IsUserAMember = {
  userId: number
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

export const useIsMember = (userId: number | undefined | null) => {
  const [executed, setExecuted] = useState(false)
  const year = useYearFilterState((state) => state.year)
  const [lastMembershipYear, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)
  const [getMembership, { loading, error, data }] = useGetMembershipByYearAndIdLazyQuery()

  if (lastMembershipYear !== year) {
    if (!userId) {
      return false
    }
    if (!executed) {
      getMembership({ variables: { year, userId } })
      setExecuted(true)
    }

    if (loading || !data) {
      return false
    }
    if (error || year !== data.memberships?.nodes?.[0]?.year) {
      error && console.log(`error = ${JSON.stringify(error, null, 2)}`)
      return false
    }
    setExecuted(false)
    setLastMembershipYear(year)
  }
  return true
}

const IsUserAMember: React.FC<IsUserAMember> = ({ userId, children = null, denied = nullOp }) => {
  const isMember = useIsMember(userId)
  return isMember ? <>{children}</> : denied()
}

export const IsMember: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const { userId } = useUser()

  if (isAuthenticated && !!userId) {
    return <IsUserAMember userId={userId}>{children}</IsUserAMember>
  } else {
    return null
  }
}

export const IsNotMember: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const { userId } = useUser()

  if (isAuthenticated && !!userId) {
    return <IsUserAMember userId={userId} denied={() => <>{children}</>} />
  } else {
    return <>{children}</>
  }
}
