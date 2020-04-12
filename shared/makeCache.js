const { createPostGraphileSchema } = require('postgraphile')

// This script is called from scripts/generate-cache
const { getSchemas, getPool } = require('./config')
const { options } = require('./postgraphileOptions')

async function main() {
  const pgPool = getPool('./shared/')
  await createPostGraphileSchema(pgPool, getSchemas(), {
    ...options,
    writeCache: `${__dirname}/postgraphile.cache`,
  })
  await pgPool.end()
}

main().then(null, (e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
