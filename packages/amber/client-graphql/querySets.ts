import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'

const useInvalidateQueries = (queries: string[]) => {
  const queryClient = useQueryClient()
  return useCallback(
    () =>
      Promise.allSettled(queries.map((q) => queryClient.invalidateQueries({ queryKey: [q] }), { refetchType: 'all' })),
    [queries, queryClient],
  )
}

const allMembershipQueries = [
  'getMembershipByYearAndId',
  'getMembershipsByYear',
  'getMembershipsById',
  'getMembershipByYearAndRoom',
  'getUserById',
]

export const useInvalidateMembershipQueries = () => useInvalidateQueries(allMembershipQueries)

const allProfileQueries = ['getUserByEmail', 'getAllUsersAndProfiles']

export const useInvalidateProfileQueries = () => useInvalidateQueries(allProfileQueries)

const allUserQueries = [...allMembershipQueries, ...allProfileQueries, 'getUserById', 'getAllUsers', 'getAllUsersBy']

export const useInvalidateUserQueries = () => useInvalidateQueries(allUserQueries)

const allPaymentQueries = [
  'getTransaction',
  'getTransactionByYear',
  'getTransactionByUser',
  'getTransactionByYearAndUser',
  'getUserById',
]

export const useInvalidatePaymentQueries = () => useInvalidateQueries(allPaymentQueries)

const allGameAssignmentQueries = ['getGameAssignmentsByYear', 'getSchedule']

export const useInvalidateGameAssignmentQueries = () => useInvalidateQueries(allGameAssignmentQueries)

const gameQueries = ['getGamesByYear', 'getGamesByAuthor', 'getGamesByYearAndAuthor', 'getGameAssignmentsByGameId']

export const useInvalidateGameQueries = () => useInvalidateQueries(gameQueries)

const allGameChoiceQueries = ['getGameChoices']

export const useInvalidateGameChoiceQueries = () => useInvalidateQueries(allGameChoiceQueries)

// const settingsQueries = ['getSettings']

// export const useInvalidateSettingsQueries = () => useInvalidateQueries(settingsQueries)
