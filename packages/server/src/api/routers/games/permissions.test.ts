import { describe, expect, test, vi } from 'vitest'

import { checkGamePermissionGate } from './permissions'

const createPermissionGateTx = ({
  gateValue = 'No',
  gmAssignment = null,
}: {
  gateValue?: string | null
  gmAssignment?: unknown | null
} = {}) => {
  const settingFindFirst = vi.fn().mockResolvedValue(gateValue === null ? null : { value: gateValue })
  const gameAssignmentFindFirst = vi.fn().mockResolvedValue(gmAssignment)

  return {
    gameAssignmentFindFirst,
    settingFindFirst,
    tx: {
      gameAssignment: {
        findFirst: gameAssignmentFindFirst,
      },
      setting: {
        findFirst: settingFindFirst,
      },
    },
  }
}

describe('game permission gate helper', () => {
  test('defaults unknown or missing settings to deny access', async () => {
    const missingSetting = createPermissionGateTx({ gateValue: null })
    const unknownSetting = createPermissionGateTx({ gateValue: 'Surprise' })

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: missingSetting.tx,
        userId: 12,
        userRoles: [],
      }),
    ).resolves.toBe(false)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: unknownSetting.tx,
        userId: 12,
        userRoles: ['ROLE_ADMIN'],
      }),
    ).resolves.toBe(false)
  })

  test('allows static gates based on admin and game-admin roles', async () => {
    const adminGate = createPermissionGateTx({ gateValue: 'Admin' })
    const gameAdminGate = createPermissionGateTx({ gateValue: 'GameAdmin' })
    const memberGate = createPermissionGateTx({ gateValue: 'Member' })
    const yesGate = createPermissionGateTx({ gateValue: 'Yes' })

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: adminGate.tx,
        userId: 12,
        userRoles: ['ROLE_ADMIN'],
      }),
    ).resolves.toBe(true)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: gameAdminGate.tx,
        userId: 12,
        userRoles: ['ROLE_GAME_ADMIN'],
      }),
    ).resolves.toBe(true)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: memberGate.tx,
        userId: undefined,
        userRoles: [],
      }),
    ).resolves.toBe(true)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: yesGate.tx,
        userId: undefined,
        userRoles: [],
      }),
    ).resolves.toBe(true)
  })

  test('short-circuits gm gates for admins and game admins', async () => {
    const adminTx = createPermissionGateTx({ gateValue: 'GM' })
    const gameAdminTx = createPermissionGateTx({ gateValue: 'GM' })

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: adminTx.tx,
        userId: 7,
        userRoles: ['ROLE_ADMIN'],
      }),
    ).resolves.toBe(true)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: gameAdminTx.tx,
        userId: 7,
        userRoles: ['ROLE_GAME_ADMIN'],
      }),
    ).resolves.toBe(true)

    expect(adminTx.gameAssignmentFindFirst).not.toHaveBeenCalled()
    expect(gameAdminTx.gameAssignmentFindFirst).not.toHaveBeenCalled()
  })

  test('requires a user id and gm assignment for gm-only gates', async () => {
    const missingUserTx = createPermissionGateTx({ gateValue: 'GM' })
    const deniedTx = createPermissionGateTx({ gateValue: 'GM' })
    const allowedTx = createPermissionGateTx({ gateValue: 'GM', gmAssignment: { id: 55 } })

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: missingUserTx.tx,
        userId: undefined,
        userRoles: [],
      }),
    ).resolves.toBe(false)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: deniedTx.tx,
        userId: 42,
        userRoles: [],
      }),
    ).resolves.toBe(false)

    await expect(
      checkGamePermissionGate({
        flagCode: 'flag.allow_game_submission',
        tx: allowedTx.tx,
        userId: 42,
        userRoles: [],
      }),
    ).resolves.toBe(true)

    expect(missingUserTx.gameAssignmentFindFirst).not.toHaveBeenCalled()
    expect(deniedTx.gameAssignmentFindFirst).toHaveBeenCalledWith({
      where: {
        gm: { not: 0 },
        membership: { userId: 42 },
      },
    })
    expect(allowedTx.gameAssignmentFindFirst).toHaveBeenCalledWith({
      where: {
        gm: { not: 0 },
        membership: { userId: 42 },
      },
    })
  })
})
