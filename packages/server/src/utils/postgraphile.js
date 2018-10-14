import fs from 'fs'

exports.installWatchFixtures = rootPgPool => {
  // Install the watch fixtures manually
  const fixtures = fs.readFileSync(require.resolve('graphile-build-pg/res/watch-fixtures.sql'), 'utf8')
  rootPgPool.query(fixtures).then(
    () => {
      console.log(`Loaded watch fixtures ✅`)
      console.log(`Ignore the "Failed to setup watch fixtures" warning`)
    },
    e => {
      console.error('Failed to load watch fixtures 🔥')
      console.error(e)
    }
  )
}
