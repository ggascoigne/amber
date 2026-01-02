/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  Promise.allSettled([
    knex.schema.table('hotel_room', (table) => {
      table.string('type', 255).notNullable()
    }),
    knex.schema.table('membership', (table) => {
      table.boolean('offer_subsidy').notNullable()
      table.boolean('request_old_price').notNullable()
      table.double('amount_owed', 19, 2).notNullable()
      table.double('amount_paid', 19, 2).notNullable()
    }),
  ])
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
