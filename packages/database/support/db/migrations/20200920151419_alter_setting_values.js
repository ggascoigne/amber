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

export async function up(knex) {
  await Promise.allSettled(
    toFix.map(async (u) => {
      await knex.raw(`
        UPDATE setting
        SET
          value = '${u.value}'
        WHERE setting.code='${u.code}'
        `)
    }),
  )
}

// eslint-disable-next-line no-empty-function
export async function down(knex) {}
