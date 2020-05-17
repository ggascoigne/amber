#!/usr/bin/env ts-node-script

/// <reference types="../types/common-tags" />
import { spawn, spawnSync } from 'child_process'
import fs from 'fs'

import cli from 'cli-ux'
import { stripIndent } from 'common-tags'
import meow from 'meow'
import tempy from 'tempy'

import { DbConfig, config } from '../shared/config'
import {
  MYSQL_PATH,
  bail,
  createCleanDb,
  createCleanDbMySql,
  createKnexMigrationTables,
  dropKnexMigrationTables,
  getPostgresArgs,
  info,
  pgloader,
  psql,
  runOrExit,
} from './scriptUtils'
import { sleep } from './sleep'

// note run `yarn db:import --skip-download` if you want to just re-run this with the last download

async function pipeLiveToLocalMysql(mysqlDbconfig: DbConfig, verbose: boolean) {
  return new Promise((resolve, reject) => {
    const exporting = spawn('/usr/local/bin/plink', [
      '-ssh',
      '-pw',
      process.env.SSH_KEYSTORE_PASSWORD!,
      '-P',
      process.env.LEGACY_JUMP_BOX_PORT!,
      '-noagent',
      '-l',
      process.env.LEGACY_JUMP_BOX_USER!,
      process.env.LEGACY_JUMP_BOX_HOST!,
      `MYSQL_PWD=${process.env.LEGACY_LIVE_MYSQL_PASSWORD!}`,
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
      `--user=${process.env.LEGACY_LIVE_MYSQL_USER!}`,
      process.env.LEGACY_LIVE_MYSQL_DATABASE!,
    ])
      .on('error', reject)
      .on('exit', (code: number) => (!code ? resolve() : reject(code)))

    const { database, host, port, user, password } = mysqlDbconfig
    const importing = spawn(
      `${MYSQL_PATH}/mysql`,
      [`--host=${host}`, `--port=${port}`, `--user=${user}`, '--default-character-set=utf8', `--database=${database}`],
      { env: { MYSQL_PWD: password } }
    )
      .on('error', reject)
      .on('exit', (code: number) => (!code ? resolve() : reject(code)))

    exporting.stdout.pipe(importing.stdin)

    exporting.stderr.pipe(process.stderr)
    if (verbose) {
      importing.stdout.pipe(process.stdout)
    }
    importing.stderr.pipe(process.stderr)
  })
}

async function pipeTmpToLive(tmpDbConfig: DbConfig, dbconfig: DbConfig, verbose: boolean) {
  return new Promise((resolve, reject) => {
    const pgDumpArgs = getPostgresArgs(tmpDbConfig)
    pgDumpArgs.push('--schema=public', '-a')
    const exporting = spawn('/usr/local/bin/pg_dump', pgDumpArgs).on('error', reject)

    const psqlArgs = getPostgresArgs(dbconfig)
    psqlArgs.push('-v', 'ON_ERROR_STOP=1')
    const importing = spawn('/usr/local/bin/psql', psqlArgs)
      .on('error', reject)
      .on('exit', (code: number) => (!code ? resolve() : reject(code)))

    exporting.stdout.pipe(importing.stdin)

    exporting.stderr.pipe(process.stderr)
    if (verbose) {
      importing.stdout.pipe(process.stdout)
    }
    importing.stderr.pipe(process.stderr)
  })
}

/*
  reset all sequences based on the max index on the table.
 */
function fixSequences(dbconfig: DbConfig, verbose: boolean) {
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

  runOrExit(spawnSync('/usr/local/bin/psql', args1, { stdio: verbose ? 'inherit' : 'ignore' }))
  runOrExit(spawnSync('/usr/local/bin/psql', args2, { stdio: verbose ? 'inherit' : 'ignore' }))
}

function cleanUpData(dbconfig: DbConfig, verbose: boolean) {
  // @formatter:off
  // language=PostgreSQL
  const q = stripIndent`
      DELETE FROM lookup_value 
      WHERE lookup_value.lookup_id = 3 
        AND (lookup_value.code = 'en-suite' OR lookup_value.code = 'no en-suite');
  `
  // @formatter:on

  return psql(dbconfig, q, verbose)
}

