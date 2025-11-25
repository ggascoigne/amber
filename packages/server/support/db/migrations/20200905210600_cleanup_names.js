import { toFix } from '../../../../../name_cleanup.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(`
    UPDATE "user"
    SET
      first_name = ARRAY_TO_STRING(ary[1:len - 1], ' '),
      last_name = ary[len]
    FROM
      (
        SELECT
          id,
          ary,
          ARRAY_LENGTH(ary, 1) AS len
        FROM
          (
            SELECT
              id,
              REGEXP_SPLIT_TO_ARRAY(full_name, E'\\\\s+') AS ary
            FROM
              "user"
          ) sub1
      ) sub2
    WHERE
      sub2.id = "user".id
    `)

  await Promise.allSettled(
    toFix.map(async (u) => {
      if (u.full)
        await knex.raw(`
          UPDATE "user"
          SET 
            first_name = '${u.first}', 
            last_name = '${u.last}', 
            full_name = '${u.full}' 
          WHERE "user".id=${u.id}
          `)
      else
        await knex.raw(`
          UPDATE "user" 
          SET 
            first_name = '${u.first}',
            last_name = '${u.last}'
          WHERE "user".id=${u.id}
          `)
    }),
  )
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
