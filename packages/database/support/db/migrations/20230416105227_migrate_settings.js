exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE setting
    ALTER COLUMN "type"
    TYPE VARCHAR(15);
    `)

  await knex.raw(`
    UPDATE setting
    SET
    TYPE = 'perm-gate'
    WHERE
    TYPE = 'integer';
    `)

  const renames = [
    { from: 'send.admin.email', to: 'send_admin_email' },
    { from: 'display.game.book', to: 'display_gamebook' },
    { from: 'display.game.signup', to: 'allow_game_signup' },
    { from: 'allow.registrations', to: 'allow_registration' },
    { from: 'display.schedule', to: 'display_schedule' },
    { from: 'display.test.warning', to: 'is_beta' },
    { from: 'display.virtual.details', to: 'display_virtual_details' },
    { from: 'use.detail.room.quantities', to: 'dev_use_detail_rome_quantities' },
  ]

  for await (const val of renames) {
    await knex.raw(`
      UPDATE setting
      SET
      CODE = '${val.to}'
      WHERE
      CODE = '${val.from}';
      `)
  }

  const removes = ['allow.game.signup.edit', 'display.teeShirt.order', 'allow.teeShirt.edit']

  for await (const val of removes) {
    await knex.raw(`
      DELETE FROM setting
      WHERE
      CODE = '${val}';
      `)
  }
}

exports.down = async function (knex) {}
