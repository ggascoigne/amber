#!/usr/bin/env node

require('dotenv').config()
const config = require('config')
const {createCleanDb} = require('./scriptUtils')
const chalk = require('chalk')

const databaseName = config.get('database.database')
console.log(`Recreating database ${databaseName}`)

const userName = config.get('database.username')
const password = config.has('database.password') ? config.get('database.password') : ''

createCleanDb(databaseName, userName, password)
  .then(() => {
    console.log('Complete')
  })
  .catch((reason) => {
    console.error(chalk.bold.red('error detected'))
    console.error(reason)
    process.exit(-1)
  })
