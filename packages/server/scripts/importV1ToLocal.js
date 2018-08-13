#!/usr/bin/env node

require('dotenv').config()
const config = require('config')
const { spawn, spawnSync } = require('child_process')
const {
  bail,
  MYSQL_PATH,
  runOrExit,
  dropKnexMigrationTables,
  createKnexMigrationTables,
  createCleanDb,
  createCleanDbMySql,
  pgloader,
  psql
} = require('./scriptUtils')
const { stripIndent } = require('common-tags')
const { sleep } = require('./sleep')
const tempy = require('tempy')
const fs = require('fs')

async function pipeLiveToLocalMysql (databaseName, userName, password) {
  return new Promise((resolve, reject) => {
    const exporting = spawn('/usr/local/bin/plink', [
      '-ssh',
      '-pw',
      process.env.KEYSTOR_PASSWORD,
      '-P',
      process.env.ACNW_SSH_PORT,
      '-noagent',
      '-l',
      process.env.REMOTE_USER,
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
      process.env.REMOTE_DATABASE_NAME
    ])
      .on('error', reject)
      .on('exit', code => (!code ? resolve() : reject(code)))

    const importing = spawn(
      `${MYSQL_PATH}/mysql`,
      [`--user=${userName}`, '--default-character-set=utf8', `--database=${databaseName}`],
      { env: { MYSQL_PWD: password } }
    )
      .on('error', reject)
      .on('exit', code => (!code ? resolve() : reject(code)))

    exporting.stdout.pipe(importing.stdin)

    exporting.stderr.pipe(process.stderr)
    importing.stdout.pipe(process.stdout)
    importing.stderr.pipe(process.stderr)
  })
}

async function pipeTmpToLocal (tmpDbName, databaseName, userName, password) {
  return new Promise((resolve, reject) => {
    const exporting = spawn('/usr/local/bin/pg_dump', ['--schema=public', '-d', tmpDbName, '-a']).on('error', reject)

    const importing = spawn('/usr/local/bin/psql', ['-d', databaseName, '-v', 'ON_ERROR_STOP=1'])
      .on('error', reject)
      .on('exit', code => (!code ? resolve() : reject(code)))

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

  runOrExit(spawnSync('/usr/local/bin/psql', [databaseName, '-Atq', '-f', name, '-o', name2], { stdio: 'inherit' }))
  runOrExit(spawnSync('/usr/local/bin/psql', [databaseName, '-f', name2], { stdio: 'inherit' }))
}

async function main () {
  const databaseName = config.get('database.database')
  const userName = config.get('database.username')
  const password = config.has('database.password') ? config.get('database.password') : ''
  const tmpDbName = 'acnw_v1_tmp'

  console.log(`Create tmp mysql database ${tmpDbName}`)
  await createCleanDbMySql(tmpDbName, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD)

  console.log(`download data`)
  await pipeLiveToLocalMysql(tmpDbName, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD).catch(bail)

  // if I don't do this then some of the users don't get copied over and things explode
  console.log(`pausing to let mySql flush to disk`)
  await sleep(5000)

  console.log(`Create tmp postgres database ${tmpDbName}`)
  await createCleanDb(tmpDbName, userName, password)

  console.log(`Importing data from tmp mysql to tmp postgres database`)
  // note that workers=1 was needed to deal with a hard-to-trace connection error
  pgloader(
    process.env.LOCAL_MYSQL_PASSWORD,
    stripIndent`
    LOAD database  
      FROM    mysql://${process.env.LOCAL_MYSQL_USER}@localhost/${tmpDbName}  
      INTO    postgresql://${userName}@localhost/${tmpDbName}
      
    WITH include drop, create tables, no truncate,  
      create indexes, reset sequences, foreign keys,
      workers = 1, concurrency = 1

    SET MySQL PARAMETERS
      net_read_timeout  = '120',
      net_write_timeout = '120'

    EXCLUDING table names matching 'async_mail_attachment', 'async_mail_bcc', 'async_mail_cc', 'async_mail_header',
      'async_mail_mess', 'async_mail_to', 'databasechangelog', 'databasechangeloglock', 'email_code', 'login_record'
    
    CAST type bigint  with extra auto_increment  
            to integer drop typemod keep default keep not null,   
         type bigint when (= precision 20) to integer drop typemod,
         type int when (= precision 11) to integer drop typemod
    ALTER SCHEMA '${tmpDbName}' RENAME TO 'public'
  ;`
  )

  console.log('Inserting knex records into tmpdb')
  createKnexMigrationTables(tmpDbName, userName, password)

  console.log('Preparing tmpdb for transfer to new database')
  runOrExit(
    spawnSync('./node_modules/.bin/knex-migrate', ['up', '--only', '20171015154605_drop_junk.js'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'mysql_import' }
    })
  )

  console.log('Deleting knex records in tmpdb')
  dropKnexMigrationTables(tmpDbName, userName, password)

  console.log(`Recreating database ${databaseName}`)
  createCleanDb(databaseName, userName, password)

  console.log('Inserting knex records')
  // remove if kex-migrate fixes it's issue
  createKnexMigrationTables(databaseName, userName, password)

  console.log('Create new schema')
  runOrExit(spawnSync('./node_modules/.bin/knex-migrate', ['up'], { stdio: 'inherit' }))

  console.log('Loading data from latest live acnw v1 database')
  await pipeTmpToLocal(tmpDbName, databaseName, userName, password).catch(bail)

  console.log('resetting sequences')
  fixSequences(databaseName, userName, password)
}

main().then(() => console.log('Complete'))
