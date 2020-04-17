process.env.NODE_ENV !== 'production' && require('dotenv').config({ path: '../.env' })

const config = {
  database: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD || '',
    port: parseInt(process.env.DATABASE_PORT, 10),
    ssl: process.env.DATABASE_SSL === '1',
    ssl_cert: process.env.DATABASE_SSL_CERT || ''
  }
}

module.exports = {
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations'
  },
  client: 'pg',
  debug: config.debug,
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database,
    ssl: config.database.ssl,
    charset: 'utf8',
    dateStrings: true,
    timezone: 'UTC'
  },
  acquireConnectionTimeout: 5000
}

console.log(JSON.stringify(module.exports))
