exports.up = async function(knex) {
  return knex.schema
    .dropTableIfExists('member_hotel_room_assignment')
    .dropTableIfExists('registration_code')
    .dropTableIfExists('token')
}

exports.down = async function(knex) {}
