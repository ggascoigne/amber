import { processEnv, safeConnectionString } from '@amber/environment/dotenv'
import pg from 'pg'

const env = processEnv()

const { Pool } = pg

export const getSchemas = () => (env.DATABASE_SCHEMAS ? env.DATABASE_SCHEMAS.split(',') : ['public'])

export enum PoolType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const getPool = (poolType: PoolType) => {
  const url = poolType === 'ADMIN' ? env.ADMIN_DATABASE_URL : env.DATABASE_URL
  console.log(`using: ${safeConnectionString(url)}`)
  return new Pool({
    connectionString: url,
  })
}

export type DbConfig = string

export type EmailConfig = {
  user: string
  port: number
  host: string
  password: string
  fromAddress: string
}

export type ConfigType = {
  rootDatabase: DbConfig
  userDatabase: DbConfig
  email: EmailConfig
}

export const config: ConfigType = {
  rootDatabase: env.ADMIN_DATABASE_URL,
  userDatabase: env.DATABASE_URL,
  email: {
    host: env.SMTP_HOST!,
    user: env.SMTP_USERNAME!,
    password: env.SMTP_PASSWORD ?? '',
    port: parseInt(env.SMTP_PORT ?? '', 10),
    fromAddress: env.EMAIL_FROM_ADDRESS!,
  },
}
