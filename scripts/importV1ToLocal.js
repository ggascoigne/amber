#!/usr/bin/env node

require('dotenv').config()
const config = require('config')
const {spawn, spawnSync} = require('child_process')
const {createCleanDb} = require('./scriptUtils')
const chalk = require('chalk')
const {mysqlExecScript} = require('./scriptUtils')
const {stripIndent} = require('common-tags')

async function createKnexMigrationTables (databaseName, userName, password) {
  const sql = stripIndent`DROP TABLE IF EXISTS knex_migrations;
  
    CREATE TABLE knex_migrations (
      id int(10) unsigned NOT NULL AUTO_INCREMENT,
      name varchar(255) DEFAULT NULL,
      batch int(11) DEFAULT NULL,
      migration_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
    
    DROP TABLE IF EXISTS knex_migrations_lock;
    
    CREATE TABLE knex_migrations_lock (
      is_locked int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      
    INSERT INTO knex_migrations_lock VALUES (0);
    `

  return mysqlExecScript(databaseName, userName, password, sql)
}

async function pipeLiveToLocal (databaseName, userName, password) {
  return new Promise((resolve, reject) => {
    const exporting = spawn(
      '/usr/local/bin/plink',
      ['-ssh',
        '-pw', process.env.KEYSTOR_PASSWORD,
        '-P', process.env.ACNW_SSH_PORT,
        '-noagent',
        '-l', process.env.REMOTE_USER,
        process.env.ACNW_HOST,
        `MYSQL_PWD=${process.env.REMOTE_DATABASE_PASSWORD}`,
        '/usr/bin/mysqldump',
        '--max_allowed_packet=1G',
        '--skip-add-locks',
        '--skip-comments',
        '--skip-extended-insert',
        '--compress --single-transaction',
        '--quick',
        '--routines',
        '--triggers',
        '--hex-blob',
        '--no-create-info',
        '--default-character-set=utf8',
        `--user=${process.env.REMOTE_DATABASE_USER}`,
        process.env.REMOTE_DATABASE_NAME]
    )
      .on('error', function (error) {
        reject(error)
      })

    const importing = spawn(
      '/usr/local/bin/mysql',
      [`--user=${userName}`, '--default-character-set=utf8', `--database=${databaseName}`],
      {env: {MYSQL_PWD: password}}
    )
      .on('error', function (error) {
        reject(error)
      })
      .on('exit', function (code) {
        !code ? resolve() : reject(code)
      })

    exporting.stdout.pipe(importing.stdin)

    exporting.stderr.pipe(process.stderr)
    importing.stdout.pipe(process.stdout)
    importing.stderr.pipe(process.stderr)
  })
}

async function main () {
  const databaseName = config.get('database.database')
  const userName = config.get('database.username')
  const password = config.get('database.password')

  console.log(`Recreating database ${databaseName}`)
  await createCleanDb(databaseName, userName, password)
    .catch((reason) => {
      console.error(chalk.bold.red('error detected'))
      console.error(reason)
      process.exit(-1)
    })

  console.log('Inserting knex records')
  // remove if kex-migrate fixes it's issue
  await createKnexMigrationTables(databaseName, userName, password)
    .catch((reason) => {
      console.error(chalk.bold.red('error detected'))
      console.error(reason)
      process.exit(-1)
    })

  console.log('Create schema in a acnw-1 format')
  const migration1 = spawnSync('./node_modules/.bin/knex-migrate', ['up', '20171015105936-acnw-1-schema.js'], {stdio: 'inherit'})
  !migration1.status || (console.log(chalk.bold.red(`EXIT: CODE: ${migration1.status}`)) && process.exit(migration1.status))

  console.log('Loading data from latest live acnw v1 database')

  await pipeLiveToLocal(databaseName, userName, password)
    .catch((reason) => {
      console.error(chalk.bold.red('error detected'))
      console.error(reason)
      process.exit(-1)
    })

  console.log('Applying the remaining migrators')
  const migration2 = spawnSync('./node_modules/.bin/knex-migrate', ['up'], {stdio: 'inherit'})
  !migration2.status || (console.log(chalk.bold.red(`EXIT: CODE: ${migration2.status}`)) && process.exit(migration2.status))
}

main().then(() => console.log('Complete'))
