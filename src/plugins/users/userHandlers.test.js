import hapi from 'hapi'
import { Profile, User } from '../../models'
import { knex } from '../../orm'
import { loadTestPlugins } from '../../utils/testUtils'
import plugin from './index'

let profile
let profile2
let user
let server

describe('users', () => {
  const cleanup = async () => {
    await User.deleteAll()
    return Profile.deleteAll()
  }

  beforeEach(async () => {
    await cleanup()
    profile = await Profile.query()
      .insert({
        email: 'test@test.com',
        full_name: 'Test Account'
      })

    profile2 = await Profile.query()
      .insert({
        email: 'test2@test.com',
        full_name: 'Test Account'
      })

    user = await User.query()
      .insert({
        username: 'username',
        password: 'something',
        account_expired: false,
        account_locked: false,
        enabled: false,
        password_expired: false,
        profile_id: profile.id
      })

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
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.user).toHaveProperty('username', 'username')
    expect(payload.user.profile).toHaveProperty('email', 'test@test.com')
  })

  test('[GET] /users/{id} - invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/999999999`
    })
    expect(JSON.parse(response.payload).message).toBe('NotFoundError')
    expect(response.statusCode).toBe(404)
  })

  test('[GET] /users', async () => {
    const response = await server.inject({
      // headers,
      method: 'GET',
      url: '/users'
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
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
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).user.username).toBe('username1')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.length).toBe(2)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining(['username', 'username1']))
    expect(payload.users.map(p => p.profile.email))
      .toEqual(expect.arrayContaining(['test@test.com', 'test2@test.com']))
  })

  describe('[POST /users - validation', () => {
    // note the getter for profile_id, this works around not having the value at the time the array is created
    const postPutData = [
      {name: 'valid', payload: {username: 'username1', password: 'something1', get profile_id () { return profile2.id }}, statusCode: 200},
      {name: 'missing username', payload: {password: 'something1', get profile_id () { return profile2.id }}, statusCode: 400},
      {name: 'missing password', payload: {username: 'username1', get profile_id () { return profile2.id }}, statusCode: 400},
      {name: 'missing profile_id', payload: {username: 'username1', password: 'something1'}, statusCode: 400}
    ]

    postPutData.forEach((run) => {
      test(`[POST] /users - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/users`,
          payload: run.payload
        })
        run.statusCode === 200 && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.statusCode === 400 && expect(response.payload).toMatch(/validation|ER_DUP_ENTRY/)
      })
    })
  })

  test('[PATCH] /users', async () => {
    const data = {
      username: 'username1'
    }
    const response = await server.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).user.username).toBe('username1')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.length).toBe(1)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining(['username1']))
    expect(payload.users.map(p => p.profile.email))
      .toEqual(expect.arrayContaining(['test@test.com']))
  })

  test('[PUT] /users', async () => {
    const data = {
      username: 'username1',
      password: 'something1',
      profile_id: profile2.id
    }
    const response = await server.inject({
      method: 'PUT',
      url: `/users/${user.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).user.username).toBe('username1')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.length).toBe(1)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining(['username1']))
    expect(payload.users.map(p => p.profile.email))
      .toEqual(expect.arrayContaining(['test2@test.com']))
  })

  test('[DELETE] /users/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${user.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.length).toBe(0)
  })
})
