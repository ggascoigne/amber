import { Role } from '../models'
import { knex } from '../orm'

export async function bootstrap (server) {
  const cs = knex.client.connectionSettings
  server.log('info', `Database: ${knex.client.config.client}://${cs.host}:${cs.port}/${cs.user}@${cs.database}`)

  const authorities = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_GAME_ADMIN', 'ROLE_ADMIN_FILTER', 'ROLE_TOKEN_REFRESH']
  authorities.forEach(async (r) => {
    const role = await Role.query().where('authority', r).first()
    if (!role) {
      await Role.query().insert({authority: r})
    }
  })

  server.log('info', 'bootstrapped!')
}
