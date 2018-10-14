const config = require('./src/utils/config')

module.exports = {
  [config.nodeEnv]: {
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      tableName: './seeds',
      directory: './db/seeds'
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
}

console.log(JSON.stringify(module.exports))
