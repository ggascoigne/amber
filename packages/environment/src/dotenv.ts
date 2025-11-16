import { dbEnv } from './constants.ts'
import { processEnv } from './processEnv.ts'

export * from './constants'
export * from './connectionStringUtils.ts'
export * from './processEnv.ts'

const isNodeRuntime = typeof process !== 'undefined' && !!process.versions?.node

if (isNodeRuntime && process.env.NEXT_RUNTIME !== 'edge' && process.env.NODE_ENV !== 'production') {
  const [path, urlModule, dotenv] = await Promise.all([import('node:path'), import('node:url'), import('dotenv')])
  const { fileURLToPath } = urlModule
  if (!dbEnv || !['acnw', 'acus'].includes(dbEnv)) {
    console.log('env', process.env)
    throw new Error('DB_ENV must be set to either "acnw" or "acus"')
  }

  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const envFilename = process.env.ENV_FILENAME ?? '.env'
  const envPath = path.join(dirname, `../../../apps/${dbEnv}/${envFilename}`)
  dotenv.config({ path: envPath, quiet: true })
}

console.log('dbEnv Environment Variables:', dbEnv)
export const env = processEnv()
