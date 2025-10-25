import { env, parsePostgresConnectionString } from '@amber/environment'
import type { Knex } from 'knex'

import { fixGrants } from '../utils/policyUtils'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_user_balance()
      RETURNS TRIGGER AS $$
      DECLARE
        affected_user_id INTEGER;
      BEGIN
        -- Determine which user_id to update
        IF TG_OP = 'DELETE' THEN
          affected_user_id := OLD.user_id;
        ELSE
          affected_user_id := NEW.user_id;
        END IF;

        -- Update the user's balance
        UPDATE "user"
        SET balance = (
          SELECT COALESCE(SUM(amount), 0)
          FROM transactions
          WHERE transactions.user_id = affected_user_id
        )
        WHERE "user".id = affected_user_id;

        -- Return appropriate record
        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        ELSE
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
  `)

  // Drop old triggers
  await knex.raw(`
    DROP TRIGGER IF EXISTS transactions_collect_trigger ON transactions;
    DROP TRIGGER IF EXISTS transactions_update_trigger ON transactions;
  `)

  // Create single row-level trigger
  await knex.raw(`
    CREATE TRIGGER transactions_balance_update_trigger
      AFTER INSERT OR UPDATE OR DELETE
      ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION update_user_balance();
  `)

  // Drop old functions
  await knex.raw(`
    DROP FUNCTION IF EXISTS collect_affected_users();
    DROP FUNCTION IF EXISTS update_balance();
  `)

  const { user } = parsePostgresConnectionString(env.DATABASE_URL)
  if (!user) {
    throw new Error('No user found in connection string')
  }
  await knex.raw(fixGrants(user))
}

export async function down(_knex: Knex): Promise<void> {
  // No down migration
}
