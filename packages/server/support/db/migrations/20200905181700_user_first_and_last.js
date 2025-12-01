/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.table('user', (table) => {
    table.string('first_name', 20).defaultTo(null)
    table.string('last_name', 40).defaultTo(null)
  })
}
