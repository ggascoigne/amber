import type { AtLeastOne } from '@amber/ui'
import { asEnumLike, keys } from '@amber/ui'

export const Perms = asEnumLike([
  'GraphiqlLoad',
  'IsAdmin',
  'IsLoggedIn',
  'FullGameBook',
  'GameAdmin',
  'PlayerAdmin',
  'Reports',
])

export type PermissionDeclaration = AtLeastOne<{
  dynamic?: Record<string, (data: any) => boolean>
  static?: PermsType[]
}>

export type Rules = Record<string, PermissionDeclaration>

export type PermsType = keyof typeof Perms

const rules = {
  ROLE_ADMIN: {
    dynamic: {
      '*': () => true,
    },
  },
  ROLE_GAME_ADMIN: {
    static: [Perms.FullGameBook, Perms.GameAdmin, Perms.Reports, Perms.IsLoggedIn],
  },
  // INSERT INTO ROLE (id, authority) VALUES(6,'ROLE_PLAYER_ADMIN')
  ROLE_PLAYER_ADMIN: {
    static: [Perms.FullGameBook, Perms.PlayerAdmin, Perms.Reports, Perms.IsLoggedIn],
  },
  ROLE_REPORTS: {
    static: [Perms.Reports, Perms.IsLoggedIn],
  },
  ROLE_USER: {
    static: [Perms.IsLoggedIn],
  },
} satisfies Rules

export const Roles = asEnumLike(keys(rules))

export type RolesType = keyof typeof Roles

export default rules
