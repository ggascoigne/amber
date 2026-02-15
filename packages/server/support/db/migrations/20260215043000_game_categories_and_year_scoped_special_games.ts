import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_category') THEN
        CREATE TYPE game_category AS ENUM ('user', 'no_game', 'any_game');
      END IF;
    END;
    $$;
  `)

  await knex.raw(`
    ALTER TABLE game
    ADD COLUMN IF NOT EXISTS category game_category NOT NULL DEFAULT 'user';
  `)

  await knex.raw(`
    UPDATE game
    SET category = 'no_game'::game_category
    WHERE year = 0
      AND slot_id IS NOT NULL;
  `)

  await knex.raw(`
    UPDATE game
    SET category = 'any_game'::game_category
    WHERE year = 0
      AND slot_id IS NULL;
  `)

  // Catch already year-scoped rows that may have special names but defaulted to 'user'.
  await knex.raw(`
    UPDATE game
    SET category = 'no_game'::game_category
    WHERE category = 'user'::game_category
      AND slot_id IS NOT NULL
      AND lower(trim(name)) = 'no game';
  `)

  await knex.raw(`
    UPDATE game
    SET category = 'any_game'::game_category
    WHERE category = 'user'::game_category
      AND slot_id IS NULL
      AND lower(trim(name)) = 'any game';
  `)

  await knex.raw(`
    WITH years AS (
      SELECT DISTINCT year FROM game WHERE year > 0
      UNION
      SELECT DISTINCT year FROM membership WHERE year > 0
      UNION
      SELECT DISTINCT year FROM game_assignment WHERE year > 0
      UNION
      SELECT DISTINCT year FROM game_choice WHERE year > 0
    ),
    no_game_templates AS (
      SELECT DISTINCT ON (g.slot_id)
        g.slot_id,
        g.description,
        g.late_finish,
        g.late_start,
        g.name,
        g.player_max,
        g.player_min,
        g.room_id,
        g.short_name,
        g.char_instructions,
        g.estimated_length,
        g.game_contact_email,
        g.genre,
        g.gm_names,
        g.message,
        g.player_preference,
        g.players_contact_gm,
        g.returning_players,
        g.setting,
        g.slot_conflicts,
        g.slot_preference,
        g.teen_friendly,
        g.type,
        g.author_id,
        g."full" AS full_value
      FROM game g
      WHERE g.category = 'no_game'::game_category
        AND g.slot_id IS NOT NULL
      ORDER BY g.slot_id, g.year ASC, g.id ASC
    ),
    fallback_no_game AS (
      SELECT
        source.description,
        source.late_finish,
        source.late_start,
        source.name,
        source.player_max,
        source.player_min,
        source.room_id,
        source.short_name,
        source.char_instructions,
        source.estimated_length,
        source.game_contact_email,
        source.genre,
        source.gm_names,
        source.message,
        source.player_preference,
        source.players_contact_gm,
        source.returning_players,
        source.setting,
        source.slot_conflicts,
        source.slot_preference,
        source.teen_friendly,
        source.type,
        source.author_id,
        source.full_value
      FROM (
        SELECT
          g.description,
          g.late_finish,
          g.late_start,
          g.name,
          g.player_max,
          g.player_min,
          g.room_id,
          g.short_name,
          g.char_instructions,
          g.estimated_length,
          g.game_contact_email,
          g.genre,
          g.gm_names,
          g.message,
          g.player_preference,
          g.players_contact_gm,
          g.returning_players,
          g.setting,
          g.slot_conflicts,
          g.slot_preference,
          g.teen_friendly,
          g.type,
          g.author_id,
          g."full" AS full_value
        FROM game g
        WHERE g.category = 'no_game'::game_category
          AND g.slot_id IS NOT NULL
        ORDER BY g.year ASC, g.id ASC
        LIMIT 1
      ) source
      UNION ALL
      SELECT
        'I am taking this slot off.',
        FALSE,
        NULL,
        'No Game',
        999,
        0,
        NULL,
        NULL,
        '',
        'n/a',
        '',
        'other',
        NULL,
        '',
        'Any',
        FALSE,
        '',
        '',
        '',
        0,
        TRUE,
        'Other',
        NULL,
        FALSE
      WHERE NOT EXISTS (
        SELECT 1
        FROM game existing
        WHERE existing.category = 'no_game'::game_category
          AND existing.slot_id IS NOT NULL
      )
    ),
    template_rows AS (
      SELECT
        s.id AS slot_id,
        COALESCE(ng.description, fallback_no_game.description, 'I am taking this slot off.') AS description,
        COALESCE(ng.late_finish, fallback_no_game.late_finish, FALSE) AS late_finish,
        COALESCE(ng.late_start, fallback_no_game.late_start, NULL) AS late_start,
        COALESCE(ng.name, fallback_no_game.name, 'No Game') AS name,
        COALESCE(ng.player_max, fallback_no_game.player_max, 999) AS player_max,
        COALESCE(ng.player_min, fallback_no_game.player_min, 0) AS player_min,
        COALESCE(ng.room_id, fallback_no_game.room_id, NULL) AS room_id,
        COALESCE(ng.short_name, fallback_no_game.short_name, NULL) AS short_name,
        COALESCE(ng.char_instructions, fallback_no_game.char_instructions, '') AS char_instructions,
        COALESCE(ng.estimated_length, fallback_no_game.estimated_length, 'n/a') AS estimated_length,
        COALESCE(ng.game_contact_email, fallback_no_game.game_contact_email, '') AS game_contact_email,
        COALESCE(ng.genre, fallback_no_game.genre, 'other') AS genre,
        COALESCE(ng.gm_names, fallback_no_game.gm_names, NULL) AS gm_names,
        COALESCE(ng.message, fallback_no_game.message, '') AS message,
        COALESCE(ng.player_preference, fallback_no_game.player_preference, 'Any') AS player_preference,
        COALESCE(ng.players_contact_gm, fallback_no_game.players_contact_gm, FALSE) AS players_contact_gm,
        COALESCE(ng.returning_players, fallback_no_game.returning_players, '') AS returning_players,
        COALESCE(ng.setting, fallback_no_game.setting, '') AS setting,
        COALESCE(ng.slot_conflicts, fallback_no_game.slot_conflicts, '') AS slot_conflicts,
        COALESCE(ng.slot_preference, fallback_no_game.slot_preference, 0) AS slot_preference,
        COALESCE(ng.teen_friendly, fallback_no_game.teen_friendly, TRUE) AS teen_friendly,
        COALESCE(ng.type, fallback_no_game.type, 'Other') AS type,
        COALESCE(ng.author_id, fallback_no_game.author_id, NULL) AS author_id,
        COALESCE(ng.full_value, fallback_no_game.full_value, FALSE) AS full_value
      FROM slot s
      LEFT JOIN no_game_templates ng ON ng.slot_id = s.id
      CROSS JOIN fallback_no_game
    )
    INSERT INTO game (
      description,
      late_finish,
      late_start,
      name,
      player_max,
      player_min,
      room_id,
      short_name,
      slot_id,
      char_instructions,
      estimated_length,
      game_contact_email,
      genre,
      gm_names,
      message,
      player_preference,
      players_contact_gm,
      returning_players,
      setting,
      slot_conflicts,
      slot_preference,
      teen_friendly,
      type,
      year,
      author_id,
      "full",
      category
    )
    SELECT
      template_rows.description,
      template_rows.late_finish,
      template_rows.late_start,
      template_rows.name,
      template_rows.player_max,
      template_rows.player_min,
      template_rows.room_id,
      template_rows.short_name,
      template_rows.slot_id,
      template_rows.char_instructions,
      template_rows.estimated_length,
      template_rows.game_contact_email,
      template_rows.genre,
      template_rows.gm_names,
      template_rows.message,
      template_rows.player_preference,
      template_rows.players_contact_gm,
      template_rows.returning_players,
      template_rows.setting,
      template_rows.slot_conflicts,
      template_rows.slot_preference,
      template_rows.teen_friendly,
      template_rows.type,
      years.year,
      template_rows.author_id,
      template_rows.full_value,
      'no_game'::game_category
    FROM years
    CROSS JOIN template_rows
    WHERE NOT EXISTS (
      SELECT 1
      FROM game existing
      WHERE existing.year = years.year
        AND existing.slot_id = template_rows.slot_id
        AND existing.category = 'no_game'::game_category
    );
  `)

  await knex.raw(`
    WITH years AS (
      SELECT DISTINCT year FROM game WHERE year > 0
      UNION
      SELECT DISTINCT year FROM membership WHERE year > 0
      UNION
      SELECT DISTINCT year FROM game_assignment WHERE year > 0
      UNION
      SELECT DISTINCT year FROM game_choice WHERE year > 0
    ),
    any_game_template AS (
      SELECT
        source.description,
        source.late_finish,
        source.late_start,
        source.name,
        source.player_max,
        source.player_min,
        source.room_id,
        source.short_name,
        source.char_instructions,
        source.estimated_length,
        source.game_contact_email,
        source.genre,
        source.gm_names,
        source.message,
        source.player_preference,
        source.players_contact_gm,
        source.returning_players,
        source.setting,
        source.slot_conflicts,
        source.slot_preference,
        source.teen_friendly,
        source.type,
        source.author_id,
        source.full_value
      FROM (
        SELECT
          g.description,
          g.late_finish,
          g.late_start,
          g.name,
          g.player_max,
          g.player_min,
          g.room_id,
          g.short_name,
          g.char_instructions,
          g.estimated_length,
          g.game_contact_email,
          g.genre,
          g.gm_names,
          g.message,
          g.player_preference,
          g.players_contact_gm,
          g.returning_players,
          g.setting,
          g.slot_conflicts,
          g.slot_preference,
          g.teen_friendly,
          g.type,
          g.author_id,
          g."full" AS full_value
        FROM game g
        WHERE g.category = 'any_game'::game_category
        ORDER BY g.year ASC, g.id ASC
        LIMIT 1
      ) source
      UNION ALL
      SELECT
        'Assign me to any game in this slot.',
        FALSE,
        NULL,
        'Any Game',
        999,
        0,
        NULL,
        NULL,
        '',
        'n/a',
        '',
        'other',
        NULL,
        '',
        'Any',
        FALSE,
        '',
        '',
        '',
        0,
        TRUE,
        'Other',
        NULL,
        FALSE
      WHERE NOT EXISTS (
        SELECT 1
        FROM game existing
        WHERE existing.category = 'any_game'::game_category
      )
    )
    INSERT INTO game (
      description,
      late_finish,
      late_start,
      name,
      player_max,
      player_min,
      room_id,
      short_name,
      slot_id,
      char_instructions,
      estimated_length,
      game_contact_email,
      genre,
      gm_names,
      message,
      player_preference,
      players_contact_gm,
      returning_players,
      setting,
      slot_conflicts,
      slot_preference,
      teen_friendly,
      type,
      year,
      author_id,
      "full",
      category
    )
    SELECT
      COALESCE(any_game_template.description, 'Assign me to any game in this slot.'),
      COALESCE(any_game_template.late_finish, FALSE),
      COALESCE(any_game_template.late_start, NULL),
      COALESCE(any_game_template.name, 'Any Game'),
      COALESCE(any_game_template.player_max, 999),
      COALESCE(any_game_template.player_min, 0),
      COALESCE(any_game_template.room_id, NULL),
      COALESCE(any_game_template.short_name, NULL),
      NULL,
      COALESCE(any_game_template.char_instructions, ''),
      COALESCE(any_game_template.estimated_length, 'n/a'),
      COALESCE(any_game_template.game_contact_email, ''),
      COALESCE(any_game_template.genre, 'other'),
      COALESCE(any_game_template.gm_names, NULL),
      COALESCE(any_game_template.message, ''),
      COALESCE(any_game_template.player_preference, 'Any'),
      COALESCE(any_game_template.players_contact_gm, FALSE),
      COALESCE(any_game_template.returning_players, ''),
      COALESCE(any_game_template.setting, ''),
      COALESCE(any_game_template.slot_conflicts, ''),
      COALESCE(any_game_template.slot_preference, 0),
      COALESCE(any_game_template.teen_friendly, TRUE),
      COALESCE(any_game_template.type, 'Other'),
      years.year,
      COALESCE(any_game_template.author_id, NULL),
      COALESCE(any_game_template.full_value, FALSE),
      'any_game'::game_category
    FROM years
    CROSS JOIN any_game_template
    WHERE NOT EXISTS (
      SELECT 1
      FROM game existing
      WHERE existing.year = years.year
        AND existing.category = 'any_game'::game_category
    );
  `)

  await knex.raw(`
    WITH assignment_special_remap AS (
      SELECT
        ga.member_id,
        ga.game_id AS old_game_id,
        ga.gm,
        ga.year,
        CASE
          WHEN g.category = 'no_game'::game_category THEN (
            SELECT ng.id
            FROM game ng
            WHERE ng.year = ga.year
              AND ng.slot_id = g.slot_id
              AND ng.category = 'no_game'::game_category
            ORDER BY ng.id ASC
            LIMIT 1
          )
          WHEN g.category = 'any_game'::game_category THEN (
            SELECT ag.id
            FROM game ag
            WHERE ag.year = ga.year
              AND ag.category = 'any_game'::game_category
            ORDER BY ag.id ASC
            LIMIT 1
          )
          ELSE NULL
        END AS new_game_id
      FROM game_assignment ga
      JOIN game g ON g.id = ga.game_id
      WHERE g.category IN ('no_game'::game_category, 'any_game'::game_category)
    )
    INSERT INTO game_assignment (member_id, game_id, gm, year)
    SELECT DISTINCT
      assignment_special_remap.member_id,
      assignment_special_remap.new_game_id,
      assignment_special_remap.gm,
      assignment_special_remap.year
    FROM assignment_special_remap
    WHERE assignment_special_remap.new_game_id IS NOT NULL
    ON CONFLICT (member_id, game_id, gm, year) DO NOTHING;
  `)

  await knex.raw(`
    WITH assignment_special_remap AS (
      SELECT
        ga.member_id,
        ga.game_id AS old_game_id,
        ga.gm,
        ga.year,
        CASE
          WHEN g.category = 'no_game'::game_category THEN (
            SELECT ng.id
            FROM game ng
            WHERE ng.year = ga.year
              AND ng.slot_id = g.slot_id
              AND ng.category = 'no_game'::game_category
            ORDER BY ng.id ASC
            LIMIT 1
          )
          WHEN g.category = 'any_game'::game_category THEN (
            SELECT ag.id
            FROM game ag
            WHERE ag.year = ga.year
              AND ag.category = 'any_game'::game_category
            ORDER BY ag.id ASC
            LIMIT 1
          )
          ELSE NULL
        END AS new_game_id
      FROM game_assignment ga
      JOIN game g ON g.id = ga.game_id
      WHERE g.category IN ('no_game'::game_category, 'any_game'::game_category)
    )
    DELETE FROM game_assignment ga
    USING assignment_special_remap remap
    WHERE ga.member_id = remap.member_id
      AND ga.game_id = remap.old_game_id
      AND ga.gm = remap.gm
      AND ga.year = remap.year
      AND remap.new_game_id IS NOT NULL
      AND remap.new_game_id <> remap.old_game_id;
  `)

  await knex.raw(`
    WITH choice_special_remap AS (
      SELECT
        gc.id AS choice_id,
        gc.game_id AS old_game_id,
        CASE
          WHEN g.category = 'no_game'::game_category THEN (
            SELECT ng.id
            FROM game ng
            WHERE ng.year = gc.year
              AND ng.slot_id = gc.slot_id
              AND ng.category = 'no_game'::game_category
            ORDER BY ng.id ASC
            LIMIT 1
          )
          WHEN g.category = 'any_game'::game_category THEN (
            SELECT ag.id
            FROM game ag
            WHERE ag.year = gc.year
              AND ag.category = 'any_game'::game_category
            ORDER BY ag.id ASC
            LIMIT 1
          )
          ELSE NULL
        END AS new_game_id
      FROM game_choice gc
      JOIN game g ON g.id = gc.game_id
      WHERE gc.game_id IS NOT NULL
        AND g.category IN ('no_game'::game_category, 'any_game'::game_category)
    )
    UPDATE game_choice gc
    SET game_id = remap.new_game_id
    FROM choice_special_remap remap
    WHERE gc.id = remap.choice_id
      AND remap.new_game_id IS NOT NULL
      AND remap.new_game_id <> remap.old_game_id;
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // No down migration
}
