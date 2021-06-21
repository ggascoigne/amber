import { Perms, useAuth } from 'components/Auth'
import { useCallback } from 'react'

import { SettingFieldsFragment, useGetSettingsQuery } from '../client'
import { useIsGm, useIsMember } from './membership'
import { notEmpty } from './ts-utils'

export enum SettingValue {
  No = 'No',
  Admin = 'Admin',
  GM = 'GM',
  Member = 'Member',
  Everyone = 'Everyone',
  Yes = 'Yes',
}

const asSettingValue = (s: string): SettingValue => SettingValue[s as keyof typeof SettingValue]

export const settingValues = ['No', 'Admin', 'GM', 'Member', 'Everyone', 'Yes']

export const useSettings = () => {
  const isGm = useIsGm()
  const isMember = useIsMember()
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const { isLoading, error, data } = useGetSettingsQuery()

  const getSettingString = useCallback(
    (setting: string, defaultValue = false): string | null => {
      const getSetting = (settings: SettingFieldsFragment[] | null, setting: string): string | null => {
        const s = settings?.find((s) => s.code === setting)
        return s ? s.value : null
      }

      if (error || isLoading || !data) {
        return defaultValue
      }

      const settings: SettingFieldsFragment[] | null = data.settings?.nodes.filter(notEmpty) ?? null

      return getSetting(settings, setting)
    },
    [data, error, isLoading]
  )

  const getSettingValue = useCallback(
    (setting: string, defaultValue = false): SettingValue | null => {
      const getSetting = (settings: SettingFieldsFragment[] | null, setting: string): SettingValue | null => {
        const s = settings?.find((s) => s.code === setting)
        if (s && s.type !== 'integer') throw new Error("can't call getSettingValue on a non-enum type")
        return s ? asSettingValue(s.value) : null
      }

      if (error || isLoading || !data) {
        return defaultValue
      }

      const settings: SettingFieldsFragment[] | null = data.settings?.nodes.filter(notEmpty) ?? null

      return getSetting(settings, setting)
    },
    [data, error, isLoading]
  )

  const getSettingTruth = useCallback(
    (setting: string, defaultValue = false) => {
      const s = getSettingValue(setting, defaultValue)

      switch (s) {
        case SettingValue.Admin:
          return isAdmin
        case SettingValue.GM:
          return isAdmin || isGm
        case SettingValue.Member:
          return isAdmin || isMember
        case SettingValue.Everyone:
        case SettingValue.Yes:
          return true
        default:
        case null:
        case SettingValue.No:
          return false
      }
    },
    [getSettingValue, isAdmin, isGm, isMember]
  )

  return error || isLoading || !data ? [undefined, undefined] : ([getSettingString, getSettingTruth] as const)
}

export const useSetting = (setting: string, defaultValue = false) => {
  const [, getSettingTruth] = useSettings()
  return getSettingTruth ? getSettingTruth(setting, defaultValue) : undefined
}

type useGetSettingValueType = (setting: string, defaultValue?: boolean) => string | null | undefined

export const useGetSettingValue: useGetSettingValueType = (setting: string, defaultValue = false) => {
  const [getSettingString] = useSettings()
  return getSettingString ? getSettingString(setting, defaultValue) : undefined
}
