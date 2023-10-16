import React, { PropsWithChildren } from 'react'

import { notEmpty } from 'ui'

import { useYearFilter } from './useYearFilterState'

import { useGraphQL, GetGameAssignmentsByMemberIdDocument, GetMembershipByYearAndIdDocument } from '../client'
import { useAuth } from '../components/Auth'

export const useGetMemberShip = (userId: number | undefined | null) => {
  const [year] = useYearFilter()
  const { data } = useGraphQL(GetMembershipByYearAndIdDocument, {
    variables: { year, userId: userId! },
    options: {
      enabled: !!userId,
    },
  })

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
  const { user } = useAuth()
  const userId = user?.userId
  const membership = useGetMemberShip(userId)
  return !!membership?.attending
}

export const IsMember: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const isMember = useIsMember()

  if (isMember) {
    return <>{children}</>
  }
  return null
}

export const IsNotMember: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const isMember = useIsMember()

  if (isMember) {
    return null
  }
  return <>{children}</>
}

export const useIsGm = () => {
  const { user } = useAuth()
  const userId = user?.userId
  const membership = useGetMemberShip(userId)
  const { data: gameAssignmentData } = useGraphQL(GetGameAssignmentsByMemberIdDocument, {
    variables: {
      memberId: membership?.id ?? 0,
    },
    options: { enabled: !!membership },
  })

  if (!user || !membership || !gameAssignmentData) return false

  return (
    gameAssignmentData.gameAssignments?.nodes
      .filter(notEmpty)
      .filter((ga) => ga.memberId === membership.id)
      .filter((ga) => ga.gm !== 0).length !== 0
  )
}
