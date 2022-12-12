exports.up = function (knex) {
  return Promise.allSettled([
    knex.schema.createTable('hotel_room_details', (table) => {
      table.bigIncrements().primary()
      table.bigInteger('version', 20).notNullable()
      table.string('bathroom_type', 255).notNullable()
      table.string('comment', 100).notNullable()
      table.boolean('enabled').notNullable()
      table.boolean('gaming_room').notNullable()
      table.string('internal_room_type', 100).notNullable()
      table.string('name', 50).notNullable()
      table.boolean('reserved').notNullable()
      table.string('reserved_for', 50).notNullable()
      table.string('room_type', 255).notNullable()
      table.string('formatted_room_type', 255).notNullable()
    }),
    knex.schema.createTable('member_hotel_room_assignment', (table) => {
      table.bigInteger('member_id', 20).notNullable().references('membership.id').unsigned().index()
      table.bigInteger('hotel_room_id', 20).notNullable().references('hotel_room_details.id').unsigned().index()
      table.boolean('room_owner').notNullable()
      table.integer('year', 11).notNullable()
      table.primary([`member_id`, `hotel_room_id`])
    }),
  ])
}

exports.down = function (knex) {
  // no revert
}
