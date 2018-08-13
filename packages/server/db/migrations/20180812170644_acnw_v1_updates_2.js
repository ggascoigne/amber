exports.up = function (knex, Promise) {
  return knex.schema.table('hotel_room', table => {
    table.renameColumn('type', 'bathroom_type')
  })
}

exports.down = function (knex, Promise) {
  // no revert
}
