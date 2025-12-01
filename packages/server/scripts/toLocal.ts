#!/usr/bin/env node_modules/.bin/tsx
import chalk from 'chalk'
import { Listr } from 'listr2'

import type { TaskContext } from './lib'
import { loadEnv, copyDatabaseTaskFactory } from './lib'

const awsEnv = loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-prod`)
const localEnv = loadEnv(`./apps/${process.env.DB_ENV}/.env`)

const tasks = new Listr<TaskContext>([
  {
    title: `AWS -> Local`,
    task: copyDatabaseTaskFactory(awsEnv, localEnv),
  },
])

tasks.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
