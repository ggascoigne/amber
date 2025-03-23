/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.raw(`
    DELETE FROM "user"
    WHERE
      id IN (
        SELECT
          u.id
        FROM
          "user" u
          LEFT JOIN membership m ON u.id = m.user_id
        WHERE
          user_id IS NULL
      )
    `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-empty-function
export async function down(knex) {}
