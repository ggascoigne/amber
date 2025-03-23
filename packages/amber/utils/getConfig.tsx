import { api, RouterOutputs } from '@amber/server'

export type ConfigQueryResult = RouterOutputs['config']['getConfig']
export type Config = ConfigQueryResult

export const useGetConfig = () => {
  const { data: config } = api.config.getConfig.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
  return config
}
