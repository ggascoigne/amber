import { processEnv, parsePostgresConnectionString, safeConnectionString } from '@amber/environment/dotenv'

import type { TaskContext } from '../taskContext'
import { resetOwner } from '../scriptUtils'

const env = processEnv()

export const resetOwnerTask = {
  title: `Resetting database owner`,
  task: async (ctx: TaskContext) => {
    const environ = ctx?.env ?? env
    const { user: targetUser } = parsePostgresConnectionString(environ.DATABASE_URL)
    await resetOwner(environ.ADMIN_DATABASE_URL, targetUser!, false)
    return Promise.resolve(`Reset owner on ${safeConnectionString(environ.ADMIN_DATABASE_URL)}`)
  },
}
