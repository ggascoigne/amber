exports.up = async function (knex) {
  await knex.raw(`
      CREATE OR REPLACE FUNCTION slot_gm_game (member_id INTEGER, slot_id INTEGER, yearNo INTEGER) RETURNS INTEGER AS $$
      DECLARE
        game_id integer := 0;
      BEGIN
        SELECT
          ga.game_id INTO game_id
        FROM
          game_assignment ga
          JOIN game g ON g.id = ga.game_id
        WHERE
          g.slot_id IS NOT NULL
          AND ga.gm != 0
          AND ga.year = $3
          AND ga.member_id = $1
          AND g.slot_id = $2;
        RETURN game_id;
      END
      $$ LANGUAGE plpgsql;
      `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_bare_slot_choices (member_id INTEGER, yearNo INTEGER) RETURNS void AS $$
    DECLARE
      has_rows integer;
      slot_id integer;
      rank integer;
      game_id integer;
    BEGIN
      SELECT
        COUNT(*) INTO has_rows
      FROM
        game_choice gc
      WHERE
        gc.year = $2
        AND gc.member_id = $1;

      IF has_rows != 0 
        THEN RETURN;
      END IF;
      FOR slot_id in 1..7 LOOP
        FOR rank in 0..4 LOOP
          IF RANK = 0 THEN
            SELECT
              * INTO game_id
            FROM
              slot_gm_game ($1, slot_id, $2);
          ELSE 
            game_id = NULL;
          END IF;

          INSERT INTO
            game_choice (game_id, member_id, RANK, slot_id, "year", returning_player)
          VALUES
            (game_id, $1, RANK, slot_id, $2, FALSE);

        END LOOP;
      END LOOP;
    END;
    $$ LANGUAGE plpgsql;
    `)
}

exports.down = async function (knex) {}
