import { useAuth } from 'components/Acnw/Auth/Auth0'
import React from 'react'

import { useGetGameAssignmentsByMemberIdQuery, useGetMembershipByYearAndIdQuery } from '../client'
import { notEmpty } from './ts-utils'
import { useUser } from './useUserFilterState'
import { useYearFilter } from './useYearFilterState'

export const useGetMemberShip = (userId: number | undefined | null) => {
  const [year] = useYearFilter()
  const { data } = useGetMembershipByYearAndIdQuery(
    { year, userId: userId! },
    {
      enabled: !!userId,
    }
  )

  if (!userId) {
    return null
  }

  if (!data) {
    return undefined // allows us to tell if the load is still ongoing and avoid redirects
  }

  const membership = data.memberships?.nodes[0]
  return membership?.year === year ? membership : null
}

export const useIsMember = () => {
  const { isAuthenticated } = useAuth()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  return !!isAuthenticated && !!membership?.attending
}

export const IsMember: React.FC = ({ children }) => {
  const isMember = useIsMember()

  if (isMember) {
    return <>{children}</>
  } else {
    return null
  }
}

export const IsNotMember: React.FC = ({ children }) => {
  const isMember = useIsMember()

  if (isMember) {
    return null
  } else {
    return <>{children}</>
  }
}

export const useIsGm = () => {
  const { isAuthenticated } = useAuth()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const { data: gameAssignmentData } = useGetGameAssignmentsByMemberIdQuery(
    {
      memberId: membership?.id ?? 0,
    },
    { enabled: !!membership }
  )

  if (!isAuthenticated || !membership || !gameAssignmentData) return false

  return (
    gameAssignmentData.gameAssignments?.nodes
      .filter(notEmpty)
      .filter((ga) => ga.memberId === membership.id)
      .filter((ga) => ga.gm !== 0).length !== 0
  )
}
