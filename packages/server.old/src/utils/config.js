const path = require('path')
const fs = require('fs')
// look for a .env file that is named after the NODE_ENV, if it doesn't exist just use the default ".env" file
const nodeEnv = process.env.NODE_ENV || 'development'
const potentialEnvFile = path.resolve(process.cwd(), `.env.${nodeEnv}`)
const envFile = fs.existsSync(potentialEnvFile) ? potentialEnvFile : path.resolve(process.cwd(), '.env')
require('dotenv').config({ path: envFile })

const config = {
  nodeEnv: nodeEnv,
  port: process.env.SERVER_PORT,
  host: process.env.SERVER_HOST,
  jwtSecret: process.env.JWT_SECRET,
  debug: process.env.DEBUG || false,
  database: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD || '',
    port: process.env.DATABASE_PORT,
    ssl: process.env.DATABASE_SSL === '1',
    ssl_cert: process.env.DATABASE_SSL_CERT || ''
  }
}

module.exports = config
