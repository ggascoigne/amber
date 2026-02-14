/**
 * @param {import('knex').Knex} _knex
 * @returns {Promise<void>}
 */
export async function up(_knex) {
  // await knex.raw(`
  //   comment on table knex_migrations is E'@omit';
  //   comment on table knex_migrations_lock is E'@omit';
  // `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
