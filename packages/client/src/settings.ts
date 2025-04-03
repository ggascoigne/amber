import { RouterOutputs } from '@amber/server'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from './trpc'

export type SettingsQueryResult = RouterOutputs['settings']['getSettings']
export type Settings = SettingsQueryResult
export type Setting = SettingsQueryResult[0]

export const useGetSettingsQuery = () => {
  const trpc = useTRPC()
  return useQuery(trpc.settings.getSettings.queryOptions())
}

export const useInvalidateSettingsQueries = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: trpc.settings.getSettings.queryKey() })
  }
}

export const useCreateSettingMutation = () => {
  const trpc = useTRPC()
  return useMutation(trpc.settings.createSetting.mutationOptions())
}

export const useUpdateSettingByIdMutation = () => {
  const trpc = useTRPC()
  return useMutation(trpc.settings.updateSettingById.mutationOptions())
}

export const useDeleteSettingMutation = () => {
  const trpc = useTRPC()
  return useMutation(trpc.settings.deleteSetting.mutationOptions())
}
