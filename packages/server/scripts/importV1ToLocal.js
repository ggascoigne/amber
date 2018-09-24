#!/usr/bin/env node

const config = require('../src/utils/config')
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
  getPostgresArgs,
  info
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

async function pipeTmpToLive (tmpDbConfig, dbconfig) {
  return new Promise((resolve, reject) => {
    const pgDumpArgs = getPostgresArgs(tmpDbConfig)
    pgDumpArgs.push('--schema=public', '-a')
    const exporting = spawn('/usr/local/bin/pg_dump', pgDumpArgs).on('error', reject)

    const psqlArgs = getPostgresArgs(dbconfig)
    psqlArgs.push('-v', 'ON_ERROR_STOP=1')
    const importing = spawn('/usr/local/bin/psql', psqlArgs)
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
function fixSequences (dbconfig) {
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

  const args1 = getPostgresArgs(dbconfig)
  args1.push('-Atq', '-f', name, '-o', name2)
  const args2 = getPostgresArgs(dbconfig)
  args2.push('-f', name2)

  runOrExit(spawnSync('/usr/local/bin/psql', args1, { stdio: 'inherit' }))
  runOrExit(spawnSync('/usr/local/bin/psql', args2, { stdio: 'inherit' }))
}

async function main () {
  const databaseName = config.database.database
  const userName = config.database.username
  const port = config.database.port
  const host = config.database.host
  const password = config.database.password
  const ssl = config.database.ssl
  const tmpDbName = 'acnw_v1_tmp'

  const dbconfig = {
    database: databaseName,
    user: userName,
    port,
    host,
    password,
    ssl
  }

  const tmpDbConfig = {
    database: tmpDbName,
    user: 'ggp',
    port: 5432,
    host: 'localhost',
    password: '',
    ssl: 0
  }

  if (!process.env.SKIP_DOWNLOAD) {
    info(`Create tmp mysql database ${tmpDbName}`)
    await createCleanDbMySql(tmpDbName, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD)

    info(`download data from live mysql to local temp`)
    await pipeLiveToLocalMysql(tmpDbName, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD).catch(bail)

    // if I don't do this then some of the users don't get copied over and things explode
    info(`pausing to let mysql flush to disk`)
    await sleep(5000)
  } else {
    info('skipping download')
  }
  info(`Create tmp postgres database ${tmpDbName}`)
  await createCleanDb(tmpDbConfig)

  info(`Importing data from tmp mysql to tmp postgres database`)
  // note that workers=1 was needed to deal with a hard-to-trace connection error
  const pgArgs = getPostgresArgs(tmpDbConfig)
  pgloader(
    process.env.LOCAL_MYSQL_PASSWORD,
    stripIndent`
    LOAD database  
      FROM    mysql://${process.env.LOCAL_MYSQL_USER}@localhost/${tmpDbName}  
      INTO    ${pgArgs[0]}
      
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

  info('Inserting knex records into postgres tmpdb')
  createKnexMigrationTables(tmpDbConfig)

  info('Preparing tmpdb for transfer to new database')
  runOrExit(
    spawnSync('./node_modules/.bin/knex-migrate', ['up', '--only', '20171015154605_drop_junk.js'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_NAME: tmpDbConfig.database,
        DATABASE_USER: tmpDbConfig.user,
        DATABASE_PORT: tmpDbConfig.port,
        DATABASE_HOST: tmpDbConfig.host,
        DATABASE_PASSWORD: tmpDbConfig.password,
        DATABASE_SSL: tmpDbConfig.ssl
      }
    })
  )

  info('Deleting knex records in tmpdb')
  dropKnexMigrationTables(tmpDbConfig)

  info(`Recreating database ${databaseName}`)
  createCleanDb(dbconfig)

  info('Inserting knex records')
  // remove if kex-migrate fixes it's issue
  createKnexMigrationTables(dbconfig)

  info('Create new schema')
  runOrExit(spawnSync('./node_modules/.bin/knex-migrate', ['up'], { stdio: 'inherit' }))

  info('Loading data from tmp to live')
  await pipeTmpToLive(tmpDbConfig, dbconfig).catch(bail)

  info('resetting sequences')
  fixSequences(dbconfig)
}

main().then(() => info('Complete'))
