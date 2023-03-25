exports.up = async function (knex) {
  await knex.raw(`
      drop function if exists create_bare_slot_choices( member_id integer, yearNo integer );
    `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_bare_slot_choices (member_id INTEGER, year_no INTEGER, no_slots INTEGER) RETURNS void AS $$
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

      IF has_rows != 0 THEN RETURN;
      END IF;
      FOR slot_id IN 1..$3 LOOP
        FOR rank IN 0..4 LOOP
          IF RANK = 0 THEN
          SELECT
            * INTO game_id
          FROM
            slot_gm_game ($1, slot_id, $2);
          ELSE game_id = NULL;
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
