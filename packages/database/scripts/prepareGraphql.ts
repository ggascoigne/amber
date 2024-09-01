#!/usr/bin/env node_modules/.bin/tsx

import fs from 'fs'
import path from 'path'

import chalk from 'chalk'
import { printSchema } from 'graphql'
import Listr from 'listr'
import { createPostGraphileSchema } from 'postgraphile'

import { PoolType, getPool, getSchemas, dbEnv } from '../shared/config'
import { getPaths } from '../shared/filePaths'
import { options } from '../shared/postgraphileOptions'

// Download the schema for codegen, also (and as importantly), save the
// postgraphile cache to speed the lambda  startup time (a lot).

const tasks = new Listr([
  {
    title: 'transforming postgraphile schema',
    task: async () => {
      const { dirname } = getPaths(import.meta.url)
      const pgPool = getPool(PoolType.ADMIN)
      const schema = await createPostGraphileSchema(pgPool, getSchemas(), {
        ...options,
        writeCache: path.join(dirname, `../shared/${dbEnv}/postgraphileCache.json`),
      })
      await pgPool.end()
      fs.writeFileSync(path.join(dirname, '../shared/graphql-schema.graphql'), printSchema(schema))
    },
  },
])

tasks.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
