import { processEnv, parsePostgresConnectionString, safeConnectionString } from '@amber/environment/dotenv'
import type { ListrTask, ListrTaskWrapper } from 'listr2'

import { createCleanDb } from '../scriptUtils'
import type { TaskContext } from '../taskContext'

const env = processEnv()

export const createCleanDbTask: ListrTask = {
  title: `Cleaning database`,
  task: async (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) => {
    const environ = ctx?.env ?? env
    const { user: targetUser, password: targetUserPassword } = parsePostgresConnectionString(environ.DATABASE_URL)
    // eslint-disable-next-line no-param-reassign
    task.output = `Creating clean database: ${safeConnectionString(environ.ADMIN_DATABASE_URL)}`
    await createCleanDb(environ.ADMIN_DATABASE_URL, targetUser!, targetUserPassword!, false)
    return Promise.resolve(`Recreating database ${safeConnectionString(environ.ADMIN_DATABASE_URL)}`)
  },
  rendererOptions: { persistentOutput: true },
}
