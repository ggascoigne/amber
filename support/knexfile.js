process.env.NODE_ENV !== 'production' && require('dotenv').config({ path: '.env' })

const fs = require('fs')

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
    password: process.env.DATABASE_ADMIN_PASSWORD || '',
    port: parseInt(process.env.DATABASE_PORT, 10),
    ssl:
      process.env.DATABASE_SSL === '1'
        ? {
            rejectUnauthorized: true,
            sslmode: 'verify-all',
            ca: fs.readFileSync('./shared/' + process.env.DATABASE_SSL_CERT || '').toString(),
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
