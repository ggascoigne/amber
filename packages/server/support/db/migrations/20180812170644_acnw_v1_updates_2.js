/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.table('hotel_room', (table) => {
    table.renameColumn('type', 'bathroom_type')
  })
}
