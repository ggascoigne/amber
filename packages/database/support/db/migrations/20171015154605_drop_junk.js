// drop a batch if stuff that I either don't care about or plan on handling
// differently this time around
//
// specifically the version, date_created and last_updated are hibernate traces,
// the dropped tables are application data rather than domain data and will just
// be handled a different way

export async function up(knex) {
  return knex.schema
    .dropTableIfExists('async_mail_attachment')
    .dropTableIfExists('async_mail_bcc')
    .dropTableIfExists('async_mail_cc')
    .dropTableIfExists('async_mail_header')
    .dropTableIfExists('async_mail_mess')
    .dropTableIfExists('async_mail_to')
    .dropTableIfExists('databasechangelog')
    .dropTableIfExists('databasechangeloglock')
    .dropTableIfExists('email_code')
    .table('game', (table) => {
      table.dropColumn('version')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('game_assignment', (table) => {
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('game_choice', (table) => {
      table.dropColumn('version')
    })
    .table('game_submission', (table) => {
      table.dropColumn('version')
      table.dropColumn('date_created')
    })
    .table('hotel_room', (table) => {
      table.dropColumn('version')
    })
    .dropTableIfExists('login_record')
    .table('lookup', (table) => {
      table.dropColumn('version')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('lookup_value', (table) => {
      table.dropColumn('version')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('membership', (table) => {
      table.dropColumn('version')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('profile', (table) => {
      table.dropColumn('version')
      table.dropColumn('email_hash')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('registration_code', (table) => {
      table.dropColumn('date_created')
    })
    .table('role', (table) => {
      table.dropColumn('version')
    })
    .table('room', (table) => {
      table.dropColumn('version')
    })
    .table('setting', (table) => {
      table.dropColumn('version')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
    .table('shirt_order', (table) => {
      table.dropColumn('version')
    })
    .table('shirt_order_item', (table) => {
      table.dropColumn('version')
    })
    .table('slot', (table) => {
      table.dropColumn('version')
    })
    .table('user', (table) => {
      table.dropColumn('version')
      table.dropColumn('action_hash')
      table.dropColumn('account_expired')
      table.dropColumn('password_expired')
      table.dropColumn('date_created')
      table.dropColumn('last_updated')
    })
}

// eslint-disable-next-line no-empty-function
export async function down(knex) {
  // there's no rolling this back!
}
