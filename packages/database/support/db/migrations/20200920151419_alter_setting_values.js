const toFix = [
  { code: 'allow.game.signup.edit', value: 'No' },
  { code: 'allow.registrations', value: 'Yes' },
  { code: 'allow.teeShirt.edit', value: 'No' },
  { code: 'display.game.book', value: 'No' },
  { code: 'display.game.signup', value: 'No' },
  { code: 'display.schedule', value: 'No' },
  { code: 'display.teeShirt.order', value: 'No' },
  { code: 'send.admin.email', value: 'No' },
]

exports.up = async function (knex) {
  await Promise.allSettled(
    toFix.map(async (u) => {
      await knex.raw(`
        UPDATE setting
        SET
          value = '${u.value}'
        WHERE setting.code='${u.code}'
        `)
    })
  )
}

exports.down = async function (knex) {}
