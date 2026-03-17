import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE game_room_assignment
    ADD COLUMN IF NOT EXISTS assignment_reason TEXT NULL;
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // Forward-only migration.
}
