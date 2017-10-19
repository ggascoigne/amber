#!/usr/bin/env node

require('dotenv').config()
const config = require('config')
const {createCleanDb} = require('./scriptUtils')
const chalk = require('chalk')

const databaseName = config.get('database.database')
console.log(`Recreating database ${databaseName}`)

createCleanDb(databaseName, config.get('database.username'), config.get('database.password'))
  .then(() => {
    console.log('Complete')
  })
  .catch((reason) => {
    console.log(chalk.bold.red('error detected'))
    process.exit(-1)
  })
