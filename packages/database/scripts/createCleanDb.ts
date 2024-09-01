#!/usr/bin/env node_modules/.bin/tsx
import chalk from 'chalk'
import Listr from 'listr'

import { createCleanDb } from './utils/scriptUtils'

import { config } from '../shared/config'

const { database } = config.rootDatabase
const targetUser = config.userDatabase.user
const targetUserPassword = config.userDatabase.password

console.log(`Recreating database ${database}`)

const tasks = new Listr([
  {
    title: `cleaning database`,
    task: () => createCleanDb(config.rootDatabase, targetUser, targetUserPassword, false),
  },
])

tasks.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
