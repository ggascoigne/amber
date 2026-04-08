import { describe, expect, test, vi } from 'vitest'

import { createSettingRecord, deleteSettingRecord, updateSettingRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createSettingsMutationsTx = () => {
  const settingCreate = vi.fn().mockResolvedValue({
    id: 4,
    code: 'currentYear',
    type: 'integer',
    value: '2026',
  })
  const settingDelete = vi.fn().mockResolvedValue({ id: 5 })
  const settingUpdate = vi.fn().mockResolvedValue({
    id: 6,
    code: 'badgeSalesOpen',
    type: 'boolean',
    value: 'true',
  })

  const tx = {
    setting: {
      create: settingCreate,
      delete: settingDelete,
      update: settingUpdate,
    },
  } as unknown as TransactionClient

  return {
    settingCreate,
    settingDelete,
    settingUpdate,
    tx,
  }
}

describe('settings mutation helpers', () => {
  test('creates settings with the existing create payload', async () => {
    const fixture = createSettingsMutationsTx()

    const result = await createSettingRecord({
      tx: fixture.tx,
      input: {
        code: 'currentYear',
        type: 'integer',
        value: '2026',
      },
    })

    expect(fixture.settingCreate).toHaveBeenCalledWith({
      data: {
        code: 'currentYear',
        type: 'integer',
        value: '2026',
      },
    })
    expect(result).toEqual({
      setting: {
        id: 4,
        code: 'currentYear',
        type: 'integer',
        value: '2026',
      },
    })
  })

  test('updates settings by id with the existing partial data payload', async () => {
    const fixture = createSettingsMutationsTx()

    const result = await updateSettingRecord({
      tx: fixture.tx,
      input: {
        id: 6,
        value: 'true',
      },
    })

    expect(fixture.settingUpdate).toHaveBeenCalledWith({
      where: { id: 6 },
      data: {
        code: undefined,
        type: undefined,
        value: 'true',
      },
    })
    expect(result).toEqual({
      setting: {
        id: 6,
        code: 'badgeSalesOpen',
        type: 'boolean',
        value: 'true',
      },
    })
  })

  test('deletes settings and returns only the deleted id', async () => {
    const fixture = createSettingsMutationsTx()

    const result = await deleteSettingRecord({
      tx: fixture.tx,
      input: { id: 5 },
    })

    expect(fixture.settingDelete).toHaveBeenCalledWith({
      where: { id: 5 },
    })
    expect(result).toEqual({
      deletedSettingId: 5,
    })
  })
})
