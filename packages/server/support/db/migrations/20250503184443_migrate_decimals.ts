import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Convert lookup_value.numeric_sequencer from decimal to float
  await knex.raw(`
    ALTER TABLE lookup_value
    ALTER COLUMN numeric_sequencer TYPE float
    USING numeric_sequencer::float;
  `)

  // Convert transactions.amount from decimal to float
  await knex.raw(`
    ALTER TABLE transactions
    ALTER COLUMN amount TYPE float
    USING amount::float;
  `)

  // Convert user.amount_owed from decimal to float
  await knex.raw(`
    ALTER TABLE "user"
    ALTER COLUMN balance TYPE float
    USING balance::float;
  `)
}

export async function down(knex: Knex): Promise<void> {
  // Revert lookup_value.numeric_sequencer back to decimal
  await knex.raw(`
    ALTER TABLE lookup_value
    ALTER COLUMN numeric_sequencer TYPE decimal
    USING numeric_sequencer::decimal;
  `)

  // Revert transactions.amount back to decimal
  await knex.raw(`
    ALTER TABLE transactions
    ALTER COLUMN amount TYPE decimal
    USING amount::decimal;
  `)

  // Revert user.amount_owed back to decimal
  await knex.raw(`
    ALTER TABLE "user"
    ALTER COLUMN balance TYPE decimal
    USING balance::decimal;
  `)
}
