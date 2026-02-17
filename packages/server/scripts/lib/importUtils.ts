import fs from 'fs'
import path from 'path'

import { type EnvType, processEnv, parsePostgresConnectionString } from '@amber/environment/dotenv'
import debug from 'debug'
import { config as dotenvConfig } from 'dotenv'
import type { ListrTaskWrapper, ListrTask } from 'listr2'
import { temporaryFile } from 'tempy'
import { $ } from 'zx'

import { getPaths } from './filePaths'
import { getPostgresArgs } from './scriptUtils'
import type { TaskContext } from './taskContext'

const { dirname } = getPaths(import.meta.url)
const repoRoot = path.resolve(dirname, '../../../..')

const tracing = !!process.env.DEBUG

const log = debug('importUtils')

const $$ = $({
  verbose: true,
})

export const loadEnv = (fileName: string): EnvType => {
  log('loadEnv %s - start %o', fileName, process.env)
  const { dirname: dir } = getPaths(import.meta.url)
  const pathName = path.resolve(dir, '../../../..', fileName)

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
  log('loadEnv %s - end %o', fileName, process.env)
  return processEnv(obj as any)
}

const formatTimestamp = (): string => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
}

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

    const { database } = parsePostgresConnectionString(environ.ADMIN_DATABASE_URL)
    const timestamp = formatTimestamp()
    const dumpName = `${database}-${timestamp}.dump`
    const dumpPath = path.join(repoRoot, dumpName)

    // eslint-disable-next-line no-param-reassign
    task.title = `Dumping database ${database} to ${dumpName}`
    logger(`dumping database ${database} to ${dumpPath}`)
    await $source`/usr/local/bin/pg_dump ${getPostgresArgs(environ.ADMIN_DATABASE_URL)} -Fc --schema=public > ${dumpPath}`

    const gzPath = `${dumpPath}.gz`
    // eslint-disable-next-line no-param-reassign
    task.title = `Compressing ${dumpName}`
    await $source`gzip ${dumpPath}`

    ctx.dumpFile = gzPath // eslint-disable-line no-param-reassign
    // eslint-disable-next-line no-param-reassign
    task.title = `Dumped ${path.basename(gzPath)}`
    logger(`dump saved to ${gzPath}`)
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

    const { dumpFile } = ctx
    if (!dumpFile) {
      throw new Error('No dump file specified. Use --file <path> to specify a dump file.')
    }

    let restoreFile = dumpFile
    let tempFile: string | undefined

    if (dumpFile.endsWith('.gz')) {
      tempFile = temporaryFile()
      // eslint-disable-next-line no-param-reassign
      task.title = `Decompressing ${path.basename(dumpFile)}`
      logger(`decompressing ${dumpFile} to ${tempFile}`)
      await $dest`gunzip -c ${dumpFile} > ${tempFile}`
      restoreFile = tempFile
    }

    // eslint-disable-next-line no-param-reassign
    task.title = `Restoring database ${database} from ${path.basename(dumpFile)}`
    logger(`Restoring database ${database} from ${restoreFile}`)

    try {
      await $dest`/usr/local/bin/pg_restore \
        -j4 \
        -d ${database} \
        --no-privileges \
        --no-owner \
        --clean \
        --if-exists \
        ${restoreFile}`
    } finally {
      if (tempFile) {
        fs.unlinkSync(tempFile)
      }
    }
  },
}
