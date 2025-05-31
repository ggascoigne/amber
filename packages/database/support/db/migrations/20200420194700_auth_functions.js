/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(`
    CREATE FUNCTION current_user_id () RETURNS INTEGER AS $$
          select nullif(current_setting('user.id', true), '')::integer;
        $$ LANGUAGE SQL STABLE;

    CREATE FUNCTION current_user_is_admin () RETURNS BOOLEAN AS $$
          select nullif(current_setting('user.admin', true), '')::boolean;
        $$ LANGUAGE SQL STABLE;
  `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.raw(`
    DROP FUNCTION current_user_id;
    DROP FUNCTION current_user_is_admin;
  `)
}
