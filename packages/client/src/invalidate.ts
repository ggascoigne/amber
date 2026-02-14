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
          return queryClient.invalidateQueries({
            queryKey: q,
            refetchType: 'all',
          })
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

  const allGameAssignmentQueries = useMemo(
    () => [
      trpc.gameAssignments.getGameAssignmentsByYear.queryKey(),
      trpc.gameAssignments.getSchedule.queryKey(),
      trpc.gameAssignments.getAssignmentDashboardData.queryKey(),
    ],
    [
      trpc.gameAssignments.getAssignmentDashboardData,
      trpc.gameAssignments.getGameAssignmentsByYear,
      trpc.gameAssignments.getSchedule,
    ],
  )

  const allGameAssignmentDashboardQueries = useMemo(
    () => [trpc.gameAssignments.getAssignmentDashboardData.queryKey()],
    [trpc.gameAssignments.getAssignmentDashboardData],
  )

  const allGameQueries = useMemo(
    () => [
      ...allGameAssignmentQueries,
      trpc.games.getGamesByYear.queryKey(),
      trpc.games.getGamesByAuthor.queryKey(),
      trpc.games.getGamesByYearAndAuthor.queryKey(),
      trpc.games.getGameById.queryKey(),
    ],
    [
      allGameAssignmentQueries,
      trpc.games.getGameById,
      trpc.games.getGamesByAuthor,
      trpc.games.getGamesByYear,
      trpc.games.getGamesByYearAndAuthor,
    ],
  )

  const allPaymentQueries = useMemo(
    () => [
      trpc.transactions.getTransactions.queryKey(),
      trpc.transactions.getTransactionsByYear.queryKey(),
      trpc.transactions.getTransactionsByUser.queryKey(),
      trpc.transactions.getTransactionsByYearAndUser.queryKey(),
      trpc.users.getUser.queryKey(),
    ],
    [
      trpc.transactions.getTransactions,
      trpc.transactions.getTransactionsByYear,
      trpc.transactions.getTransactionsByUser,
      trpc.transactions.getTransactionsByYearAndUser,
      trpc.users.getUser,
    ],
  )

  const allGameChoiceQueries = useMemo(
    () => [trpc.gameChoices.getGameChoices.queryKey()],
    [trpc.gameChoices.getGameChoices],
  )

  const allGameRoomQueries = useMemo(
    () => [trpc.gameRooms.getGameRooms.queryKey(), trpc.gameRooms.getGameRoomAndGames.queryKey()],
    [trpc.gameRooms.getGameRoomAndGames, trpc.gameRooms.getGameRooms],
  )

  const allHotelRoomDetailsQueries = useMemo(
    () => [trpc.hotelRoomDetails.getHotelRoomDetails.queryKey()],
    [trpc.hotelRoomDetails.getHotelRoomDetails],
  )

  const allHotelRoomsQueries = useMemo(
    () => [trpc.hotelRooms.getHotelRooms.queryKey()],
    [trpc.hotelRooms.getHotelRooms],
  )

  return {
    allGameAssignmentQueries,
    allGameAssignmentDashboardQueries,
    allGameChoiceQueries,
    allGameQueries,
    allGameRoomQueries,
    allLookupQueries,
    allMembershipQueries,
    allPaymentQueries,
    allProfileQueries,
    allSettingsQueries,
    allUserQueries,
    allHotelRoomDetailsQueries,
    allHotelRoomsQueries,
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

export const useInvalidatePaymentQueries = () => {
  const { allPaymentQueries } = useQueryLists()
  return useInvalidateQueries(allPaymentQueries)
}

export const useInvalidateGameAssignmentQueries = () => {
  const { allGameAssignmentQueries } = useQueryLists()
  return useInvalidateQueries(allGameAssignmentQueries, 'allGameAssignmentQueries')
}

export const useInvalidateGameAssignmentDashboardQueries = () => {
  const { allGameAssignmentDashboardQueries } = useQueryLists()
  return useInvalidateQueries(allGameAssignmentDashboardQueries, 'allGameAssignmentDashboardQueries')
}

export const useInvalidateGameQueries = () => {
  const { allGameQueries } = useQueryLists()
  return useInvalidateQueries(allGameQueries, 'allGameQueries')
}

export const useInvalidateGameChoiceQueries = () => {
  const { allGameChoiceQueries } = useQueryLists()
  return useInvalidateQueries(allGameChoiceQueries)
}

export const useInvalidateGameRoomQueries = () => {
  const { allGameRoomQueries } = useQueryLists()
  return useInvalidateQueries(allGameRoomQueries)
}

export const useInvalidateHotelRoomDetailsQueries = () => {
  const { allHotelRoomDetailsQueries } = useQueryLists()
  return useInvalidateQueries(allHotelRoomDetailsQueries)
}
export const useInvalidateHotelRoomsQueries = () => {
  const { allHotelRoomsQueries } = useQueryLists()
  return useInvalidateQueries(allHotelRoomsQueries)
}
