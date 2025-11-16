import { env, safeConnectionString } from '@amber/environment/dotenv'

const knexConfig = {
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations',
    loadExtensions: ['.js', '.cjs', '.mjs', '.ts'],
  },
  client: 'pg',
  connection: {
    connectionString: env.ADMIN_DATABASE_URL,
    charset: 'utf8',
    dateStrings: true,
    timezone: 'UTC',
  },
  acquireConnectionTimeout: 5000,
}

console.log(`using: ${safeConnectionString(env.ADMIN_DATABASE_URL)}`)

export default knexConfig
