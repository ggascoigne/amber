exports.up = function (knex) {
  return knex.raw(`
  delete from "user" where id in (select u.id from "user" u
  left join membership m on u.id = m.user_id
  where user_id is null)
  `)
}

exports.down = function (knex) {}
