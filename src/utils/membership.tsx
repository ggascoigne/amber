import React from 'react'

import { useGetMembershipByYearAndIdQuery } from '../client'
import { useAuth } from '../components/Acnw/Auth/Auth0'
import { useUser } from './useUserFilterState'
import { useYearFilterState } from './useYearFilterState'

type IsUserAMember = {
  userId: number
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

export const useIsMember = (userId: number | undefined | null) => {
  const year = useYearFilterState((state) => state.year)
  const { data } = useGetMembershipByYearAndIdQuery({
    skip: !userId,
    variables: { year, userId: userId! },
  })

  return !!(data && year === data.memberships?.nodes?.[0]?.year)
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
