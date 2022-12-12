import { spawnSync, SpawnSyncReturns } from 'child_process'
import * as fs from 'fs'

import { CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import { stripIndent } from 'common-tags'
import * as tempy from 'tempy'

import { DbConfig } from '../../shared/config'

export const MYSQL_PATH = '/usr/local/opt/mysql@5.7/bin'

export async function mysqlExecScript(dbconfig: DbConfig, script: string, verbose: boolean) {
  const { database, host, port, user, password } = dbconfig
  const args = [`--host=${host}`, `--port=${port}`, `--user=${user}`, '--default-character-set=utf8']
  database && args.push(`--database=${database}`)

  return new Promise((resolve, reject) => {
    // @ts-ignore
    const child = spawn(`${MYSQL_PATH}/mysql`, args, { env: { MYSQL_PWD: password } })
      // @ts-ignore
      .on('error', reject)
      .on('close', resolve)
      .on('exit', (code: number) => (code ? reject(code) : resolve(code)))

    if (verbose) {
      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)
    }
    child.stdin.write(script)
    child.stdin.end()
  })
}

export function getPostgresArgs(dbconfig: DbConfig) {
  const { database, host, port, user, password, ssl } = dbconfig
  return [`postgresql://${user}:${password}@${host}:${port}/${database}${ssl ? '?sslmode=require' : ''}`]
}

export const bail = (reason: any) => {
  if (reason) {
    CliUx.ux.error(chalk.bold.red('error detected'))
    CliUx.ux.error(reason)
    process.exit(-1)
  }
}
export const runOrExit = (processStatus: SpawnSyncReturns<Buffer>, cmd?: string) => {
  if (processStatus.error) {
    cmd && CliUx.ux.log(`running ${cmd}`)
    bail(processStatus.error)
  }
  if (processStatus.status) {
    cmd && CliUx.ux.log(`running ${cmd}`)
    bail(processStatus.status)
  }
}
export function psql(dbconfig: DbConfig, script: string, verbose: boolean) {
  const name = tempy.file()
  fs.writeFileSync(name, script)

  const args = getPostgresArgs(dbconfig)
  args.push('-X', '-v', 'ON_ERROR_STOP=1', '-f', name)
  const cmd = `psql ${args.join(' ')}`
  verbose && CliUx.ux.log(`running ${cmd}`)
  runOrExit(spawnSync('/usr/local/bin/psql', args, { stdio: verbose ? 'inherit' : 'ignore' }), cmd)
}

export function pgloader(mySqlPassword: string, script: string, verbose: boolean) {
  const name = tempy.file()
  fs.writeFileSync(name, script)

  runOrExit(
    spawnSync('/usr/local/bin/pgloader', ['-v', /* '--debug', */ '--on-error-stop', name], {
      // @ts-ignore
      env: { MYSQL_PWD: mySqlPassword },
      stdio: verbose ? 'inherit' : 'ignore',
    })
  )
}

export async function createCleanDbMySql(dbconfig: DbConfig, verbose: boolean) {
  const { database } = dbconfig
  // language=MySQL
  const script = stripIndent`
    DROP DATABASE IF EXISTS ${database};
    CREATE DATABASE ${database} DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;`

  return mysqlExecScript({ ...dbconfig, database: '' }, script, verbose)
}
export function info(s: string) {
  CliUx.ux.log(chalk.bold(s))
}

export async function resetOwner(dbconfig: DbConfig, targetUser: string, verbose: boolean) {
  // @formatter:off
  // language=PostgreSQL
  const script = stripIndent`
    grant usage on schema public to ${targetUser};
    grant select, insert, update, delete on all tables in schema public to ${targetUser};
    grant select, update, usage on all sequences in schema public to ${targetUser};
    grant execute on all routines in schema public to ${targetUser};
  `
  // @formatter:on
  psql({ ...dbconfig }, script, verbose)
}

export async function createCleanDb(
  dbconfig: DbConfig,
  targetUser: string,
  targetUserPassword: string,
  verbose: boolean
) {
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

  // @formatter:off
  // language=PL
  const script2 = stripIndent`
    DO $do$
    BEGIN
    IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
      WHERE rolname = '${targetUser}') THEN
        CREATE USER ${targetUser} with password '${targetUserPassword}';
    END IF;
    END
    $do$;
   `
  // @formatter:on
  psql({ ...dbconfig, database: 'postgres' }, script2, verbose)

  await resetOwner(dbconfig, targetUser, verbose)
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
