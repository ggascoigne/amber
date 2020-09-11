import React from 'react'

import { useGetMembershipByYearAndIdQuery } from '../client'
import { Auth0User, useAuth } from '../components/Acnw/Auth/Auth0'
import { configuration } from './configuration'
import { useLocalStorage } from './useLocalStorage'

type IsUserAMember = {
  user: Auth0User
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

const IsUserAMember: React.FC<IsUserAMember> = ({ user, children = null, denied = nullOp }) => {
  const year = configuration.year
  const [lastMembershipYear, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)
  const { loading, error, data } = useGetMembershipByYearAndIdQuery({ variables: { year, userId: user.userId } })
  if (lastMembershipYear !== year) {
    if (loading || !data) {
      return denied()
    }
    if (error || year !== data.memberships?.nodes?.[0]?.year) {
      error && console.log(`error = ${JSON.stringify(error, null, 2)}`)
      return denied()
    }
    setLastMembershipYear(year)
  }
  return <>{children}</>
}

export const IsMember: React.FC = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && !!user) {
    return <IsUserAMember user={user}>{children}</IsUserAMember>
  } else {
    return null
  }
}

export const IsNotMember: React.FC = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && !!user) {
    return <IsUserAMember user={user} denied={() => <>{children}</>} />
  } else {
    return <>{children}</>
  }
}
