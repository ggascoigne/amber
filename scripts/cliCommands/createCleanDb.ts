import { CliUx, Command } from '@oclif/core'
import * as chalk from 'chalk'

import { config } from '@/shared/config'
import { createCleanDb } from '../shared/scriptUtils'

const { database } = config.rootDatabase
const targetUser = config.userDatabase.user
const targetUserPassword = config.userDatabase.password

export default class CreateCleanDb extends Command {
  static description = 'Create a clean database.'

  // eslint-disable-next-line class-methods-use-this
  async run() {
    console.log(`Recreating database ${database}`)

    CliUx.ux.action.start('cleaning database')
    createCleanDb(config.rootDatabase, targetUser, targetUserPassword, false)
      .then(() => {
        CliUx.ux.action.stop()
      })
      .catch((reason: any) => {
        console.error(chalk.bold.red('error detected'))
        console.error(reason)
        process.exit(-1)
      })
  }
}