async function main() {
  const args = meow(
    `
      Usage
        $ importV1ToLocal
      
      Options
        --help          Show this help message
        --verbose       Show verbose output
        --skip-download Skip downloading database from public, just use the latest local mysl copy
  `,
    {
      description: 'importV1ToLocal - download legacy MySql database and convert it to a local postgres database.',
      flags: {
        verbose: {
          type: 'boolean',
          alias: 'v',
          default: false,
        },
        skipDownload: {
          type: 'boolean',
          alias: 's',
          default: false,
        },
      },
    }
  )

  const dbconfig: DbConfig = config.database

  const tmpDbConfig: DbConfig = {
    database: 'acnw_v1_tmp',
    user: process.env.MIGRATION_POSTGRES_USER!,
    port: parseInt(process.env.MIGRATION_POSTGRES_PORT || '', 10),
    host: process.env.MIGRATION_POSTGRES_HOST!,
    password: process.env.MIGRATION_POSTGRES_PASSWORD || '',
    ssl: process.env.MIGRATION_POSTGRES_SSL === '1',
  }

  const mysqlDbconfig: DbConfig = {
    database: 'acnw_v1_tmp',
    user: process.env.MIGRATION_MYSQL_USER!,
    port: parseInt(process.env.MIGRATION_MYSQL_PORT || '', 10),
    host: process.env.MIGRATION_MYSQL_HOST!,
    password: process.env.MIGRATION_MYSQL_PASSWORD || '',
    ssl: process.env.MIGRATION_MYSQL_SSL === '1',
  }

  cli.action.start('Import')
  if (!process.env.SKIP_DOWNLOAD && !args.flags.skipDownload) {
    info(`Create tmp mysql database ${mysqlDbconfig.database}`)
    await createCleanDbMySql(mysqlDbconfig, args.flags.verbose)

    info("Note that if this times out, make sure that you aren't on the vpn")
    info(`Download data from live mysql to local temp`)
    await pipeLiveToLocalMysql(mysqlDbconfig, args.flags.verbose).catch(bail)

    // if I don't do this then some of the users don't get copied over and things explode
    info(`Pausing to let mysql flush to disk`)
    await sleep(5000)
  } else {
    info('Skipping download')
  }
  info(`Create tmp postgres database ${tmpDbConfig.database}`)
  await createCleanDb(tmpDbConfig, args.flags.verbose)

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
  ;`,
    args.flags.verbose
  )

  info('Inserting knex records into postgres tmpdb')
  createKnexMigrationTables(tmpDbConfig, args.flags.verbose)

  info('Preparing tmpdb for transfer to new database')
  runOrExit(
    spawnSync(
      './node_modules/.bin/knex-migrate',
      ['--cwd', './support', '--knexfile', './knexfile.js', 'up', '--only', '20171015154605_drop_junk.js'],
      {
        stdio: args.flags.verbose ? 'inherit' : 'ignore',
        env: {
          ...process.env,
          DATABASE_NAME: tmpDbConfig.database,
          DATABASE_USER: tmpDbConfig.user,
          DATABASE_PORT: `${tmpDbConfig.port}`,
          DATABASE_HOST: tmpDbConfig.host,
          DATABASE_PASSWORD: tmpDbConfig.password,
          DATABASE_SSL: `${tmpDbConfig.ssl}`,
        },
      }
    )
  )

  info('Deleting knex records in tmpdb')
  dropKnexMigrationTables(tmpDbConfig, args.flags.verbose)

  info(`Recreating database ${dbconfig.database}`)
  await createCleanDb(dbconfig, args.flags.verbose)

  info('Inserting knex records')
  // remove if kex-migrate fixes it's issue
  createKnexMigrationTables(dbconfig, args.flags.verbose)

  info('Create new schema')
  runOrExit(
    spawnSync(
      './node_modules/.bin/knex-migrate',
      ['--cwd', './support', '--knexfile', './knexfile.js', 'up', '--to', '20190127145944_omit_tables'],
      {
        stdio: args.flags.verbose ? 'inherit' : 'ignore',
      }
    )
  )

  info('Loading data from tmp to live')
  await pipeTmpToLive(tmpDbConfig, dbconfig, args.flags.verbose).catch(bail)

  info('Run rest of the migrators')
  runOrExit(
    spawnSync('./node_modules/.bin/knex-migrate', ['--cwd', './support', '--knexfile', './knexfile.js', 'up'], {
      stdio: args.flags.verbose ? 'inherit' : 'ignore',
    })
  )

  info('Resetting sequences')
  fixSequences(dbconfig, args.flags.verbose)

  info('Clean up data')
  cleanUpData(dbconfig, args.flags.verbose)
}

main().then(() => {
  cli.action.stop('Complete')
})

// hack to force ts to treat the file as a module and avoid the
// 'All files must be modules when the '--isolatedModules' flag is provided.' error
export {}
