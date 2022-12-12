import * as fs from 'fs'
import * as path from 'path'

import { CliUx, Command } from '@oclif/core'
import { printSchema } from 'graphql'
import { createPostGraphileSchema } from 'postgraphile'

import { PoolType, getPool, getSchemas } from '../../shared/config'
import { options } from '../../shared/postgraphileOptions'

console.log({ pwd: process.cwd() })
// Download the schema for codegen, also (and as importantly), save the
// postgraphile cache to speed the lambda  startup time (a lot).

export default class PrepareGraphQL extends Command {
  static description = 'Prepare GraphQL Schema.'

  // eslint-disable-next-line class-methods-use-this
  async run() {
    CliUx.ux.action.start('transforming postgraphile schema')
    const pgPool = await getPool(PoolType.ADMIN)
    const schema = await createPostGraphileSchema(pgPool, getSchemas(), {
      ...options,
      writeCache: path.join(__dirname, '../../shared/postgraphileCache.json'),
    })
    await pgPool.end()
    fs.writeFileSync(path.join(__dirname, '../../shared/graphql-schema.graphql'), printSchema(schema))
    CliUx.ux.action.stop()
  }
}
