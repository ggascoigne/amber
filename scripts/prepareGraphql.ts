#!/usr/bin/env ts-node-script

import fs from 'fs'

import cli from 'cli-ux'
import { printSchema } from 'graphql'
import { createPostGraphileSchema } from 'postgraphile'

// @ts-ignore
import { PoolType, getPool, getSchemas } from '../shared/config'
// @ts-ignore
import { options } from '../shared/postgraphileOptions'

// Download the schema for codegen, also (and as importantly), save the
// postgraphile cache to speed the lambda  startup time (a lot).

async function main() {
  cli.action.start('transforming postgraphile schema')
  const pgPool = getPool(PoolType.ADMIN, './shared/')
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
