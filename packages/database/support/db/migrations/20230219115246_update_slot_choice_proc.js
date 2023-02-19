exports.up = async function (knex) {
  await knex.raw(`
      drop function if exists create_bare_slot_choices( member_id integer, yearNo integer );
    `)

  await knex.raw(`
      create or replace function create_bare_slot_choices( member_id integer, year_no integer, no_slots integer )
        returns void as $$
        declare
          has_rows integer;
          slot_id integer;
          rank integer;
          game_id integer;
        begin
          select count(*) into has_rows from game_choice gc
            where gc.year = $2 and gc.member_id = $1;
          if has_rows != 0 then
            return;
          end if;
          for slot_id in 1..$3 loop
            for rank in 0..4 loop
              if rank = 0 then
                select * into game_id from slot_gm_game( $1, slot_id, $2);
              else
                game_id = null;
              end if;
              insert into game_choice(game_id, member_id, rank, slot_id, "year", returning_player)
                values (game_id, $1, rank, slot_id, $2, false);
            end loop;
          end loop;
        end;
        $$ language plpgsql;
    `)
}

exports.down = async function (knex) {}
