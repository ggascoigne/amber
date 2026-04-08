import { describe, expect, test, vi } from 'vitest'

import { createProfileRecord, updateProfileRecord, updateUserRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createUsersMutationsTx = () => {
  const updatedUser = {
    id: 12,
    email: 'updated@example.com',
    fullName: 'Updated User',
    firstName: 'Updated',
    lastName: 'User',
    displayName: 'Update',
    balance: 42,
  }
  const createdProfile = {
    id: 34,
    userId: 12,
    phoneNumber: '555-555-5555',
    snailMailAddress: '123 Amber Way',
  }
  const updatedProfile = {
    id: 35,
    phoneNumber: '444-444-4444',
    snailMailAddress: '456 Example Ave',
  }

  const userUpdate = vi.fn().mockResolvedValue(updatedUser)
  const profileCreate = vi.fn().mockResolvedValue(createdProfile)
  const profileUpdate = vi.fn().mockResolvedValue(updatedProfile)

  const tx = {
    user: {
      update: userUpdate,
    },
    profile: {
      create: profileCreate,
      update: profileUpdate,
    },
  } as unknown as TransactionClient

  return {
    createdProfile,
    profileCreate,
    profileUpdate,
    tx,
    updatedProfile,
    updatedUser,
    userUpdate,
  }
}

describe('user mutation helpers', () => {
  test('updates users by id with the existing partial data payload and wrapped response shape', async () => {
    const fixture = createUsersMutationsTx()

    const result = await updateUserRecord({
      tx: fixture.tx,
      input: {
        id: 12,
        data: {
          email: 'updated@example.com',
          fullName: 'Updated User',
          displayName: 'Update',
          balance: 42,
        },
      },
    })

    expect(fixture.userUpdate).toHaveBeenCalledWith({
      where: { id: 12 },
      data: {
        email: 'updated@example.com',
        fullName: 'Updated User',
        displayName: 'Update',
        balance: 42,
      },
    })
    expect(result).toEqual({ user: fixture.updatedUser })
  })

  test('creates profiles with the existing write payload and wrapped response shape', async () => {
    const fixture = createUsersMutationsTx()

    const result = await createProfileRecord({
      tx: fixture.tx,
      input: {
        userId: 12,
        phoneNumber: '555-555-5555',
        snailMailAddress: '123 Amber Way',
      },
    })

    expect(fixture.profileCreate).toHaveBeenCalledWith({
      data: {
        userId: 12,
        phoneNumber: '555-555-5555',
        snailMailAddress: '123 Amber Way',
      },
    })
    expect(result).toEqual({ profile: fixture.createdProfile })
  })

  test('updates profiles by id with the existing partial data payload', async () => {
    const fixture = createUsersMutationsTx()

    const result = await updateProfileRecord({
      tx: fixture.tx,
      input: {
        id: 35,
        data: {
          phoneNumber: '444-444-4444',
          snailMailAddress: '456 Example Ave',
        },
      },
    })

    expect(fixture.profileUpdate).toHaveBeenCalledWith({
      where: { id: 35 },
      data: {
        phoneNumber: '444-444-4444',
        snailMailAddress: '456 Example Ave',
      },
    })
    expect(result).toEqual({ profile: fixture.updatedProfile })
  })
})
