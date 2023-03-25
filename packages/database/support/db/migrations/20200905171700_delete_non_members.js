exports.up = function (knex) {
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

exports.down = function (knex) {}
