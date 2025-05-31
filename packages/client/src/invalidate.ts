import { useCallback, useMemo } from 'react'

import { type QueryKey, useQueryClient } from '@tanstack/react-query'
import { debug } from 'debug'
import { match, P } from 'ts-pattern'

import { useTRPC } from './trpc'

const log = debug('amber:client:invalidate')

const useInvalidateQueries = (queries: QueryKey[], name?: string) => {
  const queryClient = useQueryClient()
  return useCallback(() => {
    log('useInvalidateQueries', name ?? queries)
    return Promise.allSettled(
      queries.map(
        (q) => {
          match(q)
            .with([P._, { type: 'query' }], ([key]) => log(`invalidating query: ${key}`))
            .with([P._, { type: 'mutation' }], ([key]) => log(`invalidating mutation: ${key}`))
            .otherwise(() => log('invalidating queryKey', q))
          return queryClient.invalidateQueries({ queryKey: q, refetchType: 'all' })
        },
        { refetchType: 'all' },
      ),
    )
  }, [name, queries, queryClient])
}

const useQueryLists = () => {
  const trpc = useTRPC()

  const allMembershipQueries = useMemo(
    () => [
      trpc.memberships.getMembershipByYearAndId.queryKey(),
      trpc.memberships.getMembershipsByYear.queryKey(),
      trpc.memberships.getMembershipsById.queryKey(),
      trpc.memberships.getMembershipByYearAndRoom.queryKey(),
      trpc.users.getUser.queryKey(),
    ],
    [
      trpc.memberships.getMembershipByYearAndId,
      trpc.memberships.getMembershipByYearAndRoom,
      trpc.memberships.getMembershipsById,
      trpc.memberships.getMembershipsByYear,
      trpc.users.getUser,
    ],
  )

  const allProfileQueries = useMemo(
    () => [trpc.users.getUserByEmail.queryKey(), trpc.users.getAllUsersAndProfiles.queryKey()],
    [trpc.users.getAllUsersAndProfiles, trpc.users.getUserByEmail],
  )

  const allLookupQueries = useMemo(
    () => [trpc.lookups.getLookupValues.queryKey(), trpc.lookups.getLookups.queryKey()],
    [trpc.lookups.getLookupValues, trpc.lookups.getLookups],
  )

  const allUserQueries = useMemo(
    () => [
      ...allMembershipQueries,
      ...allProfileQueries,
      trpc.users.getAllUsers.queryKey(),
      trpc.users.getAllUsersBy.queryKey(),
    ],
    [allMembershipQueries, allProfileQueries, trpc.users.getAllUsers, trpc.users.getAllUsersBy],
  )

  const allSettingsQueries = useMemo(() => [trpc.settings.getSettings.queryKey()], [trpc.settings.getSettings])

  return {
    allMembershipQueries,
    allProfileQueries,
    allUserQueries,
    allLookupQueries,
    allSettingsQueries,
  }
}

export const useInvalidateMembershipQueries = () => {
  const { allMembershipQueries } = useQueryLists()
  return useInvalidateQueries(allMembershipQueries, 'allMembershipQueries')
}

export const useInvalidateLookupQueries = () => {
  const { allLookupQueries } = useQueryLists()
  return useInvalidateQueries(allLookupQueries, 'allLookupQueries')
}

export const useInvalidateProfileQueries = () => {
  const { allProfileQueries } = useQueryLists()
  return useInvalidateQueries(allProfileQueries, 'allProfileQueries')
}

export const useInvalidateUserQueries = () => {
  const { allUserQueries } = useQueryLists()
  return useInvalidateQueries(allUserQueries, 'allUserQueries')
}

export const useInvalidateSettingsQueries = () => {
  const { allSettingsQueries } = useQueryLists()
  return useInvalidateQueries(allSettingsQueries, 'allSettingsQueries')
}

// const allPaymentQueries = [
//   'getTransaction',
//   'getTransactionByYear',
//   'getTransactionByUser',
//   'getTransactionByYearAndUser',
//   'getUserById',
// ]

// export const useInvalidatePaymentQueries = () => useInvalidateQueries(allPaymentQueries)

// const allGameAssignmentQueries = ['getGameAssignmentsByYear', 'getSchedule']

// export const useInvalidateGameAssignmentQueries = () => useInvalidateQueries(allGameAssignmentQueries)

// const gameQueries = ['getGamesByYear', 'getGamesByAuthor', 'getGamesByYearAndAuthor', 'getGameAssignmentsByGameId']

// export const useInvalidateGameQueries = () => useInvalidateQueries(gameQueries)

// const allGameChoiceQueries = ['getGameChoices']

// export const useInvalidateGameChoiceQueries = () => useInvalidateQueries(allGameChoiceQueries)
