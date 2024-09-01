export async function up(knex) {
  return knex.schema.table('game', (table) => {
    table.boolean('full').defaultTo(false)
  })
}

// eslint-disable-next-line no-empty-function
export async function down(knex) {}
