const toFix = require('../../../name_cleanup')

exports.up = async function (knex) {
  await knex.raw(`
                  update "user"
                  set first_name = array_to_string(ary[1:len - 1], ' '),
                      last_name = ary[len]
                  from (
                           select id, ary, array_length(ary, 1) as len
                           from (
                                    select id, regexp_split_to_array(full_name, E'\\\\s+') as ary
                                    from "user"
                                ) sub1
                       ) sub2
                  where sub2.id = "user".id
              `)

  await Promise.all(
    toFix.map(async (u) => {
      if (u.full)
        await knex.raw(
          `update "user" set first_name = '${u.first}', last_name = '${u.last}', full_name = '${u.full}' where "user".id=${u.id}`
        )
      else
        await knex.raw(`update "user" set first_name = '${u.first}', last_name = '${u.last}' where "user".id=${u.id}`)
    })
  )
}
