import hapi from 'hapi'
import { knex } from '../../bookshelf'
import { Profile } from '../../models'
import { loadTestPlugins } from '../../utils/testUtils'
import plugin from './index'

let profile
let server

describe('profiles', () => {
  beforeEach(async () => {
    profile = await Profile.forge({
      email: 'test@test.com',
      full_name: 'Test Account'
    }).save()

    await Profile.forge({
      email: 'test2@test.com',
      full_name: 'Test Account 2'
    }).save()

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  beforeAll(async () => {
    return Profile.deleteAll()
  })

  afterEach(async () => {
    return Profile.deleteAll()
  })

  afterAll(async () => {
    // make sure that the knex connection pool shuts down
    await knex.destroy()
  })

  test('[GET] /profiles/{id}', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/profiles/${profile.id}`
    })
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.profile).toHaveProperty('email', 'test@test.com')
  })

  test('[GET] /profiles/{id} - invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/profiles/999999999`
    })
    expect(response.statusCode).toBe(404)
  })

  test('[GET] /profiles', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/profiles'
    })
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.profiles.length).toBe(2)
    expect(payload.profiles[0]).toHaveProperty('email', 'test@test.com')
  })

  test('[POST] /profiles', async () => {
    const data = {
      email: 'test3@test.com',
      full_name: 'Test Account 3'
    }
    const response = await server.inject({
      method: 'POST',
      url: `/profiles`,
      payload: data
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe('test3@test.com')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(payload.profiles.length).toBe(3)
    expect(payload.profiles.map(p => p.email))
      .toEqual(expect.arrayContaining(['test@test.com', 'test2@test.com', 'test3@test.com']))
  })

  const postPutData = [
    {name: 'missing email', payload: {full_name: 'Test2 Account'}, statusCode: 400},
    {name: 'missing full_name', payload: {email: 'foo@bar.com'}, statusCode: 400},
    {name: 'invalid email', payload: {full_name: 'name', email: 'foo'}, statusCode: 400},
    {name: 'valid', payload: {full_name: 'name', email: 'foo@bar.com'}, statusCode: 200},
    {name: 'duplicate email', payload: {full_name: 'name', email: 'test2@test.com'}, statusCode: 400},
    {
      name: 'empty snail mail',
      payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: ''},
      statusCode: 400
    },
    {
      name: 'valid snail mail',
      payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: 'some address'},
      statusCode: 200
    }
  ]

  describe('[POST /profiles - validation', () => {
    postPutData.forEach((run) => {
      test(`[POST] /profiles - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/profiles`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.statusCode === 400 && expect(response.payload).toMatch(/validation|ER_DUP_ENTRY/)
      })
    })
  })

  test('[PATCH] /profiles', async () => {
    const data = {
      email: 'test3@test.com',
    }
    const response = await server.inject({
      method: 'PATCH',
      url: `/profiles/${profile.id}`,
      payload: data
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe('test3@test.com')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(payload.profiles.length).toBe(2)
    expect(payload.profiles.map(p => p.email))
      .toEqual(expect.arrayContaining(['test2@test.com', 'test3@test.com']))
  })

  describe('[PATCH /profiles/{id} - validation', () => {
    const runs = [
      {name: 'missing email', payload: {full_name: 'Test2 Account'}, statusCode: 200},
      {name: 'missing full_name', payload: {email: 'foo@bar.com'}, statusCode: 200},
      {name: 'invalid email', payload: {full_name: 'name', email: 'foo'}, statusCode: 400},
      {name: 'valid', payload: {full_name: 'name', email: 'foo@bar.com'}, statusCode: 200},
      {
        name: 'empty snail mail',
        payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: ''},
        statusCode: 400
      },
      {
        name: 'valid snail mail',
        payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: 'some address'},
        statusCode: 200
      }
    ]

    runs.forEach((run) => {
      test(`[PATCH] /profiles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PATCH',
          url: `/profiles/${profile.id}`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.statusCode === 400 && expect(response.payload).toMatch(/validation|ER_DUP_ENTRY/)
      })
    })
  })

  test('[PUT] /profiles/{id}', async () => {
    const data = {
      email: 'test3@test.com',
      full_name: 'Test Account 3'
    }
    const response = await server.inject({
      method: 'PUT',
      url: `/profiles/${profile.id}`,
      payload: data
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe('test3@test.com')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(payload.profiles.length).toBe(2)
    expect(payload.profiles.map(p => p.email))
      .toEqual(expect.arrayContaining(['test2@test.com', 'test3@test.com']))
  })

  describe('[PUT /profiles/{id} - validation', () => {
    postPutData.forEach((run) => {
      test(`[PUT] /profiles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PUT',
          url: `/profiles/${profile.id}`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.statusCode === 400 && expect(response.payload).toMatch(/validation|ER_DUP_ENTRY/)
      })
    })
  })

  test('[DELETE] /profiles/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/profiles/${profile.id}`
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(payload.profiles.length).toBe(1)
  })
})
