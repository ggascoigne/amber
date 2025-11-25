/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  // await knex.schema.dropTableIfExists('knex_migrations_lock')
  // await knex.raw(`
  //   COMMENT ON TABLE knex_migrations IS E'@omit';
  //   `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
