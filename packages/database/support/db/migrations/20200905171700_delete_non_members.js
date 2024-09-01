export async function up(knex) {
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

// eslint-disable-next-line no-empty-function
export async function down(knex) {}
