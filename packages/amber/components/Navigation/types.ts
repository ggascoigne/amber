import type { Perms } from '../Auth'

interface UserCondition {
  userId: number | null | undefined
  isMember: boolean
  getSetting: (setting: string, defaultValue?: any) => boolean
}

// note that entries are only displayed if they have a label
export interface RouteInfo {
  path: string
  label?: string
  link?: string
  subText?: string
  exact: boolean
  permission?: Perms
  condition?: boolean
  userCondition?: (params: UserCondition) => boolean
}

export type RootRoutes = RouteInfo[]
