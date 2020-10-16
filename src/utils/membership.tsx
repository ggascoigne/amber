import React from 'react'

import { useGetGameAssignmentsByYearQuery, useGetMembershipByYearAndIdQuery } from '../client'
import { useAuth } from '../components/Acnw/Auth/Auth0'
import { notEmpty } from './ts-utils'
import { useUser } from './useUserFilterState'
import { useYearFilterState } from './useYearFilterState'

const nullOp = (): null => null

export const useGetMemberShip = (userId: number | undefined | null) => {
  const year = useYearFilterState((state) => state.year)
  const { data } = useGetMembershipByYearAndIdQuery({
    skip: !userId,
    variables: { year, userId: userId! },
    fetchPolicy: 'cache-and-network',
  })

  if (!userId) {
    return null
  }

  if (!data) {
    return undefined // allows us to tell if the load is still ongoing and avoid redirects
  }

  const membership = data.memberships?.nodes?.[0]
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
  const year = useYearFilterState((state) => state.year)
  const { data: gameAssignmentData } = useGetGameAssignmentsByYearQuery({
    variables: {
      year,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (!isAuthenticated || !membership || !gameAssignmentData) return false

  return (
    gameAssignmentData.gameAssignments?.nodes
      .filter(notEmpty)
      .filter((ga) => ga!.memberId === membership.id)
      .filter((ga) => ga!.gm !== 0).length !== 0
  )
}
