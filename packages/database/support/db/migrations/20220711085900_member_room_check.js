/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION memb_check_room_avail () RETURNS TRIGGER AS $$
    DECLARE
      number_already_allocated INTEGER;
      number_available INTEGER;
    BEGIN
      SELECT INTO number_already_allocated COUNT(*)
      FROM
        membership
      WHERE
        membership.year = NEW.year
        AND membership.hotel_room_id = NEW.hotel_room_id
        AND membership.id != NEW.id;

      SELECT INTO number_available quantity
      FROM
        hotel_room
      WHERE
        hotel_room.id = NEW.hotel_room_id;

      IF (number_available - number_already_allocated) < 1 THEN 
        raise exception 'All rooms of that type are sold out, please choose another room type.';
      END IF;

      RETURN new;
    END;
    $$ LANGUAGE plpgsql;
	`)

  await knex.raw(`
    DROP TRIGGER IF EXISTS memb_check_room_avail_trigger ON membership
		`)

  await knex.raw(`
    CREATE TRIGGER memb_check_room_avail_trigger BEFORE INSERT
    OR
    UPDATE ON membership FOR EACH ROW
    EXECUTE PROCEDURE memb_check_room_avail ()
    `)
}
