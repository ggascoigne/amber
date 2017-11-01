import hapi from 'hapi'
import { knex } from '../../bookshelf'
import { Profile, User } from '../../models'
import { loadTestPlugins } from '../../utils/testUtils'
import plugin from './index'

let profile
let profile2
let user
let server

describe('users', () => {
  const cleanup = async () => {
    return Promise.all([
      User.deleteAll(),
      Profile.deleteAll()
    ])
  }

  beforeEach(async () => {
    await cleanup()
    profile = await Profile.forge({
      email: 'test@test.com',
      full_name: 'Test Account'
    }).save()

    profile2 = await Profile.forge({
      email: 'test2@test.com',
      full_name: 'Test Account'
    }).save()

    user = await User.forge({
      username: 'username',
      password: 'something',
      account_expired: false,
      account_locked: false,
      enabled: false,
      password_expired: false,
      profile_id: profile.id
    }).save()

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  afterAll(async () => {
    await cleanup()
    await knex.destroy()
  })

  test('[GET] /users/{id}', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${user.id}`
    })
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.user).toHaveProperty('username', 'username')
  })

  test('[GET] /users/{id} - invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/999999999`
    })
    expect(response.statusCode).toBe(404)
  })

  test('[GET] /users', async () => {
    const response = await server.inject({
      // headers,
      method: 'GET',
      url: '/users'
    })
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.users.length).toBe(1)
    expect(payload.users[0]).toHaveProperty('username', 'username')
  })

  test('[POST] /users', async () => {
    const data = {
      username: 'username1',
      password: 'something1',
      profile_id: profile2.id
    }
    const response = await server.inject({
      method: 'POST',
      url: `/users`,
      payload: data
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).user.username).toBe('username1')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(payload.users.length).toBe(2)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining(['username', 'username1']))
  })
})
