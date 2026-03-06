import { spawnSync } from 'child_process'

import { parsePostgresConnectionString, processEnv } from '@amber/environment/dotenv'
import type { ListrTask, ListrTaskWrapper } from 'listr2'

import type { TaskContext } from '../taskContext'

const env = processEnv()
const pollingIntervalMs = 1000

const sleep = async (durationMs: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs)
  })

const isReadyForConnections = (ctx: TaskContext) => {
  const environ = ctx?.env ?? env
  const containerName = process.env.AMBER_PG_WAIT_CONTAINER

  if (containerName) {
    const containerCli = process.env.AMBER_CONTAINER_CLI ?? 'docker'
    const result = spawnSync(
      containerCli,
      ['exec', '-i', containerName, 'pg_isready', '-q', '-h', 'localhost', '-p', '5432'],
      { stdio: 'ignore' },
    )
    return {
      ready: result.status === 0,
      targetDescription: containerName,
    }
  }

  const { host, port } = parsePostgresConnectionString(environ.ADMIN_DATABASE_URL)
  const result = spawnSync('pg_isready', ['-q', '-h', host, '-p', `${port}`], { stdio: 'ignore' })
  return {
    ready: result.status === 0,
    targetDescription: `${host}:${port}`,
  }
}

const waitForConnections = async (
  ctx: TaskContext,
  task: ListrTaskWrapper<TaskContext, any, any>,
  attemptNumber: number,
): Promise<string> => {
  const { ready, targetDescription } = isReadyForConnections(ctx)
  // eslint-disable-next-line no-param-reassign
  task.output = `Checking postgres on ${targetDescription} (attempt ${attemptNumber})`

  if (ready) {
    return `Postgres on ${targetDescription} is accepting connections`
  }

  await sleep(pollingIntervalMs)
  return waitForConnections(ctx, task, attemptNumber + 1)
}

export const waitForPostgresTask: ListrTask = {
  title: `Waiting for postgres`,
  task: async (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) => waitForConnections(ctx, task, 1),
  rendererOptions: { persistentOutput: true },
}
