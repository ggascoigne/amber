export async function up(knex) {
  return Promise.allSettled([
    knex.schema.table('user', (table) => {
      table.string('email', 64)
      table.string('full_name', 64).defaultTo(null)
      table.string('snail_mail_address', 250).defaultTo(null)
      table.string('phone_number', 32).defaultTo(null)
    }),
    knex.raw(`
      UPDATE "user" u
      SET
        email = p.email,
        full_name = p.full_name,
        phone_number = p.phone_number,
        snail_mail_address = p.snail_mail_address
      FROM
        profile p
      WHERE
        p.id = u.profile_id;
      `),
    knex.schema.table('user', (table) => {
      table.string('email', 64).notNullable().unique().alter()
    }),
    knex.schema
      .table('user', (table) => {
        table.dropColumn('username')
        table.dropColumn('profile_id')
        table.dropColumn('account_locked')
        table.dropColumn('enabled')
        table.dropColumn('password')
      })
      .dropTableIfExists('profile'),
  ])
}

// eslint-disable-next-line no-empty-function
export async function down(knex) {}
