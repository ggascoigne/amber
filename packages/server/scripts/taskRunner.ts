#!/usr/bin/env node_modules/.bin/tsx
import path from 'path'

import { processEnv } from '@amber/environment/dotenv'
import chalk from 'chalk'
import type { ListrTask } from 'listr2'
import { Listr } from 'listr2'

import {
  createCleanDbTask,
  dumpDatabaseTask,
  dumpProdTask,
  migrateDbTask,
  resetOwnerTask,
  restoreDatabaseTask,
  restoreLocalTask,
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
  | 'dumpProd'
  | 'restoreLocal'
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
  dumpProd: dumpProdTask,
  restoreLocal: restoreLocalTask,
  newDb: [createCleanDbTask, migrateDbTask],
}

const toList = (items: Array<string>) => items.join(', ')

const isTaskName = (value: string): value is TaskName => value in taskRegistry

const [, , ...rawArgs] = process.argv

let dumpFile: string | undefined
const filteredArgs: string[] = []
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--file' || rawArgs[i] === '-f') {
    dumpFile = rawArgs[++i]
    if (!dumpFile) {
      console.error(chalk.bold.red('--file requires a path argument'))
      process.exit(1)
    }
    dumpFile = path.resolve(dumpFile)
  } else {
    filteredArgs.push(rawArgs[i]!)
  }
}

const taskNames = filteredArgs.filter((name) => !name.startsWith('-'))

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
  ctx: { env: defaultEnv, dumpFile },
  renderer: process.env.DEBUG ? 'verbose' : 'default',
})

runner.run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
