#!/usr/bin/env node

const {bail} = require('./scriptUtils')
require('dotenv').config()
const config = require('config')
const {spawn, spawnSync} = require('child_process')
const {createCleanDb, createCleanDbMySql, pgloader, psql} = require('./scriptUtils')
const {createKnexMigrationTables} = require('./scriptUtils')
const {stripIndent} = require('common-tags')
const {sleep} = require('./sleep')
const tempy = require('tempy')
const fs = require('fs')

async function pipeLiveToLocalMysql (databaseName, userName, password) {
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
        '--add-drop-table',
        '--compress',
        '--create-options',
        '--single-transaction',
        '--quick',
        '--routines',
        '--triggers',
        '--hex-blob',
        '--default-character-set=utf8',
        `--user=${process.env.REMOTE_DATABASE_USER}`,
        process.env.REMOTE_DATABASE_NAME]
    )
      .on('error', reject)
      .on('exit', (code) => !code ? resolve() : reject(code))

    const importing = spawn(
      '/usr/local/bin/mysql',
      [`--user=${userName}`, '--default-character-set=utf8', `--database=${databaseName}`],
      {env: {MYSQL_PWD: password}}
    )
      .on('error', reject)
      .on('exit', (code) => !code ? resolve() : reject(code))

    exporting.stdout.pipe(importing.stdin)

    exporting.stderr.pipe(process.stderr)
    importing.stdout.pipe(process.stdout)
    importing.stderr.pipe(process.stderr)
  })
}

async function pipeTmpToLocal (tmpDbName, databaseName, userName, password) {
  return new Promise((resolve, reject) => {
    const exporting = spawn(
      '/usr/local/bin/pg_dump', ['--schema=public', '-d', tmpDbName, '-a'])
      .on('error', reject)

    const importing = spawn('/usr/local/bin/psql', ['-d', databaseName, '-v', 'ON_ERROR_STOP=1'])
      .on('error', reject)
      .on('exit', (code) => !code ? resolve() : reject(code))

    exporting.stdout.pipe(importing.stdin)

    exporting.stderr.pipe(process.stderr)
    importing.stdout.pipe(process.stdout)
    importing.stderr.pipe(process.stderr)
  })
}

/*
  reset all sequences based on the max index on the table.
 */
function fixSequences (databaseName, userName, password) {
  const q = stripIndent`
    SELECT 'SELECT SETVAL(' ||
           quote_literal(quote_ident(PGT.schemaname) || '.' || quote_ident(S.relname)) ||
           ', COALESCE(MAX(' ||quote_ident(C.attname)|| '), 1) ) FROM ' ||
           quote_ident(PGT.schemaname)|| '.'||quote_ident(T.relname)|| ';'
    FROM pg_class AS S,
         pg_depend AS D,
         pg_class AS T,
         pg_attribute AS C,
         pg_tables AS PGT
    WHERE S.relkind = 'S'
        AND S.oid = D.objid
        AND D.refobjid = T.oid
        AND D.refobjid = C.attrelid
        AND D.refobjsubid = C.attnum
        AND T.relname = PGT.tablename
    ORDER BY S.relname;
    `
  const name = tempy.file()
  const name2 = tempy.file()
  fs.writeFileSync(name, q)

  const child = spawnSync('/usr/local/bin/psql', [databaseName, '-Atq', '-f', name, '-o', name2],
    {stdio: 'inherit'}
  )
  !child.status || bail(child.status)

  const child2 = spawnSync('/usr/local/bin/psql', [databaseName, '-f', name2],
    {stdio: 'inherit'}
  )
  !child2.status || bail(child2.status)
}

async function main () {
  const databaseName = config.get('database.database')
  const userName = config.get('database.username')
  const password = config.has('database.password') ? config.get('database.password') : ''
  const tmpDbName = 'acnw_v1_tmp'

  console.log(`Create tmp mysql database ${tmpDbName}`)
  createCleanDbMySql(tmpDbName, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD)

  console.log(`download data`)
  await pipeLiveToLocalMysql(tmpDbName, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD)
    .catch(bail)

  // if I don't do this then some of the users don't get copied over and things explode
  console.log(`pausing to let mySql flush to disk`)
  await sleep(5000)

  console.log(`Create tmp postgres database ${tmpDbName}`)
  createCleanDb(tmpDbName, userName, password)

  console.log(`Importing data from tmp mysql to tmp postgres database`)
  const pgloaderScript = stripIndent`
    LOAD database  
      FROM    mysql://${process.env.LOCAL_MYSQL_USER}@localhost/${tmpDbName}  
      INTO    postgresql://${userName}@localhost/${tmpDbName}
      
    WITH include drop, create tables, no truncate,  
      create indexes, reset sequences, foreign keys

    CAST type bigint  with extra auto_increment  
            to integer drop typemod keep default keep not null,   
         type bigint when (= precision 20) to integer drop typemod,
         type int when (= precision 11) to integer drop typemod
    ALTER SCHEMA '${tmpDbName}' RENAME TO 'public'
  ;`

  pgloader(process.env.LOCAL_MYSQL_PASSWORD, pgloaderScript)

  console.log(`Recreating database ${databaseName}`)
  createCleanDb(databaseName, userName, password)

  console.log('Inserting knex records')
  // remove if kex-migrate fixes it's issue
  createKnexMigrationTables(databaseName, userName, password)

  console.log('Create schema in a acnw-1 format')
  const migration1 = spawnSync('./node_modules/.bin/knex-migrate', ['up', '20171015105936-acnw-1-schema.js'], {stdio: 'inherit'})
  !migration1.status || bail(migration1.status)

  console.log('Loading data from latest live acnw v1 database')

  await pipeTmpToLocal(tmpDbName, databaseName, userName, password)
    .catch(bail)

  console.log('resetting sequences')
  fixSequences(databaseName, userName, password)

  console.log('Applying the remaining migrators')
  const migration2 = spawnSync('./node_modules/.bin/knex-migrate', ['up'], {stdio: 'inherit'})
  !migration2.status || bail(migration1.status)
}

main().then(() => console.log('Complete'))
