exports.up = async function (knex) {
  await knex.raw(`alter table game_assignment drop constraint game_assignment_game_id_foreign`)
  await knex.raw(`
    alter table game_assignment
      add constraint game_assignment_game_id_foreign foreign key (game_id)
      references game (id) match simple
      on delete cascade
    `)
}

exports.down = async function (knex) {}
