import users from '../data/users.json'

import { createTableFor, type TableRow } from '@/mocks/sqlTools'

export type UserRecord = TableRow & {
  firstName: string
  lastName: string
  fullName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  gender: 'male' | 'female' | 'non-binary'
  subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise'
}

export const setupUserData = () =>
  createTableFor<UserRecord>({
    tableName: 'users',
    data: users,
  })
