#!/usr/bin/env node

const { config } = require('../shared/config')
const { createCleanDb } = require('./scriptUtils')
const chalk = require('chalk')

const database = config.database.database
console.log(`Recreating database ${database}`)

const user = config.database.username
const port = config.database.port
const host = config.database.host
const password = config.database.password

createCleanDb({ database, port, user, password, host })
  .then(() => {
    console.log('Complete')
  })
  .catch(reason => {
    console.error(chalk.bold.red('error detected'))
    console.error(reason)
    process.exit(-1)
  })
