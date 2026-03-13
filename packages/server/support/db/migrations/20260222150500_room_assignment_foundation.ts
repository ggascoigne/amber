import { processEnv, parsePostgresConnectionString } from '@amber/environment/dotenv'
import type { Knex } from 'knex'

import { adminUpdatePolicy, anyUserUpdatePolicy, dropPolicies, enableRls, fixGrants } from '../utils/policyUtils'

const env = processEnv()

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_accessibility') THEN
        CREATE TYPE room_accessibility AS ENUM ('accessible', 'some_stairs', 'many_stairs');
      END IF;
    END;
    $$;
  `)

  await knex.raw(`
    ALTER TABLE room
    ADD COLUMN IF NOT EXISTS accessibility room_accessibility NOT NULL DEFAULT 'accessible';
  `)

  await knex.raw(`
    ALTER TABLE profile
    ADD COLUMN IF NOT EXISTS room_accessibility_preference room_accessibility NOT NULL DEFAULT 'many_stairs';
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS game_room_assignment (
      id BIGSERIAL PRIMARY KEY,
      game_id INTEGER NOT NULL REFERENCES game(id) ON DELETE CASCADE ON UPDATE NO ACTION,
      room_id INTEGER NOT NULL REFERENCES room(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      slot_id INTEGER NOT NULL REFERENCES slot(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      year INTEGER NOT NULL,
      is_override BOOLEAN NOT NULL DEFAULT FALSE,
      source VARCHAR(10) NOT NULL DEFAULT 'manual',
      assigned_by_user_id INTEGER NULL REFERENCES "user"(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT game_room_assignment_source_check CHECK (source IN ('manual', 'auto')),
      CONSTRAINT game_room_assignment_unique_row UNIQUE (game_id, room_id, slot_id, year, is_override)
    );
  `)

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS game_room_assignment_single_default_game_index
    ON game_room_assignment (game_id, slot_id, year)
    WHERE is_override = FALSE;
  `)

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS game_room_assignment_single_default_room_index
    ON game_room_assignment (room_id, slot_id, year)
    WHERE is_override = FALSE;
  `)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS game_room_assignment_room_id_index
    ON game_room_assignment (room_id);
  `)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS game_room_assignment_slot_id_index
    ON game_room_assignment (slot_id);
  `)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS game_room_assignment_year_slot_id_index
    ON game_room_assignment (year, slot_id);
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS room_slot_availability (
      room_id INTEGER NOT NULL REFERENCES room(id) ON DELETE CASCADE ON UPDATE NO ACTION,
      slot_id INTEGER NOT NULL REFERENCES slot(id) ON DELETE CASCADE ON UPDATE NO ACTION,
      year INTEGER NOT NULL,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (room_id, slot_id, year)
    );
  `)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS room_slot_availability_year_slot_id_index
    ON room_slot_availability (year, slot_id);
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS member_room_assignment (
      member_id INTEGER NOT NULL REFERENCES membership(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      room_id INTEGER NOT NULL REFERENCES room(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      year INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (member_id, year)
    );
  `)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS member_room_assignment_room_id_index
    ON member_room_assignment (room_id);
  `)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS member_room_assignment_year_index
    ON member_room_assignment (year);
  `)

  await knex.raw(`
    WITH ranked_games AS (
      SELECT
        g.id AS game_id,
        g.room_id,
        g.slot_id,
        g.year,
        ROW_NUMBER() OVER (
          PARTITION BY g.room_id, g.slot_id, g.year
          ORDER BY g.id
        ) AS room_slot_rank
      FROM game g
      WHERE g.room_id IS NOT NULL
        AND g.slot_id IS NOT NULL
        AND g.year > 0
    )
    INSERT INTO game_room_assignment (
      game_id,
      room_id,
      slot_id,
      year,
      is_override,
      source
    )
    SELECT
      ranked_games.game_id,
      ranked_games.room_id,
      ranked_games.slot_id,
      ranked_games.year,
      ranked_games.room_slot_rank > 1,
      'manual'
    FROM ranked_games
    ON CONFLICT ON CONSTRAINT game_room_assignment_unique_row DO NOTHING;
  `)

  await knex.raw(`
    WITH years AS (
      SELECT DISTINCT year
      FROM game
      WHERE year > 0
      UNION
      SELECT DISTINCT year
      FROM membership
      WHERE year > 0
      UNION
      SELECT DISTINCT year
      FROM game_assignment
      WHERE year > 0
      UNION
      SELECT DISTINCT year
      FROM game_choice
      WHERE year > 0
    )
    INSERT INTO room_slot_availability (
      room_id,
      slot_id,
      year,
      is_available
    )
    SELECT
      room.id,
      slot.id,
      years.year,
      TRUE
    FROM years
    CROSS JOIN room
    CROSS JOIN slot
    ON CONFLICT (room_id, slot_id, year) DO NOTHING;
  `)

  await knex.raw(dropPolicies('game_room_assignment'))
  await knex.raw(dropPolicies('room_slot_availability'))
  await knex.raw(dropPolicies('member_room_assignment'))

  await knex.raw(anyUserUpdatePolicy('game_room_assignment'))
  await knex.raw(adminUpdatePolicy('room_slot_availability'))
  await knex.raw(adminUpdatePolicy('member_room_assignment'))

  await knex.raw(enableRls('game_room_assignment'))
  await knex.raw(enableRls('room_slot_availability'))
  await knex.raw(enableRls('member_room_assignment'))

  const { user } = parsePostgresConnectionString(env.DATABASE_URL)
  if (!user) {
    throw new Error('No user found in connection string')
  }
  await knex.raw(fixGrants(user))
}

export async function down(_knex: Knex): Promise<void> {
  // Forward-only migration.
}
