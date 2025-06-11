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
