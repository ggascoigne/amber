import { env, parsePostgresConnectionString } from '@amber/environment'

import { anyUserUpdatePolicy, enableRls, fixGrants } from '../utils/policyUtils.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable('transactions', (table) => {
    table.bigIncrements().primary()
    table.integer('user_id', 20).notNullable().references('user.id').unsigned().index()
    table.integer('member_id', 20).references('membership.id').unsigned().index()
    table.integer('year').notNullable()
    table.dateTime('timestamp').notNullable().defaultTo(knex.fn.now())
    table.decimal('amount').notNullable()
    table.integer('origin', 255).references('user.id').unsigned().index()
    table.boolean('stripe').notNullable().defaultTo(false)
    table.string('notes', 1044).notNullable().defaultTo('')
    table.jsonb('data').notNullable()
  })

  await knex.raw(anyUserUpdatePolicy('transactions'))
  await knex.raw(enableRls('transactions'))

  await knex.schema.table('membership', (table) => {
    table.dropColumn('amount_owed')
    table.dropColumn('amount_paid')
  })

  await knex.schema.table('user', (table) => {
    table.decimal('amount_owed').notNullable().defaultTo(0)
  })

  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_amount_owed()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
          UPDATE "user"
          SET amount_owed = (
            SELECT COALESCE(SUM(amount), 0)
            FROM transactions
            WHERE transactions.user_id = "user".id
          )
          WHERE "user".id = NEW.user_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE "user"
          SET amount_owed = (
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
      EXECUTE FUNCTION update_amount_owed();
  `)

  await knex.schema.createTable('stripe', (table) => {
    table.increments().primary()
    table.jsonb('data').notNullable()
  })

  await knex.raw(anyUserUpdatePolicy('stripe'))
  await knex.raw(enableRls('stripe'))

  const { user } = parsePostgresConnectionString(env.DATABASE_URL)
  if (!user) {
    throw new Error('No user found in connection string')
  }
  await knex.raw(fixGrants(user))
}
