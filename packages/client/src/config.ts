import { RouterOutputs } from '@amber/server'
import { useQuery } from '@tanstack/react-query'

import { useTRPC } from './trpc'

export type ConfigQueryResult = RouterOutputs['config']['getConfig']
export type Config = ConfigQueryResult

export const useGetConfigQuery = () => {
  const trpc = useTRPC()
  const { data: config } = useQuery(
    trpc.config.getConfig.queryOptions(undefined, {
      staleTime: 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }),
  )
  return config
}
