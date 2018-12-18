'use strict'

exports.seed = function seed(knex) {
  const tableName = 'user'

  const rows = [
    {
      version: 1,
      account_expired: false,
      account_locked: false,
      date_created: new Date(),
      last_updated: new Date(),
      enabled: true,
      username: 'demo@demo.com',
      password: 'some big hash',
      password_expired: false
    }
  ]

  return knex(tableName)
    .del()
    .then(() => knex.insert(rows).into(tableName))
}
