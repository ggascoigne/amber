/**
 * protect the user column from causing syntax errors
 *
 * @param {string} name
 * @returns {string}
 */ const q = (name) => (name === 'user' ? '"user"' : name)

/**
 * @param {string} table
 * @returns {string}
 */
export const dropPolicies = (table) => `
    DROP POLICY IF EXISTS ${table}_sel_policy ON ${q(table)};
    DROP POLICY IF EXISTS ${table}_mod_policy ON ${q(table)};
  `

/**
 * @param {string} table
 * @returns {string}
 */
export const anyUserUpdatePolicy = (table) => `
  CREATE POLICY ${table}_sel_policy ON ${q(table)}
    FOR SELECT
    USING (TRUE);
  CREATE POLICY ${table}_mod_policy ON ${q(table)}
    USING (current_user_id()::BOOLEAN);
  `

/**
 * @param {string} table
 * @returns {string}
 */
export const adminUpdatePolicy = (table) => `
  CREATE POLICY ${table}_sel_policy ON ${q(table)}
    FOR SELECT
    USING (TRUE);
  CREATE POLICY ${table}_mod_policy ON ${q(table)}
    USING (current_user_is_admin());
  `

/**
 * @param {string} table
 * @returns {string}
 */
export const enableRls = (table) => `ALTER TABLE ${q(table)} ENABLE ROW LEVEL SECURITY;`

/**
 * @param {string} user
 * @returns {string}
 */
export const fixGrants = (user) => `
  GRANT USAGE ON SCHEMA public TO ${user};
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${user};
  GRANT SELECT, UPDATE, USAGE ON ALL SEQUENCES IN SCHEMA public TO ${user};
  GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO ${user};
`
