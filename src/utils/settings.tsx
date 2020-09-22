import { SettingFieldsFragment, useGetSettingsQuery } from '../client'
import { useAuth } from '../components/Acnw/Auth/Auth0'
import { Perms } from '../components/Acnw/Auth/PermissionRules'

export enum SettingValue {
  No = 'No',
  Admin = 'Admin',
  GM = 'GM',
  Everyone = 'Everyone',
  Yes = 'Yes',
}

const asSettingValue = (s: string): SettingValue => SettingValue[s as keyof typeof SettingValue]

export const settingValues = ['No', 'Admin', 'GM', 'Everyone', 'Yes']

const getSetting = (settings: SettingFieldsFragment[] | null, setting: string) => {
  const s = settings?.find((s) => s.code === setting)
  return s ? asSettingValue(s.value) : null
}

export const useSetting = (setting: string) => {
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const { loading, error, data } = useGetSettingsQuery()

  if (error || loading || !data) {
    return false
  }

  const settings: SettingFieldsFragment[] | null =
    (data?.settings?.nodes?.filter((i) => i) as SettingFieldsFragment[]) || null
  const s = getSetting(settings, setting)

  switch (s) {
    case SettingValue.Admin:
      return isAdmin
    case SettingValue.GM:
      throw new Error('not implemented')
    case SettingValue.Everyone:
    case SettingValue.Yes:
      return true
    default:
    case null:
    case SettingValue.No:
      return false
  }
}
