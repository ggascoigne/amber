#!/usr/bin/env node_modules/.bin/tsx
import chalk from 'chalk'
import Listr from 'listr'

import { getPostgresArgs, resetOwner } from './utils/scriptUtils'

import { config } from '../shared/config'

const targetUser = config.userDatabase.user

console.log(chalk.bold.green('Using'), getPostgresArgs(config.rootDatabase))

const tasks = new Listr([
  {
    title: `resetting database owner for ${targetUser}`,
    task: () => resetOwner(config.rootDatabase, targetUser, false),
  },
])

tasks.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
