import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as pg from 'pg'
import * as fs from 'fs'

const { Pool } = pg

process.env.NODE_ENV !== 'production' && dotenv.config()

export const getSchemas = () => (process.env.DATABASE_SCHEMAS ? process.env.DATABASE_SCHEMAS.split(',') : ['public'])

export enum PoolType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const getPool = (poolType: PoolType, pathToRoot = './') => {
  const {
    DATABASE_HOST: host,
    DATABASE_NAME: database,
    DATABASE_PORT: port,
    DATABASE_SSL: ssl = false,
    DATABASE_SSL_CERT: sslCert = '',
  } = process.env
  const user = poolType === 'ADMIN' ? process.env.DATABASE_ADMIN : process.env.DATABASE_USER
  const password =
    (poolType === 'ADMIN' ? process.env.DATABASE_ADMIN_PASSWORD : process.env.DATABASE_USER_PASSWORD) ?? ''

  const sslChunk = ssl ? `?sslmode=verify-full&ssl=1&sslrootcert=${sslCert}` : ''
  console.log(`using: postgres://${user}:${password && '*****'}@${host}:${port}/${database}${sslChunk}`)
  return new Pool({
    user,
    host,
    database,
    password,
    port: port ? parseInt(port, 10) : undefined,
    ssl: ssl
      ? {
          rejectUnauthorized: true,
          // @ts-ignore
          sslmode: 'verify-all',
          ca: fs.readFileSync(pathToRoot + sslCert).toString(),
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

export type EmailConfig = {
  user: string
  port: number
  host: string
  password: string
}

export const config: { rootDatabase: DbConfig; userDatabase: DbConfig; email: EmailConfig } = {
  rootDatabase: {
    host: process.env.DATABASE_HOST!,
    database: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_ADMIN!,
    password: process.env.DATABASE_ADMIN_PASSWORD ?? '',
    port: parseInt(process.env.DATABASE_PORT ?? '', 10),
    ssl: process.env.DATABASE_SSL === '1',
    ssl_cert: process.env.DATABASE_SSL_CERT ?? '',
  },
  userDatabase: {
    host: process.env.DATABASE_HOST!,
    database: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_USER_PASSWORD ?? '',
    port: parseInt(process.env.DATABASE_PORT ?? '', 10),
    ssl: process.env.DATABASE_SSL === '1',
    ssl_cert: process.env.DATABASE_SSL_CERT ?? '',
  },
  email: {
    host: process.env.SMTP_HOST!,
    user: process.env.SMTP_USERNAME!,
    password: process.env.SMTP_PASSWORD ?? '',
    port: parseInt(process.env.SMTP_PORT ?? '', 10),
  },
}
