/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  // await knex.raw(`
  //   comment on table knex_migrations is E'@omit';
  //   comment on table knex_migrations_lock is E'@omit';
  // `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-empty-function
export async function down(knex) {}
