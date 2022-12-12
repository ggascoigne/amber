exports.up = async function (knex) {
  await knex.raw(`
			create or replace function memb_check_room_avail()
			returns trigger as $$
			declare
				number_already_allocated integer;
				number_available integer;
			begin
				select into number_already_allocated
					count(*) from membership
					where membership.year = new.year
					and membership.hotel_room_id = new.hotel_room_id
					and membership.id != new.id;
				
				select into number_available
					quantity from hotel_room
					where hotel_room.id = new.hotel_room_id;
				
				if (number_available - number_already_allocated) < 1
				then
					raise exception 'All rooms of that type are sold out, please choose another room type.';
				end if;
				
				return new;
			end;
			$$ language plpgsql;
		`)

  await knex.raw(`
			drop trigger if exists memb_check_room_avail_trigger on membership;
		`)

  await knex.raw(`
		create trigger memb_check_room_avail_trigger
			before insert or update on membership
			for each row execute procedure memb_check_room_avail();
	`)
}

exports.down = async function (knex) {}
