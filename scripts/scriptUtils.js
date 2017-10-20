const {spawn} = require('child_process')
const {stripIndent} = require('common-tags')

async function createCleanDb (database, user, password) {
  const script = stripIndent`
    DROP DATABASE IF EXISTS ${database};
    CREATE DATABASE ${database} DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;`

  return mysqlExecScript(null, user, password, script)
}

exports.createCleanDb = createCleanDb

async function mysqlExecScript (database, user, password, script) {
  const args = [`--user=${user}`, '--default-character-set=utf8']
  database && args.push(`--database=${database}`)

  return new Promise((resolve, reject) => {
    const child = spawn('/usr/local/bin/mysql', args,
      {env: {MYSQL_PWD: password}})
      .on('error', function (error) { reject(error) })
      .on('close', function () { resolve() })
      .on('exit', function (code) { !code ? resolve() : reject(code) })

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.stdin.write(script)
    child.stdin.end()
  })
}

exports.mysqlExecScript = mysqlExecScript
