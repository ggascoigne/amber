export async function up(knex) {
  return knex.schema.table('membership', (table) => {
    table.string('slots_attending', 20).defaultTo(null)
  })
}

// eslint-disable-next-line no-empty-function
export async function down(knex) {}
