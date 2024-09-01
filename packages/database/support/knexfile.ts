import path from 'path'

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { certs } from '../shared/dbCerts'
import { getPaths } from '../shared/filePaths.js'

export const dbEnv = process.env.DB_ENV

if (process.env.NODE_ENV !== 'production') {
  const { dirname } = getPaths(import.meta.url)
  const envFilename = process.env.ENV_FILENAME ?? '.env'
  if (!dbEnv || !['acnw', 'acus'].includes(dbEnv)) {
    throw new Error('DB_ENV must be set to either "acnw" or "acus"')
  }
  const envPath = path.join(dirname, `../../../apps/${dbEnv}/${envFilename}`)
  dotenv.config({ path: envPath })
}

const ssl = process.env.DATABASE_SSL === '1'

const certName = path.basename(process.env.DATABASE_SSL_CERT ?? '', '.pem')
// eslint-disable-next-line no-prototype-builtins
if (ssl && !certs.hasOwnProperty(certName)) {
  throw new Error(`SSL was enabled, but the named cert, ${certName} is not installed.`)
}

const ca = ssl ? certs[certName] : ''

const knexConfig = {
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations',
  },
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_ADMIN,
    password: process.env.DATABASE_ADMIN_PASSWORD ?? '',
    port: parseInt(process.env.DATABASE_PORT ?? '', 10),
    ssl: ssl
      ? {
          rejectUnauthorized: true,
          sslmode: 'verify-all',
          ca,
        }
      : false,
    charset: 'utf8',
    dateStrings: true,
    timezone: 'UTC',
  },
  acquireConnectionTimeout: 5000,
}

const config = knexConfig.connection
console.log(`using: postgres://${config.user}:*****@${config.host}:${config.port}/${config.database}`)

export default knexConfig
