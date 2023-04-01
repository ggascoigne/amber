exports.up = async function (knex) {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION add_default_role()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL  
      AS
    $$
    BEGIN
      INSERT INTO
        user_role (role_id, user_id) (
          SELECT
            id,
            NEW.id
          FROM
            "role"
          WHERE
            authority = 'ROLE_USER'
        );
      RETURN NEW;
    END;
    $$;
    
    CREATE TRIGGER default_role
    AFTER INSERT ON "user" FOR EACH ROW
    EXECUTE PROCEDURE add_default_role ();
  `)
}

exports.down = async function (knex) {}
