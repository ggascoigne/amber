import { describe, expect, test, vi } from 'vitest'

import { getSettings } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createSettingsQueriesTx = () => {
  const settingFindMany = vi.fn().mockResolvedValue([
    {
      id: 1,
      code: 'currentYear',
      type: 'integer',
      value: '2026',
    },
  ])

  const tx = {
    setting: {
      findMany: settingFindMany,
    },
  } as unknown as TransactionClient

  return {
    settingFindMany,
    tx,
  }
}

describe('settings query helpers', () => {
  test('loads settings with the existing summary select shape', async () => {
    const fixture = createSettingsQueriesTx()

    const result = await getSettings({ tx: fixture.tx })

    expect(fixture.settingFindMany).toHaveBeenCalledWith({
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
      },
    })
    expect(result).toEqual([
      {
        id: 1,
        code: 'currentYear',
        type: 'integer',
        value: '2026',
      },
    ])
  })
})
