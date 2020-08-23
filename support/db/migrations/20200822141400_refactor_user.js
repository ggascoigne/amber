exports.up = async function (knex) {
  return Promise.all([
    knex.schema.table('user', (table) => {
      table.string('email', 64)
      table.string('full_name', 64)
    }),
    knex.raw(`
      update "user" u
      set email = p.email, full_name = p.full_name
      from profile p 
      where p.id = u.profile_id;
    `),
    knex.schema.table('user', (table) => {
      table.string('email', 64).notNullable().unique().alter()
      table.string('full_name', 64).notNullable().alter()
    }),
    knex.schema
      .table('user', (table) => {
        table.dropColumn('profile_id')
        table.dropColumn('account_locked')
        table.dropColumn('enabled')
        table.dropColumn('password')
      })
      .dropTableIfExists('profile'),
  ])
}

exports.down = async function (knex) {}
