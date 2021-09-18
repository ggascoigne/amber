#!/usr/bin/env TS_NODE_PROJECT=./tsconfig.commonjs.json yarn ts-node-script -r dotenv/config

import chalk from 'chalk'
import cli from 'cli-ux'

// @ts-ignore
import { config } from '../shared/config'
// @ts-ignore
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
