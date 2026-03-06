#!/usr/bin/env node_modules/.bin/tsx
import path from 'path'

import { processEnv } from '@amber/environment/dotenv'
import chalk from 'chalk'
import type { ListrTask } from 'listr2'
import { Listr } from 'listr2'

import type { TaskContext } from './lib/taskContext'

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
  | 'waitForPostgres'
  | 'newDb'

type TaskRegistry = Record<TaskName, ListrTask<TaskContext> | ListrTask<TaskContext>[]>
type TaskLoaderRegistry = Record<TaskName, () => Promise<ListrTask<TaskContext> | ListrTask<TaskContext>[]>>

const toList = (items: Array<string>) => items.join(', ')

const availableTaskNames = [
  'writeCerts',
  'createCleanDb',
  'resetOwner',
  'dumpDatabase',
  'restoreDatabase',
  'migrateDb',
  'testSeed',
  'toAws',
  'toLocal',
  'toAwsDev',
  'dumpProd',
  'restoreLocal',
  'waitForPostgres',
  'newDb',
] as const satisfies ReadonlyArray<TaskName>

const isTaskName = (value: string): value is TaskName => availableTaskNames.includes(value as TaskName)

const taskLoaders: TaskLoaderRegistry = {
  writeCerts: async () => (await import('./lib/tasks/writeCerts')).writeCertsTask,
  createCleanDb: async () => (await import('./lib/tasks/createCleanDb')).createCleanDbTask,
  resetOwner: async () => (await import('./lib/tasks/resetOwner')).resetOwnerTask,
  dumpDatabase: async () => (await import('./lib/importUtils')).dumpDatabaseTask,
  restoreDatabase: async () => (await import('./lib/importUtils')).restoreDatabaseTask,
  migrateDb: async () => (await import('./lib/tasks/migrate')).migrateDbTask,
  testSeed: async () => (await import('./lib/tasks/testSeed')).testSeedTask,
  toAws: async () => (await import('./lib/tasks/importTasks')).toAwsTask,
  toLocal: async () => (await import('./lib/tasks/importTasks')).toLocalTask,
  toAwsDev: async () => (await import('./lib/tasks/importTasks')).toAwsDevTask,
  dumpProd: async () => (await import('./lib/tasks/importTasks')).dumpProdTask,
  restoreLocal: async () => (await import('./lib/tasks/importTasks')).restoreLocalTask,
  waitForPostgres: async () => (await import('./lib/tasks/waitForPostgres')).waitForPostgresTask,
  newDb: async () => {
    const [{ createCleanDbTask }, { migrateDbTask }] = await Promise.all([
      import('./lib/tasks/createCleanDb'),
      import('./lib/tasks/migrate'),
    ])

    return [createCleanDbTask, migrateDbTask]
  },
}

const loadTaskRegistry = async (selectedNames: Array<TaskName>): Promise<TaskRegistry> => {
  const loadedEntries = await Promise.all(selectedNames.map(async (name) => [name, await taskLoaders[name]()] as const))
  return Object.fromEntries(loadedEntries) as TaskRegistry
}

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

const requestedTaskNames = filteredArgs.filter((name) => !name.startsWith('-'))

if (requestedTaskNames.length === 0) {
  console.error(chalk.yellow(`No tasks specified. Available tasks: ${toList(Array.from(availableTaskNames))}`))
  process.exit(1)
}

const selectedTaskNames = requestedTaskNames.filter(isTaskName)
const unknownTasks = requestedTaskNames.filter((name) => !isTaskName(name))

if (unknownTasks.length > 0) {
  console.error(chalk.bold.red(`Unknown task(s): ${toList(unknownTasks)}`))
  console.error(`Available tasks: ${toList(Array.from(availableTaskNames))}`)
  process.exit(1)
}

const run = async () => {
  const taskRegistry = await loadTaskRegistry(selectedTaskNames)
  const tasksToRun = selectedTaskNames.flatMap((name) => taskRegistry[name])

  const runner = new Listr<TaskContext, 'verbose' | 'default'>(tasksToRun, {
    ctx: { env: defaultEnv, dumpFile },
    renderer: process.env.DEBUG ? 'verbose' : 'default',
  })

  await runner.run()
}

run().catch((reason: any) => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
})
