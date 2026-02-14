/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(`
    INSERT INTO
    profile (user_id, snail_mail_address, phone_number) (
      SELECT
        id,
        snail_mail_address,
        phone_number
      FROM
        "user"
    )
    `)
  return knex.schema.table('user', (table) => {
    table.dropColumn('snail_mail_address')
    table.dropColumn('phone_number')
  })
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
