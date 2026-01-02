import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // turns out that because we reuse the no game entries across years, we have ot add year to the PK

  await knex.raw(`
    ALTER TABLE game_assignment
    DROP CONSTRAINT game_assignment_pkey;
  `)
  await knex.raw(`
    ALTER TABLE game_assignment
    ADD PRIMARY KEY (member_id, game_id, gm, year);
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // No down migration
}
