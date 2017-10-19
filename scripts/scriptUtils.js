const {spawn} = require('child_process')

async function createCleanDb (database, user, password) {
  return new Promise((resolve, reject) => {
    const child = spawn('/usr/local/bin/mysql', [`--user=${user}`, '--default-character-set=utf8'],
      {env: {MYSQL_PWD: password}})
      .on('error', function (error) { reject(error) })
      .on('close', function () { resolve() })
      .on('exit', function (code) { !code ? resolve() : reject(code) })

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.stdin.write(`DROP DATABASE IF EXISTS ${database};`)
    child.stdin.write(`CREATE DATABASE ${database} DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;`)
    child.stdin.end()
  })
}

exports.createCleanDb = createCleanDb
