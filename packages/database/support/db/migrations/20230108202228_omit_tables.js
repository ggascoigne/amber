exports.up = async function (knex) {
  await knex.schema.dropTableIfExists('knex_migrations_lock')

  await knex.raw(`
    COMMENT ON TABLE knex_migrations IS E'@omit';
    `)
}

exports.down = async function (knex) {}
