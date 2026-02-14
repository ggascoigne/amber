/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  // create a stored procedure that can be used to quickly drop all data - used for a fast cleanup in tests
  return knex.schema.raw(`
    CREATE OR REPLACE FUNCTION f_truncate_tables(_username TEXT)
    RETURNS VOID AS
    $func$
    BEGIN
      EXECUTE
    (SELECT 'TRUNCATE TABLE '
      || string_agg(format('%I.%I', schemaname, tablename), ', ')
      || ' CASCADE'
      FROM   pg_tables
      WHERE  tableowner = _username
      AND    schemaname = 'public'
      );
    END
    $func$ LANGUAGE plpgsql;
    `)
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
