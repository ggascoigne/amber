exports.up = async function (knex) {
  await knex.schema.dropTableIfExists('knex_migrations_lock')

  await knex.raw(`
    comment on table knex_migrations is E'@omit';
  `)
}

exports.down = async function (knex) {}
