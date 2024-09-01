export async function up(knex) {
  return knex.schema.table('hotel_room', (table) => {
    table.renameColumn('type', 'bathroom_type')
  })
}

export async function down(knex) {
  // no revert
}
