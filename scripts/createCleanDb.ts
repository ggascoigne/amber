#!/usr/bin/env ts-node-script

import chalk from 'chalk'
import cli from 'cli-ux'

import { config } from '../shared/config'
import { createCleanDb } from './scriptUtils'

const database = config.rootDatabase.database
console.log(`Recreating database ${database}`)

cli.action.start('cleaning database')
createCleanDb(config.rootDatabase, false)
  .then(() => {
    cli.action.stop()
  })
  .catch((reason: any) => {
    console.error(chalk.bold.red('error detected'))
    console.error(reason)
    process.exit(-1)
  })
