/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(`
    ALTER TABLE game_assignment
    DROP CONSTRAINT game_assignment_game_id_foreign
  `)
  await knex.raw(`
    ALTER TABLE game_assignment
    ADD CONSTRAINT game_assignment_game_id_foreign FOREIGN KEY (game_id) REFERENCES game (id) MATCH SIMPLE ON DELETE CASCADE
  `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
