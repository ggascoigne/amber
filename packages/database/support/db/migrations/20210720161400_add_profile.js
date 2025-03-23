/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('profile', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('user.id').unsigned().index()
    table.string('snail_mail_address', 250).defaultTo(null)
    table.string('phone_number', 32).defaultTo(null)
  })
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-empty-function
export async function down(knex) {}
