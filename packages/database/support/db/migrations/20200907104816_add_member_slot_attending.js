exports.up = async function (knex) {
  return knex.schema.table('membership', (table) => {
    table.string('slots_attending', 20).defaultTo(null)
  })
}

exports.down = async function (knex) {}
