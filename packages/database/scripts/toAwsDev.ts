#!/usr/bin/env node_modules/.bin/tsx
import chalk from 'chalk'
import { Listr } from 'listr2'

import { loadEnv, TaskContext, copyDatabaseTaskFactory } from './lib'

const awsEnv = loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-prod`)
const awsDevEnv = loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-dev`)

const tasks = new Listr<TaskContext>([
  {
    title: `AWS -> AWS Dev`,
    task: copyDatabaseTaskFactory(awsEnv, awsDevEnv),
  },
])

tasks.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
