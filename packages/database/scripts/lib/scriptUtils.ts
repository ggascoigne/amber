import { spawnSync, SpawnSyncReturns } from 'child_process'
import fs from 'fs'

import chalk from 'chalk'
import { stripIndent } from 'common-tags'
import debug from 'debug'
import { temporaryFile } from 'tempy'

import type { DbConfig } from '../../shared/config.ts'
import { parsePostgresConnectionString, recreatePostgresConnectionString } from '../../shared/connectionStringUtils.ts'

const log = debug('script')

const waitForStreamToFlush = (stream: NodeJS.WritableStream): Promise<void> =>
  new Promise((resolve) => {
    // @ts-ignore
    if (stream.writableFinished) {
      resolve() // Stream already flushed
    } else {
      stream.once('finish', resolve)
    }
  })

// Call this before exiting the process
const waitForStreamsToFlush = async () => {
  await Promise.all([waitForStreamToFlush(process.stdout), waitForStreamToFlush(process.stderr)])
}

export function getPostgresArgs(dbconfig: DbConfig) {
  // psql doesn't accept the sql-1 parameter even though other things do
  // so remove it so we don't have to manage two connection strings
  return dbconfig.replace(/ssl=1&/, '')
}

export const bail = async (reason: any) => {
  if (reason) {
    console.error(chalk.bold.red('error detected'))
    console.error(reason)
    await waitForStreamsToFlush()
    process.exit(-1)
  }
}
export const runOrExit = async (processStatus: SpawnSyncReturns<Buffer>, cmd?: string) => {
  if (processStatus.error) {
    cmd && console.log(`running ${cmd}`)
    await bail(processStatus.error)
  }
  if (processStatus.status) {
    cmd && console.log(`running ${cmd}`)
    await bail(processStatus.status)
  }
}
export async function psql(dbconfig: DbConfig, script: string, verbose: boolean) {
  const name = temporaryFile()
  fs.writeFileSync(name, script)

  const args = [getPostgresArgs(dbconfig)]
  args.push('-X', '-v', 'ON_ERROR_STOP=1', '-f', name)
  const cmd = `psql ${args.join(' ')}`
  log(`running ${cmd}`)
  await runOrExit(spawnSync('/usr/local/bin/psql', args, { stdio: verbose ? 'inherit' : 'ignore' }), cmd)
}

export function info(s: string) {
  console.log(chalk.bold(s))
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
  await psql(dbconfig, script, verbose)
}

export async function createCleanDb(
  dbconfig: DbConfig,
  targetUser: string,
  targetUserPassword: string,
  verbose: boolean,
) {
  const config = parsePostgresConnectionString(dbconfig)
  const { database, user } = config
  log('database %o', config)
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
  const newUrl = recreatePostgresConnectionString({ ...config, database: 'postgres' })
  log(newUrl)
  await psql(newUrl, script, verbose)

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
  await psql(newUrl, script2, verbose)

  await resetOwner(dbconfig, targetUser, verbose)
}

export async function createKnexMigrationTables(dbconfig: DbConfig, verbose: boolean) {
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

export async function dropKnexMigrationTables(dbconfig: DbConfig, verbose: boolean) {
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
