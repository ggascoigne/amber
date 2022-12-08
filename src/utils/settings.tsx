import { useCallback } from 'react'
import { Perms, useAuth } from '@/components/Auth'

import { SettingFieldsFragment, useGetSettingsQuery } from '@/client'
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
      const getSetting = (settings: SettingFieldsFragment[] | null, setting1: string): string | null => {
        const s = settings?.find((s1) => s1.code === setting1)
        return s ? s.value : null
      }

      if (error || isLoading || !data) {
        return `${defaultValue}`
      }

      const settings: SettingFieldsFragment[] | null = data.settings?.nodes.filter(notEmpty) ?? null

      return getSetting(settings, setting)
    },
    [data, error, isLoading]
  )

  const getSettingValue = useCallback(
    (setting: string, defaultValue = false): SettingValue | boolean | null => {
      const getSetting = (settings: SettingFieldsFragment[] | null, setting1: string): SettingValue | null => {
        const s = settings?.find((s1) => s1.code === setting1)
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
        case null:
        case SettingValue.No:
        default:
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

interface UseGetSettingValueType {
  (setting: string, defaultValue?: boolean): string | null | undefined
}

export const useGetSettingValue: UseGetSettingValueType = (setting: string, defaultValue = false) => {
  const [getSettingString] = useSettings()
  return getSettingString ? getSettingString(setting, defaultValue) : undefined
}
