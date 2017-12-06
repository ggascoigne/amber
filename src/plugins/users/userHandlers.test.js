import hapi from 'hapi'
import { Profile, User } from '../../models'
import { knex } from '../../orm'
import { fakeProfile, loadTestPlugins, truncateTablesOnce } from '../../utils/testUtils'
import plugin from './index'
import faker from 'faker'

let profile
let profile2
let user
let server

describe('users', () => {
  beforeEach(async () => {
    await truncateTablesOnce()
    profile = await Profile.query()
      .insert(fakeProfile())

    profile2 = await Profile.query()
      .insert(fakeProfile())

    user = await User.query()
      .insert({
        username: faker.name.findName(),
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
    expect(payload.user).toHaveProperty('username', user.username)
    expect(payload.user.profile).toHaveProperty('email', profile.email)
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
    expect(payload.users.map(u => u.username))
      .toEqual(expect.arrayContaining([user.username]))
  })

  test('[POST] /users', async () => {
    const data = {
      username: faker.name.findName(),
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
    expect(JSON.parse(response.payload).user.username).toBe(data.username)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining([user.username, data.username]))
    expect(payload.users.map(p => p.profile.email))
      .toEqual(expect.arrayContaining([profile.email, profile2.email]))
  })

  describe('[POST /users - validation', () => {
    // note the getter for profile_id, this works around not having the value at the time the array is created
    const postPutData = [
      {
        name: 'valid',
        payload: {username: faker.name.findName(), password: 'something1', get profile_id () { return profile2.id }},
        statusCode: 200
      },
      {
        name: 'missing username',
        payload: {password: 'something1', get profile_id () { return profile2.id }},
        statusCode: 400
      },
      {
        name: 'missing password',
        payload: {username: faker.name.findName(), get profile_id () { return profile2.id }},
        statusCode: 400
      },
      {name: 'missing profile_id', payload: {username: 'username1', password: 'something1'}, statusCode: 400}
    ]

    postPutData.forEach((run) => {
      test(`[POST] /users - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/users`,
          payload: run.payload
        })
        run.errorType === 'n' && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[PATCH] /users', async () => {
    const data = {
      username: faker.name.findName()
    }
    const response = await server.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).user.username).toBe(data.username)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining([data.username]))
  })

  test('[PUT] /users', async () => {
    const data = {
      username: faker.name.findName(),
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
    expect(JSON.parse(response.payload).user.username).toBe(data.username)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/users'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.users.map(p => p.username))
      .toEqual(expect.arrayContaining([data.username]))
  })

  test('[DELETE] /users/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${user.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)
  })
})
