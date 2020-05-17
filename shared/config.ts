const { Pool } = require('pg')
const fs = require('fs')

process.env.NODE_ENV !== 'production' && require('dotenv').config()

export const getSchemas = () => (process.env.DATABASE_SCHEMAS ? process.env.DATABASE_SCHEMAS.split(',') : ['public'])

export const getPool = (pathToRoot = './') => {
  const {
    DATABASE_HOST: host,
    DATABASE_NAME: database,
    DATABASE_USER: user,
    DATABASE_PASSWORD: password = '',
    DATABASE_PORT: port,
    DATABASE_SSL: ssl = false,
    DATABASE_SSL_CERT: ssl_cert = '',
  } = process.env

  const sslChunk = ssl ? `?sslmode=verify-full&ssl=1&sslrootcert=${ssl_cert}` : ''
  console.log(`using: postgres://${user}:${password && '*****'}@${host}:${port}/${database}${sslChunk}`)
  return new Pool({
    user,
    host,
    database,
    password,
    port,
    ssl: ssl
      ? {
          rejectUnauthorized: true,
          sslmode: 'verify-all',
          ca: fs.readFileSync(pathToRoot + ssl_cert).toString(),
        }
      : false,
  })
}

export type DbConfig = {
  database: string
  user: string
  port: number
  host: string
  password: string
  ssl: boolean
  ssl_cert?: string
}

export const config: { database: DbConfig } = {
  database: {
    host: process.env.DATABASE_HOST!,
    database: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD || '',
    port: parseInt(process.env.DATABASE_PORT || '', 10),
    ssl: process.env.DATABASE_SSL === '1',
    ssl_cert: process.env.DATABASE_SSL_CERT || '',
  },
}
