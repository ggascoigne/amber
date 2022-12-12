exports.up = async function (knex) {
  await knex.raw(`
      insert into profile (user_id, snail_mail_address, phone_number)
      (select id, snail_mail_address, phone_number from "user");
    `)
  return knex.schema.table('user', (table) => {
    table.dropColumn('snail_mail_address')
    table.dropColumn('phone_number')
  })
}

exports.down = async function (knex) {}
