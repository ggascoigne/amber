import fs from 'fs'
import os from 'os'
import path from 'path'

import { processEnv } from '@amber/environment/dotenv'
import debug from 'debug'
import type { ListrTask, ListrTaskWrapper } from 'listr2'

import { certs } from '../../../shared/dbCerts'
import type { TaskContext } from '../taskContext'

const env = processEnv()

const log = debug('tasks')

const filename = path.join(os.platform() === 'win32' ? os.tmpdir() : '/tmp', 'rds-cert.pem')

export const writeCertsTask: ListrTask = {
  title: `Writing RDS cert`,
  task: (ctx: TaskContext, task: ListrTaskWrapper<TaskContext, any, any>) => {
    const environ = ctx?.env ?? env
    if (!environ.DATABASE_SSL_CERT) {
      // eslint-disable-next-line no-template-curly-in-string
      return task.skip('Skipping as ${DATABASE_SSL_CERT} is undefined')
    } else {
      const certName = path.basename(environ.DATABASE_SSL_CERT ?? '', '.pem')
      log('certName', certName)
      // eslint-disable-next-line no-prototype-builtins
      if (!certs.hasOwnProperty(certName)) {
        throw new Error(`SSL was enabled, but the named cert, '${certName}' is not installed.`)
      }
      fs.writeFileSync(filename, certs[certName]!)
      log(`Wrote ${environ.DATABASE_SSL_CERT} to ${filename}`)
      return Promise.resolve(`Wrote ${environ.DATABASE_SSL_CERT} to ${filename}`)
    }
  },
}
