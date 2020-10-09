exports.up = async function (knex) {
  await knex.raw(`
      create or replace function slot_gm_game( member_id integer, slot_id integer, yearNo integer )
      returns integer as $$
      declare
        game_id integer := 0;
      begin
        select ga.game_id into game_id
        from game_assignment ga
          join game g on g.id = ga.game_id
          where g.slot_id is not null and ga.gm != 0 and ga.year = $3 and ga.member_id = $1 and g.slot_id = $2;
      
        return game_id;
      end
      $$ language plpgsql;
    `)

  await knex.raw(`
      create or replace function create_bare_slot_choices( member_id integer, yearNo integer )
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
        for slot_id in 1..7 loop
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
