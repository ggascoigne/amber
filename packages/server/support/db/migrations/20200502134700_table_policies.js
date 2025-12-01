const tables = [
  { name: 'game', admin: false },
  { name: 'game_assignment', admin: false },
  { name: 'game_choice', admin: false },
  { name: 'game_submission', admin: false },
  { name: 'hotel_room', admin: true },
  { name: 'hotel_room_details', admin: true },
  { name: 'lookup', admin: true },
  { name: 'lookup_value', admin: true },
  { name: 'membership', admin: false },
  { name: 'profile', admin: false },
  { name: 'role', admin: true },
  { name: 'room', admin: true },
  { name: 'setting', admin: true },
  { name: 'shirt_order', admin: false },
  { name: 'shirt_order_item', admin: false },
  { name: 'slot', admin: true },
  { name: 'user', admin: false },
  { name: 'user_role', admin: true },
]

/**
 * protect the user column from causing syntax errors
 *
 * @param {string} name
 * @returns {string}
 */
const q = (name) => (name === 'user' ? '"user"' : name)

/**
 * read only if not logged on
 * @param {string} table
 * @returns {string}
 */
const anyUserUpdatePolicy = (table) => `
  CREATE POLICY ${table}_sel_policy ON ${q(table)}
    FOR SELECT
    USING (TRUE);
  CREATE POLICY ${table}_mod_policy ON ${q(table)}
    USING (current_user_id() != NULL);
  `

/**
 * @param {string} table
 * @returns {string}
 */ const adminUpdatePolicy = (table) => `
  CREATE POLICY ${table}_sel_policy ON ${q(table)}
    FOR SELECT
    USING (TRUE);
  CREATE POLICY ${table}_mod_policy ON ${q(table)}
    USING (current_user_is_admin());
  `

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(
    tables.map((table) => (table.admin ? adminUpdatePolicy(table.name) : anyUserUpdatePolicy(table.name))).join('\n'),
  )
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.raw(
    tables
      .map(
        (table) => `
            DROP POLICY IF EXISTS ${table.name}_sel_policy ON ${q(table.name)};
            DROP POLICY IF EXISTS ${table.name}_mod_policy ON ${q(table.name)};
          `,
      )
      .join('\n'),
  )
}
