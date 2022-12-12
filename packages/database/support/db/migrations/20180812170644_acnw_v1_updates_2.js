exports.up = function (knex) {
  return knex.schema.table('hotel_room', (table) => {
    table.renameColumn('type', 'bathroom_type')
  })
}

exports.down = function (knex) {
  // no revert
}
