const config = require('./src/utils/config')

module.exports = {
  [config.util.getEnv('NODE_ENV')]: {
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      tableName: './seeds',
      directory: './db/seeds'
    },
    client: 'pg',
    debug: config.get('debug'),
    connection: {
      host: config.get('database.host'),
      port: config.get('database.port'),
      user: config.get('database.username'),
      password: config.has('database.password') ? config.get('database.password') : '',
      database: config.get('database.database'),
      charset: 'utf8'
    }
  }
}
