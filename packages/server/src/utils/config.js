const path = require('path')
const fs = require('fs')
// look for a .env file that is named after the NODE_ENV, if it doesn't exist just use the default ".env" file
const nodeEnv = process.env.NODE_ENV || 'development'
const potentialEnvFile = path.resolve(process.cwd(), `.env.${nodeEnv}`)
const envFile = fs.existsSync(potentialEnvFile) ? potentialEnvFile : path.resolve(process.cwd(), '.env')
require('dotenv').config({ path: envFile })

const config = {
  nodeEnv: nodeEnv,
  isDev: nodeEnv === 'development',
  port: parseInt(process.env.SERVER_PORT, 10),
  host: process.env.SERVER_HOST,
  debug: process.env.DEBUG || false,
  database: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD || '',
    port: parseInt(process.env.DATABASE_PORT, 10),
    ssl: process.env.DATABASE_SSL === '1',
    ssl_cert: process.env.DATABASE_SSL_CERT || '',
    connectionString: ''
  }
}

function getConnectionString(d) {
  return `postgres://${d.username}:${d.password}@${d.host}:${d.port}/${d.database}${
    d.ssl ? '?sqlmode=require&ssl=1' : ''
  }`
}

// stick to this syntax here since this file is shared by some stand alone scripts
module.exports.getConnectionString = getConnectionString

config.database.connectionString = getConnectionString(config.database)

module.exports = config
