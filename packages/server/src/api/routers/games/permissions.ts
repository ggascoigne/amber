type GamePermissionRoleFlags = {
  isAdmin: boolean
  isGameAdmin: boolean
}

type GamePermissionGateValue = 'Admin' | 'GameAdmin' | 'GM' | 'Member' | 'No' | 'Yes'

export type GamePermissionGateTransaction = {
  gameAssignment: {
    findFirst: (args: {
      where: {
        gm: { not: number }
        membership: { userId: number }
      }
    }) => Promise<unknown | null>
  }
  setting: {
    findFirst: (args: {
      where: {
        code: string
      }
    }) => Promise<{ value: string | null } | null>
  }
}

type CheckGamePermissionGateOptions = {
  flagCode: string
  tx: GamePermissionGateTransaction
  userId: number | undefined
  userRoles: Array<string>
}

const defaultGamePermissionGateValue = 'No'

const staticGamePermissionEvaluators: Record<
  Exclude<GamePermissionGateValue, 'GM'>,
  (flags: GamePermissionRoleFlags) => boolean
> = {
  Admin: (flags) => flags.isAdmin,
  GameAdmin: (flags) => flags.isAdmin || flags.isGameAdmin,
  Member: () => true,
  No: () => false,
  Yes: () => true,
}

const hasOwn = <Target extends object>(target: Target, key: PropertyKey): key is keyof Target =>
  Object.prototype.hasOwnProperty.call(target, key)

const getGamePermissionRoleFlags = (userRoles: Array<string>): GamePermissionRoleFlags => ({
  isAdmin: userRoles.includes('ROLE_ADMIN'),
  isGameAdmin: userRoles.includes('ROLE_GAME_ADMIN'),
})

const canAccessAsGm = async ({
  roleFlags,
  tx,
  userId,
}: {
  roleFlags: GamePermissionRoleFlags
  tx: GamePermissionGateTransaction
  userId: number | undefined
}): Promise<boolean> => {
  // Intentionally not scoped to a specific year. This mirrors the frontend useIsGm behavior,
  // but keeps access during year rollover before fresh assignments exist.
  if (roleFlags.isAdmin || roleFlags.isGameAdmin) {
    return true
  }

  if (!userId) {
    return false
  }

  const gmAssignment = await tx.gameAssignment.findFirst({
    where: {
      gm: { not: 0 },
      membership: { userId },
    },
  })

  return gmAssignment !== null
}

export const checkGamePermissionGate = async ({
  flagCode,
  tx,
  userId,
  userRoles,
}: CheckGamePermissionGateOptions): Promise<boolean> => {
  const setting = await tx.setting.findFirst({ where: { code: flagCode } })
  const gateValue = setting?.value ?? defaultGamePermissionGateValue
  const roleFlags = getGamePermissionRoleFlags(userRoles)

  if (gateValue === 'GM') {
    return canAccessAsGm({ roleFlags, tx, userId })
  }

  return hasOwn(staticGamePermissionEvaluators, gateValue)
    ? staticGamePermissionEvaluators[gateValue](roleFlags)
    : false
}
