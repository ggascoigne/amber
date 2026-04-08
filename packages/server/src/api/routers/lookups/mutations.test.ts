import { describe, expect, test, vi } from 'vitest'

import {
  createLookupRecord,
  createLookupValueRecord,
  deleteLookupRecord,
  deleteLookupValueRecord,
  updateLookupRecord,
  updateLookupValueRecord,
} from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createLookupsMutationsTx = () => {
  const lookupCreate = vi.fn().mockResolvedValue({ id: 11, realm: 'badge_type' })
  const lookupUpdate = vi.fn().mockResolvedValue({ id: 12, realm: 'room_type' })
  const lookupDelete = vi.fn().mockResolvedValue({ id: 13 })
  const lookupValueCreate = vi.fn().mockResolvedValue({ id: 21, code: 'ATTENDEE' })
  const lookupValueUpdate = vi.fn().mockResolvedValue({ id: 22, code: 'SUPPORTER' })
  const lookupValueDelete = vi.fn().mockResolvedValue({ id: 23 })

  const tx = {
    lookup: {
      create: lookupCreate,
      update: lookupUpdate,
      delete: lookupDelete,
    },
    lookupValue: {
      create: lookupValueCreate,
      update: lookupValueUpdate,
      delete: lookupValueDelete,
    },
  } as unknown as TransactionClient

  return {
    lookupCreate,
    lookupUpdate,
    lookupDelete,
    lookupValueCreate,
    lookupValueUpdate,
    lookupValueDelete,
    tx,
  }
}

describe('lookup mutation helpers', () => {
  test('creates lookups with the preserved default metadata fields', async () => {
    const fixture = createLookupsMutationsTx()

    const result = await createLookupRecord({
      tx: fixture.tx,
      input: { realm: 'badge_type' },
    })

    expect(fixture.lookupCreate).toHaveBeenCalledWith({
      data: {
        realm: 'badge_type',
        codeMaximum: null,
        codeMinimum: null,
        codeScale: null,
        codeType: 'string',
        internationalize: false,
        ordering: 'sequencer',
        valueMaximum: null,
        valueMinimum: null,
        valueScale: null,
        valueType: 'string',
      },
    })
    expect(result).toEqual({
      lookup: { id: 11, realm: 'badge_type' },
      update: false,
    })
  })

  test('updates lookups by id and returns the updated flag', async () => {
    const fixture = createLookupsMutationsTx()

    const result = await updateLookupRecord({
      tx: fixture.tx,
      input: {
        id: 12,
        realm: 'hotel_room_type',
      },
    })

    expect(fixture.lookupUpdate).toHaveBeenCalledWith({
      where: { id: 12 },
      data: {
        realm: 'hotel_room_type',
      },
    })
    expect(result).toEqual({
      lookup: { id: 12, realm: 'room_type' },
      update: true,
    })
  })

  test('deletes lookups and returns only the deleted id', async () => {
    const fixture = createLookupsMutationsTx()

    const result = await deleteLookupRecord({
      tx: fixture.tx,
      input: { id: 13 },
    })

    expect(fixture.lookupDelete).toHaveBeenCalledWith({
      where: { id: 13 },
    })
    expect(result).toEqual({
      deletedLookupId: 13,
    })
  })

  test('creates lookup values with the preserved sequencer defaults', async () => {
    const fixture = createLookupsMutationsTx()

    const result = await createLookupValueRecord({
      tx: fixture.tx,
      input: {
        lookupId: 7,
        code: 'ATTENDEE',
        sequencer: 2,
        value: 'Attendee',
      },
    })

    expect(fixture.lookupValueCreate).toHaveBeenCalledWith({
      data: {
        lookupId: 7,
        code: 'ATTENDEE',
        sequencer: 2,
        value: 'Attendee',
        numericSequencer: 0,
        stringSequencer: '_',
      },
    })
    expect(result).toEqual({
      lookupValue: { id: 21, code: 'ATTENDEE' },
      update: false,
    })
  })

  test('updates lookup values by id with optional fields intact', async () => {
    const fixture = createLookupsMutationsTx()

    const result = await updateLookupValueRecord({
      tx: fixture.tx,
      input: {
        id: 22,
        code: 'SPONSOR',
        sequencer: 4,
        value: 'Sponsor',
      },
    })

    expect(fixture.lookupValueUpdate).toHaveBeenCalledWith({
      where: { id: 22 },
      data: {
        code: 'SPONSOR',
        sequencer: 4,
        value: 'Sponsor',
      },
    })
    expect(result).toEqual({
      lookupValue: { id: 22, code: 'SUPPORTER' },
      update: true,
    })
  })

  test('deletes lookup values and returns only the deleted id', async () => {
    const fixture = createLookupsMutationsTx()

    const result = await deleteLookupValueRecord({
      tx: fixture.tx,
      input: { id: 23 },
    })

    expect(fixture.lookupValueDelete).toHaveBeenCalledWith({
      where: { id: 23 },
    })
    expect(result).toEqual({
      deletedLookupValueId: 23,
    })
  })
})
