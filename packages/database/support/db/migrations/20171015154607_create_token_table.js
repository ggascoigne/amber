// drop a batch if stuff that I either don't care about or plan on handling
// differently this time around
//
// specifically the version, date_created and last_updated are hibernate traces,
// the dropped tables are application data rather than domain data and will just
// be handled a different way

exports.up = function (knex) {
  return knex.schema.createTable('token', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('user.id').unsigned().index()
    table.text('cuid')
    table.boolean('active').defaultTo(true)
    table.dateTime('last_used')
  })
}

exports.down = function (knex) {}
