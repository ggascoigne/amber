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
  { name: 'user_role', admin: true }
]

// protect the user column from causing syntax errors
const q = name => (name === 'user' ? '"user"' : name)

const anyUserUpdatePolicy = table => `
  create policy ${table}_sel_policy on ${q(table)}
    for select
    using (true);
  create policy ${table}_mod_policy on ${q(table)}
    using (current_user_id() != null);
  `

const adminUpdatePolicy = table => `
  create policy ${table}_sel_policy on ${q(table)}
    for select
    using (true);
  create policy ${table}_mod_policy on ${q(table)}
    using (current_user_is_admin());
  `

exports.up = async function(knex) {
  await knex.raw(
    tables.map(table => (table.admin ? adminUpdatePolicy(table.name) : anyUserUpdatePolicy(table.name))).join('\n')
  )
}

exports.down = async function(knex) {
  await knex.raw(
    tables
      .map(
        table =>
          `
            drop policy if exists ${table.name}_sel_policy on ${q(table.name)};
            drop policy if exists ${table.name}_mod_policy on ${q(table.name)};
          `
      )
      .join('\n')
  )
}
