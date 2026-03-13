import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE room
    ADD COLUMN IF NOT EXISTS enabled BOOLEAN;
  `)

  await knex.raw(`
    UPDATE room
    SET enabled = TRUE
    WHERE enabled IS NULL;
  `)

  await knex.raw(`
    ALTER TABLE room
    ALTER COLUMN enabled SET DEFAULT TRUE;
  `)

  await knex.raw(`
    ALTER TABLE room
    ALTER COLUMN enabled SET NOT NULL;
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // Forward-only migration.
}
