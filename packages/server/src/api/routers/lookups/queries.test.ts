import { describe, expect, test, vi } from 'vitest'

import { getLookups, getLookupValues, getSingleLookupValue } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createLookupsQueriesTx = () => {
  const lookups = [
    {
      id: 11,
      realm: 'room_type',
      lookupValue: [{ id: 41, code: 'SINGLE', sequencer: 1, value: 'Single' }],
    },
  ]
  const lookupValues = [
    {
      id: 12,
      realm: 'badge_type',
      lookupValue: [
        { id: 42, code: 'SUPPORTER', sequencer: 2, value: 'Supporter' },
        { id: 43, code: 'ATTENDEE', sequencer: 1, value: 'Attendee' },
      ],
    },
  ]
  const singleLookupValue = [
    {
      id: 13,
      realm: 'badge_type',
      lookupValue: [{ id: 43, code: 'ATTENDEE', sequencer: 1, value: 'Attendee' }],
    },
  ]

  const lookupFindMany = vi
    .fn()
    .mockResolvedValueOnce(lookups)
    .mockResolvedValueOnce(lookupValues)
    .mockResolvedValueOnce(singleLookupValue)

  const tx = {
    lookup: {
      findMany: lookupFindMany,
    },
  } as unknown as TransactionClient

  return {
    lookupFindMany,
    lookupValues,
    lookups,
    singleLookupValue,
    tx,
  }
}

describe('lookup query helpers', () => {
  test('loads all lookups with realm ordering and sequencer-sorted lookup values', async () => {
    const fixture = createLookupsQueriesTx()

    const result = await getLookups({ tx: fixture.tx })

    expect(fixture.lookupFindMany).toHaveBeenNthCalledWith(1, {
      orderBy: { realm: 'asc' },
      include: {
        lookupValue: {
          orderBy: { sequencer: 'asc' },
        },
      },
    })
    expect(result).toEqual(fixture.lookups)
  })

  test('loads a realm-specific lookup with value-sorted lookup values', async () => {
    const fixture = createLookupsQueriesTx()

    await getLookups({ tx: fixture.tx })

    const result = await getLookupValues({
      tx: fixture.tx,
      input: { realm: 'badge_type' },
    })

    expect(fixture.lookupFindMany).toHaveBeenNthCalledWith(2, {
      where: { realm: 'badge_type' },
      include: {
        lookupValue: {
          orderBy: { value: 'asc' },
        },
      },
    })
    expect(result).toEqual(fixture.lookupValues)
  })

  test('loads a single lookup value filtered by code inside the existing lookup include shape', async () => {
    const fixture = createLookupsQueriesTx()

    await getLookups({ tx: fixture.tx })
    await getLookupValues({
      tx: fixture.tx,
      input: { realm: 'badge_type' },
    })

    const result = await getSingleLookupValue({
      tx: fixture.tx,
      input: { code: 'ATTENDEE', realm: 'badge_type' },
    })

    expect(fixture.lookupFindMany).toHaveBeenNthCalledWith(3, {
      where: { realm: 'badge_type' },
      include: {
        lookupValue: {
          where: { code: 'ATTENDEE' },
        },
      },
    })
    expect(result).toEqual(fixture.singleLookupValue)
  })
})
