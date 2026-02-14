import { type EnvType } from '@amber/environment/dotenv'
import type { Listr, ListrTask, ListrTaskWrapper } from 'listr2'

import { createCleanDbTask } from './createCleanDb'
import { resetOwnerTask } from './resetOwner'
import { writeCertsTask } from './writeCerts'

import { loadEnv } from '../../lib'
import { dumpDatabaseTask, restoreDatabaseTask } from '../importUtils'
import type { TaskContext } from '../taskContext'

export const copyDatabaseTaskFactory =
  (source: () => EnvType, dest: () => EnvType) =>
  async (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) =>
    task.newListr<TaskContext>(
      [
        {
          title: `Export source database`,
          task: (_ctx2, task2): Listr =>
            task2.newListr<TaskContext>([writeCertsTask, dumpDatabaseTask], {
              ctx: { env: source() },
            }),
        },
        {
          title: `Configure destination database`,
          task: (_ctx2, task2): Listr =>
            task2.newListr<TaskContext>([writeCertsTask, createCleanDbTask, restoreDatabaseTask, resetOwnerTask], {
              ctx: { env: dest() },
            }),
        },
      ],
      {
        rendererOptions: {
          // You can configure more verbose output here to ensure nothing is hidden
          collapse: false, // Prevents collapsing of completed tasks
          showErrorMessage: true, // Ensures that errors aren't masked
          showSubtasks: true, // Show all subtasks if you have nested tasks
        },
        exitOnError: true,
        concurrent: false,
      },
    )

export const toLocalTask: ListrTask = {
  title: `AWS -> Local`,
  task: copyDatabaseTaskFactory(
    () => loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-prod`),
    () => loadEnv(`./apps/${process.env.DB_ENV}/.env`),
  ),
}

export const toAwsTask: ListrTask = {
  title: `Local -> AWS`,
  task: copyDatabaseTaskFactory(
    () => loadEnv(`./apps/${process.env.DB_ENV}/.env`),
    () => loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-prod`),
  ),
}

export const toAwsDevTask: ListrTask = {
  title: `Local -> AWS`,
  task: copyDatabaseTaskFactory(
    () => loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-prod`),
    () => loadEnv(`./apps/${process.env.DB_ENV}/.env.aws-dev`),
  ),
}
