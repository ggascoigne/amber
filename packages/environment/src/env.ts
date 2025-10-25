import path from 'path'

import dotenv from 'dotenv'

import { getPaths } from './filePaths.js'
import { processEnv } from './processEnv.ts'

export * from './connectionStringUtils.ts'
export * from './processEnv.ts'

export const isDev = process.env.NODE_ENV !== 'production'
export const isTest = process.env.NODE_ENV === 'test'
export const dbEnv = process.env.DB_ENV

const isNodeRuntime = typeof process !== 'undefined' && !!process.versions?.node

if (isNodeRuntime && process.env.NODE_ENV !== 'production') {
  const { dirname } = getPaths(import.meta.url)
  const envFilename = process.env.ENV_FILENAME ?? '.env'
  if (!dbEnv || !['acnw', 'acus'].includes(dbEnv)) {
    throw new Error('DB_ENV must be set to either "acnw" or "acus"')
  }
  const envPath = path.join(dirname, `../../../apps/${dbEnv}/${envFilename}`)
  dotenv.config({ path: envPath, quiet: true })
}

// if (isDev && typeof window === 'undefined') {
//   const { dirname } = getPaths(import.meta.url)
//   dotenv.config({ path: path.resolve(dirname, '../.env') })
// }

export const env = processEnv()
