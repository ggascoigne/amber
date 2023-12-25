exports.up = async function (knex) {
  await knex.raw(`
    DROP TRIGGER transactions_update_trigger ON transactions;
  `)

  await knex.raw(`
    DROP FUNCTION update_amount_owed;
  `)

  await knex.schema.table('user', (table) => {
    table.renameColumn('amount_owed', 'balance')
  })

  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_balance()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
          UPDATE "user"
          SET balance = (
            SELECT COALESCE(SUM(amount), 0)
            FROM transactions
            WHERE transactions.user_id = "user".id
          )
          WHERE "user".id = NEW.user_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE "user"
          SET balance = (
            SELECT COALESCE(SUM(amount), 0)
            FROM transactions
            WHERE transactions.user_id = "user".id
          )
          WHERE "user".id = OLD.user_id;
        END IF;
        
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
	`)

  await knex.raw(`
    CREATE TRIGGER transactions_update_trigger
      AFTER INSERT OR UPDATE OR DELETE
      ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION update_balance();
  `)
}

exports.down = function (knex) {
  // no revert
}
