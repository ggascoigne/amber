/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema
    .dropTableIfExists('member_hotel_room_assignment')
    .dropTableIfExists('registration_code')
    .dropTableIfExists('token')
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-empty-function
export async function down(knex) {}
