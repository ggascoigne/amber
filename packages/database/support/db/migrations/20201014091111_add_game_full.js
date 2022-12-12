exports.up = async function (knex) {
  return knex.schema.table('game', (table) => {
    table.boolean('full').defaultTo(false)
  })
}

exports.down = async function (knex) {}
