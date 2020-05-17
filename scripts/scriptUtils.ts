import { SpawnSyncReturns } from 'child_process'

import cli from 'cli-ux'

import { DbConfig } from '../shared/config'

const { spawn, spawnSync } = require('child_process')
const { stripIndent } = require('common-tags')
const chalk = require('chalk')
const fs = require('fs')
const tempy = require('tempy')

export const MYSQL_PATH = '/usr/local/opt/mysql@5.7/bin'

export async function createCleanDbMySql(dbconfig: DbConfig, verbose: boolean) {
  const { database } = dbconfig
  // language=MySQL
  const script = stripIndent`
    DROP DATABASE IF EXISTS ${database};
    CREATE DATABASE ${database} DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;`

  return mysqlExecScript({ ...dbconfig, database: '' }, script, verbose)
}

export function getPostgresArgs(dbconfig: DbConfig) {
  const { database, host, port, user, password, ssl } = dbconfig
  return [`postgresql://${user}:${password}@${host}:${port}/${database}${ssl ? '?sslmode=require' : ''}`]
}

export async function createCleanDb(dbconfig: DbConfig, verbose: boolean) {
  const { database, user } = dbconfig
  // useful for tests since it forces dropping local connections
  // const script = stripIndent`
  //   -- Disallow new connections
  //   UPDATE pg_database SET datallowconn = 'false' WHERE datname = '${database}';
  //   ALTER DATABASE ${database} CONNECTION LIMIT 1;
  //   -- Terminate existing connections
  //   SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${database}';
  //   -- Drop database
  //   DROP DATABASE IF EXISTS ${database};
  // `

  // works on RDS
  // @formatter:off
  // language=PostgreSQL
  const script = stripIndent`
    DROP DATABASE IF EXISTS temporary_db_that_shouldnt_exist; 
    CREATE DATABASE temporary_db_that_shouldnt_exist with OWNER ${user}; 
    \\connect temporary_db_that_shouldnt_exist 
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${database}'; 
    DROP DATABASE IF EXISTS ${database}; 
    CREATE DATABASE ${database} WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8'; 
    ALTER DATABASE ${database} OWNER TO ${user}; 
    \\connect ${database} 
    DROP DATABASE IF EXISTS temporary_db_that_shouldnt_exist;
   `
  // @formatter:on
  psql({ ...dbconfig, database: 'postgres' }, script, verbose)
}

export function createKnexMigrationTables(dbconfig: DbConfig, verbose: boolean) {
  // @formatter:off
  // language=PostgreSQL
  const sql = stripIndent`
    DROP TABLE IF EXISTS knex_migrations;
    CREATE TABLE knex_migrations (
      id             integer NOT NULL,
      name           character varying(255),
      batch          integer,
      migration_time timestamp with time zone
    );

    CREATE SEQUENCE knex_migrations_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    ALTER SEQUENCE knex_migrations_id_seq
    OWNED BY knex_migrations.id;
    ALTER TABLE ONLY knex_migrations
      ALTER COLUMN id SET DEFAULT nextval('knex_migrations_id_seq' ::regclass);
    ALTER TABLE ONLY knex_migrations
      ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);

    DROP TABLE IF EXISTS knex_migrations_lock;
    CREATE TABLE knex_migrations_lock (
      is_locked integer
    );

    INSERT INTO knex_migrations_lock
    VALUES (0);
  `
  // @formatter:on

  return psql(dbconfig, sql, verbose)
}

export function dropKnexMigrationTables(dbconfig: DbConfig, verbose: boolean) {
  // @formatter:off
  // language=PostgreSQL
  const sql = stripIndent`
    DROP TABLE IF EXISTS knex_migrations;
    DROP SEQUENCE IF EXISTS knex_migrations_id_seq;
    DROP TABLE IF EXISTS knex_migrations_lock;
  `
  // @formatter:on

  return psql(dbconfig, sql, verbose)
}

export async function mysqlExecScript(dbconfig: DbConfig, script: string, verbose: boolean) {
  const { database, host, port, user, password } = dbconfig
  const args = [`--host=${host}`, `--port=${port}`, `--user=${user}`, '--default-character-set=utf8']
  database && args.push(`--database=${database}`)

  return new Promise((resolve, reject) => {
    const child = spawn(`${MYSQL_PATH}/mysql`, args, { env: { MYSQL_PWD: password } })
      .on('error', reject)
      .on('close', resolve)
      .on('exit', (code: number) => (!code ? resolve() : reject(code)))

    if (verbose) {
      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)
    }
    child.stdin.write(script)
    child.stdin.end()
  })
}

export function psql(dbconfig: DbConfig, script: string, verbose: boolean) {
  const name = tempy.file()
  fs.writeFileSync(name, script)

  const args = getPostgresArgs(dbconfig)
  args.push('-X', '-v', 'ON_ERROR_STOP=1', '-f', name)
  verbose && cli.log(`running psql ${args.join(' ')}`)
  runOrExit(spawnSync('/usr/local/bin/psql', args, { stdio: verbose ? 'inherit' : 'ignore' }))
}

export function pgloader(mySqlPassword: string, script: string, verbose: boolean) {
  const name = tempy.file()
  fs.writeFileSync(name, script)

  runOrExit(
    spawnSync('/usr/local/bin/pgloader', ['-v', /* '--debug', */ '--on-error-stop', name], {
      env: { MYSQL_PWD: mySqlPassword },
      stdio: verbose ? 'inherit' : 'ignore',
    })
  )
}

export const bail = (reason: any) => {
  if (reason) {
    cli.error(chalk.bold.red('error detected'))
    cli.error(reason)
    process.exit(-1)
  }
}
export const runOrExit = (processStatus: SpawnSyncReturns<Buffer>, message = '') => {
  if (processStatus.error) {
    bail(message || processStatus.error)
  }
  if (processStatus.status) {
    bail(message || processStatus.status)
  }
}

export function info(s: string) {
  cli.log(chalk.bold(s))
}
