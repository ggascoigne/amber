import type { PropsWithChildren } from 'react'
import type React from 'react'

import { useTRPC } from '@amber/client'
import { useQuery } from '@tanstack/react-query'

import { useUser } from './useUserFilterState'
import { useYearFilter } from './useYearFilterState'

import { useAuth } from '../components/Auth'

export const useGetMemberShip = (userId: number | undefined | null) => {
  const [year] = useYearFilter()
  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.memberships.getMembershipByYearAndId.queryOptions(
      { year, userId: userId! },
      {
        enabled: !!userId,
      },
    ),
  )

  if (!userId) {
    return null
  }

  if (!data) {
    return undefined // allows us to tell if the load is still ongoing and avoid redirects
  }

  const membership = data[0]
  return membership?.year === year ? membership : null
}

export const useIsMember = () => {
  const { userId } = useUser()
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
  const trpc = useTRPC()
  const { user } = useAuth()
  const [year] = useYearFilter()
  const userId = user?.userId
  const { data: isGmData } = useQuery(
    trpc.gameAssignments.isGameMaster.queryOptions(
      {
        userId: userId!,
        year,
      },
      { enabled: !!userId },
    ),
  )

  if (!user) return false

  return isGmData ?? false
}
