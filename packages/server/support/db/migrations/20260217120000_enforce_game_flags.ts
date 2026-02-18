import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Update flag.allow_game_editing from boolean to perm-gate where it exists as boolean
  await knex.raw(`
    UPDATE setting
    SET type = 'perm-gate',
        value = CASE WHEN value = 'true' THEN 'Yes' ELSE 'No' END
    WHERE code = 'flag.allow_game_editing'
      AND type = 'boolean';
  `)

  // Insert flag.allow_game_editing if it doesn't exist
  await knex.raw(`
    INSERT INTO setting (code, type, value)
    SELECT 'flag.allow_game_editing', 'perm-gate', 'No'
    WHERE NOT EXISTS (
      SELECT 1 FROM setting WHERE code = 'flag.allow_game_editing'
    );
  `)

  // Insert flag.allow_game_submission if it doesn't exist
  await knex.raw(`
    INSERT INTO setting (code, type, value)
    SELECT 'flag.allow_game_submission', 'perm-gate', 'No'
    WHERE NOT EXISTS (
      SELECT 1 FROM setting WHERE code = 'flag.allow_game_submission'
    );
  `)

  // Delete legacy allow_game_submission (without flag. prefix) if it exists
  await knex.raw(`
    DELETE FROM setting
    WHERE code = 'allow_game_submission';
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // Forward-only migration: the deleted legacy row and newly inserted rows
  // cannot be reliably reversed without knowing the prior state of each environment.
  // These flags were not checked by any code before this change, so not reverting them is safe.
}
