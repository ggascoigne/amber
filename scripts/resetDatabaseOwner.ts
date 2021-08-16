#!/usr/bin/env ts-node-script

import chalk from 'chalk'
import cli from 'cli-ux'

import { config } from '../shared/config'
import { getPostgresArgs, resetOwner } from './scriptUtils'

const targetUser = config.userDatabase.user

console.log(`using ${getPostgresArgs(config.rootDatabase)}`)
cli.action.start(`resetting database owner for ${targetUser}`)
resetOwner(config.rootDatabase, targetUser, false)
  .then(() => {
    cli.action.stop()
  })
  .catch((reason: any) => {
    console.error(chalk.bold.red('error detected'))
    console.error(reason)
    process.exit(-1)
  })
