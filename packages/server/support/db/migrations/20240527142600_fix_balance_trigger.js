import { env, parsePostgresConnectionString } from '@amber/environment/dotenv'

import { fixGrants } from '../utils/policyUtils.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION collect_affected_users()
      RETURNS TRIGGER AS $$
      BEGIN
        CREATE TEMP TABLE IF NOT EXISTS temp_affected_users (
          user_id INT PRIMARY KEY
        ) ON COMMIT DROP;

        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
          INSERT INTO temp_affected_users (user_id)
          VALUES (NEW.user_id)
          ON CONFLICT (user_id) DO NOTHING;
          RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO temp_affected_users (user_id)
          VALUES (OLD.user_id)
          ON CONFLICT (user_id) DO NOTHING;
          RETURN OLD;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;	
  `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_balance()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE "user"
        SET balance = (
          SELECT COALESCE(SUM(amount), 0)
          FROM transactions
          WHERE transactions.user_id = "user".id
        )
        WHERE "user".id IN (SELECT user_id FROM temp_affected_users);
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
  `)

  await knex.raw(`
      DROP TRIGGER IF EXISTS transactions_collect_trigger ON transactions
  `)

  await knex.raw(`
    CREATE TRIGGER transactions_collect_trigger
      BEFORE INSERT OR UPDATE OR DELETE
      ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION collect_affected_users();
  `)

  await knex.raw(`
      DROP TRIGGER IF EXISTS transactions_update_trigger ON transactions
  `)

  await knex.raw(`
    CREATE TRIGGER transactions_update_trigger
      AFTER INSERT OR UPDATE OR DELETE
      ON transactions
      FOR EACH STATEMENT
      EXECUTE FUNCTION update_balance();
  `)

  const { user } = parsePostgresConnectionString(env.DATABASE_URL)
  if (!user) {
    throw new Error('No user found in connection string')
  }
  await knex.raw(fixGrants(user))
}
