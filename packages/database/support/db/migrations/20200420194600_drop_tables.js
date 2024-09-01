export async function up(knex) {
  return knex.schema
    .dropTableIfExists('member_hotel_room_assignment')
    .dropTableIfExists('registration_code')
    .dropTableIfExists('token')
}

// eslint-disable-next-line no-empty-function
export async function down(knex) {}
