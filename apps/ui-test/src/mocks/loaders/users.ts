import type { PGliteInterface } from '@electric-sql/pglite'

import users from '../data/users.json'

import { createTableFor } from '@/mocks/sqlTools'

export const setupUserDataPg = async (db: PGliteInterface) =>
  createTableFor(db, {
    tableName: 'users',
    data: users,
    dataCount: users.length,
  })
