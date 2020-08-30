exports.up = async function (knex) {
  await knex.raw(`
      CREATE OR REPLACE FUNCTION add_default_role()
        RETURNS TRIGGER 
        LANGUAGE PLPGSQL  
        AS
      $$
      BEGIN
        insert into user_role (role_id, user_id) (select id, NEW.id from "role" where authority = 'ROLE_USER' );
        RETURN NEW;
      END;
      $$;
      
      create trigger default_role after insert on "user" for each row execute procedure add_default_role();
    `)
}

exports.down = async function (knex) {}
