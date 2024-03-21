import { useCallback } from 'react'

import { notEmpty } from 'ui'

import { useIsGm, useIsMember } from './membership'

import { SettingFieldsFragment, useGraphQL, GetSettingsDocument } from '../client'
import { Perms, useAuth } from '../components/Auth'

export enum SettingValue {
  No = 'No',
  Admin = 'Admin',
  GameAdmin = 'GameAdmin',
  GM = 'GM',
  Member = 'Member',
  Yes = 'Yes',
}

const asSettingValue = (s: string): SettingValue => SettingValue[s as keyof typeof SettingValue]

export const permissionGateValues = ['No', 'Admin', 'GameAdmin', 'GM', 'Member', 'Yes']

export const useSettings = () => {
  const isGm = useIsGm()
  const isMember = useIsMember()
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const isGameAdmin = hasPermissions(Perms.GameAdmin)
  const { isLoading, error, data } = useGraphQL(GetSettingsDocument)

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
    [data, error, isLoading],
  )

  const getSettingValue = useCallback(
    (setting: string, defaultValue = false): SettingValue | boolean | null => {
      const getSetting = (settings: SettingFieldsFragment[] | null, setting1: string): SettingValue | null => {
        const s = settings?.find((s1) => s1.code === setting1)
        if (s && s.type !== 'perm-gate') throw new Error("can't call getSettingValue on a non-enum type")
        return s ? asSettingValue(s.value) : null
      }

      if (error || isLoading || !data) {
        return defaultValue
      }

      const settings: SettingFieldsFragment[] | null = data.settings?.nodes.filter(notEmpty) ?? null

      return getSetting(settings, setting)
    },
    [data, error, isLoading],
  )

  const getFlagBoolean = useCallback(
    (setting: string, defaultValue = false) => {
      // todo rework this to use configuration.flag object
      const s = getSettingValue(`flag.${setting}`, defaultValue)

      switch (s) {
        case SettingValue.Admin:
          return isAdmin
        case SettingValue.GameAdmin:
          return isAdmin || isGameAdmin
        case SettingValue.GM:
          return isAdmin || isGameAdmin || isGm
        case SettingValue.Member:
          return isAdmin || isMember
        case SettingValue.Yes:
          return true
        case null:
        case SettingValue.No:
        default:
          return false
      }
    },
    [getSettingValue, isAdmin, isGm, isMember],
  )

  return error || isLoading || !data ? [undefined, undefined] : ([getSettingString, getFlagBoolean] as const)
}

export const useFlag = (setting: string, defaultValue = false) => {
  const [, getFlagBoolean] = useSettings()
  return getFlagBoolean?.(setting, defaultValue)
}

interface UseGetSettingValueType {
  (setting: string, defaultValue?: boolean): string | null | undefined
}

export const useGetSettingValue: UseGetSettingValueType = (setting: string, defaultValue = false) => {
  const [getSettingString] = useSettings()
  return getSettingString?.(setting, defaultValue)
}
