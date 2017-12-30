import faker from 'faker'
import hapi from 'hapi'
import { Profile, User } from '../../models'
import { userGraphUpdateOptions } from '../../models/user'
import { knex } from '../../orm'
import { fakeProfile, fakeUser, loadTestPlugins, prepTestDatabaseOnce, roleUser } from '../../utils/testUtils'
import plugin from './index'
import { roleNamesToRoles } from './userHandlers'

let profile
let profile2
let user
let server

describe('users', () => {
  beforeEach(async () => {
    await prepTestDatabaseOnce()

    profile = await Profile.query()
      .insert(fakeProfile())

    profile2 = await Profile.query()
      .insert(fakeProfile())

    user = await User.query()
      .upsertGraph(fakeUser(profile.id), userGraphUpdateOptions)

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
    expect(payload.user).not.toHaveProperty('username', user.password)
    expect(payload.user.profile).toHaveProperty('email', profile.email)
    expect(payload.user.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining([roleUser.authority]))
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

  describe('roleNamesToRoles', async () => {
    const data = [
      {input: [], output: []},
      {input: null, output: []},
      {input: undefined, output: []},
      {input: ['foo'], output: []},
      {input: ['ROLE_USER'], output: ['ROLE_USER']},
      {input: ['ROLE_ADMIN'], output: ['ROLE_ADMIN']},
      {input: ['ROLE_ADMIN', 'ROLE_USER'], output: ['ROLE_USER', 'ROLE_ADMIN']}
    ]
    data.forEach(({input, output}, index) => {
      test(`${index}: ${input}`, async () => {
        const result = await roleNamesToRoles(input)
        expect(result.map(r => r.authority)).toEqual(expect.arrayContaining(output))
      })
    })
  })

  test('[POST] /users', async () => {
    const data = {
      username: faker.name.findName(),
      password: 'something1',
      profile_id: profile2.id,
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    }
    const response = await server.inject({
      method: 'POST',
      url: `/users`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).user.username).toBe(data.username)
    const userId = JSON.parse(response.payload).user.id

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: `/users/${userId}`
    })).payload)
    expect(payload.message).toBe(undefined)
    const newUser = payload.user
    expect(newUser).not.toBe(undefined)
    expect(newUser.profile.email).toBe(profile2.email)
    expect(newUser.roles.map(r => r.authority)).toEqual(expect.arrayContaining(['ROLE_ADMIN', 'ROLE_USER']))
  })

  test('[POST] /users - no role', async () => {
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
    const userId = JSON.parse(response.payload).user.id

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: `/users/${userId}`
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    const newUser = payload.user
    expect(newUser).not.toBe(undefined)
    expect(newUser.profile.email).toBe(profile2.email)
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
      username: faker.name.findName(),
      roles: ['ROLE_ADMIN', 'ROLE_USER']
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
      url: `/users/${user.id}`
    })).payload)
    expect(payload.message).toBe(undefined)
    expect(payload.user.username).toEqual(data.username)
    expect(payload.user.roles.map(r => r.authority)).toEqual(expect.arrayContaining(['ROLE_ADMIN', 'ROLE_USER']))
  })

  test('[PUT] /users', async () => {
    const data = {
      username: faker.name.findName(),
      password: 'something1',
      profile_id: profile2.id,
      roles: ['ROLE_ADMIN']
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
      url: `/users/${user.id}`
    })).payload)
    expect(payload.message).toBe(undefined)
    expect(payload.user.username).toEqual(data.username)
    expect(payload.user.profile.email).toBe(profile2.email)
    expect(payload.user.roles.map(r => r.authority)).toEqual(expect.arrayContaining(['ROLE_ADMIN']))
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

  test('hash', async () => {
    expect(await User.hashPassword('password')).toEqual('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
  })
})
