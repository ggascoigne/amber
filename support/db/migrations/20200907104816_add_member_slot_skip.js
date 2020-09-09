exports.up = async function (knex) {
  return knex.schema.table('membership', (table) => {
    table.string('skip_slots', 20).defaultTo(null)
  })
}

exports.down = async function (knex) {}
