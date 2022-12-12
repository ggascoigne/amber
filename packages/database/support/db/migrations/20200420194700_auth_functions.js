exports.up = async function (knex) {
  await knex.raw(`
    create function current_user_id() returns integer as $$
      select nullif(current_setting('user.id', true), '')::integer;
    $$ language sql stable;
    create function current_user_is_admin() returns boolean as $$
      select nullif(current_setting('user.admin', true), '')::boolean;
    $$ language sql stable;
  `)
}

exports.down = async function (knex) {
  await knex.raw(`
    drop function current_user_id;
    drop function current_user_is_admin;
  `)
}
