import fs from 'fs'
import path from 'path'

import { type EnvType, processEnv, parsePostgresConnectionString } from '@amber/environment'
import debug from 'debug'
import { config as dotenvConfig } from 'dotenv'
import type { ListrTaskWrapper, ListrTask } from 'listr2'
import { temporaryFile } from 'tempy'
import { $ } from 'zx'

import { getPostgresArgs } from './scriptUtils'
import type { TaskContext } from './taskContext'

import { getPaths } from '../../shared/filePaths'

const tracing = !!process.env.DEBUG

const log = debug('importUtils')

const $$ = $({
  verbose: true,
})

export const loadEnv = (fileName: string): EnvType => {
  const { dirname } = getPaths(import.meta.url)
  const pathName = path.resolve(dirname, '../../../..', fileName)

  if (!fs.existsSync(pathName)) {
    throw new Error(`File not found: ${fileName} (${pathName})`)
  }
  const obj = {}
  dotenvConfig({
    path: pathName,
    processEnv: obj,
    quiet: true,
  })
  log('loaded env from', pathName)
  log('env', obj)
  return processEnv(obj as any)
}

let outputFileName

export const dumpDatabaseTask: ListrTask = {
  title: `Dumping database`,
  task: async (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) => {
    const logger = log.extend('dumpDatabaseTask')
    const environ = ctx.env!

    const $source = $$({
      verbose: tracing,
      env: {
        ...environ,
        ...process.env,
        NODE_ENV: 'production',
      },
    })

    const name = temporaryFile()
    const { database } = parsePostgresConnectionString(environ.ADMIN_DATABASE_URL)
    // eslint-disable-next-line no-param-reassign
    task.title = `dumping database ${database}`
    logger(`dumping database ${database} to ${name}`)
    await $source`/usr/local/bin/pg_dump ${getPostgresArgs(environ.ADMIN_DATABASE_URL)} -Fc --schema=public > ${name}`
    outputFileName = name
  },
}

export const restoreDatabaseTask: ListrTask = {
  title: `Restoring database`,
  task: async (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) => {
    const logger = log.extend('restoreDatabaseTask')
    const environ = ctx.env!
    const { host, database, password, port, user } = parsePostgresConnectionString(environ.ADMIN_DATABASE_URL)

    const $dest = $$({
      verbose: tracing,
      env: {
        ...environ,
        ...process.env,
        NODE_ENV: 'production', // ensure that the script doesn't load dotenv and prefers the environment
        // cspell:disable
        PGHOST: host,
        PGPORT: `${port}`,
        PGUSER: user,
        PGPASSWORD: password,
        // cspell:enable
      },
    })

    // eslint-disable-next-line no-param-reassign
    task.title = `Restoring database ${database}`
    logger(`Restoring database ${database} from ${outputFileName!}`)

    await $dest`/usr/local/bin/pg_restore \
      -j4 \
      -d ${database} \
      --no-privileges \
      --no-owner \
      --clean \
      --if-exists \
      ${outputFileName!}`
  },
}
