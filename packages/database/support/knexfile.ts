/* eslint-disable global-require */
// noinspection ES6ConvertRequireIntoImport,TypeScriptUnresolvedFunction
// @ts-ignore
require('ts-node/register')

if (process.env.NODE_ENV !== 'production') {
  const dbEnv = process.env.DB_ENV
  if (!dbEnv || !['acnw', 'acus'].includes(dbEnv)) {
    throw new Error('DB_ENV must be set to either "acnw" or "acus"')
  }
  require('dotenv').config({ path: `../../apps/${dbEnv}/.env` })
}

const path = require('path')

const { certs } = require('../shared/dbCerts')

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

module.exports = knexConfig

const config = knexConfig.connection
console.log(`using: postgres://${config.user}:*****@${config.host}:${config.port}/${config.database}`)
