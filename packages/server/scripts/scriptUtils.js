const { spawn, spawnSync } = require('child_process')
const { stripIndent } = require('common-tags')
const chalk = require('chalk')
const fs = require('fs')
const tempy = require('tempy')

async function createCleanDbMySql (database, user, password) {
  const script = stripIndent`
    DROP DATABASE IF EXISTS ${database};
    CREATE DATABASE ${database} DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;`

  return mysqlExecScript(null, user, password, script)
}

exports.createCleanDbMySql = createCleanDbMySql

async function createCleanDb (database, user, password) {
  forceDropDb(database)
  const createdbStatus = spawnSync('createdb', [database], { stdio: 'inherit' })
  !createdbStatus.status || bail(createdbStatus.status)
}

exports.createCleanDb = createCleanDb

function createKnexMigrationTables (databaseName, userName, password) {
  const sql = stripIndent`
    DROP TABLE IF EXISTS knex_migrations;
  
    CREATE TABLE knex_migrations (
        id integer NOT NULL,
        name character varying(255),
        batch integer,
        migration_time timestamp with time zone
    );
    
    CREATE SEQUENCE knex_migrations_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    
    ALTER SEQUENCE knex_migrations_id_seq OWNED BY knex_migrations.id;
    ALTER TABLE ONLY knex_migrations ALTER COLUMN id SET DEFAULT nextval('knex_migrations_id_seq'::regclass);
    ALTER TABLE ONLY knex_migrations ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);
    
    DROP TABLE IF EXISTS knex_migrations_lock;
    CREATE TABLE knex_migrations_lock (
        is_locked integer
    );

    INSERT INTO knex_migrations_lock VALUES (0);
    `

  return psql(databaseName, sql)
}

exports.createKnexMigrationTables = createKnexMigrationTables

async function mysqlExecScript (database, user, password, script) {
  const args = [`--user=${user}`, '--default-character-set=utf8']
  database && args.push(`--database=${database}`)

  return new Promise((resolve, reject) => {
    const child = spawn('/usr/local/bin/mysql', args, { env: { MYSQL_PWD: password } })
      .on('error', reject)
      .on('close', resolve)
      .on('exit', code => (!code ? resolve() : reject(code)))

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.stdin.write(script)
    child.stdin.end()
  })
}

function forceDropDb (database) {
  const script = stripIndent`
    -- Disallow new connections
    UPDATE pg_database SET datallowconn = 'false' WHERE datname = '${database}';
    ALTER DATABASE ${database} CONNECTION LIMIT 1;
    -- Terminate existing connections
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${database}';
    -- Drop database
    DROP DATABASE IF EXISTS ${database};
  `

  psql('postgres', script, 'ignore')
}

function psql (database, script, stdio = 'inherit') {
  const name = tempy.file()
  fs.writeFileSync(name, script)

  const child = spawnSync('/usr/local/bin/psql', [database, '-f', name], { stdio: stdio })
  !child.status || bail(child.status)
}

function pgloader (mySqlPassword, script) {
  const name = tempy.file()
  fs.writeFileSync(name, script)

  const child = spawnSync('/usr/local/bin/pgloader', ['-v', name], {
    env: { MYSQL_PWD: mySqlPassword },
    stdio: 'inherit'
  })
  !child.status || bail(child.status)
}

exports.pgloader = pgloader

const bail = reason => {
  console.error(chalk.bold.red('error detected'))
  console.error(reason)
  process.exit(-1)
}
exports.bail = bail
