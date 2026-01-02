import { safeConnectionString, processEnv } from '@amber/environment/dotenv'
import type { ListrTask, ListrTaskWrapper } from 'listr2'
import { $ } from 'zx'

import type { TaskContext } from '../taskContext'

const env = processEnv()

export const migrateDbTask: ListrTask = {
  title: `Database Migration`,
  task: async (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) => {
    const environ = ctx?.env ?? env

    const $$ = $({
      verbose: false,
      env: {
        ...environ,
        ...process.env,
        // NODE_ENV: 'production',
      },
    })
    // eslint-disable-next-line no-param-reassign
    task.output = `Migrating database: ${safeConnectionString(environ.ADMIN_DATABASE_URL)}`
    await $$`node --import=tsx node_modules/knex/bin/cli.js migrate:latest --knexfile ./support/knexfile.ts up`
    return Promise.resolve(`Migrated ${safeConnectionString(environ.ADMIN_DATABASE_URL)}`)
  },
  rendererOptions: {
    // collapse: false, // Prevents collapsing of completed tasks
    // showErrorMessage: true, // Ensures that errors aren't masked
    // showSubtasks: true, // Show all subtasks if you have nested tasks
    persistentOutput: true,
  },
}
