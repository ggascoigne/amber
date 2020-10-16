import { useCallback } from 'react'

import { SettingFieldsFragment, useGetSettingsQuery } from '../client'
import { useAuth } from '../components/Acnw/Auth/Auth0'
import { Perms } from '../components/Acnw/Auth/PermissionRules'
import { useIsGm } from './membership'
import { notEmpty } from './ts-utils'

export enum SettingValue {
  No = 'No',
  Admin = 'Admin',
  GM = 'GM',
  Everyone = 'Everyone',
  Yes = 'Yes',
}

const asSettingValue = (s: string): SettingValue => SettingValue[s as keyof typeof SettingValue]

export const settingValues = ['No', 'Admin', 'GM', 'Everyone', 'Yes']

export const useSettings = () => {
  const isGm = useIsGm()
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const { loading, error, data } = useGetSettingsQuery({
    fetchPolicy: 'cache-first',
  })

  const getSettingValue = useCallback(
    (setting: string, defaultValue = false): SettingValue | null => {
      const getSetting = (settings: SettingFieldsFragment[] | null, setting: string): SettingValue | null => {
        const s = settings?.find((s) => s.code === setting)
        return s ? asSettingValue(s.value) : null
      }

      if (error || loading || !data) {
        return defaultValue
      }

      const settings: SettingFieldsFragment[] | null = data?.settings?.nodes?.filter(notEmpty) ?? null

      return getSetting(settings, setting)
    },
    [data, error, loading]
  )

  const getSettingTruth = useCallback(
    (setting: string, defaultValue = false) => {
      const s = getSettingValue(setting, setting)

      switch (s) {
        case SettingValue.Admin:
          return isAdmin
        case SettingValue.GM:
          return isAdmin || isGm
        case SettingValue.Everyone:
        case SettingValue.Yes:
          return true
        default:
        case null:
        case SettingValue.No:
          return false
      }
    },
    [getSettingValue, isAdmin, isGm]
  )

  return error || loading || !data ? [undefined, undefined] : ([getSettingValue, getSettingTruth] as const)
}

export const useSetting = (setting: string, defaultValue = false) => {
  const [, getSettingTruth] = useSettings()
  return getSettingTruth ? getSettingTruth(setting, defaultValue) : undefined
}

type useGetSettingValueType = (setting: string, defaultValue?: boolean) => SettingValue | null | undefined

export const useGetSettingValue: useGetSettingValueType = (setting: string, defaultValue = false) => {
  const [getSettingValue] = useSettings()
  return getSettingValue ? getSettingValue(setting, defaultValue) : undefined
}
