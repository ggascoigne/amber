import { env, parsePostgresConnectionString } from '@amber/environment/dotenv'

import { anyUserUpdatePolicy, adminUpdatePolicy, dropPolicies, enableRls } from '../utils/policyUtils.js'

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
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  const { user, password = '' } = parsePostgresConnectionString(env.DATABASE_URL)
  if (!user) {
    throw new Error('No user found in connection string')
  }

  const res = await knex.raw(`SELECT 1 FROM pg_roles WHERE rolname='${user}'`)
  if (res?.rows?.[0]?.['?column?'] !== 1) {
    // note that users are per database and not per schema
    await knex.raw(`DROP ROLE IF EXISTS ${user}`)
    await knex.raw(`CREATE ROLE ${user} WITH LOGIN PASSWORD '${password}' NOINHERIT;`)
  }
  await knex.raw(`GRANT USAGE ON SCHEMA public TO ${user};`)
  await knex.raw(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${user};`)
  await knex.raw(`GRANT SELECT, UPDATE, USAGE ON ALL SEQUENCES IN SCHEMA public TO ${user};`)
  await knex.raw(`GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO ${user};`)

  await knex.raw(tables.map((table) => dropPolicies(table.name)).join('\n'))

  await knex.raw(
    tables.map((table) => (table.admin ? adminUpdatePolicy(table.name) : anyUserUpdatePolicy(table.name))).join('\n'),
  )

  await knex.raw(`
    DROP POLICY IF EXISTS profile_sel_policy ON profile;

    CREATE POLICY profile_sel_policy ON profile
      FOR SELECT
      USING ("user_id" = current_user_id() OR current_user_is_admin());
    `)

  await knex.raw(tables.map((table) => enableRls(table.name)).join('\n'))
}
