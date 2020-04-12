const { Pool } = require('pg')
const fs = require('fs')

process.env.NODE_ENV !== 'production' && require('dotenv').config()

exports.getSchemas = () => {
  return process.env.DATABASE_SCHEMAS ? process.env.DATABASE_SCHEMAS.split(',') : ['public']
}

exports.getPool = (pathToRoot = './') => {
  const {
    DATABASE_HOST: host,
    DATABASE_NAME: database,
    DATABASE_USER: user,
    DATABASE_PASSWORD: password = '',
    DATABASE_PORT: port,
    DATABASE_SSL: ssl = false,
    DATABASE_SSL_CERT: database_ssl_cert = '',
  } = process.env

  const sslChunk = ssl ? `?sslmode=verify-full&ssl=1&sslrootcert=${database_ssl_cert}` : ''
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
          ca: fs.readFileSync(pathToRoot + database_ssl_cert).toString(),
        }
      : false,
  })
}
