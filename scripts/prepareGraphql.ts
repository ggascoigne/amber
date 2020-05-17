#!/usr/bin/env ts-node-script

import fs from 'fs'

import cli from 'cli-ux'
import { printSchema } from 'graphql'
import { createPostGraphileSchema } from 'postgraphile'

import { getPool, getSchemas } from '../shared/config'
import { options } from '../shared/postgraphileOptions'

async function main() {
  cli.action.start('transforming postgraphile schema')
  const pgPool = getPool('./shared/')
  const schema = await createPostGraphileSchema(pgPool, getSchemas(), {
    ...options,
    writeCache: `./shared/postgraphile.cache`,
  })
  await pgPool.end()
  fs.writeFileSync('./graphql-schema.graphql', printSchema(schema))
  cli.action.stop()
}

main().then(null, (e: any) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
