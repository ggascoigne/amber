export async function up(knex) {
  return knex.schema.table('user', (table) => {
    table.string('display_name', 40).defaultTo(null)
  })
}
