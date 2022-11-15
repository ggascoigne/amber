#!/usr/bin/env ts-node-script -r dotenv/config

import chalk from 'chalk'
import cli from 'cli-ux'

import { config } from '../shared/config'
import { createCleanDb } from './scriptUtils'

const { database } = config.rootDatabase
const targetUser = config.userDatabase.user
const targetUserPassword = config.userDatabase.password

console.log(`Recreating database ${database}`)

cli.action.start('cleaning database')
createCleanDb(config.rootDatabase, targetUser, targetUserPassword, false)
  .then(() => {
    cli.action.stop()
  })
  .catch((reason: any) => {
    console.error(chalk.bold.red('error detected'))
    console.error(reason)
    process.exit(-1)
  })
