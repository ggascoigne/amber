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
  info,
  psql
} = require('./scriptUtils')
const { stripIndent } = require('common-tags')
const { sleep } = require('./sleep')
const tempy = require('tempy')
const fs = require('fs')

async function pipeLiveToLocalMysql(mysqlDbconfig) {
  return new Promise((resolve, reject) => {
    const exporting = spawn('/usr/local/bin/plink', [
      '-ssh',
      '-pw',
      process.env.SSH_KEYSTORE_PASSWORD,
      '-P',
      process.env.LEGACY_JUMP_BOX_PORT,
      '-noagent',
      '-l',
      process.env.LEGACY_JUMP_BOX_USER,
      process.env.LEGACY_JUMP_BOX_HOST,
      `MYSQL_PWD=${process.env.LEGACY_LIVE_MYSQL_PASSWORD}`,
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
      `--user=${process.env.LEGACY_LIVE_MYSQL_USER}`,
      process.env.LEGACY_LIVE_MYSQL_DATABASE
    ])
      .on('error', reject)
      .on('exit', code => (!code ? resolve() : reject(code)))

    const { database, host, port, user, password } = mysqlDbconfig
    const importing = spawn(
      `${MYSQL_PATH}/mysql`,
      [`--host=${host}`, `--port=${port}`, `--user=${user}`, '--default-character-set=utf8', `--database=${database}`],
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

async function pipeTmpToLive(tmpDbConfig, dbconfig) {
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
function fixSequences(dbconfig) {
  // @formatter:off
  // language=PostgreSQL
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
  // @formatter:on

  const name = tempy.file()
  const name2 = tempy.file()
  fs.writeFileSync(name, q)

  const args1 = getPostgresArgs(dbconfig)
  args1.push('-XAtq', '-f', name, '-o', name2)
  const args2 = getPostgresArgs(dbconfig)
  args2.push('-X', '-f', name2)

  runOrExit(spawnSync('/usr/local/bin/psql', args1, { stdio: 'inherit' }))
  runOrExit(spawnSync('/usr/local/bin/psql', args2, { stdio: 'inherit' }))
}

function cleanUpData(dbconfig) {
  // @formatter:off
  // language=PostgreSQL
  const q = stripIndent`
      DELETE FROM lookup_value 
      WHERE lookup_value.lookup_id = 3 
        AND (lookup_value.code = 'en-suite' OR lookup_value.code = 'no en-suite');
  `
  // @formatter:on

  return psql(dbconfig, q)
}

async function main() {
  const dbconfig = {
    database: config.database.database,
    user: config.database.username,
    port: config.database.port,
    host: config.database.host,
    password: config.database.password,
    ssl: config.database.ssl,
    ssl_cert: config.database.ssl_cert
  }

  const tmpDbConfig = {
    database: 'acnw_v1_tmp',
    user: process.env.MIGRATION_POSTGRES_USER,
    port: process.env.MIGRATION_POSTGRES_PORT,
    host: process.env.MIGRATION_POSTGRES_HOST,
    password: process.env.MIGRATION_POSTGRES_PASSWORD,
    ssl: process.env.MIGRATION_POSTGRES_SSL
  }

  const mysqlDbconfig = {
    database: 'acnw_v1_tmp',
    user: process.env.MIGRATION_MYSQL_USER,
    port: process.env.MIGRATION_MYSQL_PORT,
    host: process.env.MIGRATION_MYSQL_HOST,
    password: process.env.MIGRATION_MYSQL_PASSWORD,
    ssl: process.env.MIGRATION_MYSQL_SSL
  }

  if (!process.env.SKIP_DOWNLOAD) {
    info(`Create tmp mysql database ${mysqlDbconfig.database}`)
    await createCleanDbMySql(mysqlDbconfig)

    info("note that if this times out, make sure that you aren't on the vpn")
    info(`download data from live mysql to local temp`)
    await pipeLiveToLocalMysql(mysqlDbconfig).catch(bail)

    // if I don't do this then some of the users don't get copied over and things explode
    info(`pausing to let mysql flush to disk`)
    await sleep(5000)
  } else {
    info('skipping download')
  }
  info(`Create tmp postgres database ${tmpDbConfig.database}`)
  await createCleanDb(tmpDbConfig)

  info(`Importing data from tmp mysql to tmp postgres database`)
  // note that workers=1 was needed to deal with a hard-to-trace connection error
  // tested with
  // $ pgloader --version
  // pgloader version "3.5.2"
  // compiled with SBCL 1.4.9
  const pgArgs = getPostgresArgs(tmpDbConfig)
  pgloader(
    mysqlDbconfig.password,
    stripIndent`
    LOAD database  
      FROM    mysql://${mysqlDbconfig.user}@${mysqlDbconfig.host}:${mysqlDbconfig.port}/${mysqlDbconfig.database}  
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
    ALTER SCHEMA '${tmpDbConfig.database}' RENAME TO 'public'
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

  info(`Recreating database ${dbconfig.database}`)
  await createCleanDb(dbconfig)

  info('Inserting knex records')
  // remove if kex-migrate fixes it's issue
  createKnexMigrationTables(dbconfig)

  info('Create new schema')
  runOrExit(spawnSync('./node_modules/.bin/knex-migrate', ['up'], { stdio: 'inherit' }))

  info('Loading data from tmp to live')
  await pipeTmpToLive(tmpDbConfig, dbconfig).catch(bail)

  info('resetting sequences')
  fixSequences(dbconfig)

  info('clean up data')
  cleanUpData(dbconfig)
}

main().then(() => info('Complete'))
