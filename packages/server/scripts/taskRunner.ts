#!/usr/bin/env node_modules/.bin/tsx
import { processEnv } from '@amber/environment/dotenv'
import chalk from 'chalk'
import type { ListrTask } from 'listr2'
import { Listr } from 'listr2'

import {
  createCleanDbTask,
  dumpDatabaseTask,
  migrateDbTask,
  resetOwnerTask,
  restoreDatabaseTask,
  testSeedTask,
  toAwsDevTask,
  toAwsTask,
  toLocalTask,
  type TaskContext,
  writeCertsTask,
} from './lib'

const defaultEnv = processEnv()

type TaskName =
  | 'writeCerts'
  | 'createCleanDb'
  | 'resetOwner'
  | 'dumpDatabase'
  | 'restoreDatabase'
  | 'migrateDb'
  | 'testSeed'
  | 'toAws'
  | 'toLocal'
  | 'toAwsDev'
  | 'newDb'

type TaskRegistry = Record<TaskName, ListrTask<TaskContext> | ListrTask<TaskContext>[]>

const taskRegistry: TaskRegistry = {
  writeCerts: writeCertsTask,
  createCleanDb: createCleanDbTask,
  resetOwner: resetOwnerTask,
  dumpDatabase: dumpDatabaseTask,
  restoreDatabase: restoreDatabaseTask,
  migrateDb: migrateDbTask,
  testSeed: testSeedTask,
  toAws: toAwsTask,
  toLocal: toLocalTask,
  toAwsDev: toAwsDevTask,
  newDb: [createCleanDbTask, migrateDbTask],
}

const toList = (items: Array<string>) => items.join(', ')

const isTaskName = (value: string): value is TaskName => value in taskRegistry

const [, , ...rawTaskNames] = process.argv

const taskNames = rawTaskNames.filter((name) => !name.startsWith('-'))

if (taskNames.length === 0) {
  console.error(chalk.yellow(`No tasks specified. Available tasks: ${toList(Object.keys(taskRegistry))}`))
  process.exit(1)
}

const selectedTaskNames = taskNames.filter(isTaskName)
const unknownTasks = taskNames.filter((name) => !isTaskName(name))

if (unknownTasks.length > 0) {
  console.error(chalk.bold.red(`Unknown task(s): ${toList(unknownTasks)}`))
  console.error(`Available tasks: ${toList(Object.keys(taskRegistry))}`)
  process.exit(1)
}

const tasksToRun = selectedTaskNames.flatMap((name) => taskRegistry[name])

const runner = new Listr<TaskContext, 'verbose' | 'default'>(tasksToRun, {
  ctx: { env: defaultEnv },
  renderer: process.env.DEBUG ? 'verbose' : 'default',
})

runner.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
