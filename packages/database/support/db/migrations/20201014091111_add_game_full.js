/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.table('game', (table) => {
    table.boolean('full').defaultTo(false)
  })
}
