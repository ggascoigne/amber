const { createPostGraphileSchema } = require('postgraphile')

const { getSchemas, getPool } = require('../shared/config')
const { options } = require('../shared/postgraphileOptions')
const { printSchema } = require('graphql')
const fs = require('fs')

async function main() {
  const pgPool = getPool('./shared/')
  const schema = await createPostGraphileSchema(pgPool, getSchemas(), {
    ...options,
    writeCache: `./shared/postgraphile.cache`
  })
  await pgPool.end()
  fs.writeFileSync('./graphql-schema.graphql', printSchema(schema))
}

main().then(null, e => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
