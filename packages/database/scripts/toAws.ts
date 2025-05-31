#!/usr/bin/env node_modules/.bin/tsx
import chalk from 'chalk'
import { Listr } from 'listr2'

import { loadEnv, TaskContext, copyDatabaseTaskFactory } from './lib'

const awsEnv = loadEnv('.env.aws')
const localEnv = loadEnv('.env')

const tasks = new Listr<TaskContext>([
  {
    title: `Local -> AWS`,
    task: copyDatabaseTaskFactory(localEnv, awsEnv),
  },
])

tasks.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
