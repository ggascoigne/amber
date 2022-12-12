exports.up = async function (knex) {
  return knex.schema.createTable('profile', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('user.id').unsigned().index()
    table.string('snail_mail_address', 250).defaultTo(null)
    table.string('phone_number', 32).defaultTo(null)
  })
}

exports.down = async function (knex) {}
