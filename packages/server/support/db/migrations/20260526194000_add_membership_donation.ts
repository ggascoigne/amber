import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('membership', (table) => {
    table.double('donation').notNullable().defaultTo(0)
  })
}

export async function down(_knex: Knex): Promise<void> {
  // No down migration
}
